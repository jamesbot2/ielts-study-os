"""Knowledge storage contract + in-memory and PostgreSQL implementations.

Production retrieval must query PostgreSQL (pgvector + tsvector); it must never
load all rows into Python. The in-memory implementation exists for fast offline
tests and shares the same filter semantics.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from datetime import UTC
from typing import Protocol

from ..rag.retrieval import ChunkRecord, SearchFilters, cosine, lexical_score, matches_filters


def hash_text(text: str) -> str:
    return hashlib.sha256(text.strip().encode()).hexdigest()


CHUNK_METADATA_FIELDS = ("heading", "language", "skill", "test_type", "topics", "question_types", "chunk_index")


def chunk_metadata_changed(a: KnowledgeChunk, b: KnowledgeChunk) -> bool:
    """True when canonical non-embedding metadata differs. Content text is
    already equal via content_hash; only metadata is compared here."""
    return any(getattr(a, f) != getattr(b, f) for f in CHUNK_METADATA_FIELDS)


@dataclass
class KnowledgeSource:
    id: str
    title: str
    provider: str
    url: str | None
    source_type: str
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
    embedding_fingerprint: str = ""


@dataclass
class IngestionResult:
    added: int = 0
    updated: int = 0
    unchanged: int = 0
    deleted: int = 0


@dataclass
class RepositoryHealth:
    reachable: bool
    pgvector_available: bool = False
    chunk_count: int = 0
    error: str | None = None


class KnowledgeRepository(Protocol):
    def upsert_source(self, source: KnowledgeSource) -> None: ...

    def upsert_chunks(self, chunks: list[KnowledgeChunk]) -> IngestionResult: ...

    def search_vector(self, query_embedding: list[float], filters: SearchFilters, top_k: int) -> list[ChunkRecord]: ...

    def search_lexical(self, query: str, filters: SearchFilters, top_k: int) -> list[ChunkRecord]: ...

    def health_check(self) -> RepositoryHealth: ...


class InMemoryKnowledgeRepository:
    """Fast, offline repository. Vector/lexical search runs in Python."""

    def __init__(self) -> None:
        self.sources: dict[str, KnowledgeSource] = {}
        self.chunks: dict[str, KnowledgeChunk] = {}
        self.runs: list[dict] = []
    def start_ingestion_run(self, fingerprint: str) -> int:
        run_id = len(self.runs) + 1
        self.runs.append({"id": run_id, "status": "running", "fingerprint": fingerprint, "started_at": "now"})
        return run_id

    def finish_ingestion_run(self, run_id: int, result: IngestionResult) -> None:
        for r in self.runs:
            if r["id"] == run_id:
                r["status"] = "completed"
                r.update({"added": result.added, "updated": result.updated, "unchanged": result.unchanged, "deleted": result.deleted})

    def fail_ingestion_run(self, run_id: int, error: str) -> None:
        for r in self.runs:
            if r["id"] == run_id:
                r["status"] = "failed"
                r["error"] = error

    def upsert_source(self, source: KnowledgeSource) -> None:
        self.sources[source.id] = source

    def upsert_chunks(self, chunks: list[KnowledgeChunk]) -> IngestionResult:
        result = IngestionResult()
        source_id = chunks[0].source_id if chunks else None
        # Content hashes are SOURCE-SCOPED: identical text in two different sources
        # must remain two independent chunks.
        incoming_hashes = {c.content_hash for c in chunks}
        existing_by_key = {(c.source_id, c.content_hash): c for c in self.chunks.values()}

        if source_id:
            stale = [
                cid
                for cid, c in self.chunks.items()
                if c.source_id == source_id and c.content_hash not in incoming_hashes
            ]
            for cid in stale:
                del self.chunks[cid]
                result.deleted += 1

        for c in chunks:
            key = (c.source_id, c.content_hash)
            if key in existing_by_key:
                existing = existing_by_key[key]
                changed = False
                # Update changed metadata even when content hash + fingerprint are unchanged.
                if chunk_metadata_changed(existing, c):
                    for f in CHUNK_METADATA_FIELDS:
                        setattr(existing, f, getattr(c, f))
                    changed = True
                # Re-embed when fingerprint changed or embedding was missing.
                if existing.embedding_fingerprint != c.embedding_fingerprint or (not existing.embedding and c.embedding):
                    existing.embedding = c.embedding
                    existing.embedding_fingerprint = c.embedding_fingerprint
                    changed = True
                if changed:
                    result.updated += 1
                else:
                    result.unchanged += 1
            else:
                self.chunks[c.id] = c
                result.added += 1
        return result

    def _records(self) -> list[ChunkRecord]:
        out: list[ChunkRecord] = []
        for c in self.chunks.values():
            src = self.sources.get(c.source_id)
            out.append(
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
        return out

    def search_vector(self, query_embedding: list[float], filters: SearchFilters, top_k: int) -> list[ChunkRecord]:
        candidates = [r for r in self._records() if matches_filters(r.fields, filters)]
        ranked = sorted(candidates, key=lambda r: cosine(query_embedding, r.embedding), reverse=True)
        return ranked[:top_k]

    def search_lexical(self, query: str, filters: SearchFilters, top_k: int) -> list[ChunkRecord]:
        candidates = [r for r in self._records() if matches_filters(r.fields, filters)]
        ranked = sorted(candidates, key=lambda r: lexical_score(query, r.content), reverse=True)
        return ranked[:top_k]

    def health_check(self) -> RepositoryHealth:
        return RepositoryHealth(reachable=True, pgvector_available=False, chunk_count=len(self.chunks))


# Backward-compatible alias used by ingestion + existing tests.
InMemoryRepository = InMemoryKnowledgeRepository


class PostgresKnowledgeRepository:
    """PostgreSQL + pgvector implementation. Lazy-imports SQLAlchemy so offline
    unit tests never require a live database."""

    def __init__(self, database_url: str) -> None:
        self.database_url = database_url
        self._engine = None
        self._session_factory = None

    def _lazy_init(self):
        if self._engine is not None:
            return
        from sqlalchemy import create_engine, text
        from sqlalchemy.orm import sessionmaker

        from .models import Base

        self._engine = create_engine(self.database_url, pool_pre_ping=True)
        self._session_factory = sessionmaker(bind=self._engine, expire_on_commit=False)
        with self._engine.begin() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        Base.metadata.create_all(self._engine)

    def upsert_source(self, source: KnowledgeSource) -> None:
        self._lazy_init()
        from sqlalchemy.orm import Session

        from .models import KnowledgeSourceRow

        with self._session_factory() as session:
            assert isinstance(session, Session)
            session.merge(
                KnowledgeSourceRow(
                    id=source.id,
                    title=source.title,
                    provider=source.provider,
                    url=source.url,
                    source_type=source.source_type,
                    official=source.official,
                    license=source.license,
                    redistribution_policy=source.redistribution_policy,
                    language=source.language,
                    skill=source.skill,
                    test_type=source.test_type,
                    topics=source.topics,
                    last_verified=source.last_verified,
                    content_hash=source.content_hash,
                )
            )
            session.commit()

    def upsert_chunks(self, chunks: list[KnowledgeChunk]) -> IngestionResult:
        self._lazy_init()
        from sqlalchemy import select

        from ..config import settings
        from .models import KnowledgeChunkRow

        result = IngestionResult()
        if not chunks:
            return result
        # Dimension validation: never let PostgreSQL fail with an opaque vector error.
        dim = settings.embedding_dimension
        for c in chunks:
            if c.embedding is not None and len(c.embedding) != dim:
                raise ValueError(
                    f"Embedding dimension mismatch for chunk {c.id}: got {len(c.embedding)}, expected {dim}"
                )
        source_id = chunks[0].source_id
        incoming_hashes = {c.content_hash for c in chunks}
        with self._session_factory() as session:
            existing = {r.content_hash: r for r in session.scalars(select(KnowledgeChunkRow).where(KnowledgeChunkRow.source_id == source_id)).all()}
            stale = [r.id for h, r in existing.items() if h not in incoming_hashes]
            for cid in stale:
                row = session.get(KnowledgeChunkRow, cid)
                if row:
                    session.delete(row)
                    result.deleted += 1
            for c in chunks:
                row = existing.get(c.content_hash)
                if row:
                    changed = False
                    # Update changed metadata even when content hash + fingerprint unchanged.
                    if any(getattr(row, f) != getattr(c, f) for f in CHUNK_METADATA_FIELDS):
                        for f in CHUNK_METADATA_FIELDS:
                            setattr(row, f, getattr(c, f))
                        changed = True
                    # Re-embed when fingerprint changed or embedding was missing.
                    if row.embedding_fingerprint != c.embedding_fingerprint or (not row.embedding and c.embedding):
                        row.embedding = c.embedding
                        row.embedding_fingerprint = c.embedding_fingerprint
                        changed = True
                    if changed:
                        result.updated += 1
                    else:
                        result.unchanged += 1
                else:
                    session.add(
                        KnowledgeChunkRow(
                            id=c.id,
                            source_id=c.source_id,
                            heading=c.heading,
                            content=c.content,
                            language=c.language,
                            skill=c.skill,
                            test_type=c.test_type,
                            topics=c.topics,
                            question_types=c.question_types,
                            chunk_index=c.chunk_index,
                            content_hash=c.content_hash,
                            embedding=c.embedding,
                            embedding_fingerprint=c.embedding_fingerprint,
                        )
                    )
                    result.added += 1
            session.commit()
        return result

    def _apply_filters(self, stmt, filters: SearchFilters, chunk_cls, source_cls):
        from sqlalchemy import func
        from sqlalchemy.dialects.postgresql import JSONB

        if filters.skill:
            stmt = stmt.where(chunk_cls.skill.in_([filters.skill, "all"]))
        if filters.test_type:
            stmt = stmt.where(chunk_cls.test_type.in_([filters.test_type, "both"]))
        if filters.language:
            stmt = stmt.where(chunk_cls.language == filters.language)
        if filters.question_type:
            stmt = stmt.where(func.cast(chunk_cls.question_types, JSONB).contains([filters.question_type]))
        if filters.source_type is not None or filters.official is not None:
            stmt = stmt.join(source_cls, chunk_cls.source_id == source_cls.id)
            if filters.source_type is not None:
                stmt = stmt.where(source_cls.source_type == filters.source_type)
            if filters.official is not None:
                stmt = stmt.where(source_cls.official == filters.official)
        return stmt

    def search_vector(self, query_embedding: list[float], filters: SearchFilters, top_k: int) -> list[ChunkRecord]:
        self._lazy_init()
        from sqlalchemy import select

        from .models import KnowledgeChunkRow, KnowledgeSourceRow

        stmt = select(KnowledgeChunkRow).order_by(KnowledgeChunkRow.embedding.cosine_distance(query_embedding)).limit(top_k)
        stmt = self._apply_filters(stmt, filters, KnowledgeChunkRow, KnowledgeSourceRow)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
        return self._to_records(rows)

    def search_lexical(self, query: str, filters: SearchFilters, top_k: int) -> list[ChunkRecord]:
        self._lazy_init()
        from sqlalchemy import func, select

        from .models import KnowledgeChunkRow, KnowledgeSourceRow

        # English content uses the english config; non-English uses 'simple' so we
        # do not silently run Chinese text through English stemming.
        lang_config = "english" if (filters.language is None or filters.language == "en") else "simple"
        vector = func.to_tsvector(lang_config, func.concat(KnowledgeChunkRow.heading, " ", KnowledgeChunkRow.content))
        tsquery = func.websearch_to_tsquery(lang_config, query[:200])
        stmt = (
            select(KnowledgeChunkRow)
            .where(vector.op("@@")(tsquery))
            .order_by(func.ts_rank(vector, tsquery).desc())
            .limit(top_k)
        )
        stmt = self._apply_filters(stmt, filters, KnowledgeChunkRow, KnowledgeSourceRow)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
        return self._to_records(rows)

    def _to_records(self, rows) -> list[ChunkRecord]:
        from sqlalchemy import select

        from .models import KnowledgeSourceRow

        if not rows:
            return []
        source_ids = {r.source_id for r in rows}
        with self._session_factory() as session:
            sources = {s.id: s for s in session.scalars(select(KnowledgeSourceRow).where(KnowledgeSourceRow.id.in_(source_ids))).all()}
        out = []
        for row in rows:
            src = sources.get(row.source_id)
            out.append(
                ChunkRecord(
                    chunk_id=row.id,
                    source_id=row.source_id,
                    title=src.title if src else row.source_id,
                    url=src.url if src else None,
                    section=row.heading,
                    content=row.content,
                    embedding=[],
                    fields={
                        "skill": row.skill,
                        "test_type": row.test_type,
                        "source_type": src.source_type if src else None,
                        "official": src.official if src else False,
                        "question_types": row.question_types or [],
                        "language": row.language,
                    },
                )
            )
        return out

    def health_check(self) -> RepositoryHealth:
        try:
            self._lazy_init()
            from sqlalchemy import func, select, text

            from .models import KnowledgeChunkRow

            with self._engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                pgvec = conn.execute(text("SELECT 1 FROM pg_extension WHERE extname='vector'")).fetchone() is not None
                count = conn.execute(select(func.count()).select_from(KnowledgeChunkRow)).scalar() or 0
            return RepositoryHealth(reachable=True, pgvector_available=bool(pgvec), chunk_count=int(count))
        except Exception as e:  # noqa: BLE001 - health check must never raise
            return RepositoryHealth(reachable=False, error=str(e))

    def start_ingestion_run(self, fingerprint: str) -> int:
        self._lazy_init()
        from .models import IngestionRunRow

        row = IngestionRunRow(status="running", embedding_fingerprint=fingerprint)
        with self._session_factory() as session:
            session.add(row)
            session.commit()
            session.refresh(row)
            return int(row.id)

    def finish_ingestion_run(self, run_id: int, result: IngestionResult) -> None:
        from datetime import datetime

        from .models import IngestionRunRow

        with self._session_factory() as session:
            row = session.get(IngestionRunRow, run_id)
            if row:
                row.status = "completed"
                row.completed_at = datetime.now(UTC)
                row.added = result.added
                row.updated = result.updated
                row.unchanged = result.unchanged
                row.deleted = result.deleted
                session.commit()

    def fail_ingestion_run(self, run_id: int, error: str) -> None:
        from datetime import datetime

        from .models import IngestionRunRow

        with self._session_factory() as session:
            row = session.get(IngestionRunRow, run_id)
            if row:
                row.status = "failed"
                row.completed_at = datetime.now(UTC)
                row.error = error[:2000]
                session.commit()
