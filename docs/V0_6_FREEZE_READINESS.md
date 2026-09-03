# V0.6 Freeze Readiness Audit

Evidence-based audit of the V0.6.x foundation against the freeze criteria.
This document records readiness; it does NOT freeze the foundation.

- **Candidate SHA:** f27e143 (final commit of this audit)
- **Version:** 0.6.4 (freeze bump 0.6.4 → 0.6.5 remains a separate operation)
- **Date:** 2026-09-03
- **FOUNDATION FROZEN:** NO

---

## Content matrix (recomputed from canonical source, not from historical reports)

| Area | Value | Threshold | Status |
|------|-------|-----------|--------|
| Reading targeted sets | 28 | ≥2/type × 14 | PASS |
| Reading major types ≥2 | 14/14 | 14/14 | PASS |
| Academic Reading full scored units | 40 | exactly 40 | PASS |
| General Reading full scored units | 40 | exactly 40 | PASS |
| Listening targeted sets | 26 | ≥2/type × 13 | PASS |
| Listening major types ≥2 | 13/13 | 13/13 | PASS |
| Listening playable types ≥2 | 13/13 | 13/13 | PASS |
| Full Listening scored units | 40 | exactly 40 | PASS |
| Academic Writing Task 1 | 30 | ≥30 | PASS |
| General Writing Task 1 | 28 | ≥25 | PASS |
| Writing Task 2 | 64 | ≥60 | PASS |
| Speaking Part 1 questions | 180 | ≥120 | PASS |
| Speaking Part 2 cue cards | 60 | ≥60 | PASS |
| Speaking Part 3 questions | 155 | ≥90 | PASS |
| Grammar lessons | 22 | ≥20 | PASS |
| Grammar exercises | 200 | ≥200 | PASS |
| Min exercises per grammar lesson | 8 | ≥8 | PASS |

Content validators (canonical `validateAllContent`, `validateWritingPrompts`,
`validateGrammarExercises`, `validateGrammarExerciseList`): **0 issues**.

