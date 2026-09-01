"""Single retrieval policy shared by the RAG API and the Coach agent.

- embeddings configured → hybrid (vector + lexical + RRF)
- embeddings NOT configured → lexical-only (no zero-vector ranking)
"""

from __future__ import annotations

from ..llm.base import EmbeddingProvider
from .retrieval import (
    ChunkRecord,
    RetrievedChunk,
    SearchFilters,
    hybrid_search_repository,
)


def _to_retrieved(hits: list[ChunkRecord]) -> list[RetrievedChunk]:
    return [
        RetrievedChunk(
            chunk_id=h.chunk_id,
            source_id=h.source_id,
            title=h.title,
            url=h.url,
            section=h.section,
            content=h.content,
            score=0.0,
            fields=h.fields,
        )
        for h in hits
    ]


class RetrievalService:
    def __init__(self, repository: object, embeddings: EmbeddingProvider, embeddings_configured: bool) -> None:
        self.repository = repository
        self.embeddings = embeddings
        self.embeddings_configured = embeddings_configured

    @property
    def mode(self) -> str:
        return "hybrid" if self.embeddings_configured else "lexical_only"

    async def search(self, query: str, filters: SearchFilters, top_k: int) -> list[RetrievedChunk]:
        if not self.embeddings_configured:
            return _to_retrieved(self.repository.search_lexical(query, filters, top_k))
        embedding = await self.embeddings.embed_query(query)
        return hybrid_search_repository(self.repository, query, embedding, filters, top_k=top_k)
