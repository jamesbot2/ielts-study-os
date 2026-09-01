"""Hybrid retrieval: vector similarity + lexical overlap, fused with Reciprocal
Rank Fusion. Works over an in-memory chunk store so it is fully offline-testable."""

from __future__ import annotations

import math
import re
from dataclasses import dataclass, field
from typing import Any


@dataclass
class RetrievedChunk:
    chunk_id: str
    source_id: str
    title: str
    url: str | None
    section: str
    content: str
    score: float
    fields: dict[str, Any] = field(default_factory=dict)


@dataclass
class SearchFilters:
    skill: str | None = None
    test_type: str | None = None
    source_type: str | None = None
    official: bool | None = None
    question_type: str | None = None
    language: str | None = None


def cosine(a: list[float], b: list[float]) -> float:
    if not a or not b:
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def lexical_score(query: str, text: str) -> float:
    q_terms = set(re.findall(r"[a-z0-9]+", query.lower()))
    if not q_terms:
        return 0.0
    t_terms = set(re.findall(r"[a-z0-9]+", text.lower()))
    return len(q_terms & t_terms) / len(q_terms)


def reciprocal_rank_fusion(rank_lists: list[list[str]], k: float = 60.0) -> dict[str, float]:
    scores: dict[str, float] = {}
    for ranked in rank_lists:
        for rank, cid in enumerate(ranked):
            scores[cid] = scores.get(cid, 0.0) + 1.0 / (k + rank + 1)
    return scores


def matches_filters(chunk_fields: dict[str, Any], filters: SearchFilters) -> bool:
    if filters.skill and chunk_fields.get("skill") and chunk_fields.get("skill") != filters.skill and chunk_fields.get("skill") != "all":
        return False
    if filters.test_type and chunk_fields.get("test_type") and chunk_fields.get("test_type") not in (filters.test_type, "both"):
        return False
    if filters.source_type and chunk_fields.get("source_type") != filters.source_type:
        return False
    if filters.official is not None and chunk_fields.get("official") != filters.official:
        return False
    if filters.question_type and filters.question_type not in (chunk_fields.get("question_types") or []):
        return False
    if filters.language and chunk_fields.get("language") and chunk_fields.get("language") != filters.language:
        return False
    return True


@dataclass
class ChunkRecord:
    chunk_id: str
    source_id: str
    title: str
    url: str | None
    section: str
    content: str
    embedding: list[float]
    fields: dict[str, Any]


class HybridRetriever:
    """Holds records in memory. The production repository loads records from
    PostgreSQL; this class stays DB-agnostic."""

    def __init__(self, records: list[ChunkRecord]) -> None:
        self.records = records

    def search(self, query: str, query_embedding: list[float], top_k: int = 8, filters: SearchFilters | None = None) -> list[RetrievedChunk]:
        flt = filters or SearchFilters()
        candidates = [r for r in self.records if matches_filters(r.fields, flt)]

        vector_rank = sorted(
            candidates,
            key=lambda r: cosine(query_embedding, r.embedding),
            reverse=True,
        )
        lexical_rank = sorted(
            candidates,
            key=lambda r: lexical_score(query, r.content),
            reverse=True,
        )
        fused = reciprocal_rank_fusion(
            [[r.chunk_id for r in vector_rank], [r.chunk_id for r in lexical_rank]],
        )
        ranked = sorted(candidates, key=lambda r: fused.get(r.chunk_id, 0.0), reverse=True)
        top = ranked[:top_k]
        return [
            RetrievedChunk(
                chunk_id=r.chunk_id,
                source_id=r.source_id,
                title=r.title,
                url=r.url,
                section=r.section,
                content=r.content,
                score=round(fused.get(r.chunk_id, 0.0), 6),
                fields=r.fields,
            )
            for r in top
        ]
