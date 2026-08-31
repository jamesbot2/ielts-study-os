# Product Specification

## Vision

IELTS Study OS lets a learner go from zero IELTS knowledge to full exam
preparation in one application, without external copyrighted question banks and
without any API key being required for the core loop.

## Principles

1. **Official facts are canonical** — no invented scoring or structure.
2. **Deterministic where possible** — objective scoring never uses an LLM.
3. **AI is additive** — the app fully works with AI unconfigured.
4. **Honest estimates** — AI band scores are labelled estimates, never "official".
5. **Original content by default** — four-class content model.
6. **Bilingual** — English + Simplified Chinese UI and explanations.
7. **Exam realism** — computer-delivered mock UX, strict timing.

## Personas

- A beginner who needs structure and bilingual explanations.
- A self-studier tracking mistakes and vocabulary with SRS.
- A test-taker practising timed computer mocks before test day.
- An advanced learner using AI coaching and writing/speaking feedback.

## Core user journeys

1. **Onboarding** → language, Academic/General, current/target bands, test date,
   weekly hours, weak skills, optional diagnostic → study plan.
2. **Learn** → browse fundamentals → skill curricula → bilingual lessons.
3. **Practice** → reading (split-pane), listening (one-play/replay), writing
   (editor + AI eval), speaking (record + transcript + AI eval).
4. **Vocabulary** → add/extract words → FSRS review.
5. **Mistake Book** → review, filter, mark mastery.
6. **Mock exam** → computer-style timed sections → deterministic results.
7. **Analytics** → skill/question-type/mock/mistake trends.
8. **AI Coach** → contextual streaming tutor.
9. **Materials** → import own materials or generate original AI practice.

## Content model

Four source classes (see `docs/CONTENT_POLICY.md`):

- `ORIGINAL` — written for this project.
- `AI_GENERATED` — clearly labelled, validated.
- `OPEN_LICENSED` — genuinely redistributable.
- `USER_IMPORTED` — legally owned by the user; never committed.

Every set carries metadata (id, title, skill, testType, sourceType, sourceName,
license, copyrightStatus, academicOrGeneral, questionTypes, difficulty,
estimatedBandRange, dates, generatedByAI, generationModel, reviewStatus).

## Interaction states

- **Learning mode** — explanations, hints, replay, feedback available.
- **Exam mode** — strict timing, one-play audio, no feedback until submission.
- **Review mode** — user answer, correct answer, evidence, explanation, why-wrong,
  question type, difficulty, time, skill tag, strategy link.
