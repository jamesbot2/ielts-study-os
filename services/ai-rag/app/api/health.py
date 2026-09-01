"""Health endpoint — structured state, no secrets."""

from __future__ import annotations

from fastapi import APIRouter

from ..config import settings

router = APIRouter()


def get_health() -> dict:
    return {
        "status": "ok",
        "service": "ielts-study-os-ai-rag",
        "llm_configured": bool(settings.llm_base_url and settings.llm_model),
        "embeddings_configured": bool(settings.embedding_base_url and settings.embedding_model),
        # Database/vector status is reported by deployments that wire a real DB;
        # here we reflect configuration only and never expose secret values.
        "database": "configured" if settings.database_url else "unset",
    }


@router.get("/health")
async def health() -> dict:
    return get_health()
