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
        # Top-level status reflects the PROCESS only; rag_status carries RAG health.
        "status": "ok",
        "service": "ielts-study-os-ai-rag",
        "version": "0.6.2",
        "llm_configured": rag.llm is not None,
        "embeddings_configured": rag.embeddings_configured,
        "rag_status": rag.rag_state,
        "retrieval_mode": rag.retrieval_mode,
        "database_configured": bool(settings.database_url),
        "database_reachable": h.reachable,
        "pgvector_available": h.pgvector_available,
        "knowledge_chunk_count": h.chunk_count,
    }
