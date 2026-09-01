"""SQLAlchemy models for the PostgreSQL + pgvector knowledge store."""

from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from ..config import settings

try:  # pgvector is required for the production store; optional for offline tests
    from pgvector.sqlalchemy import Vector

    EMBEDDING_TYPE = Vector(settings.embedding_dimension)
except ImportError:  # pragma: no cover - offline test environments
    Vector = None  # type: ignore[assignment]
    EMBEDDING_TYPE = JSON


class Base(DeclarativeBase):
    pass


def utcnow() -> datetime:
    return datetime.now(UTC)


class KnowledgeSourceRow(Base):
    __tablename__ = "knowledge_sources"

    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    provider: Mapped[str] = mapped_column(String(300), nullable=False)
    url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    official: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    license: Mapped[str | None] = mapped_column(String(200), nullable=True)
    redistribution_policy: Mapped[str] = mapped_column(String(100), nullable=False)
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    skill: Mapped[str] = mapped_column(String(40), nullable=False, default="all")
    test_type: Mapped[str] = mapped_column(String(20), nullable=False, default="both")
    topics: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    last_verified: Mapped[str] = mapped_column(String(20), nullable=False)
    content_hash: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)


class KnowledgeChunkRow(Base):
    __tablename__ = "knowledge_chunks"
    __table_args__ = (UniqueConstraint("source_id", "content_hash", name="uq_chunk_source_hash"),)

    id: Mapped[str] = mapped_column(String(200), primary_key=True)
    source_id: Mapped[str] = mapped_column(ForeignKey("knowledge_sources.id", ondelete="CASCADE"), index=True, nullable=False)
    heading: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    skill: Mapped[str] = mapped_column(String(40), nullable=False, default="all")
    test_type: Mapped[str] = mapped_column(String(20), nullable=False, default="both")
    topics: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    question_types: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    embedding: Mapped[list | None] = mapped_column(EMBEDDING_TYPE, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)


class IngestionRunRow(Base):
    __tablename__ = "ingestion_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    added: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updated: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    unchanged: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    deleted: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
