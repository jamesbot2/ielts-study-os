# Database

V0.2 is **static-first**: there is no server database. All persistent data is
stored in the browser's **IndexedDB** via [Dexie](https://dexie.org).

## Why IndexedDB

- It is the only browser API designed for structured, transactional, sizeable
  client-side storage.
- It works offline and survives reloads.
- Dexie provides a small, typed, versioned schema API.

`localStorage` is used only for tiny preferences (language) and the in-progress
mock exam state.

## Schema (`src/lib/storage/db.ts`)

Versioned (`DB_VERSION = 1`) with the following stores:

| Store | Key | Indexes |
|---|---|---|
| `profile` | id | — |
| `settings` | id | — |
| `studyTasks` | id | scheduledFor, completed |
| `lessonProgress` | lessonId | updatedAt |
| `vocabulary` | id | due, createdAt, word |
| `vocabularyReviews` | id | cardId, reviewedAt |
| `practiceAttempts` | id | setId, skill, startedAt |
| `questionAttempts` | id | attemptId, questionId |
| `mistakes` | id | skill, questionType, createdAt |
| `writingDrafts` | id | promptId, updatedAt |
| `writingSubmissions` | id | promptId, createdAt |
| `speakingSessions` | id | createdAt |
| `speakingRecordings` | id | sessionId, part, createdAt |
| `speakingTranscripts` | id | recordingId |
| `mockAttempts` | id | status, startedAt |
| `aiConversations` | id | kind, updatedAt |
| `aiMessages` | id | conversationId, createdAt |
| `importedMaterials` | id | createdAt |

## Access layer

`src/lib/storage/repository.ts` exposes async domain operations
(`getProfile`, `createVocabCard`, `recordVocabReview`, `submitPractice`-support,
`recordMistake`, `createMockAttempt`, …). Components import only these functions.

## Migrations

Dexie schema versions are declared in `db.ts`. Future changes bump `DB_VERSION`
and add an upgrade function so existing learner data is never casually
destroyed.

## Backup

Full versioned JSON export/import/reset is in `src/lib/storage/export.ts`.
See `docs/DATA_BACKUP.md`.

## (Removed) SQLite

The V0.1 SQLite backend (`node:sqlite`, `src/lib/db`) and all API routes were
removed. There is no runtime SQLite dependency. Migration path from V0.1 is
documented in `docs/DATA_BACKUP.md`.
