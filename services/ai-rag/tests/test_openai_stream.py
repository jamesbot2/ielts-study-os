"""Regression tests for the OpenAI-compatible SSE stream parser.

The parser previously had an unreachable body after `continue`, so streaming
never yielded any delta. These tests pin the correct behaviour:
- `data: {...}` lines are parsed into deltas
- `data: [DONE]` terminates cleanly
- keep-alive / blank / non-data lines never crash the stream
- multiple chunks accumulate in order
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx
import pytest

from app.llm.openai_compatible import OpenAICompatibleLlm

BASE = "https://llm.test/v1"
MODEL = "test-model"


def _llm(handler):
    transport = httpx.MockTransport(handler)
    llm = OpenAICompatibleLlm(BASE, "test-key", MODEL, timeout=5.0, transport=transport)
    return llm, transport


async def _collect(llm, messages):
    out = []
    async for delta in llm.stream(messages):
        out.append(delta)
    return "".join(out)


def _sse_response(chunks: list[str], status: int = 200):
    body = "".join(chunks)

    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url == f"{BASE}/chat/completions"
        assert request.headers["authorization"] == "Bearer test-key"
        return httpx.Response(status, text=body, headers={"content-type": "text/event-stream"})

    return handler


@pytest.mark.asyncio
async def test_parses_data_deltas_in_order():
    llm, _ = _llm(
        _sse_response(
            [
                'data: {"choices":[{"delta":{"content":"Hello "}}]}\n\n',
                'data: {"choices":[{"delta":{"content":"world"}}]}\n\n',
                "data: [DONE]\n\n",
            ]
        )
    )
    text = await _collect(llm, [{"role": "user", "content": "hi"}])
    assert text == "Hello world"


@pytest.mark.asyncio
async def test_ignores_keepalive_and_non_data_lines():
    llm, _ = _llm(
        _sse_response(
            [
                ": keep-alive comment\n\n",
                "\n",
                "random non-event line\n",
                'data: {"choices":[{"delta":{"content":"ok"}}]}\n\n',
                "data: [DONE]\n\n",
            ]
        )
    )
    text = await _collect(llm, [{"role": "user", "content": "hi"}])
    assert text == "ok"


@pytest.mark.asyncio
async def test_skips_malformed_json_without_crashing():
    llm, _ = _llm(
        _sse_response(
            [
                "data: {not valid json}\n\n",
                'data: {"choices":[]}\n\n',  # no delta content
                'data: {"choices":[{"delta":{}}]}\n\n',  # empty delta
                'data: {"choices":[{"delta":{"content":"survived"}}]}\n\n',
                "data: [DONE]\n\n",
            ]
        )
    )
    text = await _collect(llm, [{"role": "user", "content": "hi"}])
    assert text == "survived"


@pytest.mark.asyncio
async def test_stream_ends_on_done_without_trailing_events():
    llm, _ = _llm(_sse_response(["data: [DONE]\n\n"]))
    text = await _collect(llm, [{"role": "user", "content": "hi"}])
    assert text == ""


@pytest.mark.asyncio
async def test_empty_delta_field_is_skipped():
    llm, _ = _llm(
        _sse_response(
            [
                'data: {"choices":[{"delta":{"content":null}}]}\n\n',
                'data: {"choices":[{"delta":{"content":"x"}}]}\n\n',
                "data: [DONE]\n\n",
            ]
        )
    )
    text = await _collect(llm, [{"role": "user", "content": "hi"}])
    assert text == "x"
