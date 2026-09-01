"""HTTP adapter for any OpenAI-compatible chat/embedding endpoint."""

from __future__ import annotations

import json
from typing import Any, AsyncIterator

import httpx

from .base import LlmProvider


class OpenAICompatibleLlm(LlmProvider):
    def __init__(self, base_url: str, api_key: str | None, model: str, timeout: float = 60.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.timeout = timeout

    def _headers(self) -> dict[str, str]:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["Authorization"] = f"Bearer {self.api_key}"
        return h

    async def chat(self, messages: list[dict[str, str]], **kwargs: Any) -> str:
        payload = {"model": self.model, "messages": messages, **kwargs}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            res = await client.post(f"{self.base_url}/chat/completions", headers=self._headers(), json=payload)
            res.raise_for_status()
            data = res.json()
        return data["choices"][0]["message"]["content"]

    async def stream(self, messages: list[dict[str, str]], **kwargs: Any) -> AsyncIterator[str]:
        payload = {"model": self.model, "messages": messages, "stream": True, **kwargs}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream("POST", f"{self.base_url}/chat/completions", headers=self._headers(), json=payload) as res:
                res.raise_for_status()
                async for line in res.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if data == "[DONE]":
                        break
                    try:
                        chunk = json.loads(data)
                        delta = chunk["choices"][0].get("delta", {}).get("content")
                        if delta:
                            yield delta
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue

    async def structured(self, messages: list[dict[str, str]], schema: dict[str, Any], **kwargs: Any) -> dict[str, Any]:
        raw = await self.chat(messages, **kwargs)
        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            raise ValueError(f"LLM did not return valid JSON: {e}") from e
