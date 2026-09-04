"""API-level test: a structured-output failure must surface as a sanitized
NDJSON error event (not a silent HTTP-200 empty stream)."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import create_app
from app.storage.repository import InMemoryKnowledgeRepository
from tests.fakes import FakeEmbeddings


class _ProseOnlyLlm:
    """A real-world-shaped provider: plain chat works, structured returns prose
    even after retry — mirrors a generic model ignoring JSON instructions."""

    def __init__(self):
        self.calls = 0

    async def chat(self, messages, **kwargs):
        return "I am sorry, I can only reply in plain prose."

    async def stream(self, messages, **kwargs):
        yield "I am sorry, I can only reply in plain prose."

    async def structured(self, messages, schema, **kwargs):
        self.calls += 1
        raise ValueError("LLM did not return a single JSON object matching the requested schema")


def _app(llm):
    emb = FakeEmbeddings()
    repo = InMemoryKnowledgeRepository()
    app = create_app(repository=repo, embeddings=emb, llm=llm)
    return TestClient(app)


def test_coach_structured_failure_yields_error_event_not_silent_stream():
    client = _app(_ProseOnlyLlm())
    r = client.post(
        "/api/coach/agent",
        json={"message": "What should I practise?", "learnerContext": {}},
    )
    assert r.status_code == 200  # streaming endpoint stays 200
    lines = [ln for ln in r.text.strip().split("\n") if ln.strip()]
    types = []
    for line in lines:
        import json

        ev = json.loads(line)
        types.append(ev["type"])
    assert "error" in types, f"expected an error event, got: {lines}"
    assert "done" in types
    err = next(json.loads(l) for l in lines if '"type": "error"' in l or '"type":"error"' in l)
    msg = err["message"]
    # Sanitized: no secrets, no upstream body, no authorization header.
    assert "key" not in msg.lower() or "api key" not in msg.lower()
    assert "Bearer" not in msg
    assert "structured response" in msg or "JSON" in msg or "json" in msg
