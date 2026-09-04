"""HTTP adapter for any OpenAI-compatible chat/embedding endpoint.

All runtime (user-controlled BYOK) provider calls go through the pinned,
DNS-rebinding-safe transport in ``safe_http``. ``transport=`` is accepted for
offline tests only and is never used in production code paths.
"""

from __future__ import annotations

import json
from collections.abc import AsyncIterator
from typing import Any

import httpx

from .base import LlmProvider
from .safe_http import build_provider_client


class OpenAICompatibleLlm(LlmProvider):
    def __init__(
        self,
        base_url: str,
        api_key: str | None,
        model: str,
        timeout: float = 60.0,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.timeout = timeout
        # Test-only transport override (MockTransport). Production always uses
        # the pinned safe transport (build_provider_client).
        self._transport = transport

    def _new_client(self) -> httpx.AsyncClient:
        if self._transport is not None:
            return httpx.AsyncClient(transport=self._transport, timeout=self.timeout, follow_redirects=False)
        return build_provider_client(timeout=self.timeout)

    def _headers(self) -> dict[str, str]:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["Authorization"] = f"Bearer {self.api_key}"
        return h

    async def chat(self, messages: list[dict[str, str]], **kwargs: Any) -> str:
        payload = {"model": self.model, "messages": messages, **kwargs}
        async with self._new_client() as client:
            res = await client.post(f"{self.base_url}/chat/completions", headers=self._headers(), json=payload)
            res.raise_for_status()
            data = res.json()
        return data["choices"][0]["message"]["content"]

    async def stream(self, messages: list[dict[str, str]], **kwargs: Any) -> AsyncIterator[str]:
        payload = {"model": self.model, "messages": messages, "stream": True, **kwargs}
        async with self._new_client() as client, client.stream(
            "POST", f"{self.base_url}/chat/completions", headers=self._headers(), json=payload
        ) as res:
            res.raise_for_status()
            async for line in res.aiter_lines():
                line = line.strip()
                if not line.startswith("data:"):
                    # Ignore keep-alive comments, blank lines and any other
                    # non-event line — never crash the stream.
                    continue
                data = line[5:].strip()
                if data == "[DONE]":
                    break
                if not data:
                    continue
                try:
                    chunk = json.loads(data)
                    delta = chunk["choices"][0].get("delta", {}).get("content")
                    if delta:
                        yield delta
                except (json.JSONDecodeError, KeyError, IndexError, TypeError):
                    # Malformed or irrelevant chunk: skip it, keep streaming.
                    continue

    async def structured(self, messages: list[dict[str, str]], schema: dict[str, Any], **kwargs: Any) -> dict[str, Any]:
        raw = await self.chat(messages, **kwargs)
        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            raise ValueError(f"LLM did not return valid JSON: {e}") from e
