# AI Evaluation

How writing and speaking are evaluated, and why the scores are honest estimates.

## Writing

**Inputs**: test type, task number, prompt (+ optional visual/data for Task 1),
answer, word count, time used.

**Output** (Zod-validated `WritingEvaluation`):

- `estimatedOverallBand` — computed **deterministically** from criterion bands.
- `criterionScores` — Task Achievement/Task Response, Coherence & Cohesion,
  Lexical Resource, Grammatical Range & Accuracy, each with a band + rationale.
- `strengths`, `weaknesses`, `sentenceLevelIssues`, `grammarIssues`,
  `lexicalIssues`, `coherenceIssues`, `taskResponseIssues`,
  `missingRequirements`, `suggestedCorrections`, `improvedSentences`,
  `vocabularySuggestions`, `nextPracticeTargets`, `examinerStyleSummary`.
- `bandGapAnalysis` — "Why this is approximately Band X" and "what specifically
  separates this from Band X+1".

**Score combination** (`writingBandFromCriteria`):

- Task 1: TA + CC + LR + GRA, equal weight.
- Task 2: TR + CC + LR + GRA, equal weight.
- Task 2 carries double Task 1 weight at the **section** level:
  `overall writing = round((T1 + 2×T2) / 3)`.

The grader prompt instructs the model to anchor every band in official public
band descriptors and forbids inventing criteria. The model returns criterion
bands only; the overall band is computed by code.

## Speaking

**Inputs**: part, prompt, transcript, duration, optional audio metrics.

**Output** (Zod-validated `SpeakingEvaluation`):

- `criterionScores` for FC, LR, GRA, Pronunciation, each with `supported`.
- `transcriptMetrics` (deterministic): WPM, word count, filler count, repeated
  words, vocabulary diversity (TTR), sentence stats.
- `audioMetrics` (optional; only if a real audio engine ran).
- `strengths`, `weaknesses`, `grammarIssues`, `betterVocabulary`,
  `improvedVersions`, `answerDevelopmentSuggestions`, `weakestCriterion`,
  `nextRecommendedDrills`.

**Pronunciation rule**: `supported` is `false` without audio analysis, band = 0,
rationale = "not evaluated". The app **never** fabricates a pronunciation score
from text.

**Score combination**: average of supported criteria, rounded to nearest half
band.

## Honesty guarantees

- Every AI score is surfaced with the label **"Estimated IELTS band"** and the
  note "AI-generated scores are estimates, not official IELTS scores."
- Objective (Listening/Reading) scores are **never** produced by an LLM.
- A clear `estimatedOverallBand` + gap analysis tells the learner *why* the band
  was assigned and *what* to work on next.
