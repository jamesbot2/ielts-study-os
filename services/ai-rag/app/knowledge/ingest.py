"""Idempotent knowledge ingestion: source manifest + exported content → chunks.

Copyright rule: only ingest sources whose redistribution_policy is explicitly
open_licensed / original / curated_summary / user_explicit. metadata_only and
official sources are linked, not copied."""

from __future__ import annotations

from typing import Any

from ..llm.base import EmbeddingProvider
from ..rag.chunking import SourceSection, chunk_sections
from ..storage.repository import (
    IngestionResult,
    KnowledgeChunk,
    KnowledgeRepository,
    KnowledgeSource,
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
    repo: KnowledgeRepository,
    manifest_data: dict[str, Any],
    embeddings: EmbeddingProvider,
    exported_docs: dict[str, dict[str, Any]],
    embedding_fingerprint: str = "",
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
                    embedding_fingerprint=embedding_fingerprint,
                )
            )
        r = repo.upsert_chunks(chunk_records)
        total.added += r.added
        total.updated += r.updated
        total.unchanged += r.unchanged
        total.deleted += r.deleted
    return total


def _find_knowledge_dir() -> str:
    import os

    for candidate in (
        os.environ.get("KNOWLEDGE_DIR"),
        os.path.join(os.getcwd(), "knowledge"),
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "knowledge"),
    ):
        if candidate and os.path.isdir(candidate):
            return os.path.abspath(candidate)
    raise FileNotFoundError("knowledge/ directory not found; set KNOWLEDGE_DIR")


def load_exported_docs(knowledge_dir: str) -> dict[str, dict[str, Any]]:
    import json
    import os

    docs: dict[str, dict[str, Any]] = {}
    # IELTS Study OS original curriculum → one combined doc (one source, many sections).
    curriculum_path = os.path.join(knowledge_dir, "generated", "ielts-study-os.json")
    curriculum_sections: list[dict[str, Any]] = []
    curriculum_question_types: list[str] = []
    if os.path.exists(curriculum_path):
        with open(curriculum_path) as f:
            payload = json.load(f)
        for lesson in payload.get("lessons", []):
            title = lesson.get("title", {}).get("en", lesson.get("id", ""))
            for s in lesson.get("sections", []):
                curriculum_sections.append(
                    {
                        "heading": f"{title} — {s.get('heading', {}).get('en', '')}".strip(" —"),
                        "paragraphs": s.get("paragraphs", []),
                        "bullets": s.get("bullets", []),
                    }
                )
            for qt in lesson.get("relatedQuestionTypes", []):
                if qt not in curriculum_question_types:
                    curriculum_question_types.append(qt)
    docs["ielts-study-os-original"] = {
        "questionTypes": curriculum_question_types,
        "sections": curriculum_sections,
    }
    # Official-format notes → one doc.
    notes_path = os.path.join(knowledge_dir, "official-notes.json")
    if os.path.exists(notes_path):
        with open(notes_path) as f:
            notes = json.load(f)
        docs["ielts-study-os-official-notes"] = {
            "questionTypes": [],
            "sections": [
                {"heading": n["heading"], "paragraphs": [{"en": n["content"]}], "bullets": []}
                for n in notes.get("notes", [])
            ],
        }
    return docs


def main() -> None:
    import asyncio
    import os

    from ..config import settings
    from ..embeddings.openai_compatible import OpenAICompatibleEmbeddings
    from ..storage.repository import InMemoryKnowledgeRepository, PostgresKnowledgeRepository
    from .manifest import load_manifest

    knowledge_dir = _find_knowledge_dir()
    manifest_path = os.path.join(knowledge_dir, "sources.yml")
    with open(manifest_path) as f:
        import yaml

        manifest_data = yaml.safe_load(f)

    embeddings: EmbeddingProvider
    fingerprint: str
    if settings.embedding_base_url and settings.embedding_model:
        embeddings = OpenAICompatibleEmbeddings(settings.embedding_base_url, settings.embedding_api_key, settings.embedding_model, settings.embedding_dimension)
        fingerprint = f"{settings.embedding_model}:{settings.embedding_dimension}:v1"
    else:
        from ..main import _ZeroEmbeddings

        embeddings = _ZeroEmbeddings()
        fingerprint = "zero:0:v1"

    if settings.database_url:
        # Production PostgreSQL ingestion must never write zero vectors.
        if fingerprint.startswith("zero"):
            raise SystemExit("Embedding provider is required for PostgreSQL knowledge ingestion. Set EMBEDDING_BASE_URL/EMBEDDING_MODEL.")
        repo = PostgresKnowledgeRepository(settings.database_url)
    else:
        repo = InMemoryKnowledgeRepository()

    docs = load_exported_docs(knowledge_dir)
    result = asyncio.run(ingest_manifest(repo, manifest_data, embeddings, docs, fingerprint))
    print(f"sources={len(load_manifest(manifest_data).sources)} "
          f"chunks_eligible={sum(1 for d in docs.values() if d)} "
          f"added={result.added} updated={result.updated} "
          f"unchanged={result.unchanged} deleted={result.deleted}")


if __name__ == "__main__":
    main()
