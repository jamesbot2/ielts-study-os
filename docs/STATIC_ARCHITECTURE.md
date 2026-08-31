# Static Architecture

IELTS Study OS is **static-first**: it builds to a directory of static files and
runs entirely in the browser with **no account, no server and no API key**.

## Build

`next.config.ts` sets `output: "export"` and `trailingSlash: true`. `npm run
build` produces the deployable directory `out/`. Every route is either
prerendered (○) or statically generated via `generateStaticParams` (●).

There are **no route handlers** (`src/app/api` was removed). There is **no
server-only runtime**.

## Persistence

All learner data lives in **IndexedDB** via Dexie (see `src/lib/storage/`):

| Table | Purpose |
|---|---|
| `profile` | study profile + targets |
| `settings` | UI/theme + optional AI/speech proxy URLs |
| `studyTasks` | study plan |
| `lessonProgress` | lesson completion |
| `vocabulary` / `vocabularyReviews` | cards + FSRS state |
| `practiceAttempts` / `questionAttempts` | practice results |
| `mistakes` | mistake book |
| `writingDrafts` / `writingSubmissions` | essays + cached evaluations |
| `speakingSessions` / `speakingRecordings` / `speakingTranscripts` | speaking flow |
| `mockAttempts` | mock exams |
| `aiConversations` / `aiMessages` | (reserved) |
| `importedMaterials` | user-imported / generated material |

`localStorage` is used only for tiny preferences (language) and in-progress mock
exam state (answers + absolute deadline).

## Optional services

AI and speech are **optional remote proxies**, never required:

- `AiClient` (DisabledAiClient default, RemoteAiProxyClient) — the browser only
  knows a public proxy URL, never a secret provider key.
- Speech (STT/pronunciation) — recording + manual transcript work without any
  service; a remote endpoint URL may be configured later.

## Why this is Vercel-ready

`out/` is a plain static site. It needs no server functions, no database, no
secrets. Deploying it is a matter of pointing a static host at `out/` (Vercel
deployment instructions are intentionally out of scope for this round).

## Data portability

`src/lib/storage/export.ts` implements versioned JSON export/import (merge or
replace) and reset. See `docs/DATA_BACKUP.md`.
