"""OpenAI-compatible LLM + embedding abstractions. No vendor coupling."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, AsyncIterator


class LlmProvider(ABC):
    @abstractmethod
    async def chat(self, messages: list[dict[str, str]], **kwargs: Any) -> str:
        """Return a single completion string."""

    @abstractmethod
    async def stream(self, messages: list[dict[str, str]], **kwargs: Any) -> AsyncIterator[str]:
        """Yield text deltas."""

    @abstractmethod
    async def structured(self, messages: list[dict[str, str]], schema: dict[str, Any], **kwargs: Any) -> dict[str, Any]:
        """Return a JSON object validated against `schema` (JSON Schema)."""


class EmbeddingProvider(ABC):
    @property
    @abstractmethod
    def dimension(self) -> int: ...

    @abstractmethod
    async def embed_texts(self, texts: list[str]) -> list[list[float]]: ...

    async def embed_query(self, text: str) -> list[float]:
        return (await self.embed_texts([text]))[0]
