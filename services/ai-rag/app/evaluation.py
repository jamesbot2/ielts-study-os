"""IELTS evaluation: real LLM calls + strict Pydantic validation.

Never returns placeholder JSON. On invalid LLM output we attempt one controlled
repair; if still invalid we raise a controlled error. Pronunciation is NEVER
scored from text alone."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, ValidationError

from .llm.base import LlmProvider


class WritingCriterion(BaseModel):
    criterion: Literal["taskAchievement", "taskResponse", "coherenceCohesion", "lexicalResource", "grammaticalRange"]
    band: float = Field(ge=0, le=9)
    rationale: str


class WritingEvaluation(BaseModel):
    criterionScores: list[WritingCriterion] = Field(min_length=4, max_length=5)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    sentenceLevelIssues: list[dict] = Field(default_factory=list)
    grammarIssues: list[str] = Field(default_factory=list)
    lexicalIssues: list[str] = Field(default_factory=list)
    coherenceIssues: list[str] = Field(default_factory=list)
    taskResponseIssues: list[str] = Field(default_factory=list)
    missingRequirements: list[str] = Field(default_factory=list)
    suggestedCorrections: list[str] = Field(default_factory=list)
    improvedSentences: list[dict] = Field(default_factory=list)
    vocabularySuggestions: list[dict] = Field(default_factory=list)
    nextPracticeTargets: list[str] = Field(default_factory=list)
    examinerStyleSummary: str = ""
    bandGapAnalysis: str = ""


class SpeakingCriterion(BaseModel):
    criterion: Literal["fluencyCoherence", "lexicalResource", "grammaticalRange", "pronunciation"]
    band: float = Field(ge=0, le=9)
    rationale: str
    supported: bool


class SpeakingEvaluation(BaseModel):
    criterionScores: list[SpeakingCriterion]
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    grammarIssues: list[str] = Field(default_factory=list)
    betterVocabulary: list[dict] = Field(default_factory=list)
    improvedVersions: list[dict] = Field(default_factory=list)
    answerDevelopmentSuggestions: list[str] = Field(default_factory=list)
    weakestCriterion: Literal["fluencyCoherence", "lexicalResource", "grammaticalRange", "pronunciation"]
    nextRecommendedDrills: list[str] = Field(default_factory=list)


class EvaluationServiceError(Exception):
    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.message = message


def enforce_pronunciation_safety(raw: dict[str, Any], has_audio: bool) -> dict[str, Any]:
    """Always re-applied (before validation, after repair, before returning).
    Without audio evidence, pronunciation must be supported=false and band=0."""
    if has_audio:
        return raw
    scores = raw.get("criterionScores")
    if isinstance(scores, list):
        for sc in scores:
            if isinstance(sc, dict) and sc.get("criterion") == "pronunciation":
                sc["band"] = 0
                sc["supported"] = False
    return raw


def _writing_system(task: int, test_type: str) -> str:
    criterion = "Task Achievement" if task == 1 else "Task Response"
    return (
        "You are a highly experienced IELTS Writing examiner. Evaluate strictly against the official public "
        f"IELTS band descriptors. Task {task} ({test_type}). Primary criterion: {criterion}. "
        "Return ONLY valid JSON matching the required schema. Use whole or half bands (e.g. 6.0, 6.5). "
        "Never claim the score is an official IELTS score."
    )


def _speaking_system(has_audio: bool) -> str:
    return (
        "You are a highly experienced IELTS Speaking examiner. Evaluate against the official public band "
        "descriptors for fluency/coherence, lexical resource, grammatical range and accuracy, and pronunciation. "
        "Return ONLY valid JSON. For 'pronunciation': "
        f"supported={str(has_audio).lower()}. "
        + ("A separate audio engine measured pronunciation; incorporate it cautiously." if has_audio
           else "Pronunciation is NOT evaluated (no audio). Band must be 0 and supported=false; never fabricate a pronunciation score from text.")
    )


async def evaluate_writing(llm: LlmProvider, body: Any) -> WritingEvaluation:
    messages = [
        {"role": "system", "content": _writing_system(body.task, body.testType)},
        {
            "role": "user",
            "content": f"PROMPT:\n{body.prompt}\n\nSTUDENT ANSWER ({body.wordCount} words):\n{body.answer}",
        },
    ]
    schema = WritingEvaluation.model_json_schema()
    raw = await llm.structured(messages, schema, temperature=0.2)
    try:
        return WritingEvaluation.model_validate(raw)
    except ValidationError:
        # One controlled repair attempt with an explicit reminder.
        repaired = await llm.structured(
            messages + [{"role": "assistant", "content": str(raw)}, {"role": "user", "content": "Repair the JSON to match the required schema exactly."}],
            schema,
            temperature=0.0,
        )
        try:
            return WritingEvaluation.model_validate(repaired)
        except ValidationError as e:
            raise EvaluationServiceError(502, f"Invalid writing evaluation output: {e}") from e


async def evaluate_speaking(llm: LlmProvider, body: Any) -> SpeakingEvaluation:
    has_audio = bool((body.audioMetrics or {}).get("pronunciationScore") is not None)
    messages = [
        {"role": "system", "content": _speaking_system(has_audio)},
        {"role": "user", "content": f"PART {body.part} PROMPT:\n{body.prompt}\n\nTRANSCRIPT:\n{body.transcript}"},
    ]
    schema = SpeakingEvaluation.model_json_schema()
    raw = await llm.structured(messages, schema, temperature=0.2)
    raw = enforce_pronunciation_safety(raw, has_audio)
    try:
        return SpeakingEvaluation.model_validate(raw)
    except ValidationError:
        repaired = await llm.structured(
            messages + [{"role": "assistant", "content": str(raw)}, {"role": "user", "content": "Repair the JSON to match the required schema exactly."}],
            schema,
            temperature=0.0,
        )
        # Re-apply safety AFTER repair so repair cannot reintroduce a fabricated score.
        repaired = enforce_pronunciation_safety(repaired, has_audio)
        try:
            return SpeakingEvaluation.model_validate(repaired)
        except ValidationError as e:
            raise EvaluationServiceError(502, f"Invalid speaking evaluation output: {e}") from e
