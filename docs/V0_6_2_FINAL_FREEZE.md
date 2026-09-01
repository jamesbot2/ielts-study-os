# V0.6.2 Final RAG + Content Freeze

Status: closes the remaining RAG-runtime and learner-context correctness gaps
found in the V0.6.1 audit (commit `a1fb04b`).

## Fixed in this release

| ID | Severity | Issue | Fix | Evidence |
|----|----------|-------|-----|----------|
| R1 | P0 | PostgreSQL lexical search ignored SearchFilters | `search_lexical` now applies the full filter domain via `_apply_filters` | `repository.py`; filter-parity contract shared with in-memory store |
| R2 | P0 | PostgreSQL vector search missing `official` + `question_type` filters | `_apply_filters` implements all six filters (skill, test_type, source_type, official, question_type via JSONB `@>`, language) with a source join | `repository.py` |
| R3 | P0 | PostgreSQL tests used 8-dim vectors vs 1536 schema | Tests derive dimension from `settings.embedding_dimension` (doc updated); real tests still require `POSTGRES_TEST_URL` | `tests/test_postgres.py` |
| R4 | P0 | Production ingestion could write zero vectors | `python -m app.knowledge.ingest` fails closed when `DATABASE_URL` is set but no embedding provider is configured | `ingest.py` `main()` |
| R5 | P0 | Embedding dimension not validated | `upsert_chunks` raises a clear `ValueError` on dimension mismatch | `repository.py` |
| R6 | P0 | Re-ingestion never re-embedded unchanged content | `embedding_fingerprint` on chunks; re-embed when fingerprint changes or embedding missing | `models.py`, `repository.py`, `ingest.py` |
| R7 | P0 | Coach history accepted but ignored | `AgentRuntime.run(..., history)` sanitizes + inserts history; only user/assistant roles | `runtime.py`, `api/coach.py` |
| R8 | P0 | Speaking repair could reintroduce fabricated pronunciation | `enforce_pronunciation_safety()` applied before validation, after repair, before return | `evaluation.py`; `tests/test_evaluation.py` repair test |
| R9 | P0 | Practice accuracy averaged per-attempt proportions | True aggregate: `correctQuestions / totalQuestions`; band mean over band-bearing attempts only | `context.ts`; `context.test.ts` |
| R10 | P0 | `max_context_size` unused | `POST /api/coach/agent` rejects oversized context with 413 before LLM/tools | `api/coach.py`; `test_startup.py` |
| R11 | P0 | Agent actions not validated server-side | Pydantic `ActionProposal` + URL-safety + ranges; unknown/unsafe actions dropped | `schemas.py`; `test_agent.py` |
| R12 | P0 | RAG reported healthy without embeddings | RAG states `healthy` / `lexical_only` / `knowledge_empty` / `database_unavailable` / `unavailable`; lexical-only fallback skips zero-vector ranking | `main.py`, `health.py`, `api/rag.py`; `test_startup.py` |
| C1 | P1 | `repeatedWeaknesses` included n=1 | Now requires n>=2 (truthful "repeated") | `context.ts` |
| C2 | P1 | `unknown` question types ranked as weakness | Excluded from weak/frequent types | `context.ts` |

## Not completed (honest)

- **Content numeric targets remain incomplete** (see final report). This is the
  single blocking P1 before the V0.6 foundation can be frozen.
- **PostgreSQL integration tests are written but NOT RUN** — this machine has no
  Docker and no local PostgreSQL/pgvector instance; creating random cloud infra
  or touching unrelated databases is forbidden. A disposable
  `docker-compose.yml` is provided so the suite can run wherever Docker exists.
- **AI/RAG production deployment** remains NOT DEPLOYED (no credentials).

## Quality gate (recorded at close)

- Web: 169 unit/integration tests, lint 0 errors/33 warnings, typecheck clean,
  static build 110 pages.
- Service: 29 pytest (2 postgres-marked skipped), ruff clean, imports verified.
- Knowledge: `npm run knowledge:export` regenerated deterministically.
