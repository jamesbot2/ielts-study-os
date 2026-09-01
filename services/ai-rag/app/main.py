"""FastAPI application factory. Wires providers from settings; stays fully
importable without any real LLM/embedding/DB for offline tests."""

from __future__ import annotations

from dataclasses import dataclass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .llm.base import LlmProvider, EmbeddingProvider
from .llm.openai_compatible import OpenAICompatibleLlm
from .embeddings.openai_compatible import OpenAICompatibleEmbeddings
from .rag.retrieval import HybridRetriever
from .agent.runtime import AgentRuntime
from .api import health, rag, coach, writing


@dataclass
class RagContext:
    llm: LlmProvider | None
    embeddings: EmbeddingProvider
    retriever: HybridRetriever
    agent: AgentRuntime


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


def create_app(retriever: HybridRetriever | None = None, llm: LlmProvider | None = None, embeddings: EmbeddingProvider | None = None) -> FastAPI:
    app = FastAPI(title="IELTS Study OS AI/RAG", version="0.6.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    retriever = retriever or HybridRetriever([])
    llm = llm if llm is not None else build_llm()
    embeddings = embeddings or build_embeddings()

    if embeddings is None:
        # Minimal zero-vector fallback so the service can still boot offline.
        from .llm.base import EmbeddingProvider as EP

        class _Zero(EP):
            @property
            def dimension(self) -> int:
                return 1

            async def embed_texts(self, texts):
                return [[0.0] for _ in texts]

        embeddings = _Zero()

    app.state.rag = RagContext(llm=llm, embeddings=embeddings, retriever=retriever, agent=AgentRuntime(llm or _NoopLlm(), retriever, embeddings))

    app.include_router(health.router)
    app.include_router(rag.router)
    app.include_router(coach.router)
    app.include_router(writing.router)
    return app


class _NoopLlm(LlmProvider):
    async def chat(self, messages, **kwargs):
        return ""

    async def stream(self, messages, **kwargs):
        if False:
            yield ""

    async def structured(self, messages, schema, **kwargs):
        return {"text": "AI is not configured on this service.", "citations": [], "actions": []}


app = create_app()
