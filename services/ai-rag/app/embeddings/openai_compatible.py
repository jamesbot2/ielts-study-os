"""OpenAI-compatible embeddings adapter with optional task-specific adapters.

Some providers (e.g. Jina Embeddings v5) expose task-specific LoRA adapters via
a ``task`` field on the standard OpenAI-compatible ``/embeddings`` endpoint:

- ``retrieval.passage`` — for documents being indexed/searched
- ``retrieval.query`` — for asymmetric search queries

Using the wrong side of the query/passage pair measurably degrades retrieval
quality, so the adapter sends the correct task for indexing vs querying when
the provider configuration declares them. Providers that do not use tasks
(e.g. OpenAI ``text-embedding-*``) simply omit the ``task`` field — behaviour is
unchanged for them.
"""

from __future__ import annotations

import httpx

from ..llm.base import EmbeddingProvider


class OpenAICompatibleEmbeddings(EmbeddingProvider):
    def __init__(
        self,
        base_url: str,
        api_key: str | None,
        model: str,
        dimension: int,
        timeout: float = 60.0,
        passage_task: str | None = None,
        query_task: str | None = None,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self._dimension = dimension
        self.timeout = timeout
        self.passage_task = passage_task
        self.query_task = query_task
        # Test-only transport override (MockTransport); production uses the
        # pinned safe transport below.
        self._transport = transport

    @property
    def dimension(self) -> int:
        return self._dimension

    def _headers(self) -> dict[str, str]:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["Authorization"] = f"Bearer {self.api_key}"
        return h

    async def embed_texts(self, texts: list[str], *, task: str | None = None, use_default_task: bool = True) -> list[list[float]]:
        """Embed documents (passage side when a passage task is configured).

        ``task`` overrides the default passage task. ``use_default_task=False``
        forces NO task field (used for queries when no query task exists, so an
        asymmetric query never silently uses the passage adapter).
        """
        if not texts:
            return []
        payload: dict = {"model": self.model, "input": texts}
        if task is not None:
            payload["task"] = task
        elif use_default_task and self.passage_task:
            payload["task"] = self.passage_task
        async with self._new_client() as client:
            res = await client.post(
                f"{self.base_url}/embeddings",
                headers=self._headers(),
                json=payload,
            )
            res.raise_for_status()
            data = res.json()
        vectors = sorted(data["data"], key=lambda d: d["index"])
        return [v["embedding"] for v in vectors]

    async def embed_query(self, text: str) -> list[float]:
        """Embed a search query (query side when a query task is configured)."""
        # Jina v5 explicitly requires the query task for asymmetric retrieval;
        # the generic base fallback (embed_texts) would use the passage task.
        if self.query_task is not None:
            vectors = await self.embed_texts([text], task=self.query_task)
            return vectors[0]
        # No query task configured: force NO task field — a query must never be
        # embedded with the passage adapter (asymmetric retrieval would degrade).
        return (await self.embed_texts([text], use_default_task=False))[0]

    def _new_client(self) -> httpx.AsyncClient:
        if self._transport is not None:
            return httpx.AsyncClient(transport=self._transport, timeout=self.timeout)
        from ..llm.safe_http import build_provider_client

        return build_provider_client(timeout=self.timeout)
