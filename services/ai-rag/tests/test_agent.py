import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tests.fakes import FakeLlm, FakeEmbeddings  # noqa: E402
from app.rag.retrieval import HybridRetriever, ChunkRecord  # noqa: E402
from app.agent.runtime import AgentRuntime  # noqa: E402


def make_runtime(script):
    retriever = HybridRetriever(
        [
            ChunkRecord(
                chunk_id="c1",
                source_id="ielts-org",
                title="IELTS.org",
                url="https://ielts.org",
                section="False vs Not Given",
                content="False means the statement contradicts the passage; Not Given means it is not mentioned.",
                embedding=[1.0],
                fields={"skill": "reading", "test_type": "academic", "official": True, "question_types": ["tfng"], "language": "en"},
            )
        ]
    )
    return AgentRuntime(FakeLlm(script), retriever, FakeEmbeddings())


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
