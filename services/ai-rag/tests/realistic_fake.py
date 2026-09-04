"""Realistic OpenAI-compatible fake used to reproduce the structured-output bug.

Behaves like a GENERIC chat model, NOT an already-perfect structured responder:

- /chat/completions WITHOUT an explicit JSON instruction in the last user
  message returns normal prose (like a real chat model answering "ping").
- /chat/completions WITH the structured JSON instruction (the text our adapter
  appends) returns a JSON object matching the schema, optionally fenced.
- The fake records the last request payload so tests can assert the schema was
  actually sent and used.

This mirrors the real failure: /api/llm/test (plain chat) can pass while the
Coach structured path fails when the model is not instructed to emit JSON.
"""

from __future__ import annotations

import json

import httpx


def build_prose_chat_handler(prose: str = "Hello! I am a helpful IELTS assistant."):
    """A /chat/completions handler that returns plain prose unless the last
    user message asks for a JSON object (structured instruction present)."""

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.read())
        messages = body.get("messages", [])
        last_user = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                last_user = str(m.get("content") or "")
                break
        # Detect our structured instruction marker.
        is_structured = "Respond with ONLY a single JSON object" in last_user or "JSON schema" in last_user
        if is_structured:
            # Extract a tool-call or final-answer object. The fake looks for a
            # schema fragment to decide which object to return (best-effort).
            if '"tool"' in last_user:
                answer = {"tool": "search_knowledge_base", "args": {"query": "IELTS Academic Reading duration"}}
            else:
                answer = {
                    "text": "Academic Reading lasts 60 minutes with 40 questions.",
                    "citations": [],
                    "actions": [],
                }
            return httpx.Response(200, json={"choices": [{"message": {"content": json.dumps(answer)}}]})
        return httpx.Response(200, json={"choices": [{"message": {"content": prose}}]})

    return handler


def build_prose_chat_handler_v2(prose: str = "Sure, here is some prose."):
    """Variant that ALWAYS returns prose (never JSON) — models that ignore the
    instruction must be handled by our controlled-error path."""
    return lambda request: httpx.Response(200, json={"choices": [{"message": {"content": prose}}]})


def make_client(handler):
    """OpenAICompatibleLlm over a MockTransport using the given handler."""
    from app.llm.openai_compatible import OpenAICompatibleLlm

    return OpenAICompatibleLlm(
        "https://llm.test/v1",
        "test-key",
        "test-model",
        timeout=5.0,
        transport=httpx.MockTransport(handler),
    )
