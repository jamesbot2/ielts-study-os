import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.agent.runtime import AgentRuntime
from app.storage.repository import (
    InMemoryKnowledgeRepository,
    KnowledgeChunk,
    KnowledgeSource,
)
from tests.fakes import FakeEmbeddings, FakeLlm


def make_runtime(script):
    emb = FakeEmbeddings()
    repo = InMemoryKnowledgeRepository()
    repo.upsert_source(
        KnowledgeSource(
            id="ielts-org", title="IELTS.org", provider="IELTS", url="https://ielts.org",
            source_type="official", official=True, license=None, redistribution_policy="metadata_only",
            language="en", skill="reading", test_type="academic", topics=["tfng"], last_verified="2026-09-01",
        )
    )
    content = "False means the statement contradicts the passage; Not Given means it is not mentioned."
    repo.upsert_chunks(
        [
            KnowledgeChunk(
                id="c1", source_id="ielts-org", heading="False vs Not Given", content=content,
                language="en", skill="reading", test_type="academic", topics=["tfng"],
                question_types=["tfng"], chunk_index=0, content_hash="h1",
                embedding=emb._embed(content),
            )
        ]
    )
    return AgentRuntime(FakeLlm(script), repo, emb)


def test_agent_searches_then_cites_valid_source():
    runtime = make_runtime(
        [
            {"tool": "search_knowledge_base", "args": {"query": "difference between false and not given"}},
            {
                "text": "False contradicts the passage; Not Given is not mentioned.",
                "citations": [{"id": "c1", "sourceId": "ielts-org", "title": "IELTS.org"}],
                "actions": [],
            },
        ]
    )
    result = runtime.run_sync("What is the difference between False and Not Given?", {}, "en")
    assert "False" in result.text
    assert len(result.citations) == 1
    assert result.citations[0]["sourceId"] == "ielts-org"
    assert "search_knowledge_base" in result.tool_steps


def test_agent_drops_fabricated_citation():
    runtime = make_runtime(
        [
            {"tool": "search_knowledge_base", "args": {"query": "false vs not given"}},
            {"text": "answer", "citations": [{"id": "fake", "sourceId": "madeup", "title": "Made Up"}], "actions": []},
        ]
    )
    result = runtime.run_sync("question?", {}, "en")
    assert result.citations == []


def test_agent_never_invents_pronunciation():
    # No speaking evaluation in snapshot; the model must not fabricate a score.
    runtime = make_runtime(
        [
            {
                "text": "I have no pronunciation evidence, so I cannot score your pronunciation.",
                "citations": [],
                "actions": [],
            }
        ]
    )
    snapshot = {"speaking": {"evaluatedCriteria": []}}
    result = runtime.run_sync("How is my pronunciation?", snapshot, "en")
    assert "cannot score" in result.text


def test_agent_hits_step_cap_without_hanging():
    # A model stuck calling the same tool must terminate within the budget.
    runtime = make_runtime([{"tool": "get_vocab_due", "args": {}}] * 20)
    result = runtime.run_sync("hi", {}, "en")
    assert result.text != ""
    assert len(result.tool_steps) <= 8
