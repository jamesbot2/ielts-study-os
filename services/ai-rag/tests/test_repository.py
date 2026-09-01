"""Offline repository semantics: metadata updates, source updates, re-embedding,
and ingestion-run tracking. The same contract runs against PostgreSQL in
test_postgres.py."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.storage.repository import (
    InMemoryKnowledgeRepository,
    KnowledgeChunk,
    KnowledgeSource,
)


def _source(**kw):
    base = {
        "id": "src", "title": "T", "provider": "P", "url": None, "source_type": "original", "official": False,
        "license": "CC0", "redistribution_policy": "original_full", "language": "en", "skill": "all",
        "test_type": "both", "topics": [], "last_verified": "2026-09-01",
    }
    base.update(kw)
    return KnowledgeSource(**base)


def _chunk(**kw):
    base = {
        "id": "c1", "source_id": "src", "heading": "A", "content": "same text body", "language": "en",
        "skill": "reading", "test_type": "academic", "topics": ["reading"], "question_types": ["multiple_choice"],
        "chunk_index": 0, "content_hash": "h1", "embedding": [0.1] * 8, "embedding_fingerprint": "fp1",
    }
    base.update(kw)
    return KnowledgeChunk(**base)


def test_metadata_update_in_memory():
    repo = InMemoryKnowledgeRepository()
    repo.upsert_source(_source())
    r1 = repo.upsert_chunks([_chunk()])
    assert r1.added == 1

    # Same content hash + same fingerprint, but changed metadata → updated.
    changed = _chunk(heading="B", skill="writing", question_types=["matching_headings"], topics=["writing"])
    r2 = repo.upsert_chunks([changed])
    assert r2.updated == 1 and r2.unchanged == 0 and r2.added == 0

    stored = repo.chunks["c1"]
    assert stored.heading == "B"
    assert stored.skill == "writing"
    assert stored.question_types == ["matching_headings"]
    assert stored.topics == ["writing"]

    # Identical re-ingest → unchanged.
    r3 = repo.upsert_chunks([changed])
    assert r3.unchanged == 1


def test_reembed_only_changes_embedding():
    repo = InMemoryKnowledgeRepository()
    repo.upsert_source(_source())
    repo.upsert_chunks([_chunk()])

    reembedded = _chunk(embedding=[0.2] * 8, embedding_fingerprint="fp2")
    r = repo.upsert_chunks([reembedded])
    assert r.updated == 1
    assert repo.chunks["c1"].embedding_fingerprint == "fp2"
    assert repo.chunks["c1"].embedding == [0.2] * 8


def test_source_metadata_update():
    repo = InMemoryKnowledgeRepository()
    repo.upsert_source(_source())
    repo.upsert_source(_source(title="New title", url="https://new.example", official=True, source_type="official"))
    src = repo.sources["src"]
    assert src.title == "New title"
    assert src.url == "https://new.example"
    assert src.official is True
    assert src.source_type == "official"


def test_ingestion_run_tracking():
    repo = InMemoryKnowledgeRepository()
    repo.upsert_source(_source())
    run_id = repo.start_ingestion_run("fp1")
    assert repo.runs[run_id - 1]["status"] == "running"

    result = repo.upsert_chunks([_chunk()])
    repo.finish_ingestion_run(run_id, result)
    assert repo.runs[run_id - 1]["status"] == "completed"
    assert repo.runs[run_id - 1]["added"] == 1

    run2 = repo.start_ingestion_run("fp1")
    repo.fail_ingestion_run(run2, "boom")
    assert repo.runs[run2 - 1]["status"] == "failed"
    assert repo.runs[run2 - 1]["error"] == "boom"
