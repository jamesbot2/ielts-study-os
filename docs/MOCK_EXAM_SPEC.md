# Mock Exam Specification

The mock engine reproduces the **interaction model** of computer-delivered IELTS
without copying any protected assets or branding.

## Exam types

- **Academic Full** — Listening + Reading (Academic) + Writing (Academic).
- **General Training Full** — Listening + Reading (General) + Writing (General).
- **Listening / Reading / Writing** — individual sections.
- **Speaking** — a separate full mock session (`/mock/speaking`).

## Strict exam mode

- Full-screen layout (separate route group, no sidebar).
- Persistent, non-pausable timer per section using **absolute deadlines**
  (`deadline = startedAt + duration`), so a refresh never resets the clock.
- Answers and exam state persisted to `localStorage`; refresh offers Resume /
  Start over.
- Automatic section submission on time expiry; automatic final submission.
- Question navigator with answered/unanswered/current states.
- Low-time warning; clear section-transition screens.
- No answer feedback before submission.

## Section behaviour

**Listening**: 4 parts, 40 questions; **real generated audio**; one playback
only, no seek, no replay; transcript hidden until submission.

**Reading**: 60 minutes, 3 sections, 40 questions; split passage/questions,
highlighting, no feedback during the exam.

**Writing**: 60 minutes, Task 1 + Task 2; word count, timer, no grammar/spell
assistance in strict mode.

**Speaking**: INTRO → Part 1 → Part 2 (instructions → 1-min prep → 1–2 min long
turn) → Part 3 → COMPLETE → REVIEW; recording + manual transcript; deterministic
metrics.

## Scoring (deterministic)

- Listening/Reading: normalised answer checking → raw score → band table
  (Academic vs General tables differ).
- Result: per-section raw/band plus the **average of completed skills** — never
  labelled as an official Overall IELTS Band (which requires Speaking too).
- Mistakes flow into the Mistake Book automatically.

## Persistence

- `mockAttempts` in IndexedDB (kind, status, timestamps, overall band).
- In-progress state (answers, section, absolute deadline) in `localStorage`.
