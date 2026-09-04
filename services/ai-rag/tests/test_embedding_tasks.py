"""Tests for task-specific embedding adapters (Jina v5 retrieval.passage/query).

Verifies the adapter sends the correct ``task`` field when indexing documents
(passage) vs embedding a search query (query), and that providers without
task support are unaffected (no ``task`` key in the payload).
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx
import pytest

from app.embeddings.openai_compatible import OpenAICompatibleEmbeddings

BASE = "https://embed.test/v1"


def _embedding_response(dim: int = 4, n: int = 1):
    body = {
        "data": [
            {"object": "embedding", "index": i, "embedding": [float(i + 1)] + [0.0] * (dim - 1)}
            for i in range(n)
        ],
        "model": "test",
        "usage": {"prompt_tokens": 1, "total_tokens": 1},
    }
    return body


def _make(handler, dimension: int = 4, **kwargs):
    transport = httpx.MockTransport(handler)
    return OpenAICompatibleEmbeddings(BASE, "key", "test-model", dimension, transport=transport, **kwargs)


def _capture_handler(captured):
    def handler(request: httpx.Request) -> httpx.Response:
        captured.append(request)
        return httpx.Response(200, json=_embedding_response(n=2))

    return handler


@pytest.mark.asyncio
async def test_passage_task_sent_for_document_embedding():
    captured: list[httpx.Request] = []
    emb = _make(_capture_handler(captured), passage_task="retrieval.passage", query_task="retrieval.query")
    await emb.embed_texts(["doc one", "doc two"])
    payload = captured[0].read()
    import json

    body = json.loads(payload)
    assert body["task"] == "retrieval.passage"
    assert body["model"] == "test-model"
    assert len(body["input"]) == 2


@pytest.mark.asyncio
async def test_query_task_sent_for_query_embedding():
    captured: list[httpx.Request] = []
    emb = _make(_capture_handler(captured), passage_task="retrieval.passage", query_task="retrieval.query")
    await emb.embed_query("how long is academic reading")
    import json

    body = json.loads(captured[0].read())
    assert body["task"] == "retrieval.query"
    assert body["input"] == ["how long is academic reading"]


@pytest.mark.asyncio
async def test_no_task_key_when_not_configured():
    """Providers without task support (e.g. OpenAI) must not get a task field."""
    captured: list[httpx.Request] = []
    emb = _make(_capture_handler(captured))  # no tasks
    await emb.embed_texts(["doc"])
    await emb.embed_query("query")
    import json

    for req in captured:
        body = json.loads(req.read())
        assert "task" not in body


@pytest.mark.asyncio
async def test_query_embedding_uses_query_task_not_passage():
    """Critical Jina v5 asymmetric invariant: queries must NOT use the passage
    task even when only passage_task is configured."""
    captured: list[httpx.Request] = []
    emb = _make(_capture_handler(captured), passage_task="retrieval.passage")
    await emb.embed_query("a query")
    import json

    body = json.loads(captured[0].read())
    assert body.get("task") != "retrieval.passage"
    assert "task" not in body  # no query_task configured → omit entirely


@pytest.mark.asyncio
async def test_dimension_property_reflects_config():
    emb = _make(lambda r: httpx.Response(200, json=_embedding_response()), dimension=1024)
    assert emb.dimension == 1024
