# IELTS Study OS

An independent, open-source, **static-first** IELTS learning platform. Learn
IELTS from zero knowledge to full exam preparation — fundamentals, scoring, all
four skills, question-type strategies, practice, spaced-repetition vocabulary,
AI coaching (optional), AI writing/speaking evaluation (optional), study
planning, analytics, and realistic computer-delivered mock exams.

**No account. No backend. No API key required.** The entire core product runs
in your browser and stores your data locally in IndexedDB.

**Live:** https://ielts-study-os.vercel.app

**Disclaimer:** This project is an independent learning tool and is **not**
affiliated with, endorsed by, or approved by IELTS, British Council, IDP, or
Cambridge University Press & Assessment. AI-generated band scores are estimates,
not official IELTS scores.

## Features

- **Bilingual UI** — English and 简体中文, toggle anywhere, persisted.
- **IELTS Fundamentals curriculum** — structure, scoring, band rounding,
  computer delivery, One Skill Retake, misconceptions.
- **Listening** — complete original 40-question test with **real generated
  audio**, one-play exam mode, replay practice, transcript after submission.
- **Reading** — complete original 40-question Academic and General Training
  tests; split-pane reader, highlighting, font-size, timer, flagging, evidence
  and explanations.
- **Writing** — Academic Task 1, General Training letters, Task 2 essays;
  editor with timer, word count, autosave, draft history.
- **Speaking** — topic library, MediaRecorder, manual transcript, speech
  metrics, full Part 1→2→3 mock flow. Pronunciation is *never* fabricated from
  text.
- **Vocabulary** — FSRS spaced repetition (Again/Hard/Good/Easy).
- **Grammar** — lessons + 23 IELTS-oriented practice exercises.
- **Mistake Book** — unified mistakes from every skill.
- **AI Coach / Writing / Speaking evaluation** — optional, via a remote proxy;
  deterministic band combination; clearly labelled estimates.
- **Mock Exams** — computer-delivered flow with strict timers, refresh recovery,
  deterministic scoring.
- **Analytics & Study Plan** — based on real persisted activity.
- **Material Library** — import your own legally-owned materials.
- **Data export / import / reset** — versioned JSON backup.

## Architecture

Static export (`output: "export"`) → browser → IndexedDB (Dexie). No server
routes, no SQLite, no secrets. See `docs/STATIC_ARCHITECTURE.md`.

## Installation

```bash
git clone https://github.com/jamesbot2/ielts-study-os.git
cd ielts-study-os
npm install
npm run dev
```

Open http://localhost:3000. Everything works without any key.

## Production static build

```bash
npm run build
```

This generates the deployable static site in **`out/`**. Serve it with any
static file server, e.g.:

```bash
npx serve out
# or: python3 -m http.server 4173 --directory out
```

## Environment & optional AI/speech

There is no required environment configuration. Optional remote proxies (AI /
speech-to-text) can be configured in **Settings** — the browser stores only a
public proxy URL, never a secret key. See `docs/AI_ARCHITECTURE.md` and
`docs/SPEECH_ARCHITECTURE.md`.

## Content policy

This project ships **only original and clearly-labelled content** (CC0), plus
optional clearly-labelled AI-generated material. It does **not** redistribute
copyrighted Cambridge IELTS books, audio, images, PDFs or leaked questions.
See `docs/CONTENT_POLICY.md`.

## Development commands

```bash
npm run dev          # dev server
npm run build        # static production build → out/
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # vitest unit/integration tests
npm run test:e2e     # Playwright against the static build
```

## Testing

- 66 unit/integration tests (scoring, normalisation, word limits, rounding,
  FSRS, study plan, storage, backup, content validation, coverage).
- 11 Playwright E2E tests run against the static export.

## Status

A working, static-first V0.2: complete 40-question Listening/Reading tests with
real audio, full speaking mock, grammar practice, IndexedDB persistence, backup
and CI. See `docs/CONTENT_COVERAGE.md` for the precise, honest coverage matrix.

## License

MIT (see `LICENSE`). Original content is CC0. See `docs/LICENSE_AUDIT.md`.
