import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import create_app
from app.storage.repository import (
    InMemoryKnowledgeRepository,
    KnowledgeChunk,
    KnowledgeSource,
)
from tests.fakes import FakeEmbeddings


def make_repo():
    emb = FakeEmbeddings()
    repo = InMemoryKnowledgeRepository()
    repo.upsert_source(
        KnowledgeSource(
            id="ielts-org", title="IELTS.org", provider="IELTS", url="https://ielts.org",
            source_type="official", official=True, license=None, redistribution_policy="metadata_only",
            language="en", skill="reading", test_type="academic", topics=["reading"], last_verified="2026-09-01",
        )
    )
    content = "Academic Reading lasts 60 minutes with 40 questions across three long passages."
    repo.upsert_chunks(
        [
            KnowledgeChunk(
                id="c1", source_id="ielts-org", heading="Academic Reading", content=content,
                language="en", skill="reading", test_type="academic", topics=["reading"],
                question_types=["multiple_choice"], chunk_index=0, content_hash="h1",
                embedding=emb._embed(content),
            )
        ]
    )
    return repo, emb


def test_normal_app_startup_serves_indexed_knowledge():
    repo, emb = make_repo()
    app = create_app(repository=repo, embeddings=emb, llm=None)
    client = TestClient(app)

    h = client.get("/health").json()
    assert h["rag"] == "healthy"
    assert h["knowledge_chunk_count"] == 1

    r = client.post("/api/rag/search", json={"query": "How long is Academic Reading?", "top_k": 5}).json()
    assert len(r["results"]) >= 1
    assert r["results"][0]["sourceId"] == "ielts-org"


def test_health_reports_unreachable_database():
    from app import config

    config.settings.database_url = "postgresql+psycopg://127.0.0.1:59999/nonexistent"
    app = create_app(repository=None, embeddings=FakeEmbeddings(), llm=None)
    client = TestClient(app)
    h = client.get("/health").json()
    assert h["database_configured"] is True
    assert h["database_reachable"] is False
    assert h["rag"] in ("unavailable", "degraded")
    # reset to avoid leaking into other tests
    config.settings.database_url = ""
