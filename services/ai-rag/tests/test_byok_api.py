"""API-level BYOK tests: per-request provider is used; absent provider falls
back to the server LLM; invalid/private provider URLs are rejected."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import create_app
from app.storage.repository import InMemoryKnowledgeRepository
from tests.fakes import FakeEmbeddings, FakeLlm

PUBLIC = "https://api.deepseek.com/v1"


def _app(llm=None):
    emb = FakeEmbeddings()
    repo = InMemoryKnowledgeRepository()
    app = create_app(repository=repo, embeddings=emb, llm=llm)
    return TestClient(app)


def _coach_script(text="Based on the data, practise Reading next."):
    return [{"text": text, "citations": [], "actions": []}]


def test_coach_uses_runtime_provider(monkeypatch):
    """A request-supplied provider must drive the call (not the server LLM)."""
    import app.llm.provider as provider_mod

    seen = {}

    class RecordingLlm:
        def __init__(self, base_url, api_key, model):
            seen["base_url"] = base_url
            seen["api_key"] = api_key
            seen["model"] = model
            self._inner = FakeLlm(_coach_script())

        async def chat(self, *a, **k):
            return await self._inner.chat(*a, **k)

        async def stream(self, *a, **k):
            async for ch in self._inner.stream(*a, **k):
                yield ch

        async def structured(self, *a, **k):
            return await self._inner.structured(*a, **k)

    monkeypatch.setattr(provider_mod, "build_runtime_llm", lambda cfg: RecordingLlm(cfg.baseUrl, cfg.apiKey, cfg.model))
    monkeypatch.setattr(provider_mod, "validate_provider_url", lambda url, **k: url)

    server_llm = FakeLlm([])
    client = _app(llm=server_llm)
    r = client.post(
        "/api/coach/agent",
        json={
            "message": "What should I practise?",
            "learnerContext": {},
            "provider": {"baseUrl": PUBLIC, "model": "deepseek-chat", "apiKey": "sk-byok"},
        },
    )
    assert r.status_code == 200
    body = r.text
    assert "Based on the data" in body
    assert seen["api_key"] == "sk-byok"
    assert seen["model"] == "deepseek-chat"


def test_coach_falls_back_to_server_llm(monkeypatch):
    """No provider in the request → server-configured LLM is used."""

    called = {}

    class ServerLlm(FakeLlm):
        async def structured(self, *a, **k):
            called["server_used"] = True
            return await super().structured(*a, **k)

    server = ServerLlm(_coach_script())
    client = _app(llm=server)
    r = client.post(
        "/api/coach/agent",
        json={"message": "hi", "learnerContext": {}},
    )
    assert r.status_code == 200
    assert called.get("server_used") is True


def test_coach_rejects_private_provider(monkeypatch):
    """A provider Base URL pointing at localhost is rejected with 422."""
    import app.llm.provider as provider_mod
    from app.llm.ssrf import SSRFError

    def strict(url, **k):
        raise SSRFError("Base URL must point to a public host")

    monkeypatch.setattr(provider_mod, "validate_provider_url", strict)
    client = _app(llm=FakeLlm([]))
    r = client.post(
        "/api/coach/agent",
        json={
            "message": "hi",
            "learnerContext": {},
            "provider": {"baseUrl": "http://localhost:8000/v1", "model": "m", "apiKey": "k"},
        },
    )
    assert r.status_code in (422, 503)


def test_coach_clear_error_when_no_llm_at_all():
    client = _app(llm=None)
    r = client.post("/api/coach/agent", json={"message": "hi", "learnerContext": {}})
    assert r.status_code == 503
    assert "not configured" in r.json()["detail"].lower()


def test_writing_uses_runtime_provider(monkeypatch):
    import app.llm.provider as provider_mod

    seen = {}

    class RecordingLlm:
        def __init__(self, base_url, api_key, model):
            seen["api_key"] = api_key
            self._payload = {
                "criterionScores": [
                    {"criterion": "taskResponse", "band": 6.0, "rationale": "x"},
                    {"criterion": "coherenceCohesion", "band": 6.0, "rationale": "x"},
                    {"criterion": "lexicalResource", "band": 6.0, "rationale": "x"},
                    {"criterion": "grammaticalRange", "band": 6.0, "rationale": "x"},
                ],
                "strengths": [],
                "weaknesses": [],
                "sentenceLevelIssues": [],
                "grammarIssues": [],
                "lexicalIssues": [],
                "coherenceIssues": [],
                "taskResponseIssues": [],
                "missingRequirements": [],
                "suggestedCorrections": [],
                "improvedSentences": [],
                "vocabularySuggestions": [],
                "nextPracticeTargets": [],
                "examinerStyleSummary": "",
                "bandGapAnalysis": "",
            }

        async def chat(self, messages, **kwargs):
            import json

            return json.dumps(self._payload)

        async def stream(self, *a, **k):
            return
            yield  # pragma: no cover

        async def structured(self, messages, schema, **kwargs):
            # LlmProvider.structured returns a parsed dict.
            return self._payload

    monkeypatch.setattr(provider_mod, "build_runtime_llm", lambda cfg: RecordingLlm(cfg.baseUrl, cfg.apiKey, cfg.model))
    monkeypatch.setattr(provider_mod, "validate_provider_url", lambda url, **k: url)

    client = _app(llm=None)  # no server LLM — BYOK must still work
    r = client.post(
        "/api/writing/evaluate",
        json={
            "answer": "Some essay text.",
            "wordCount": 3,
            "prompt": "Task",
            "provider": {"baseUrl": PUBLIC, "model": "m", "apiKey": "sk-w"},
        },
    )
    assert r.status_code == 200
    assert seen.get("api_key") == "sk-w"
    assert r.json()["evaluation"]["criterionScores"][0]["band"] == 6.0
