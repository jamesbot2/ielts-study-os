# V0.6.1 RAG Runtime + Learner Context + Content Closure

Status: closure of the gaps found in the V0.6.0 audit (commit `2268c2b`).

## Fixed in this release

| ID | Severity | Issue | Fix | Evidence |
|----|----------|-------|-----|----------|
| R1 | P0 | PostgreSQL/pgvector only documented, not implemented | `PostgresKnowledgeRepository` + SQLAlchemy models (`knowledge_sources`, `knowledge_chunks`, `ingestion_runs`) + `Vector(dim)` column + `CREATE EXTENSION IF NOT EXISTS vector` | `app/storage/models.py`, `repository.py`; `tests/test_postgres.py` (marker `postgres`, skips without env) |
| R2 | P0 | `create_app()` boots with `HybridRetriever([])` → empty RAG | `create_app()` wires a repository; startup states: `unavailable` / `degraded` / `knowledge_empty` / `healthy` | `tests/test_startup.py` |
| R3 | P0 | `/health` reported `database=configured` from env only | `/health` now reports `database_configured`, `database_reachable`, `pgvector_available`, `knowledge_chunk_count`, `rag` state | `app/api/health.py`; `tests/test_startup.py` |
| R4 | P0 | Ingestion only wired to `InMemoryRepository` | `KnowledgeRepository` protocol; ingestion CLI `python -m app.knowledge.ingest` targets Postgres when `DATABASE_URL` set | `app/knowledge/ingest.py`; ran `added=99` on real content |
| R5 | P0 | `/api/writing/evaluate` + `/api/speaking/evaluate` returned placeholders | Real LLM evaluation + strict Pydantic validation + one controlled repair + pronunciation safety | `app/evaluation.py`, `app/api/writing.py`; `tests/test_evaluation.py` |
| R6 | P0 | DB vector/lexical search not implemented | pgvector `cosine_distance` query + `websearch_to_tsquery` lexical query; RRF fusion shared via `hybrid_search_repository` | `app/rag/retrieval.py`, `repository.py` |
| C1 | P0 | Practice "accuracy" = raw correct count | Now `correct / total` (25/40 → 0.625) | `context.ts`; `context.test.ts` |
| C2 | P0 | `weakQuestionTypes` used question ids | Resolves real question type via canonical practice-set registry | `context.ts`; `context.test.ts` |
| C3 | P1 | Vocabulary `weakTags` = frequency | Renamed `commonTags` + added FSRS-evidence `weakTags` (lapses/difficulty) | `context.ts`; `context.test.ts` |
| C4 | P1 | Mock trends only from `kind` | Extracts full-mock section bands from `state.sections` | `context.ts` |
| C5 | P1 | Writing schema parsing assumed `Record<string,number>` | Parses array `criterionScores` + repeats lowest criterion | `context.ts`; `context.test.ts` |
| C6 | P1 | Speaking criteria hardcoded | Reads real `supported` flags; excludes pronunciation without audio; real repeated issues | `context.ts`; `context.test.ts` |
| C7 | P1 | Study plan "next 7 days" not date-bounded | True `today <= scheduledFor < today+7` window | `context.ts`; `context.test.ts` |
| C8 | P1 | Recent-record ordering implicit | Explicit chronological sort before slicing | `context.ts` |
| C9 | P1 | Large-data bound untested | Stress fixture test asserting caps + size + no raw essays | `context.test.ts` |
| P1 | P1 | Ask-Coach PageContext not wired | `Ask AI Coach` on lesson, mistake, and practice review | `lesson-viewer.tsx`, `mistakes-module.tsx`, `reading-runner.tsx`, `page-link.ts`; `e2e/coach.spec.ts` |
| V1 | P1 | package-lock = 0.5.2 | `npm install --package-lock-only` → lock now tracks package.json | `package-lock.json` |

## Not completed (honest)

- **Content numeric targets** remain below the V0.6 targets: grammar lessons 7 (<20),
  grammar exercises 61 (<200), Academic Task 1 10 (<30), General Task 1 8 (<25),
  Task 2 14 (<60), Speaking Part 2 47 (<60), per-question-type targeted
  Reading/Listening sets (0 new targeted mini sets). These are P1.
- **PostgreSQL integration tests** are written but skipped locally (no `POSTGRES_TEST_URL`).
  Run with `pytest -m postgres`.
- **AI/RAG production deployment** is still NOT DEPLOYED (no credentials).

## Quality gate (recorded at close)

- Web: 167 unit/integration tests, 24 Playwright, lint 0 errors/33 warnings,
  typecheck clean, static build 110 pages.
- Service: 23 pytest (2 postgres skipped), ruff clean.
- Knowledge: `npm run knowledge:export` → 51 lessons + 11 sources; ingestion
  in-memory → 99 chunks.
