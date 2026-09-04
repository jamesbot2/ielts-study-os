"""Regression tests for the structured-output Coach fix.

Reproduces the real RC bug with a GENERIC chat-model fake:
- ordinary chat (used by /api/llm/test) returns prose → connection test passes
- structured request with NO JSON instruction would return prose → old code
  failed Coach silently; new code appends the schema instruction, parses the
  JSON object, validates it, and only then classifies the agent step.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx
import pytest

from app.agent.runtime import AgentRuntime, StructuredOutputError
from app.agent.schemas import AGENT_STEP_SCHEMA, classify_agent_step, is_valid_agent_step
from app.rag.service import RetrievalService
from app.storage.repository import InMemoryKnowledgeRepository
from tests.realistic_fake import build_prose_chat_handler, build_prose_chat_handler_v2, make_client


# --- 1. structured() actually uses the schema ---------------------------------
@pytest.mark.asyncio
async def test_structured_sends_schema_instruction():
    captured = {}

    def handler(request: httpx.Request) -> httpx.Response:
        import json as _json

        captured["body"] = _json.loads(request.read())
        return httpx.Response(200, json={"choices": [{"message": {"content": _json.dumps({"text": "hi", "citations": [], "actions": []})}}]})

    llm = make_client(handler)
    out = await llm.structured([{"role": "user", "content": "hello"}], AGENT_STEP_SCHEMA)
    messages = captured["body"]["messages"]
    last = messages[-1]["content"]
    assert "Respond with ONLY a single JSON object" in last
    assert "JSON schema" in last
    assert out == {"text": "hi", "citations": [], "actions": []}


# --- 2. generic model: prose for plain chat, JSON for structured --------------
@pytest.mark.asyncio
async def test_generic_model_chat_returns_prose_structured_returns_json():
    llm = make_client(build_prose_chat_handler())
    # Plain chat → prose (this is what /api/llm/test sees and passes).
    prose = await llm.chat([{"role": "user", "content": "ping"}])
    assert "Hello! I am a helpful IELTS assistant." in prose
    # Structured → JSON object (Coach path now works).
    step = await llm.structured([{"role": "user", "content": "find reading duration"}], AGENT_STEP_SCHEMA)
    assert step.get("tool") == "search_knowledge_base"


# --- 3. structured() rejects pure prose ---------------------------------------
@pytest.mark.asyncio
async def test_structured_rejects_prose_when_model_ignores_instruction():
    llm = make_client(build_prose_chat_handler_v2("I am sorry, I cannot do JSON."))
    with pytest.raises(ValueError) as ei:
        await llm.structured([{"role": "user", "content": "x"}], AGENT_STEP_SCHEMA)
    assert "JSON" in str(ei.value) or "prose" in str(ei.value) or "object" in str(ei.value)


# --- 4. fenced JSON compatibility ---------------------------------------------
@pytest.mark.asyncio
async def test_structured_accepts_single_fenced_json():
    def handler(request: httpx.Request) -> httpx.Response:
        import json

        payload = json.dumps({"text": "fenced answer", "citations": [], "actions": []})
        return httpx.Response(200, json={"choices": [{"message": {"content": f"Here you go:\n```json\n{payload}\n```"}}]})

    llm = make_client(handler)
    out = await llm.structured([{"role": "user", "content": "x"}], AGENT_STEP_SCHEMA)
    assert out["text"] == "fenced answer"


# --- 5. malformed JSON → controlled failure ------------------------------------
@pytest.mark.asyncio
async def test_structured_rejects_malformed_json():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json={"choices": [{"message": {"content": "{not valid json"}}]})

    llm = make_client(handler)
    with pytest.raises(ValueError):
        await llm.structured([{"role": "user", "content": "x"}], AGENT_STEP_SCHEMA)


# --- agent step shape ----------------------------------------------------------
def test_classify_tool_step():
    kind, step = classify_agent_step({"tool": "search_knowledge_base", "args": {"query": "x"}})
    assert kind == "tool"
    assert step["tool"] == "search_knowledge_base"


def test_classify_final_answer():
    kind, _ = classify_agent_step({"text": "answer", "citations": [], "actions": []})
    assert kind == "answer"


def test_classify_rejects_empty_object():
    assert is_valid_agent_step({}) is False
    with pytest.raises(ValueError):
        classify_agent_step({})


def test_classify_rejects_meaningless_object():
    assert is_valid_agent_step({"foo": "bar"}) is False


def test_classify_rejects_both_tool_and_text():
    assert is_valid_agent_step({"tool": "x", "text": "y"}) is False


# --- runtime: generic prose model does not silently pass ------------------------
def _runtime(llm):
    emb_repo = InMemoryKnowledgeRepository()
    svc = RetrievalService(emb_repo, None, embeddings_configured=False)
    return AgentRuntime(llm, svc)


def test_runtime_with_generic_model_and_retry():
    """A model that returns prose even after the retry must raise a controlled
    StructuredOutputError — never an empty success."""
    llm = make_client(build_prose_chat_handler_v2("Just some prose, no JSON here."))
    rt = _runtime(llm)
    with pytest.raises(StructuredOutputError):
        rt.run_sync("hello", {})


def test_runtime_with_generic_model_success():
    """A generic model that honours the JSON instruction completes a tool step."""
    llm = make_client(build_prose_chat_handler())
    rt = _runtime(llm)
    result = rt.run_sync("How long is Academic Reading?", {})
    assert result.tool_steps  # search_knowledge_base was called
