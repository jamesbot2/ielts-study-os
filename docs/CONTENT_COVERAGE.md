# Content Coverage

This file is the master checklist for IELTS knowledge coverage. It is generated
from the actual content where possible (see `src/lib/content/coverage.ts` and the
content-validation tests) and intentionally honest: **"implemented" means a
working feature exists**.

Status legend: ✅ implemented · 🟡 partial · ⬜ planned/not implemented

## 1. Objective practice content (measured)

| Set | Questions | Passages/Sections | Audio | Question types |
|---|---|---|---|---|
| Academic Reading | **40** | 3 passages | — | multiple choice, T/F/NG, Y/N/NG, matching headings/information/features/sentence endings, sentence/summary/note/table completion, short answer |
| General Training Reading | **40** | 3 sections | — | multiple choice, T/F/NG, matching headings/features/sentence endings, sentence/summary/note completion, short answer |
| Listening | **40** | 4 parts | **real TTS audio (4 MP3s)** | form completion, multiple choice, map labelling, short answer, matching, note completion |

A structural validator (`src/lib/content/validate.ts`, tested) enforces unique
IDs, 40-question counts, correct-answer presence, word-limit metadata,
source/license metadata, and reading answer-consistency (answers grounded in the
passage).

## 2. Curriculum coverage matrix

| Category | Subcategory | Lesson | Practice | Assessment | Status |
|---|---|---|---|---|---|
| IELTS Fundamentals | What/why IELTS, Academic vs General, structure, timings | ✅ | — | ✅ | ✅ |
| IELTS Fundamentals | 0–9 scale, rounding, band conversion (L/R/GT) | ✅ | — | ✅ deterministic + tests | ✅ |
| IELTS Fundamentals | Writing/Speaking scoring, computer delivery, One Skill Retake | ✅ | — | ✅ | ✅ |
| Listening | 4-part structure, 13 question types, strategies | ✅ | ✅ 40q | ✅ | ✅ |
| Reading (Academic) | 3 passages, all major types, skills | ✅ | ✅ 40q | ✅ | ✅ |
| Reading (General) | 3 sections incl. matching features + sentence endings | ✅ | ✅ 40q | ✅ | ✅ |
| Writing (Academic T1) | graphs/charts/tables/maps/processes | ✅ | ✅ 4 prompts | ✅ (AI, optional) | ✅ |
| Writing (General T1) | formal/semi-formal/informal letters | ✅ | ✅ 3 prompts | ✅ (AI, optional) | ✅ |
| Writing T2 | all essay types | ✅ | ✅ 6 prompts | ✅ (AI, optional) | ✅ |
| Speaking | Parts 1/2/3, 4 criteria, strategies | ✅ | ✅ 47-topic library + full mock flow | ✅ (AI, optional) | ✅ |
| Vocabulary | FSRS, rich cards | ✅ | ✅ built-in library (~96 words) + collocation bank | ✅ | ✅ |
| Grammar | 20+ topics + IELTS error types | ✅ | ✅ 23 exercises | ✅ (self-check) | ✅ |
| Strategies | per-skill checklists | ✅ | — | — | ✅ |

## 3. Product surface

| Area | Status |
|---|---|
| Onboarding (skippable) | ✅ |
| Dashboard | ✅ (from real persisted data) |
| Learn hub + bilingual lessons (56 lessons) | ✅ |
| Reading runner (split-pane, highlight, timer, flag, review) | ✅ |
| Listening runner (real audio, one-play exam, replay practice) | ✅ |
| Writing editor (timer, autosave, drafts, AI optional) | ✅ |
| Speaking practice + full mock (record, transcript, metrics) | ✅ |
| Vocabulary + FSRS | ✅ |
| Grammar practice | ✅ |
| Mistake Book (all skills) | ✅ |
| Mock exams (Academic/General full, Listening, Reading, Writing, Speaking) | ✅ |
| Analytics (real activity) | ✅ |
| Study plan (deterministic, editable) | ✅ |
| Material library (text/Markdown/JSON import, AI-labelled generation) | ✅ |
| Resource Center (built-in official + open-source catalog, search/filter) | ✅ |
| Study guides (30/60/90-day + band-improvement plans) | ✅ |
| Settings (profile, optional AI/speech proxy, export/import/reset) | ✅ |
| i18n (English + Simplified Chinese) | ✅ |

## 4. Honest gaps (current version)

1. **Pronunciation assessment** — provider interface only; no audio
   pronunciation scoring runs by default. Correctly shown as "not evaluated"
   (never fabricated from text).
2. **PDF / DOCX import** — not implemented; text/Markdown/JSON import works.
3. **AI** — evaluation/coach require a user-configured remote proxy (off by
   default). Deterministic band combination is done client-side.
4. **Speech-to-text** — manual transcript always works; automatic STT requires
   a configured remote endpoint.
5. **Reading answer-consistency** is validated at the word level (not full
   phrase), which is intentionally lenient to avoid false positives.
6. **Question type coverage**: not every type appears in every test, but the
   practice library provides real examples of all major types (measured by
   `questionTypeCoverage()` in the tests).

These are tracked in `docs/ROADMAP.md`.
