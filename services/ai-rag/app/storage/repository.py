"""Knowledge domain models + idempotent in-memory repository.

The production deployment uses PostgreSQL + pgvector; retrieval logic is
DB-agnostic (see app/rag/retrieval.py) and tests use this in-memory store."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from typing import Any

from ..rag.retrieval import ChunkRecord


@dataclass
class KnowledgeSource:
    id: str
    title: str
    provider: str
    url: str | None
    source_type: str  # official | official_test_admin | open_licensed | original | user_imported | reference
    official: bool
    license: str | None
    redistribution_policy: str
    language: str
    skill: str
    test_type: str
    topics: list[str]
    last_verified: str
    content_hash: str = ""


@dataclass
class KnowledgeChunk:
    id: str
    source_id: str
    heading: str
    content: str
    language: str
    skill: str
    test_type: str
    topics: list[str]
    question_types: list[str]
    chunk_index: int
    content_hash: str
    embedding: list[float] | None = None


@dataclass
class IngestionResult:
    added: int
    updated: int
    unchanged: int
    deleted: int


class InMemoryRepository:
    def __init__(self) -> None:
        self.sources: dict[str, KnowledgeSource] = {}
        self.chunks: dict[str, KnowledgeChunk] = {}

    def upsert_source(self, source: KnowledgeSource) -> None:
        self.sources[source.id] = source

    def upsert_chunks(self, chunks: list[KnowledgeChunk]) -> IngestionResult:
        result = IngestionResult(0, 0, 0, 0)
        incoming_hashes = {c.content_hash for c in chunks}
        existing_by_hash = {c.content_hash: c for c in self.chunks.values()}

        # Delete stale chunks for the same source that are no longer present.
        source_id = chunks[0].source_id if chunks else None
        if source_id:
            stale = [cid for cid, c in self.chunks.items() if c.source_id == source_id and c.content_hash not in incoming_hashes]
            for cid in stale:
                del self.chunks[cid]
                result.deleted += 1

        for c in chunks:
            if c.content_hash in existing_by_hash:
                if existing_by_hash[c.content_hash].id != c.id:
                    self.chunks[c.id] = c
                    result.updated += 1
                else:
                    result.unchanged += 1
            else:
                self.chunks[c.id] = c
                result.added += 1
        return result

    def to_records(self) -> list[ChunkRecord]:
        records = []
        for c in self.chunks.values():
            src = self.sources.get(c.source_id)
            records.append(
                ChunkRecord(
                    chunk_id=c.id,
                    source_id=c.source_id,
                    title=src.title if src else c.source_id,
                    url=src.url if src else None,
                    section=c.heading,
                    content=c.content,
                    embedding=c.embedding or [],
                    fields={
                        "skill": c.skill,
                        "test_type": c.test_type,
                        "source_type": src.source_type if src else None,
                        "official": src.official if src else False,
                        "question_types": c.question_types,
                        "language": c.language,
                    },
                )
            )
        return records


def hash_text(text: str) -> str:
    return hashlib.sha256(text.strip().encode()).hexdigest()
