"""Coach agent endpoint — NDJSON event stream + a simple compat endpoint."""

from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ..config import settings
from ..llm.provider import resolve_llm

router = APIRouter()


class CoachAgentRequest(BaseModel):
    conversationId: str | None = None
    message: str
    learnerContext: dict[str, Any] = Field(default_factory=dict)
    pageContext: dict[str, Any] | None = None
    locale: str = "en"
    history: list[dict[str, str]] = Field(default_factory=list)
    # Optional per-request BYOK provider (baseUrl/model/apiKey). Absent →
    # server-managed LLM_BASE_URL fallback when configured.
    provider: dict[str, Any] | None = None


def _validate_request(body: CoachAgentRequest) -> None:
    import json

    if len(body.message) > settings.max_message_length:
        raise HTTPException(status_code=413, detail="Message too long")
    if len(body.history) > settings.max_history_size:
        raise HTTPException(status_code=413, detail="History too large")
    context_size = len(json.dumps(body.learnerContext)) + len(json.dumps(body.pageContext or {}))
    if context_size > settings.max_context_size:
        raise HTTPException(status_code=413, detail="Learner context too large")


@router.post("/api/coach/agent")
async def coach_agent(body: CoachAgentRequest, request: Request) -> StreamingResponse:
    _validate_request(body)
    ctx = request.app.state.rag
    llm, error = resolve_llm(body.provider, ctx.llm)
    if llm is None:
        raise HTTPException(status_code=503, detail=error or "LLM not configured")

    snapshot = body.learnerContext
    if body.pageContext:
        snapshot = {**snapshot, "page": body.pageContext}

    async def gen():
        async for event in ctx.agent.stream_with_llm(llm, body.message, snapshot, body.locale, body.history):
            yield json.dumps(event, ensure_ascii=False) + "\n"

    return StreamingResponse(gen(), media_type="application/x-ndjson")


@router.post("/api/coach")
async def coach_compat(body: dict[str, Any], request: Request) -> StreamingResponse:
    """Backward-compatible plain-text stream for the older /api/coach contract."""
    ctx = request.app.state.rag
    llm, error = resolve_llm(body.get("provider"), ctx.llm)
    if llm is None:
        raise HTTPException(status_code=503, detail=error or "LLM not configured")
    messages = body.get("messages") or []
    user_text = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")

    async def gen():
        async for event in ctx.agent.stream_with_llm(llm, user_text, {}, "en"):
            if event["type"] == "delta":
                yield event["text"]
            elif event["type"] == "done":
                break

    return StreamingResponse(gen(), media_type="text/plain")
