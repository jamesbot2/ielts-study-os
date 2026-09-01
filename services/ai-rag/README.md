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
2. Ingestion is idempotent: sources are upserted by content hash; re-running
   reports `added / updated / unchanged / deleted`. Only sources whose
   `ingestion_mode` is redistributable are chunked (never official pages).

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
