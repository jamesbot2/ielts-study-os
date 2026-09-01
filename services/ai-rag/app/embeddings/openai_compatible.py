"""OpenAI-compatible embeddings adapter."""

from __future__ import annotations

import httpx

from ..llm.base import EmbeddingProvider


class OpenAICompatibleEmbeddings(EmbeddingProvider):
    def __init__(self, base_url: str, api_key: str | None, model: str, dimension: int, timeout: float = 60.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self._dimension = dimension
        self.timeout = timeout

    @property
    def dimension(self) -> int:
        return self._dimension

    def _headers(self) -> dict[str, str]:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["Authorization"] = f"Bearer {self.api_key}"
        return h

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            res = await client.post(
                f"{self.base_url}/embeddings",
                headers=self._headers(),
                json={"model": self.model, "input": texts},
            )
            res.raise_for_status()
            data = res.json()
        vectors = sorted(data["data"], key=lambda d: d["index"])
        return [v["embedding"] for v in vectors]
