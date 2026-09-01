"""Coach agent endpoint — NDJSON event stream + a simple compat endpoint."""

from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ..config import settings

router = APIRouter()


class CoachAgentRequest(BaseModel):
    conversationId: str | None = None
    message: str
    learnerContext: dict[str, Any] = Field(default_factory=dict)
    pageContext: dict[str, Any] | None = None
    locale: str = "en"
    history: list[dict[str, str]] = Field(default_factory=list)


def _validate_request(body: CoachAgentRequest) -> None:
    if len(body.message) > settings.max_message_length:
        raise HTTPException(status_code=413, detail="Message too long")
    if len(body.history) > settings.max_history_size:
        raise HTTPException(status_code=413, detail="History too large")


@router.post("/api/coach/agent")
async def coach_agent(body: CoachAgentRequest, request: Request) -> StreamingResponse:
    _validate_request(body)
    ctx = request.app.state.rag
    if ctx.llm is None:
        raise HTTPException(status_code=503, detail="LLM not configured")

    snapshot = body.learnerContext
    if body.pageContext:
        snapshot = {**snapshot, "page": body.pageContext}

    async def gen():
        async for event in ctx.agent.stream(body.message, snapshot, body.locale):
            yield json.dumps(event, ensure_ascii=False) + "\n"

    return StreamingResponse(gen(), media_type="application/x-ndjson")


@router.post("/api/coach")
async def coach_compat(body: dict[str, Any], request: Request) -> StreamingResponse:
    """Backward-compatible plain-text stream for the older /api/coach contract."""
    ctx = request.app.state.rag
    if ctx.llm is None:
        raise HTTPException(status_code=503, detail="LLM not configured")
    messages = body.get("messages") or []
    user_text = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")

    async def gen():
        async for event in ctx.agent.stream(user_text, {}, "en"):
            if event["type"] == "delta":
                yield event["text"]
            elif event["type"] == "done":
                break

    return StreamingResponse(gen(), media_type="text/plain")
