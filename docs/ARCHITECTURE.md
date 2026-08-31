# Architecture

## Overview

Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4. Local-first
single-user persistence via Node's built-in `node:sqlite` (no native build step).
A clean service layer keeps domain logic server-side and testable.

## Directory layout

```
src/
  app/                    # Next.js routes (route groups)
    (app)/                # everything with the sidebar shell
    (exam)/               # full-screen exam runner (no sidebar)
    api/                  # route handlers (server)
  components/             # shared + feature UI (client where interactive)
  features/               # (reserved) domain feature modules
  lib/
    ai/                   # provider abstraction + evaluators + coach
    speech/               # STT/TTS/pronunciation provider interfaces
    scoring/              # deterministic scoring engine
    srs/                  # FSRS wrapper
    content/              # curriculum + practice content (data modules)
    db/                   # schema, connection, store (data access)
    study-plan/           # plan generator
    i18n/                 # dictionaries + translate
    client/               # client fetch helpers
  server/                 # (reserved) server-only orchestration
  types/                  # domain types
content/                  # (reserved) external/editable content
docs/                     # documentation
data/                     # local SQLite + uploads (gitignored)
```

## Key decisions

- **Database**: `node:sqlite` (`DatabaseSync`) with WAL mode. A `getDb()`
  singleton + `migrate()` runs idempotent DDL. Swap to Postgres/Supabase later by
  replacing `src/lib/db`.
- **Content vs data**: static curriculum/practice content is TypeScript modules
  (versionable, typed); user state (progress, attempts, vocabulary, mistakes) is
  SQLite.
- **Server/client boundary**: interactive feature components are `"use client"`;
  they fetch from API routes. Server components render static hubs and read
  server-side store directly. `server-only` guards key/service modules.
- **i18n**: typed dictionary (`en` / `zh`) + client context provider persisting to
  cookie + localStorage. Curriculum content uses `Lc {en, zh}` inline.
- **AI**: provider-independent (`AiProvider` interface) with OpenAI-compatible
  implementation; keys server-side only; graceful disabled mode.
- **Speech**: provider interfaces; `MediaRecorder` client; manual transcript
  fallback; pronunciation never fabricated from text.
- **Scoring**: pure functions in `src/lib/scoring` with full unit tests.

## Data flow (practice submission)

1. Client runner collects answers (autosaved to localStorage).
2. `POST /api/practice/submit` → validates with Zod.
3. Deterministic `checkQuestion` per question → raw score → band.
4. Persists attempt + question attempts + mistakes.
5. Returns per-question results for the review UI.

## Data flow (AI evaluation)

1. Client sends answer/prompt → `POST /api/writing/evaluate`.
2. Server checks `isAiConfigured()`, builds a band-descriptor-anchored prompt.
3. `generateStructured` calls the provider, parses and `Zod`-validates JSON.
4. Deterministic code combines criterion bands into an overall band.
5. Result persisted and returned; clearly labelled as an estimate.

## Security

- API keys read from env/settings, stored server-side, never returned raw
  (masked), never in client bundles.
- Uploads and imported materials stored under gitignored `data/`.
- Structured AI output validated before use.
- No secrets, DB, recordings or user content are committed.

See `docs/DATABASE.md`, `docs/AI_ARCHITECTURE.md`, `docs/SPEECH_ARCHITECTURE.md`,
`docs/MOCK_EXAM_SPEC.md`.
