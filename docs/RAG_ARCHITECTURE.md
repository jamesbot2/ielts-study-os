# RAG Architecture

## Source flow

1. **Curated original content** (the typed TS curriculum) is exported
   deterministically via `npm run knowledge:export` →
   `knowledge/generated/ielts-study-os.json`.
2. **Official-format notes** (`knowledge/official-notes.json`) are original
   rewritten summaries with official source URLs — never copied pages.
3. **Manifest** (`knowledge/sources.yml`) declares license + redistribution
   policy for every source.
4. **Ingestion** (`app/knowledge/ingest.py`) chunks only redistributable sources
   (`original_full`, `open_licensed`, `curated_summary`, `user_explicit`);
   `metadata_only`/official sources are linked, not copied.

## Chunking

Structural: split on heading/section boundaries first; only split oversized
sections further (~750 tokens target, ~100 tokens overlap). Each chunk carries
`content_hash`, source ID, skill, test type, topics and question types.

## Embedding

`EmbeddingProvider` abstraction (OpenAI-compatible HTTP adapter). Deterministic
fake embeddings are used in tests. Embedding failure never corrupts existing
indexed data — ingestion upserts per chunk hash in batches.

## Storage

PostgreSQL + pgvector is implemented (`PostgresKnowledgeRepository` +
SQLAlchemy models for `knowledge_sources`, `knowledge_chunks`, `ingestion_runs`).
Vector search uses pgvector `cosine_distance`; lexical search uses PostgreSQL
`websearch_to_tsquery`; the two are fused with Reciprocal Rank Fusion in
`hybrid_search_repository`. Retrieval is DB-agnostic and tested against an
in-memory store. Embeddings and DB dumps are never committed.

## Hybrid retrieval

Vector cosine similarity + lexical term overlap, fused with Reciprocal Rank
Fusion. Filters: `skill`, `test_type`, `source_type`, `official`,
`question_type`, `language`. Optional reranker interface with a no-reranker
fallback.

## Citations

Every RAG answer validates cited IDs against actually-retrieved chunks. Unknown
or fabricated citation IDs are dropped.

## Privacy

The browser sends a bounded `LearnerContextSnapshot` per Coach request; the RAG
store holds only curated knowledge, not learner data. Audio/essays/full backups
are never sent by default.

## Agent flow

Bounded tool loop (max 8 steps), same-tool guard, prompt-injection guard
(retrieved documents and the snapshot are DATA, never instructions). NDJSON
event stream to the browser.
