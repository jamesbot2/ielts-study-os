# IELTS Specification (canonical reference)

This document records the IELTS facts the application is built against, sourced
from official IELTS / British Council / IDP guidance. It is **maintainable
content**: rules that may change over time (delivery format, One Skill Retake,
raw-score tables) live in code/config, not hard-coded in UI strings.

## Test versions

- **Academic** — higher education and professional registration.
- **General Training** — migration, secondary education, work/training.
- Both share the same Listening and Speaking tests; Reading and Writing differ.

## Structure and timing

| Component | Time | Content |
|---|---|---|
| Listening | ~30 min + check | 4 parts, 40 questions |
| Reading | 60 min | 3 sections, 40 questions |
| Writing | 60 min | Task 1 + Task 2 |
| Speaking | 11–14 min | Parts 1, 2, 3 |

## Listening

- 4 parts: (1) everyday social conversation; (2) everyday social monologue;
  (3) academic/training conversation (up to 4 speakers); (4) academic monologue.
- Recording played **once**; multiple English accents.
- Question types: multiple choice, multiple-answer, matching, plan/map/diagram
  labelling, form/note/table/flow-chart/summary/sentence completion, short answer.

## Reading

**Academic**: 3 long texts from books/journals/magazines/newspapers, written for a
non-specialist audience, at least one with a detailed logical argument, increasing
difficulty.

**General Training**: Section 1 = 2–3 short social "survival" texts; Section 2 =
2 workplace texts; Section 3 = 1 longer general-interest text.

**Question types**: multiple choice, True/False/Not Given, Yes/No/Not Given,
matching information/headings/features/sentence endings, sentence/summary/note/
table/flow-chart/diagram completion, short answer.

## Writing

**Academic Task 1**: describe visual data (line/bar/pie charts, tables, multiple/
mixed charts, processes, maps/plans). ≥150 words.

**General Training Task 1**: a letter (formal/semi-formal/informal). ≥150 words.

**Task 2**: discursive essay. ≥250 words.

**Criteria**: Task Achievement (T1) / Task Response (T2), Coherence and Cohesion,
Lexical Resource, Grammatical Range and Accuracy. Task 2 is weighted double:
`(T1 + 2×T2) / 3`.

## Speaking

- Part 1: familiar/personal topics (4–5 min).
- Part 2: cue card, 1 min preparation, 1–2 min long turn (3–4 min).
- Part 3: abstract discussion related to Part 2 (4–5 min).

**Criteria (equal weight)**: Fluency and Coherence, Lexical Resource, Grammatical
Range and Accuracy, Pronunciation.

## Scoring

- Band scale 0–9, whole and half bands.
- Overall = average of 4 section bands, rounded to the **nearest half band**
  (x.25 → next half up; x.75 → next whole up).
- Objective skills: raw score (out of 40) → band via conversion table.

### Approximate conversion tables (public, may vary slightly by test version)

**Listening**

| Raw | Band | | Raw | Band |
|---|---|---|---|---|
| 39–40 | 9.0 | | 18–22 | 5.5 |
| 37–38 | 8.5 | | 16–17 | 5.0 |
| 35–36 | 8.0 | | 13–15 | 4.5 |
| 32–34 | 7.5 | | 10–12 | 4.0 |
| 30–31 | 7.0 | | 8–9 | 3.5 |
| 26–29 | 6.5 | | 6–7 | 3.0 |
| 23–25 | 6.0 | | 4–5 | 2.5 |

**Academic Reading**

| Raw | Band | | Raw | Band |
|---|---|---|---|---|
| 39–40 | 9.0 | | 19–22 | 5.5 |
| 37–38 | 8.5 | | 15–18 | 5.0 |
| 35–36 | 8.0 | | 13–14 | 4.5 |
| 33–34 | 7.5 | | 10–12 | 4.0 |
| 30–32 | 7.0 | | 8–9 | 3.5 |
| 27–29 | 6.5 | | 6–7 | 3.0 |
| 23–26 | 6.0 | | 4–5 | 2.5 |

**General Training Reading** (stricter)

| Raw | Band | | Raw | Band |
|---|---|---|---|---|
| 40 | 9.0 | | 27–29 | 5.5 |
| 39 | 8.5 | | 23–26 | 5.0 |
| 38 | 8.0 | | 19–22 | 4.5 |
| 36–37 | 7.5 | | 15–18 | 4.0 |
| 34–35 | 7.0 | | 12–14 | 3.5 |
| 32–33 | 6.5 | | 9–11 | 3.0 |
| 30–31 | 6.0 | | 6–8 | 2.5 |

These tables are encoded in `src/lib/scoring/scoring.ts` as maintainable data.

## Current delivery format (2026)

Computer-delivered IELTS is the primary format (Listening, Reading, Writing on a
computer; Speaking face-to-face or video). A "Writing on Paper" option exists in
selected markets. The mock exam UX therefore models the **computer** experience:
on-screen question navigator, highlighting/notes, one-play audio, typed answers.

## Other facts

- **One Skill Retake**: retake a single component; availability varies by centre.
- **Results validity**: typically 2 years; institutions may set their own rules.
- **No pass/fail**: IELTS reports a band score.
- **Accents**: all standard English accents accepted.
