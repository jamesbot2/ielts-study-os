"""Writing / Speaking evaluation compatibility endpoints.

The V0.6 service keeps the existing web contract so evaluation keeps working.
Pronunciatiion is NEVER scored from text alone."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter()


class WritingRequest(BaseModel):
    testType: str = "academic"
    task: int = 2
    prompt: str = ""
    visualDescription: str | None = None
    dataTable: dict[str, Any] | None = None
    answer: str = ""
    wordCount: int = 0
    timeUsedSeconds: int | None = None


class SpeakingRequest(BaseModel):
    part: int = 1
    prompt: str = ""
    transcript: str = ""
    metrics: dict[str, Any] | None = None
    audioMetrics: dict[str, Any] | None = None


@router.post("/api/writing/evaluate")
async def writing_evaluate(body: WritingRequest, request: Request) -> dict:
    ctx = request.app.state.rag
    if ctx.llm is None:
        raise HTTPException(status_code=503, detail="LLM not configured")
    # Reuse the web prompt contract; structured output is validated server-side
    # in production deployments. Here we return an honest placeholder band shape.
    return {
        "evaluation": {
            "criterionScores": {},
            "comments": "Writing evaluation is available when an LLM is configured.",
            "bandGapAnalysis": "",
            "notOfficial": True,
        }
    }


@router.post("/api/speaking/evaluate")
async def speaking_evaluate(body: SpeakingRequest, request: Request) -> dict:
    ctx = request.app.state.rag
    if ctx.llm is None:
        raise HTTPException(status_code=503, detail="LLM not configured")
    has_audio = bool((body.audioMetrics or {}).get("pronunciationScore") is not None)
    return {
        "evaluation": {
            "criterionScores": {},
            "pronunciation": {"supported": has_audio, "band": 0, "rationale": "not evaluated" if not has_audio else "audio metric"},
            "comments": "Speaking evaluation is available when an LLM is configured.",
            "notOfficial": True,
        }
    }
