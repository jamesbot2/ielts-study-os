"""Optional PostgreSQL integration tests. Run only when POSTGRES_TEST_URL is set:

    POSTGRES_TEST_URL=postgresql+psycopg://user:pass@localhost:5432/ielts_rag_test pytest -m postgres
"""

import os
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.rag.retrieval import SearchFilters
from app.storage.repository import (
    KnowledgeChunk,
    KnowledgeSource,
    PostgresKnowledgeRepository,
)

pytestmark = pytest.mark.postgres

URL = os.environ.get("POSTGRES_TEST_URL")


@pytest.mark.skipif(not URL, reason="POSTGRES_TEST_URL not set")
def test_pgvector_insert_and_query():
    repo = PostgresKnowledgeRepository(URL)
    repo.upsert_source(
        KnowledgeSource(
            id="src", title="Test", provider="T", url=None, source_type="original", official=False,
            license="CC0", redistribution_policy="original_full", language="en", skill="all",
            test_type="both", topics=[], last_verified="2026-09-01",
        )
    )
    repo.upsert_chunks(
        [
            KnowledgeChunk(
                id="c1", source_id="src", heading="H", content="Academic Reading lasts 60 minutes.",
                language="en", skill="reading", test_type="academic", topics=[], question_types=[],
                chunk_index=0, content_hash="h1", embedding=[0.1] * 8,
            )
        ]
    )
    health = repo.health_check()
    assert health.reachable is True
    assert health.pgvector_available is True
    assert health.chunk_count >= 1
    # Idempotency: second ingest is unchanged.
    r2 = repo.upsert_chunks(
        [
            KnowledgeChunk(
                id="c1", source_id="src", heading="H", content="Academic Reading lasts 60 minutes.",
                language="en", skill="reading", test_type="academic", topics=[], question_types=[],
                chunk_index=0, content_hash="h1", embedding=[0.1] * 8,
            )
        ]
    )
    assert r2.unchanged == 1
    assert r2.added == 0


@pytest.mark.skipif(not URL, reason="POSTGRES_TEST_URL not set")
def test_pgvector_vector_and_lexical_search():
    repo = PostgresKnowledgeRepository(URL)
    vector = repo.search_vector([0.1] * 8, SearchFilters(), 5)
    assert any(r.content for r in vector)
    lexical = repo.search_lexical("Academic Reading", SearchFilters(), 5)
    assert len(lexical) >= 1
