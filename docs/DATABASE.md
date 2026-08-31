# Database

Local-first SQLite via Node's built-in `node:sqlite` (`DatabaseSync`), WAL mode,
foreign keys on. The database file lives at `data/ielts.db` (gitignored) and can
be overridden with `IELTS_DB_PATH`.

## Why not Postgres/Supabase from day one

The requirement is that the app starts locally with zero cloud configuration.
`node:sqlite` has no native build step and no service dependency. The schema and
store layer are written so Postgres/Supabase can be swapped in later.

## Schema

`src/lib/db/schema.ts` defines an idempotent DDL (versioned via
`settings.schema_version`). Tables:

| Table | Purpose |
|---|---|
| `settings` | key/value store (profile, AI/speech config, schema version) |
| `lesson_progress` | per-lesson completion status |
| `vocabulary_cards` | vocab + FSRS state + due date |
| `vocabulary_reviews` | review log |
| `practice_attempts` | one per completed practice set |
| `question_attempts` | per-question result + time + flag |
| `mistakes` | unified mistake book |
| `writing_submissions` / `writing_evaluations` | essays + AI reports |
| `speaking_sessions` / `speaking_recordings` / `speaking_transcripts` / `speaking_evaluations` | speaking flow |
| `mock_attempts` / `mock_sections` | mock exams + per-section scores |
| `ai_conversations` / `ai_messages` | coach + examiner chat |
| `study_tasks` | study plan items |
| `imported_materials` | user-imported / generated content |

## Access layer

`src/lib/db/store.ts` exposes typed functions (`getProfile`, `createVocabCard`,
`createPracticeAttempt`, `recordMistake`, …). It is marked `server-only`.

## Migrations

`migrate()` runs the full DDL (all `CREATE TABLE IF NOT EXISTS`) then bumps
`schema_version`. This is reproducible and safe to run repeatedly.

## Privacy

- No secrets in the DB (API keys are only held in server memory/env + settings;
  the GET endpoint masks them).
- User recordings/imports live under `data/` and are gitignored.
- Full export available at `GET /api/export` (JSON).
