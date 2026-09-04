"""TEMPORARY one-shot production RAG admin endpoints (removed after use).

Authenticated with INGEST_ONCE_TOKEN (Sensitive, runtime-only). Runs inside the
Vercel Production function so it can use the runtime Sensitive variables
directly. NEVER returns/logs secrets. This module is deleted after ingestion.
"""

from __future__ import annotations

import asyncio
import hmac
import os
from pathlib import Path

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

router = APIRouter()

_INGEST_TOKEN_ENV = "INGEST_ONCE_TOKEN"


class _ActionRequest(BaseModel):
    pass


def _check_token(x_ingest_token: str | None) -> None:
    expected = os.environ.get(_INGEST_TOKEN_ENV, "")
    provided = (x_ingest_token or "").strip()
    if not expected or not provided:
        raise HTTPException(status_code=401, detail="unauthorized")
    if not hmac.compare_digest(expected.encode(), provided.encode()):
        raise HTTPException(status_code=401, detail="unauthorized")


def _sanitized_error(e: Exception) -> str:
    """Return a user-safe error string. Never includes secrets."""
    text = str(e)
    # Generic classification; never echo raw upstream bodies.
    low = text.lower()
    if "401" in low or "unauthorized" in low or "authentication" in low:
        return "provider authentication failed"
    if "403" in low:
        return "provider forbidden"
    if "404" in low or "not found" in low or "no such file" in low:
        return "resource not found (check knowledge files / endpoint)"
    if "timeout" in low:
        return "request timed out"
    if "dimension" in low:
        return "embedding dimension mismatch"
    if "connection" in low or "resolve" in low:
        return "database/network unavailable"
    # Keep the type name only; drop the message body to avoid leaking details.
    return type(e).__name__


def _build_embeddings():
    from ..config import settings
    from ..embeddings.openai_compatible import OpenAICompatibleEmbeddings

    return OpenAICompatibleEmbeddings(
        settings.embedding_base_url,
        settings.embedding_api_key,
        settings.embedding_model,
        settings.embedding_dimension,
        passage_task=settings.embedding_passage_task,
        query_task=settings.embedding_query_task,
    )


def _find_knowledge_dir() -> str | None:
    """Locate the repository knowledge/ directory from inside the runtime.

    Vercel functions are built from rootDirectory=services/ai-rag, so the
    repository knowledge/ (one level up) may or may not be present. Try the
    documented locations and report which is usable.
    """
    candidates = [
        os.environ.get("KNOWLEDGE_DIR"),
        str(Path.cwd() / "knowledge"),
        str(Path(__file__).resolve().parents[3] / "knowledge"),  # repo root
        str(Path(__file__).resolve().parents[2] / "knowledge"),
    ]
    for c in candidates:
        if c and Path(c).is_dir() and (Path(c) / "sources.yml").is_file():
            return c
    return None


@router.get("/api/internal/rag-admin/status")
async def rag_admin_status(x_ingest_token: str | None = Header(default=None)) -> dict:
    _check_token(x_ingest_token)
    from ..config import settings
    from ..storage.repository import PostgresKnowledgeRepository

    kdir = _find_knowledge_dir()
    db_configured = bool(settings.database_url)
    db_reachable = False
    pgvector = False
    chunks = 0
    if db_configured:
        try:
            repo = PostgresKnowledgeRepository(settings.database_url)
            h = repo.health_check()
            db_reachable = h.reachable
            pgvector = h.pgvector_available
            chunks = h.chunk_count
        except Exception as e:  # noqa: BLE001
            return {
                "knowledge_dir": kdir,
                "database_configured": True,
                "database_reachable": False,
                "error": _sanitized_error(e),
            }
    return {
        "knowledge_dir": kdir,
        "knowledge_files": {
            "sources_yml": bool(kdir and (Path(kdir) / "sources.yml").is_file()),
            "generated_curriculum": bool(kdir and (Path(kdir) / "generated" / "ielts-study-os.json").is_file()),
            "official_notes": bool(kdir and (Path(kdir) / "official-notes.json").is_file()),
        },
        "model": settings.embedding_model,
        "dimension": settings.embedding_dimension,
        "passage_task": settings.embedding_passage_task,
        "query_task": settings.embedding_query_task,
        "database_configured": db_configured,
        "database_reachable": db_reachable,
        "pgvector_available": pgvector,
        "knowledge_chunk_count": chunks,
    }


@router.post("/api/internal/rag-admin/smoke")
async def rag_admin_smoke(x_ingest_token: str | None = Header(default=None)) -> dict:
    """Jina embedding smoke: passage vs query task, dimension, non-zero."""
    _check_token(x_ingest_token)
    from ..config import settings

    emb = _build_embeddings()
    text = "IELTS Academic Reading lasts 60 minutes with 40 questions."

    async def _run():
        passage = await emb.embed_texts([text], task=settings.embedding_passage_task or None)
        query = await emb.embed_query(text)
        return passage[0], query

    try:
        pvec, qvec = asyncio.run(_run())
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": _sanitized_error(e)}

    p_nonzero = any(x != 0.0 for x in pvec)
    q_nonzero = any(x != 0.0 for x in qvec)
    dim_ok = len(pvec) == settings.embedding_dimension == len(qvec)
    distinct = pvec != qvec
    ok = dim_ok and p_nonzero and q_nonzero and distinct
    return {
        "ok": ok,
        "model": settings.embedding_model,
        "configured_dimension": settings.embedding_dimension,
        "passage_dim": len(pvec),
        "query_dim": len(qvec),
        "passage_nonzero": p_nonzero,
        "query_nonzero": q_nonzero,
        "passage_distinct_from_query": distinct,
        "error": None,
    }


@router.post("/api/internal/rag-admin/ingest")
async def rag_admin_ingest(x_ingest_token: str | None = Header(default=None)) -> dict:
    _check_token(x_ingest_token)
    from ..config import settings
    from ..knowledge.ingest import _find_knowledge_dir as _find
    from ..knowledge.ingest import ingest_manifest, load_exported_docs
    from ..storage.repository import PostgresKnowledgeRepository

    kdir = _find_knowledge_dir() or _find()
    if not kdir or not (Path(kdir) / "sources.yml").is_file():
        return {"ok": False, "error": "knowledge directory not available in runtime; set KNOWLEDGE_DIR"}
    import yaml

    try:
        manifest_data = yaml.safe_load((Path(kdir) / "sources.yml").read_text(encoding="utf-8"))
        emb = _build_embeddings()
        repo = PostgresKnowledgeRepository(settings.database_url)
        repo._lazy_init()
        docs = load_exported_docs(kdir)
        task_suffix = f":{settings.embedding_passage_task}" if settings.embedding_passage_task else ""
        fingerprint = f"{settings.embedding_model}:{settings.embedding_dimension}:v1{task_suffix}"
        run_id = repo.start_ingestion_run(fingerprint)

        async def _run():
            return await ingest_manifest(repo, manifest_data, emb, docs, fingerprint)

        try:
            result = asyncio.run(_run())
        except Exception as e:
            repo.fail_ingestion_run(run_id, _sanitized_error(e))
            raise
        repo.finish_ingestion_run(run_id, result)
        return {
            "ok": True,
            "run_id": run_id,
            "sources_processed": len(docs),
            "added": result.added,
            "updated": result.updated,
            "unchanged": result.unchanged,
            "deleted": result.deleted,
            "fingerprint": fingerprint,
            "error": None,
        }
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": _sanitized_error(e)}
