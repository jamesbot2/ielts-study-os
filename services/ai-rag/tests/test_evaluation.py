import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest

from app.evaluation import (
    EvaluationServiceError,
    SpeakingEvaluation,
    WritingEvaluation,
    evaluate_speaking,
    evaluate_writing,
)
from tests.fakes import FakeLlm

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
    "grammarIssues": ["subject-verb agreement"],
    "lexicalIssues": [],
    "coherenceIssues": [],
    "taskResponseIssues": [],
    "missingRequirements": [],
    "suggestedCorrections": [],
    "improvedSentences": [],
    "vocabularySuggestions": [],
    "nextPracticeTargets": ["grammar"],
    "examinerStyleSummary": "ok",
    "bandGapAnalysis": "next half band needs fewer errors",
}

SPEAKING_OK = {
    "criterionScores": [
        {"criterion": "fluencyCoherence", "band": 6.0, "rationale": "ok", "supported": True},
        {"criterion": "lexicalResource", "band": 6.0, "rationale": "ok", "supported": True},
        {"criterion": "grammaticalRange", "band": 6.0, "rationale": "ok", "supported": True},
        {"criterion": "pronunciation", "band": 0, "rationale": "n/a", "supported": False},
    ],
    "strengths": ["fluent"],
    "weaknesses": [],
    "grammarIssues": [],
    "betterVocabulary": [],
    "improvedVersions": [],
    "answerDevelopmentSuggestions": [],
    "weakestCriterion": "grammaticalRange",
    "nextRecommendedDrills": ["grammar"],
}


class _Body:
    task = 2
    testType = "academic"
    prompt = "Some people think... To what extent do you agree?"
    answer = "I agree because..."
    wordCount = 3
    part = 1
    transcript = "yes I agree"
    audioMetrics = None


@pytest.mark.asyncio
async def test_writing_valid_output():
    llm = FakeLlm([WRITING_OK])
    out = await evaluate_writing(llm, _Body())
    assert isinstance(out, WritingEvaluation)
    assert out.criterionScores[0].band == 6.0


@pytest.mark.asyncio
async def test_writing_invalid_then_repair():
    llm = FakeLlm([{"criterionScores": "nope"}, WRITING_OK])
    out = await evaluate_writing(llm, _Body())
    assert isinstance(out, WritingEvaluation)


@pytest.mark.asyncio
async def test_writing_invalid_raises_controlled_error():
    llm = FakeLlm([{"bad": "shape"}, {"also": "bad"}])
    with pytest.raises(EvaluationServiceError):
        await evaluate_writing(llm, _Body())


@pytest.mark.asyncio
async def test_speaking_without_audio_forces_pronunciation_unsupported():
    llm = FakeLlm(
        [
            {**SPEAKING_OK, "criterionScores": [
                {"criterion": "fluencyCoherence", "band": 6.0, "rationale": "ok", "supported": True},
                {"criterion": "lexicalResource", "band": 6.0, "rationale": "ok", "supported": True},
                {"criterion": "grammaticalRange", "band": 6.0, "rationale": "ok", "supported": True},
                {"criterion": "pronunciation", "band": 7.0, "rationale": "guessed", "supported": True},
            ]}
        ]
    )
    out = await evaluate_speaking(llm, _Body())
    pron = next(c for c in out.criterionScores if c.criterion == "pronunciation")
    assert pron.supported is False
    assert pron.band == 0


@pytest.mark.asyncio
async def test_speaking_with_audio_metric_allows_pronunciation():
    body = _Body()
    body.audioMetrics = {"pronunciationScore": 6.5}
    llm = FakeLlm([SPEAKING_OK])
    out = await evaluate_speaking(llm, body)
    assert isinstance(out, SpeakingEvaluation)
