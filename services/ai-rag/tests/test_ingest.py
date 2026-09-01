import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest

from app.knowledge.ingest import ingest_manifest
from app.storage.repository import InMemoryRepository
from tests.fakes import FakeEmbeddings

MANIFEST = {
    "sources": [
        {
            "id": "ielts-os-original",
            "title": "IELTS Study OS Original",
            "source_type": "original",
            "official": False,
            "license": "CC0",
            "redistribution_policy": "original_full",
            "language": "en",
            "skill": "all",
            "test_type": "both",
            "topics": ["reading"],
            "last_verified": "2026-09-01",
            "ingestion_mode": "original_full",
            "path": "ielts-os-original",
        },
        {
            "id": "ielts-org",
            "title": "IELTS.org",
            "url": "https://ielts.org",
            "source_type": "official",
            "official": True,
            "license": None,
            "redistribution_policy": "metadata_only",
            "language": "en",
            "skill": "all",
            "test_type": "both",
            "topics": [],
            "last_verified": "2026-09-01",
            "ingestion_mode": "metadata_only",
        },
    ]
}

DOC = {
    "id": "ielts-os-original",
    "questionTypes": ["tfng"],
    "sections": [
        {
            "heading": "False vs Not Given",
            "paragraphs": [{"en": "False means the statement contradicts the passage."}, {"en": "Not Given means the passage does not mention it."}],
            "bullets": [{"en": "Check for direct contradiction first."}],
        }
    ],
}


@pytest.mark.asyncio
async def test_ingestion_is_idempotent():
    repo = InMemoryRepository()
    emb = FakeEmbeddings()
    r1 = await ingest_manifest(repo, MANIFEST, emb, {"ielts-os-original": DOC})
    assert r1.added == 1  # one section → one chunk
    r2 = await ingest_manifest(repo, MANIFEST, emb, {"ielts-os-original": DOC})
    assert r2.added == 0
    assert r2.unchanged == 1
    assert len(repo.chunks) == 1


@pytest.mark.asyncio
async def test_official_metadata_only_source_not_ingested():
    repo = InMemoryRepository()
    emb = FakeEmbeddings()
    await ingest_manifest(repo, MANIFEST, emb, {"ielts-os-original": DOC})
    # The official source is metadata_only and must not produce chunks.
    assert all(c.source_id != "ielts-org" for c in repo.chunks.values())
    assert "ielts-org" in repo.sources
