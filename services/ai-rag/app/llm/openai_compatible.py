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
        """Ask the model for a JSON object conforming to ``schema``.

        The supplied schema is actually used: a bounded JSON-only instruction is
        appended to the LAST user message (or added as one), the raw chat reply
        is parsed as JSON, and the result is validated against the schema.

        Parsing policy:
        - primary path: the whole reply is one JSON object
        - compatibility: exactly one ```json … ``` fenced block is accepted
        - anything else (prose, markdown, multiple fences, …) is REJECTED with
          a clear error — never silently coerced.
        """
        instr = (
            "\n\nRespond with ONLY a single JSON object that strictly follows this "
            f"JSON schema, with no markdown fences, no commentary and no extra text:\n"
            f"{json.dumps(schema, ensure_ascii=False)}"
        )
        if messages and messages[-1].get("role") == "user":
            work = list(messages)
            work[-1] = {**work[-1], "content": str(work[-1].get("content") or "") + instr}
        else:
            work = [*messages, {"role": "user", "content": instr.lstrip()}]

        raw = await self.chat(work, **kwargs)
        obj = _parse_json_object(raw)
        _validate_json_schema_shape(obj, schema)
        return obj


def _parse_json_object(raw: str) -> dict:
    """Parse a raw LLM reply as exactly one JSON object.

    Primary path: whole reply is the object. Compatibility: exactly one
    ```json … ``` fenced block. Anything else raises ValueError.
    """
    if raw is None:
        raise ValueError("LLM returned an empty structured response")
    text = raw.strip()
    if not text:
        raise ValueError("LLM returned an empty structured response")
    # Primary path.
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass
    # Narrow compatibility: exactly one ```json fence (optional language tag).
    if "```" in text:
        import re

        fences = re.findall(r"```(?:json)?\s*\n(.*?)```", text, flags=re.DOTALL)
        if len(fences) == 1:
            candidate = fences[0].strip()
            try:
                parsed = json.loads(candidate)
                if isinstance(parsed, dict):
                    return parsed
            except json.JSONDecodeError:
                pass
    raise ValueError(
        "LLM did not return a single JSON object matching the requested schema "
        "(returned prose or malformed JSON)."
    )


def _validate_json_schema_shape(obj: dict, schema: dict[str, Any]) -> None:
    """Lightweight structural validation of a parsed object against a JSON
    schema (type + required + property types). Deep JSON-Schema validation is
    intentionally not re-implemented here; this catches gross mismatches."""
    if not isinstance(obj, dict):
        raise ValueError("Structured LLM output must be a JSON object")  # noqa: TRY004 - contract error across layers
    if not isinstance(schema, dict):
        return
    if schema.get("type") == "object":
        required = schema.get("required") or []
        props = schema.get("properties") or {}
        for field in required:
            if field not in obj:
                raise ValueError(f"Structured LLM output is missing required field: {field}")
        for key, val in obj.items():
            prop_schema = props.get(key)
            if not isinstance(prop_schema, dict):
                continue
            expected = prop_schema.get("type")
            if expected == "string" and not isinstance(val, str):
                raise ValueError(f"Structured LLM output field '{key}' must be a string")
            if expected == "integer" and not isinstance(val, int):
                raise ValueError(f"Structured LLM output field '{key}' must be an integer")
            if expected == "boolean" and not isinstance(val, bool):
                raise ValueError(f"Structured LLM output field '{key}' must be a boolean")
            if expected == "array" and not isinstance(val, list):
                raise ValueError(f"Structured LLM output field '{key}' must be an array")
            if expected == "object" and not isinstance(val, dict):
                raise ValueError(f"Structured LLM output field '{key}' must be an object")
