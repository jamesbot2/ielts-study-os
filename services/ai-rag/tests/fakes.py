"""Deterministic fake providers — CI never calls paid APIs."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.llm.base import EmbeddingProvider, LlmProvider


class FakeLlm(LlmProvider):
    """Scripted LLM: returns pre-set structured responses in order."""

    def __init__(self, script: list[dict[str, Any]]) -> None:
        self.script = list(script)
        self.calls: list[list[dict[str, str]]] = []

    async def chat(self, messages, **kwargs):
        self.calls.append(messages)
        step = self.script.pop(0) if self.script else {"text": "fallback"}
        return json.dumps(step)

    async def stream(self, messages, **kwargs):
        self.calls.append(messages)
        text = (self.script.pop(0) if self.script else {"text": "fallback"}).get("text", "")
        for ch in text:
            yield ch

    async def structured(self, messages, schema, **kwargs):
        self.calls.append(messages)
        return self.script.pop(0) if self.script else {"text": "fallback", "citations": [], "actions": []}


class FakeEmbeddings(EmbeddingProvider):
    """Deterministic hash-based embeddings (no network)."""

    @property
    def dimension(self):
        return 8

    async def embed_texts(self, texts):
        return [self._embed(t) for t in texts]

    def _embed(self, text: str) -> list[float]:
        vec = [0.0] * self.dimension
        for token in text.lower().split():
            h = int(hashlib.md5(token.encode()).hexdigest(), 16)
            idx = h % self.dimension
            vec[idx] += 1.0
        norm = sum(v * v for v in vec) ** 0.5 or 1.0
        return [v / norm for v in vec]
