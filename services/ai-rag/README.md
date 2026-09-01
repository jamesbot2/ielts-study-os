# IELTS Study OS — AI/RAG Service

Independent, optional backend for the static IELTS Study OS web app. The web app
works fully without it; when configured, it provides:

- RAG knowledge retrieval with source citations
- a bounded, learner-aware AI Coach
- Writing / Speaking evaluation compatibility endpoints

## Stack

Python 3.12+, FastAPI, Pydantic v2, httpx, SQLAlchemy 2, PostgreSQL + pgvector.
All LLM/embedding access goes through OpenAI-compatible HTTP adapters — no
vendor coupling.

## Configuration

Copy `.env.example` to `.env`. Secrets live ONLY here (never in the browser):

```bash
DATABASE_URL=postgresql+psycopg://localhost/ielts_rag
LLM_BASE_URL=https://your-provider.example/v1
LLM_API_KEY=...
LLM_MODEL=...
EMBEDDING_BASE_URL=https://your-provider.example/v1
EMBEDDING_API_KEY=...
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSION=1536
ALLOWED_ORIGINS=["http://localhost:3000","https://ielts-study-os.vercel.app"]
```

## Local run

```bash
cd services/ai-rag
uv sync                 # or: python -m venv .venv && .venv/bin/pip install -e ".[dev]"
uv run uvicorn app.main:app --reload --port 8000
```

Web app (separate process): `npm run dev` in the repo root.

## Testing (offline — no paid APIs)

```bash
.venv/bin/python -m pytest -q
```

Tests use deterministic fake LLM/embedding providers and an in-memory store.

## Knowledge ingestion

1. Export the web curriculum: `npm run knowledge:export`
   → `knowledge/generated/ielts-study-os.json`
2. Ingest (idempotent, upserts by content hash, removes stale chunks for the
   same source, prints added/updated/unchanged/deleted):

```bash
KNOWLEDGE_DIR=../knowledge python -m app.knowledge.ingest
```

Set `DATABASE_URL` to target PostgreSQL; otherwise it runs against an
in-memory store for smoke-testing.

## Database initialization

The repository creates tables and enables `vector` on first use
(`CREATE EXTENSION IF NOT EXISTS vector`, then `Base.metadata.create_all`).
For a controlled setup you can also run the same via the ingestion command.

## Health / smoke

```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/rag/search -H 'Content-Type: application/json' -d '{"query":"How long is Academic Reading?","top_k":8}'
```

`/health` reports `rag_status` (`healthy` | `lexical_only` | `knowledge_empty` |
`database_unavailable` | `unavailable`), `retrieval_mode` (`hybrid` |
`lexical_only`), `database_reachable`, `pgvector_available`, `knowledge_chunk_count`
and `embeddings_configured` — never secrets. Top-level `status: "ok"` reflects
only the process being alive; RAG health is in `rag_status`.

## Optional PostgreSQL integration tests

```bash
POSTGRES_TEST_URL=postgresql+psycopg://user:pass@localhost:5432/ielts_rag_test python -m pytest -m postgres
```

## API

- `GET /health` — structured service/LLM/embedding state (no secrets)
- `POST /api/rag/search` — hybrid retrieval
- `POST /api/coach/agent` — NDJSON event stream (`delta`, `citation`,
  `action_proposal`, `tool_status`, `done`)
- `POST /api/coach` — backward-compatible plain-text stream
- `POST /api/writing/evaluate`, `POST /api/speaking/evaluate` — compatibility

## Deployment

Deploy as an independent service with a PostgreSQL+pgvector database. CORS is
configured via `ALLOWED_ORIGINS`. Set the web app's AI proxy URL to the public
service base URL. No Docker is required for tests.
