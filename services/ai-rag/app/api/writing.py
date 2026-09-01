"""Writing / Speaking evaluation endpoints — real LLM evaluation + validation."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from ..evaluation import EvaluationServiceError, evaluate_speaking, evaluate_writing

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
    rag = request.app.state.rag
    if rag.llm is None:
        raise HTTPException(status_code=503, detail="LLM not configured")
    try:
        evaluation = await evaluate_writing(rag.llm, body)
    except EvaluationServiceError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message) from e
    return {"evaluation": evaluation.model_dump()}


@router.post("/api/speaking/evaluate")
async def speaking_evaluate(body: SpeakingRequest, request: Request) -> dict:
    rag = request.app.state.rag
    if rag.llm is None:
        raise HTTPException(status_code=503, detail="LLM not configured")
    try:
        evaluation = await evaluate_speaking(rag.llm, body)
    except EvaluationServiceError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message) from e
    return {"evaluation": evaluation.model_dump()}
