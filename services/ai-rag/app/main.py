"""FastAPI application factory.

Startup wiring is explicit and never silently substitutes an empty RAG store for
a failed production database:

- no DATABASE_URL       → RAG unavailable (empty in-memory store, clearly flagged)
- DATABASE_URL unreachable → RAG unavailable/degraded (service still boots for diagnostics)
- reachable, 0 chunks   → RAG "knowledge_empty"
- reachable, N chunks   → RAG healthy (uses PostgreSQL + pgvector)
"""

from __future__ import annotations

from dataclasses import dataclass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .agent.runtime import AgentRuntime
from .api import coach, health, rag, writing
from .config import settings
from .embeddings.openai_compatible import OpenAICompatibleEmbeddings
from .llm.base import EmbeddingProvider, LlmProvider
from .llm.openai_compatible import OpenAICompatibleLlm
from .rag.service import RetrievalService
from .storage.repository import (
    InMemoryKnowledgeRepository,
    PostgresKnowledgeRepository,
    RepositoryHealth,
)


@dataclass
class RagContext:
    llm: LlmProvider | None
    embeddings: EmbeddingProvider
    embeddings_configured: bool
    retrieval: RetrievalService
    rag_state: str  # healthy | lexical_only | knowledge_empty | database_unavailable | unavailable
    retrieval_mode: str  # hybrid | lexical_only
    health: RepositoryHealth
    agent: AgentRuntime

    async def search(self, query: str, filters, top_k: int):
        return await self.retrieval.search(query, filters, top_k)


def build_llm() -> LlmProvider | None:
    if settings.llm_base_url and settings.llm_model:
        return OpenAICompatibleLlm(settings.llm_base_url, settings.llm_api_key, settings.llm_model)
    return None


def build_embeddings() -> EmbeddingProvider | None:
    if settings.embedding_base_url and settings.embedding_model:
        return OpenAICompatibleEmbeddings(
            settings.embedding_base_url, settings.embedding_api_key, settings.embedding_model, settings.embedding_dimension
        )
    return None


class _ZeroEmbeddings(EmbeddingProvider):
    @property
    def dimension(self) -> int:
        return settings.embedding_dimension

    async def embed_texts(self, texts):
        return [[0.0] * self.dimension for _ in texts]


class _NoopLlm(LlmProvider):
    async def chat(self, messages, **kwargs):
        return ""

    async def stream(self, messages, **kwargs):
        if False:
            yield ""

    async def structured(self, messages, schema, **kwargs):
        return {"text": "AI is not configured on this service.", "citations": [], "actions": []}


def create_app(repository: object | None = None, llm: LlmProvider | None = None, embeddings: EmbeddingProvider | None = None) -> FastAPI:
    app = FastAPI(title="IELTS Study OS AI/RAG", version="0.6.4")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Resolve repository + health state.
    repo = repository
    health_state = RepositoryHealth(reachable=False, chunk_count=0)
    embeddings_configured = (embeddings is not None) or bool(settings.embedding_base_url and settings.embedding_model)
    rag_state = "unavailable"
    if repo is None:
        if settings.database_url:
            pg = PostgresKnowledgeRepository(settings.database_url)
            health_state = pg.health_check()
            if health_state.reachable:
                repo = pg
                if health_state.chunk_count == 0:
                    rag_state = "knowledge_empty"
                else:
                    rag_state = "healthy" if embeddings_configured else "lexical_only"
            else:
                repo = InMemoryKnowledgeRepository()
                rag_state = "database_unavailable"
        else:
            repo = InMemoryKnowledgeRepository()
            rag_state = "unavailable"
    else:
        health_state = getattr(repo, "health_check", lambda: RepositoryHealth(reachable=True, chunk_count=0))()
        if health_state.reachable:
            rag_state = "knowledge_empty" if health_state.chunk_count == 0 else ("healthy" if embeddings_configured else "lexical_only")

    llm_provider = llm if llm is not None else build_llm()
    emb = embeddings or build_embeddings() or _ZeroEmbeddings()
    retrieval_mode = "lexical_only" if not embeddings_configured else "hybrid"
    retrieval_service = RetrievalService(repo, emb, embeddings_configured)

    ctx = RagContext(
        llm=llm_provider,
        embeddings=emb,
        embeddings_configured=embeddings_configured,
        retrieval=retrieval_service,
        rag_state=rag_state,
        retrieval_mode=retrieval_mode,
        health=health_state,
        agent=AgentRuntime(llm_provider or _NoopLlm(), retrieval_service),
    )
    app.state.rag = ctx
    app.state.settings = settings

    app.include_router(health.router)
    app.include_router(rag.router)
    app.include_router(coach.router)
    app.include_router(writing.router)
    return app


app = create_app()
