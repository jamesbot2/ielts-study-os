"""Writing/Speaking regression: they share the structured() path with Coach.

A generic HTTP provider that returns JSON only when instructed (our realistic
fake) must be able to complete writing/speaking evaluation once structured()
uses the schema. Before the fix, structured() ignored the schema so a real
model could return prose and evaluation would fail with a JSON error.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import json

import httpx
import pytest

from app.evaluation import evaluate_speaking, evaluate_writing
from app.llm.openai_compatible import OpenAICompatibleLlm

WRITING_OK = {
    "criterionScores": [
        {"criterion": "taskResponse", "band": 6.0, "rationale": "addresses parts"},
        {"criterion": "coherenceCohesion", "band": 6.5, "rationale": "clear"},
        {"criterion": "lexicalResource", "band": 6.0, "rationale": "adequate"},
        {"criterion": "grammaticalRange", "band": 5.5, "rationale": "errors"},
    ],
    "strengths": ["clear position"],
    "weaknesses": ["grammar errors"],
    "sentenceLevelIssues": [],
    "grammarIssues": [],
    "lexicalIssues": [],
    "coherenceIssues": [],
    "taskResponseIssues": [],
    "missingRequirements": [],
    "suggestedCorrections": [],
    "improvedSentences": [],
    "vocabularySuggestions": [],
    "nextPracticeTargets": [],
    "examinerStyleSummary": "ok",
    "bandGapAnalysis": "ok",
}

SPEAKING_OK = {
    "criterionScores": [
        {"criterion": "fluencyCoherence", "band": 6.0, "rationale": "ok", "supported": True},
        {"criterion": "lexicalResource", "band": 6.0, "rationale": "ok", "supported": True},
        {"criterion": "grammaticalRange", "band": 6.0, "rationale": "ok", "supported": True},
        {"criterion": "pronunciation", "band": 0, "rationale": "no audio", "supported": False},
    ],
    "strengths": [],
    "weaknesses": [],
    "grammarIssues": [],
    "betterVocabulary": [],
    "improvedVersions": [],
    "answerDevelopmentSuggestions": [],
    "weakestCriterion": "pronunciation",
    "nextRecommendedDrills": [],
}


def _json_when_structured(payload_for_schema):
    """Handler: prose for plain chat; JSON object when our structured
    instruction marker is present."""

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.read())
        last_user = ""
        for m in reversed(body.get("messages", [])):
            if m.get("role") == "user":
                last_user = str(m.get("content") or "")
                break
        if "Respond with ONLY a single JSON object" in last_user:
            return httpx.Response(200, json={"choices": [{"message": {"content": json.dumps(payload_for_schema)}}]})
        return httpx.Response(200, json={"choices": [{"message": {"content": "Sure! That is a good IELTS essay topic."}}]})

    return handler


def _llm(handler):
    return OpenAICompatibleLlm(
        "https://llm.test/v1", "test-key", "test-model", timeout=5.0,
        transport=httpx.MockTransport(handler),
    )


class _Body:
    def __init__(self, **kw):
        self.__dict__.update(kw)


@pytest.mark.asyncio
async def test_writing_completes_with_generic_model():
    llm = _llm(_json_when_structured(WRITING_OK))
    body = _Body(testType="academic", task=2, prompt="Task", answer="Some essay", wordCount=3)
    ev = await evaluate_writing(llm, body)
    assert ev.criterionScores[0].band == 6.0


@pytest.mark.asyncio
async def test_speaking_completes_with_generic_model():
    llm = _llm(_json_when_structured(SPEAKING_OK))
    body = _Body(part=1, prompt="Talk about home", transcript="My home is small.", metrics={}, audioMetrics={})
    ev = await evaluate_speaking(llm, body)
    # Pronunciation must stay unsupported (no audio) even though the model
    # returned supported=True in raw JSON? Our SPEAKING_OK already has it false.
    pron = next(c for c in ev.criterionScores if c.criterion == "pronunciation")
    assert pron.supported is False
    assert pron.band == 0
