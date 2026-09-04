"""Runtime LLM provider utility endpoints (BYOK).

- POST /api/llm/test   — minimal low-cost connection test for the Settings UI.
- POST /api/llm/models — optional model listing when the provider exposes a
                         compatible GET /models endpoint (best effort).

Every request carries the user's transient provider config; the backend
validates it (SSRF-safe) and never stores the API key.
"""

from __future__ import annotations

from typing import Any

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ..llm.base import LlmProvider
from ..llm.openai_compatible import OpenAICompatibleLlm
from ..llm.provider import parse_runtime_provider

router = APIRouter()

# Smallest possible chat payload for a connection/auth/model probe.
_PROBE_MESSAGES = [{"role": "user", "content": "ping"}]


class TestConnectionRequest(BaseModel):
    provider: dict[str, Any] = Field(default_factory=dict)


class ModelsRequest(BaseModel):
    provider: dict[str, Any] = Field(default_factory=dict)


def _require_llm(provider_raw: dict[str, Any]) -> LlmProvider:
    try:
        cfg = parse_runtime_provider(provider_raw)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    if cfg is None:
        raise HTTPException(status_code=422, detail="provider.baseUrl and provider.model are required")
    return OpenAICompatibleLlm(cfg.baseUrl, cfg.apiKey, cfg.model)


def _friendly_llm_error(e: Exception) -> str:
    """Map an upstream failure to a short, user-friendly message. Never echoes
    the full upstream body (it may contain sensitive data)."""
    text = str(e)
    low = text.lower()
    if isinstance(e, httpx.HTTPStatusError):
        status = e.response.status_code
        if status == 401:
            return "Authentication failed"
        if status == 403:
            return "Authentication failed"
        if status == 404:
            return "Model not found or endpoint not supported"
        if status == 429:
            return "Provider rate limit reached"
        if status >= 500:
            return "Provider unavailable"
        return f"Provider returned HTTP {status}"
    if isinstance(e, httpx.TimeoutException):
        return "Request timed out"
    if isinstance(e, httpx.ConnectError):
        return "Provider unavailable"
    if "connect" in low or "resolve" in low:
        return "Provider unavailable"
    if "404" in low or "not found" in low:
        return "Model not found or endpoint not supported"
    if "401" in low or "authentication" in low or "auth" in low:
        return "Authentication failed"
    return "Invalid Base URL or provider error"


@router.post("/api/llm/test")
async def test_connection(body: TestConnectionRequest) -> dict:
    llm = _require_llm(body.provider)
    try:
        await llm.chat(_PROBE_MESSAGES, temperature=0, max_tokens=8)
    except Exception as e:  # noqa: BLE001 - translate to friendly message
        return {"ok": False, "message": _friendly_llm_error(e)}
    return {"ok": True, "message": "Connection OK", "model": _provider_model(body.provider)}


@router.post("/api/llm/models")
async def fetch_models(body: ModelsRequest) -> dict:
    """Best-effort model list from a standard GET {base}/models endpoint.

    Reuses the same SSRF-safe validation. Failures never block manual model
    entry in the UI (the endpoint simply reports ok=false).
    """
    raw = body.provider
    try:
        cfg = parse_runtime_provider(raw)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    if cfg is None:
        raise HTTPException(status_code=422, detail="provider.baseUrl is required")
    headers = {"Content-Type": "application/json"}
    if cfg.apiKey:
        headers["Authorization"] = f"Bearer {cfg.apiKey}"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.get(f"{cfg.baseUrl}/models", headers=headers)
            if res.status_code in (401, 403):
                return {"ok": False, "message": "Authentication failed", "models": []}
            if res.status_code == 404:
                return {"ok": False, "message": "Provider does not expose /models", "models": []}
            res.raise_for_status()
            data = res.json()
        ids = [m.get("id") for m in data.get("data", []) if isinstance(m, dict) and m.get("id")]
        return {"ok": True, "models": ids[:200]}
    except httpx.TimeoutException:
        return {"ok": False, "message": "Request timed out", "models": []}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "message": _friendly_llm_error(e), "models": []}


def _provider_model(raw: dict[str, Any]) -> str | None:
    return raw.get("model") or None
