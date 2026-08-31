# Architecture

## Overview

Static-first Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind
v4. The app builds to a static `out/` directory and runs entirely in the
browser. Learner data persists in IndexedDB via Dexie. There are no server
routes and no server-only runtime.

## Directory layout

```
src/
  app/
    (app)/                 # routes with the sidebar shell
    (exam)/                # full-screen exam/speaking-mock routes
    globals.css, layout.tsx
  components/              # shared + feature UI (client)
  lib/
    storage/               # IndexedDB (Dexie): db, repository, export, types
    scoring/               # deterministic IELTS scoring (pure, tested)
    srs/                   # FSRS wrapper (ts-fsrs)
    content/               # curriculum + practice content (static modules)
    ai/                    # client AiClient abstraction + schemas + prompts
    speech/                # transcript metrics (pure)
    practice/              # client-side submit + mock scoring
    analytics/             # analytics computed from IndexedDB
    study-plan/            # deterministic plan generator
    i18n/                  # en/zh dictionaries + translate
  types/                   # domain types
scripts/tts/               # audio generation (Piper) + speaker scripts
public/audio/              # generated original Listening audio (committed)
docs/                      # documentation
```

## Key decisions

- **Storage**: Dexie over IndexedDB. `src/lib/storage/db.ts` declares the
  versioned schema; `repository.ts` exposes async domain operations; components
  never touch IndexedDB directly. Swap to a cloud sync adapter later without
  rewriting the UI.
- **Content vs data**: static content (lessons, passages, questions, prompts,
  topics) is TypeScript modules; user state is IndexedDB.
- **Scoring**: pure functions in `src/lib/scoring` (never an LLM), heavily
  unit-tested. `calculateOfficialOverallBand` requires all four skills;
  `calculateCompletedSkillsAverage` is the analytics average.
- **AI**: `AiClient` interface with `DisabledAiClient` (default) and
  `RemoteAiProxyClient`. Schemas + prompt builders live in `src/lib/ai` as the
  proxy contract. No provider keys in the browser.
- **Speech**: `MediaRecorder` + dynamic MIME selection; manual transcript
  fallback; transcript metrics are deterministic; pronunciation is only ever
  produced by a real audio engine.
- **i18n**: typed dictionary + client context, persisted to `localStorage` +
  cookie; curriculum content carries `{en, zh}` inline.

## Data flow (practice submission)

1. Runner collects answers (local autosave).
2. `submitPractice()` (client) deterministically checks each question, computes
   the band, persists attempt + question attempts + mistakes to IndexedDB.
3. Review UI renders results with evidence and explanations.

## Data flow (mock exam)

1. `startMock()` creates an attempt; answers + absolute `deadline` timestamps
   are persisted to localStorage for refresh recovery.
2. `finishMock()` deterministically scores sections and computes the
   "average of completed skills" (never labelled as an official overall band).

## Security & privacy

- No secrets shipped or stored.
- User data stays in the browser by default (see `docs/PRIVACY.md`).
- Imported/recorded data is never committed to the repository.

See `docs/STATIC_ARCHITECTURE.md`, `docs/AI_ARCHITECTURE.md`,
`docs/SPEECH_ARCHITECTURE.md`, `docs/MOCK_EXAM_SPEC.md`.
