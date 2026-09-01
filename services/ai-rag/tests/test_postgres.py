"""Optional PostgreSQL integration tests. Run only when POSTGRES_TEST_URL is set:

    POSTGRES_TEST_URL=postgresql+psycopg://user:pass@localhost:5432/ielts_rag_test pytest -m postgres

Every test is isolated (unique source/chunk IDs) and cleans up after itself.
Embeddings always derive their dimension from settings.embedding_dimension —
never a hardcoded value.
"""

import os
import sys
import uuid
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config import settings
from app.rag.retrieval import SearchFilters
from app.storage.repository import (
    KnowledgeChunk,
    KnowledgeSource,
    PostgresKnowledgeRepository,
)
from tests.corpus import seed_corpus

pytestmark = pytest.mark.postgres

URL = os.environ.get("POSTGRES_TEST_URL")
DIM = settings.embedding_dimension


@pytest.fixture()
def repo():
    r = PostgresKnowledgeRepository(URL)
    r._lazy_init()
    yield r


def _unique(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


@pytest.mark.skipif(not URL, reason="POSTGRES_TEST_URL not set")
def test_connectivity_and_extension(repo):
    h = repo.health_check()
    assert h.reachable is True
    assert h.pgvector_available is True


@pytest.mark.skipif(not URL, reason="POSTGRES_TEST_URL not set")
def test_vector_dimension_rejection(repo):
    src_id = _unique("src")
    repo.upsert_source(
        KnowledgeSource(
            id=src_id, title="T", provider="T", url=None, source_type="original", official=False,
            license="CC0", redistribution_policy="original_full", language="en", skill="all",
            test_type="both", topics=[], last_verified="2026-09-01",
        )
    )
    with pytest.raises(ValueError):
        repo.upsert_chunks(
            [
                KnowledgeChunk(
                    id=_unique("c"), source_id=src_id, heading="H", content="x", language="en",
                    skill="all", test_type="both", topics=[], question_types=[], chunk_index=0,
                    content_hash=_unique("h"), embedding=[0.1] * (DIM - 1), embedding_fingerprint="fp",
                )
            ]
        )


@pytest.mark.skipif(not URL, reason="POSTGRES_TEST_URL not set")
def test_filter_contract_live(repo):
    prefix = _unique("f")
    # Seed a corpus with unique IDs to avoid cross-test data dependency.
    dim = DIM
    src = KnowledgeSource(
        id=f"{prefix}-src", title="Filter Source", provider="T", url=None, source_type="original",
        official=False, license="CC0", redistribution_policy="original_full", language="en",
        skill="reading", test_type="academic", topics=[], last_verified="2026-09-01",
    )
    repo.upsert_source(src)
    repo.upsert_chunks(
        [
            KnowledgeChunk(
                id=f"{prefix}-mh", source_id=f"{prefix}-src", heading="Matching Headings",
                content="Matching Headings asks you to match paragraphs to headings.",
                language="en", skill="reading", test_type="academic", topics=[],
                question_types=["matching_headings"], chunk_index=0, content_hash=f"{prefix}-mh-hash",
                embedding=[0.11] * dim, embedding_fingerprint="fp1",
            ),
            KnowledgeChunk(
                id=f"{prefix}-mc", source_id=f"{prefix}-src", heading="Multiple Choice",
                content="Multiple Choice questions have several options.",
                language="en", skill="reading", test_type="academic", topics=[],
                question_types=["multiple_choice"], chunk_index=0, content_hash=f"{prefix}-mc-hash",
                embedding=[0.12] * dim, embedding_fingerprint="fp1",
            ),
        ]
    )

    v = repo.search_vector([0.11] * dim, SearchFilters(question_type="matching_headings"), 10)
    assert {r.chunk_id for r in v} == {f"{prefix}-mh"}
    l = repo.search_lexical("Matching Headings", SearchFilters(question_type="matching_headings"), 10)
    assert {r.chunk_id for r in l} == {f"{prefix}-mh"}


@pytest.mark.skipif(not URL, reason="POSTGRES_TEST_URL not set")
def test_metadata_update_and_idempotency(repo):
    prefix = _unique("m")
    dim = DIM
    repo.upsert_source(
        KnowledgeSource(
            id=f"{prefix}-src", title="T", provider="T", url=None, source_type="original", official=False,
            license="CC0", redistribution_policy="original_full", language="en", skill="all",
            test_type="both", topics=[], last_verified="2026-09-01",
        )
    )
    content = "Same content body that stays identical across ingestions."
    chunk = KnowledgeChunk(
        id=f"{prefix}-c", source_id=f"{prefix}-src", heading="H", content=content, language="en",
        skill="reading", test_type="academic", topics=[], question_types=["multiple_choice"],
        chunk_index=0, content_hash=f"{prefix}-hash", embedding=[0.21] * dim, embedding_fingerprint="fp1",
    )
    r1 = repo.upsert_chunks([chunk])
    assert r1.added == 1

    # Identical re-ingest → unchanged.
    r2 = repo.upsert_chunks([chunk])
    assert r2.unchanged == 1 and r2.added == 0

    # Same content hash, changed metadata → updated, not duplicated.
    changed = KnowledgeChunk(
        id=f"{prefix}-c", source_id=f"{prefix}-src", heading="H2", content=content, language="en",
        skill="writing", test_type="academic", topics=["writing"], question_types=["matching_headings"],
        chunk_index=0, content_hash=f"{prefix}-hash", embedding=[0.21] * dim, embedding_fingerprint="fp1",
    )
    r3 = repo.upsert_chunks([changed])
    assert r3.updated == 1 and r3.added == 0

    # Verify the stored row's actual metadata changed (not just the counter).
    from app.storage.models import KnowledgeChunkRow

    with repo._session_factory() as session:
        row = session.get(KnowledgeChunkRow, f"{prefix}-c")
        assert row.heading == "H2"
        assert row.skill == "writing"
        assert row.topics == ["writing"]
        assert row.question_types == ["matching_headings"]

    # Same content, new fingerprint → re-embedded (updated).
    reembed = KnowledgeChunk(
        id=f"{prefix}-c", source_id=f"{prefix}-src", heading="H2", content=content, language="en",
        skill="writing", test_type="academic", topics=[], question_types=["matching_headings"],
        chunk_index=0, content_hash=f"{prefix}-hash", embedding=[0.22] * dim, embedding_fingerprint="fp2",
    )
    r4 = repo.upsert_chunks([reembed])
    assert r4.updated == 1

    # Cleanup this test's rows.
    from app.storage.models import KnowledgeChunkRow, KnowledgeSourceRow

    with repo._session_factory() as session:
        for row in session.query(KnowledgeChunkRow).filter(KnowledgeChunkRow.source_id == f"{prefix}-src").all():
            session.delete(row)
        s = session.get(KnowledgeSourceRow, f"{prefix}-src")
        if s:
            session.delete(s)
        session.commit()


@pytest.mark.skipif(not URL, reason="POSTGRES_TEST_URL not set")
def test_rrf_hybrid_search_live(repo):
    seed_corpus(repo, DIM)
    from app.rag.retrieval import hybrid_search_repository

    results = hybrid_search_repository(repo, "Reading headings", [0.1] * DIM, SearchFilters(skill="reading"), top_k=5)
    assert any(r.chunk_id == "c-acad-read-mh" for r in results)
