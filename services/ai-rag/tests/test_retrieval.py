import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.rag.retrieval import (
    ChunkRecord,
    HybridRetriever,
    SearchFilters,
    cosine,
    lexical_score,
)

EMBEDDINGS = {
    "academic_reading": [1.0, 0.0, 0.0],
    "general_reading": [1.0, 0.0, 0.0],
    "writing_task2": [0.0, 1.0, 0.0],
    "speaking_part2": [0.0, 0.0, 1.0],
}


def make_records():
    return [
        ChunkRecord(
            chunk_id="c1",
            source_id="ielts-org-reading",
            title="IELTS.org Reading",
            url="https://ielts.org/reading",
            section="Academic Reading",
            content="Academic Reading lasts 60 minutes and has 40 questions across three long passages.",
            embedding=EMBEDDINGS["academic_reading"],
            fields={"skill": "reading", "test_type": "academic", "official": True, "question_types": ["multiple_choice"], "language": "en"},
        ),
        ChunkRecord(
            chunk_id="c2",
            source_id="ielts-org-reading",
            title="IELTS.org Reading",
            url="https://ielts.org/reading",
            section="General Training Reading",
            content="General Training Reading has sections with notices, workplace texts and one longer text.",
            embedding=EMBEDDINGS["general_reading"],
            fields={"skill": "reading", "test_type": "general", "official": True, "question_types": ["tfng"], "language": "en"},
        ),
        ChunkRecord(
            chunk_id="c3",
            source_id="ielts-os-writing",
            title="IELTS Study OS Writing",
            url=None,
            section="Task 2 weighting",
            content="Writing Task 2 contributes twice as much as Task 1 to the Writing band score.",
            embedding=EMBEDDINGS["writing_task2"],
            fields={"skill": "writing", "test_type": "both", "official": False, "question_types": [], "language": "en"},
        ),
    ]


def test_hybrid_retrieval_returns_relevant_chunk():
    retriever = HybridRetriever(make_records())
    results = retriever.search("How long is Academic Reading?", EMBEDDINGS["academic_reading"], top_k=2)
    assert results[0].source_id == "ielts-org-reading"
    assert "Academic" in results[0].section


def test_filter_separates_academic_from_general():
    retriever = HybridRetriever(make_records())
    results = retriever.search("reading sections", EMBEDDINGS["general_reading"], top_k=5, filters=SearchFilters(test_type="general"))
    # General filter must exclude academic-only chunks; "both" chunks are allowed.
    assert all(r.fields["test_type"] in ("general", "both") for r in results)
    assert results[0].chunk_id == "c2"


def test_lexical_score():
    assert lexical_score("false not given", "False and Not Given are different question types.") > 0
    assert lexical_score("xyzabc", "unrelated text") == 0.0


def test_cosine():
    assert cosine([1, 0], [1, 0]) == 1.0
    assert cosine([1, 0], [0, 1]) == 0.0
    assert cosine([], []) == 0.0
