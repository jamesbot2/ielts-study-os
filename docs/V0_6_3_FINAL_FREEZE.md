# V0.6.3 Final Freeze

Status: closes the remaining RAG-runtime correctness gaps and makes progress on
content. This is the final V0.6.x release before V0.7.

## Part A — PostgreSQL / RAG closure

| ID | Severity | Issue | Result | Evidence |
|----|----------|-------|--------|----------|
| A1 | P0 | psycopg driver missing from project deps | FIXED | `pyproject.toml` adds `psycopg[binary]>=3.1`; clean venv imports verified |
| A2 | P0 | `test_postgres.py` hardcoded `[0.1] * 8` | FIXED | dimension derived from `settings.embedding_dimension` |
| A3 | P0 | Wrong-dimension rejection untested | FIXED | `test_vector_dimension_rejection` asserts `ValueError` before insert |
| A4 | P0 | Postgres test order/data dependency | FIXED | per-test unique IDs via `uuid`; cleanup in metadata test |
| A5 | P0 | Filter parity not exercised | FIXED | `tests/test_filters.py` (in-memory, 8 tests) + `test_postgres.py` live contract tests |
| A6 | P0 | Coach `search_knowledge_base` bypassed `retrieval_mode` | FIXED | `RetrievalService` shared by RAG API and agent; `test_coach_lexical_only_does_not_call_vector` |
| A7 | P0 | Zero-vector ranking in live retrieval | FIXED | `RetrievalService.mode == lexical_only` → `search_lexical` only |
| A8 | P1 | Chunk upsert ignored metadata changes | FIXED | same content hash + changed metadata → `updated` (both repos) |
| A9 | P1 | `ingestion_runs` not used | FIXED | `start/finish/fail_ingestion_run` wired into CLI |
| A10 | P1 | Lexical search always `english` | FIXED | non-`en` uses `simple` config; limitation documented |
| A11 | P1 | Tool search top_k/query validation | FIXED | bounded query + top_k clamping |
| A12 | P1 | README stale health contract | FIXED | documents `rag_status`/`retrieval_mode` |

### PostgreSQL integration environment

- `docker`: unavailable · `docker compose`: unavailable · `psql`: unavailable ·
  `POSTGRES_TEST_URL`: unset · no local PostgreSQL socket.
- Live Postgres tests are **BLOCKED** (environment), not skipped-as-pass. The
  test code is credible (correct dimension, isolation, full filter contract) and
  a `docker-compose.yml` documents the disposable environment.

## Part B — Content closure

| Target | Before | After | Status |
|--------|--------|-------|--------|
| Speaking Part 1 ≥120 | 141 | 180 | PASS |
| Speaking Part 2 ≥60 | 47 | 60 | PASS |
| Speaking Part 3 ≥90 | 129 | 155 | PASS |
| Grammar exercises ≥200 | 61 | 80 | **P1 remaining** |
| Grammar lessons ≥20 | 7 | 7 | **P1 remaining** |
| Academic Task 1 ≥30 | 10 | 10 | **P1 remaining** |
| General Task 1 ≥25 | 8 | 8 | **P1 remaining** |
| Task 2 ≥60 | 14 | 14 | **P1 remaining** |
| Reading targeted ≥2/type | 0 | 0 | **P1 remaining** |
| Listening targeted ≥2/type | 0 | 0 | **P1 remaining** |

## Quality gate (recorded)

- Web: 169 unit/integration, lint 0 errors/33 warnings, typecheck clean,
  `npm run knowledge:export` regenerated.
- Service: 38 pytest passed, 5 postgres-marked skipped, ruff clean, imports verified.
- Content counts derived from `npm run content:coverage`.
