# V0.6.4 Final Content & PostgreSQL Evidence Freeze

Status: the last V0.6.x release. This closes the genuine PostgreSQL metadata-update
bug and productizes the targeted-practice data model. Content numeric targets
remain incomplete (see final section).

## Part A — PostgreSQL correctness & evidence

| ID | Severity | Issue | Fix | Evidence |
|----|----------|-------|-----|----------|
| A1 | P0 | `upsert_chunks` did not update changed metadata (heading/skill/test_type/topics/question_types/chunk_index) when content_hash + fingerprint unchanged | Both `InMemoryKnowledgeRepository` and `PostgresKnowledgeRepository` now compare canonical metadata via `chunk_metadata_changed` + `CHUNK_METADATA_FIELDS` and update in place | `tests/test_repository.py` (offline) + `tests/test_postgres.py` (live row assertions) |
| A2 | P0 | In-memory repo had the same bug | fixed identically | `test_metadata_update_in_memory` |
| A3 | P1 | Source upsert not proven | added source metadata update test | `test_source_metadata_update` |
| A4 | P1 | Re-embed only changed embedding fields | `test_reembed_only_changes_embedding` asserts embedding+fingerprint change | `tests/test_repository.py` |
| A5 | P1 | Ingestion run success/failure not proven | `test_ingestion_run_tracking` (running→completed/failed) | `tests/test_repository.py` |
| A6 | P1 | Live Postgres metadata update not verifying row fields | live test now queries the stored row and asserts heading/skill/topics/question_types changed | `tests/test_postgres.py` |

Counter semantics: added / updated (metadata OR fingerprint OR embedding repair, once per chunk) / unchanged / deleted.

## Part B — Targeted practice data model

| ID | Item | Result |
|----|------|--------|
| B1 | `PracticeMode = "full" | "targeted"` on `PracticeSet` | DONE (`src/types/ielts.ts`) |
| B2 | `targetQuestionType?: QuestionType` | DONE |
| B3 | Existing full sets default to `"full"` | DONE (backward compatible `?? "full"`) |
| B4 | Coverage reports `readingFullSets / readingTargetedSets / readingTargetedByType / listeningFullSets / listeningTargetedSets / listeningTargetedByType` | DONE (`coverage.ts`) |

## Content (honest — targets NOT met)

| Target | Actual | Status |
|--------|--------|--------|
| Reading targeted ≥2/type | 0 | P1 |
| Listening targeted ≥2/type | 0 | P1 |
| Academic Task 1 ≥30 | 10 | P1 |
| General Task 1 ≥25 | 8 | P1 |
| Task 2 ≥60 | 14 | P1 |
| Speaking Part 1 ≥120 | 180 | PASS |
| Speaking Part 2 ≥60 | 60 | PASS |
| Speaking Part 3 ≥90 | 155 | PASS |
| Grammar lessons ≥20 | 7 | P1 |
| Grammar exercises ≥200 | 80 | P1 |

## PostgreSQL environment

- docker: unavailable · compose: unavailable · psql: unavailable ·
  POSTGRES_TEST_URL: unset · no local Postgres socket.
- Live Postgres suite remains **BLOCKED** (external environment), not PASS.
  Test code is correct, isolated, and complete (driver, dimension, metadata,
  re-embed, six-filter contract, cleanup).

## Quality gate (recorded)

- Web: 169 unit/integration, lint 0 errors/33 warnings, typecheck clean.
- Service: 42 pytest passed, 5 postgres-marked skipped, ruff clean.
