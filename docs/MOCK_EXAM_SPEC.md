# Mock Exam Specification

The mock engine reproduces the **interaction model** of computer-delivered IELTS
without copying any protected assets pixel-for-pixel.

## Exam types

- **Academic Full** — Listening + Reading (Academic) + Writing (Academic).
- **General Training Full** — Listening + Reading (General) + Writing (General).
- **Listening / Reading / Writing** — individual sections.
- **Speaking** — runs as a separate session (practice/speaking module).

## Strict exam mode

- Full-screen-capable layout (separate route group, no sidebar).
- Persistent, non-pausable timer per section.
- Answers autosaved (localStorage + server state).
- Automatic section submission on time expiry.
- Question navigator with answered/unanswered/current/flagged states.
- Previous/next navigation + keyboard accessibility.
- Low-time warning near the end.
- Crash recovery: in-progress attempt state is persisted server-side; a refresh
  can resume. Intentional pause is never offered in exam mode.

## Section behaviour

**Listening**: 4 parts, 40 questions (content currently 20); audio plays once;
no transcript before completion; final checking period.

**Reading**: 60 minutes, 3 sections, 40 questions (content currently 21–25);
split passage/questions, highlighting, notes, no feedback during the exam.

**Writing**: 60 minutes, Task 1 + Task 2, word count, timer, no grammar/spell
assistance in strict mode, Task 2 double weighting reflected in results.

## Scoring (deterministic)

- Listening/Reading: normalised answer checking → raw score → band table
  (Academic vs General tables differ).
- Overall: average of available section bands, rounded to nearest half band.
- Results show raw score, band per section, overall band, and the honest note that
  raw-score tables are approximate.

## Results dashboard

- Overall + per-section bands.
- Deterministic per-question analysis available via the practice review UI.
- Writing AI report included only when an evaluator is configured.
- Mistakes are recorded into the Mistake Book automatically.

## Persistence

- `mock_attempts` (state JSON) + `mock_sections` tables.
- Answers stored server-side per section; `PATCH /api/mock/[id]` saves state;
  `POST /api/mock/[id]` completes and scores.
