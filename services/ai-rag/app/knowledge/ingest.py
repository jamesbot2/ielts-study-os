"""Idempotent knowledge ingestion: source manifest + exported content → chunks.

Copyright rule: only ingest sources whose redistribution_policy is explicitly
open_licensed / original / curated_summary / user_explicit. metadata_only and
official sources are linked, not copied."""

from __future__ import annotations

from typing import Any

from ..llm.base import EmbeddingProvider
from ..rag.chunking import chunk_sections, SourceSection
from ..storage.repository import (
    InMemoryRepository,
    KnowledgeChunk,
    KnowledgeSource,
    IngestionResult,
)
from .manifest import load_manifest

REDISTRIBUTABLE_MODES = {"original_full", "open_licensed", "curated_summary", "user_explicit"}


def content_to_sections(doc: dict[str, Any]) -> list[SourceSection]:
    sections: list[SourceSection] = []
    for s in doc.get("sections", []):
        heading = s.get("heading") or s.get("title") or ""
        parts = []
        for p in s.get("paragraphs", []):
            parts.append(p.get("en", p) if isinstance(p, dict) else str(p))
        for b in s.get("bullets", []):
            parts.append("- " + (b.get("en", b) if isinstance(b, dict) else str(b)))
        sections.append(SourceSection(heading=heading, content="\n".join(parts)))
    return sections


async def ingest_manifest(
    repo: InMemoryRepository,
    manifest_data: dict[str, Any],
    embeddings: EmbeddingProvider,
    exported_docs: dict[str, dict[str, Any]],
) -> IngestionResult:
    manifest = load_manifest(manifest_data)
    total = IngestionResult(0, 0, 0, 0)
    for entry in manifest.sources:
        source = KnowledgeSource(
            id=entry.id,
            title=entry.title,
            provider=entry.title,
            url=entry.url,
            source_type=entry.source_type,
            official=entry.official,
            license=entry.license,
            redistribution_policy=entry.redistribution_policy,
            language=entry.language,
            skill=entry.skill,
            test_type=entry.test_type,
            topics=entry.topics,
            last_verified=entry.last_verified,
        )
        repo.upsert_source(source)

        # Never ingest non-redistributable sources.
        if entry.ingestion_mode not in REDISTRIBUTABLE_MODES or not entry.path:
            continue

        doc = exported_docs.get(entry.id) or exported_docs.get(entry.path, {})
        if not doc:
            continue

        sections = content_to_sections(doc)
        chunks = chunk_sections(sections)
        texts = [c.text for c in chunks]
        vectors = await embeddings.embed_texts(texts) if texts else []

        chunk_records = []
        for i, c in enumerate(chunks):
            chunk_records.append(
                KnowledgeChunk(
                    id=f"{entry.id}:{c.section_index}:{c.chunk_index}",
                    source_id=entry.id,
                    heading=c.heading,
                    content=c.content,
                    language=entry.language,
                    skill=entry.skill,
                    test_type=entry.test_type,
                    topics=entry.topics,
                    question_types=doc.get("questionTypes", []),
                    chunk_index=i,
                    content_hash=c.content_hash,
                    embedding=vectors[i] if i < len(vectors) else None,
                )
            )
        r = repo.upsert_chunks(chunk_records)
        total.added += r.added
        total.updated += r.updated
        total.unchanged += r.unchanged
        total.deleted += r.deleted
    return total
