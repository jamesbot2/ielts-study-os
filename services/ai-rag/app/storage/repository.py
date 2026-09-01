"""Knowledge storage contract + in-memory and PostgreSQL implementations.

Production retrieval must query PostgreSQL (pgvector + tsvector); it must never
load all rows into Python. The in-memory implementation exists for fast offline
tests and shares the same filter semantics.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from typing import Protocol

from ..rag.retrieval import ChunkRecord, SearchFilters, cosine, lexical_score, matches_filters


def hash_text(text: str) -> str:
    return hashlib.sha256(text.strip().encode()).hexdigest()


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

    def upsert_source(self, source: KnowledgeSource) -> None:
        self.sources[source.id] = source

    def upsert_chunks(self, chunks: list[KnowledgeChunk]) -> IngestionResult:
        result = IngestionResult()
        incoming_hashes = {c.content_hash for c in chunks}
        existing_by_hash = {c.content_hash: c for c in self.chunks.values()}
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

        from .models import KnowledgeChunkRow

        result = IngestionResult()
        if not chunks:
            return result
        source_id = chunks[0].source_id
        incoming_hashes = {c.content_hash for c in chunks}
        with self._session_factory() as session:
            existing = {r.content_hash: r for r in session.scalars(select(KnowledgeChunkRow).where(KnowledgeChunkRow.source_id == source_id)).all()}
            # Delete stale chunks for this source only.
            stale = [r.id for h, r in existing.items() if h not in incoming_hashes]
            for cid in stale:
                row = session.get(KnowledgeChunkRow, cid)
                if row:
                    session.delete(row)
                    result.deleted += 1
            for c in chunks:
                row = existing.get(c.content_hash)
                if row:
                    if row.id != c.id:
                        row.heading = c.heading
                        row.content = c.content
                        row.embedding = c.embedding
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
                        )
                    )
                    result.added += 1
            session.commit()
        return result

    def _filter_where(self, stmt, filters: SearchFilters, row_cls):
        if filters.skill:
            stmt = stmt.where(row_cls.skill.in_([filters.skill, "all"]))
        if filters.test_type:
            stmt = stmt.where(row_cls.test_type.in_([filters.test_type, "both"]))
        if filters.source_type:
            from .models import KnowledgeSourceRow

            stmt = stmt.join(KnowledgeSourceRow).where(KnowledgeSourceRow.source_type == filters.source_type)
        if filters.language:
            stmt = stmt.where(row_cls.language == filters.language)
        return stmt

    def search_vector(self, query_embedding: list[float], filters: SearchFilters, top_k: int) -> list[ChunkRecord]:
        self._lazy_init()
        from sqlalchemy import select

        from .models import KnowledgeChunkRow

        stmt = select(KnowledgeChunkRow).order_by(KnowledgeChunkRow.embedding.cosine_distance(query_embedding)).limit(top_k)
        stmt = self._filter_where(stmt, filters, KnowledgeChunkRow)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
        return [self._to_record(r, 0.0) for r in rows]

    def search_lexical(self, query: str, filters: SearchFilters, top_k: int) -> list[ChunkRecord]:
        self._lazy_init()
        from sqlalchemy import text

        # tsvector over heading+content with websearch_to_tsquery for safe plain-text query.
        sql = """
            SELECT id FROM knowledge_chunks
            WHERE to_tsvector('english', heading || ' ' || content) @@ to_tsquery('english', :q)
            ORDER BY ts_rank(to_tsvector('english', heading || ' ' || content), to_tsquery('english', :q)) DESC
            LIMIT :k
        """
        # tsquery syntax: use websearch_to_tsquery for safe plain-text query.
        sql = """
            SELECT id FROM knowledge_chunks
            WHERE to_tsvector('english', heading || ' ' || content) @@ websearch_to_tsquery('english', :q)
            ORDER BY ts_rank(to_tsvector('english', heading || ' ' || content), websearch_to_tsquery('english', :q)) DESC
            LIMIT :k
        """
        with self._engine.connect() as conn:
            result = conn.execute(text(sql), {"q": query[:200], "k": top_k})
            ids = [r[0] for r in result.fetchall()]
        if not ids:
            return []
        from sqlalchemy import select

        from .models import KnowledgeChunkRow

        with self._session_factory() as session:
            rows = session.scalars(select(KnowledgeChunkRow).where(KnowledgeChunkRow.id.in_(ids))).all()
        by_id = {r.id: r for r in rows}
        return [self._to_record(by_id[i], 0.0) for i in ids if i in by_id]

    def _to_record(self, row, score: float) -> ChunkRecord:
        from .models import KnowledgeSourceRow

        src = None
        with self._session_factory() as session:
            src = session.get(KnowledgeSourceRow, row.source_id)
        return ChunkRecord(
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