`acad-t1-mixed-3` prompt/visual year mismatch: **FIXED** in this audit
(prompt now reads "…wheat production in a region in 2015 and 2020, while the
pie chart shows the use of its farmland in 2020"), with a targeted regression
test.

---

## Scoring semantics

| Invariant | Status |
|-----------|--------|
| Canonical scored-unit model (`src/lib/scoring/units.ts`) is the single implementation | PASS |
| 40-unit full-test invariant (matching items = one mark, multi-answer options = one mark) | PASS (40/40/40 verified by test) |
| Academic vs General Reading band tables routed by testType | PASS |
| Official overall band returned only when all four skill bands exist (`calculateOfficialOverallBand`) | PASS |
| Partial average labeled "Average of graded sections"/"Average of completed skills", never "Overall IELTS Band" | PASS |
| Writing AI output presented as an estimate (`estimatedOverallBand`), not an official score | PASS |
| Pronunciation never scored from transcript alone (unsupported → band 0 + "not evaluated"; UI shows n/a) | PASS |

## Privacy / local-first

| Invariant | Status |
|-----------|--------|
| Core usable as static export; no mandatory account/session/API key | PASS |
| Learner state in IndexedDB; only small prefs in localStorage | PASS |
| User-imported materials remain local; never auto-sent to Coach/analytics/export | PASS |
| Coach context bounded (attempts 20, mistakes 20, mocks 10, writing 5, speaking 10, study 7 days); no audio blobs, full essays, or lesson text | PASS |
| No provider secret keys in browser code or repository | PASS (0 found) |
| `docs/PRIVACY.md` matches implementation | PASS |

## RAG / Coach

| Invariant | Status |
|-----------|--------|
| Manifest redistribution policy; `metadata_only` never ingested as chunks | PASS (negative test) |
| Embedding dimension mismatch rejected | PASS |
| Embedding fingerprint + re-embed on change | PASS |
| Zero-vector writes blocked for PostgreSQL ingestion (SystemExit) | PASS |
| Retrieval filters (skill/test_type/source_type/official/question_type/language) consistent in in-memory and PostgreSQL paths | PASS (tests) |
| Lexical/vector branches share the same filter domain; RRF fusion | PASS |
| DB-unavailable health semantics: `status` = process only; `rag_status`/`retrieval_mode`/`database_reachable` separate | PASS |
| Citation IDs validated against retrieved chunks | PASS |
| Coach history bounded (20) with 413 on oversize | PASS |
| Agent tool step budget = 8 (no unbounded loop) | PASS |
| Action proposals: bounded schema, browser requires explicit user confirmation (`acceptAction`), unknown hrefs rejected | PASS |
| Coach does not claim official scores; does not infer pronunciation from transcript | PASS |

## PostgreSQL integration

This audit installed PostgreSQL 17 + pgvector locally (test-only, not
production) and ran the integration suite: **6/6 passed twice on fresh
databases** (connectivity + extension, dimension rejection, full six-filter
matrix on both vector and lexical search, filter contract, metadata
update/re-embed, RRF hybrid search). Two test defects were found and fixed:
the lexical test query used `websearch_to_tsquery` AND-semantics that no chunk
could satisfy, and two filter expectations contradicted the canonical
"both"/"all" wildcard semantics shared by the in-memory and PostgreSQL
repositories.

A permanent **GitHub Actions job** (`Service Quality` → `PostgreSQL +
pgvector integration`, `pgvector/pgvector:pg16` service, `POSTGRES_TEST_URL`,
`pytest -m postgres`) now runs this suite on every push: **PASS on f27e143**.

In-memory repository tests: 43 passed / 6 (Postgres-only) skipped.
Skipped tests are **not** counted as PASS.

## Listening audio

- `tts:check`: PASS (26 jobs match canonical content).
- Asset existence: PASS (26 MP3 files, none zero-byte).
- Browser load: PASS (Playwright loads `audio` elements against the static export).
- **Human listening QA: PENDING.** No human has listened to the 26 targeted
  Listening sets. Automated checks cannot prove naturalness, word accuracy,
  speaker assignment, pronunciation quality, clipping or pause placement.
  Freeze-readiness requires a human sign-off using the checklist below.

### Human Listening QA checklist (26 sets)

For each set, listen to the audio in the practice page and verify:
1. audio plays with no clipping/distortion;
2. the spoken content matches the transcript semantically;
3. answers are actually spoken (not silently missing);
4. pauses are adequate at question boundaries;
5. numerals/names are pronounced correctly.

| # | Set | Checked? |
|---|-----|----------|
| 1 | listening-targeted-form-completion-01 | ☐ |
| 2 | listening-targeted-form-completion-02 | ☐ |
| 3 | listening-targeted-note-completion-01 | ☐ |
| 4 | listening-targeted-note-completion-02 | ☐ |
| 5 | listening-targeted-table-completion-01 | ☐ |
| 6 | listening-targeted-table-completion-02 | ☐ |
| 7 | listening-targeted-summary-completion-01 | ☐ |
| 8 | listening-targeted-summary-completion-02 | ☐ |
| 9 | listening-targeted-sentence-completion-01 | ☐ |
| 10 | listening-targeted-sentence-completion-02 | ☐ |
| 11 | listening-targeted-flow-chart-completion-01 | ☐ |
| 12 | listening-targeted-flow-chart-completion-02 | ☐ |
| 13 | listening-targeted-diagram-labelling-01 | ☐ |
| 14 | listening-targeted-diagram-labelling-02 | ☐ |
| 15 | listening-targeted-plan-labelling-01 | ☐ |
| 16 | listening-targeted-plan-labelling-02 | ☐ |
| 17 | listening-targeted-map-labelling-01 | ☐ |
| 18 | listening-targeted-map-labelling-02 | ☐ |
| 19 | listening-targeted-matching-01 | ☐ |
| 20 | listening-targeted-matching-02 | ☐ |
| 21 | listening-targeted-multiple-choice-01 | ☐ |
| 22 | listening-targeted-multiple-choice-02 | ☐ |
| 23 | listening-targeted-multiple-answer-01 | ☐ |
| 24 | listening-targeted-multiple-answer-02 | ☐ |
| 25 | listening-targeted-short-answer-01 | ☐ |
| 26 | listening-targeted-short-answer-02 | ☐ |

## CI (GitHub Actions)

Workflows (after this audit):

- **CI** — `npm ci`, lint, typecheck, unit tests, `content:coverage`,
  `tts:check`, build + static-output verification.
- **E2E** — Playwright against the static export (`out/`).
- **Service Quality** — Python 3.12: `ruff check .`, `pytest -m "not postgres"`
  (deterministic fake providers, no API keys), plus a
  **PostgreSQL + pgvector integration job** (`pytest -m postgres` against a real
  `pgvector/pgvector:pg16` service).

No `|| true`, no unconditional `continue-on-error` on release-critical gates.

## Production

- GitHub origin: pushed with every audit commit.
- GitLab mirror: **BLOCKED — credentials unavailable** in this environment
  (token intentionally never stored in `.git/config`).
- Canonical Vercel `https://ielts-study-os.vercel.app`: currently returns
  **`DEPLOYMENT_NOT_FOUND` (404)** — the canonical deployment is not serving
  any build. Restoring production requires the GitLab mirror path (blocked)
  or re-linking Vercel (not attempted in this audit).
- AI/RAG production deployment: **NOT DEPLOYED** (no credentials/infrastructure;
  optional for the static core, which degrades honestly when unconfigured).

## Findings

| Severity | Item | State |
|----------|------|-------|
| P0 | None found in code correctness | — |
| P1 | `acad-t1-mixed-3` year mismatch | FIXED this audit |
| P1 | Human Listening QA sign-off missing | PENDING (blocker for freeze) |
| P1 | Canonical production unavailable (`DEPLOYMENT_NOT_FOUND`); mirror credentials unavailable | BLOCKED (blocker for freeze) |
| P1 | PostgreSQL integration previously unproven | PASS: real PG17+pgvector locally (6/6) and GitHub Actions integration job (6/6) |
| P2 | 33 pre-existing lint warnings (style/naming; none correctness-related) | DEFERRED |
| P2 | Reranker, token-level streaming, V0.7 architecture items | DEFERRED |

## Freeze decision

**V0.6 FREEZE READY: NO** (as of this audit)

Blockers:
1. Human Listening QA — PENDING (26-set checklist above; no human sign-off).
2. Canonical production not deployed — `ielts-study-os.vercel.app` returns
   DEPLOYMENT_NOT_FOUND; GitLab mirror credentials unavailable, so the
   canonical deploy path cannot be exercised in this environment.

FOUNDATION FROZEN: NO. Version remains 0.6.4.
