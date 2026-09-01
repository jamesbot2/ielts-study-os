"""Health endpoint — structured state, no secrets."""

from __future__ import annotations

from fastapi import APIRouter, Request

from ..config import settings

router = APIRouter()


@router.get("/health")
async def health(request: Request) -> dict:
    rag = request.app.state.rag
    h = rag.health
    return {
        "status": "ok",
        "service": "ielts-study-os-ai-rag",
        "version": "0.6.1",
        "llm_configured": rag.llm is not None,
        "embeddings_configured": bool(settings.embedding_base_url and settings.embedding_model),
        "rag": rag.rag_state,
        "database_configured": bool(settings.database_url),
        "database_reachable": h.reachable,
        "pgvector_available": h.pgvector_available,
        "knowledge_chunk_count": h.chunk_count,
    }
