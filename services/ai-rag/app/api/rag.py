"""RAG search endpoint."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from ..config import settings
from ..rag.retrieval import SearchFilters

router = APIRouter()


class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    filters: dict[str, Any] = {}
    top_k: int = Field(default=8, ge=1, le=settings.max_top_k)


@router.post("/api/rag/search")
async def search(body: SearchRequest, request: Request) -> dict:
    ctx = request.app.state.rag  # RagContext set in main.py
    filters = SearchFilters(**{k: v for k, v in body.filters.items() if k in SearchFilters.__dataclass_fields__})
    top_k = body.top_k
    embedding = await ctx.embeddings.embed_query(body.query)
    results = ctx.search(body.query, embedding, filters, top_k=top_k)
    return {
        "results": [
            {
                "chunkId": r.chunk_id,
                "sourceId": r.source_id,
                "title": r.title,
                "url": r.url,
                "section": r.section,
                "content": r.content,
                "score": r.score,
            }
            for r in results
        ]
    }
