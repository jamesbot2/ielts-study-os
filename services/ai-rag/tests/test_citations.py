import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.rag.citations import validate_citations  # noqa: E402
from app.rag.retrieval import RetrievedChunk  # noqa: E402


def make_retrieved():
    return [
        RetrievedChunk(
            chunk_id="c1",
            source_id="ielts-org",
            title="IELTS.org",
            url="https://ielts.org",
            section="Test format",
            content="...",
            score=0.5,
            fields={"source_type": "official"},
        )
    ]


def test_valid_citation_kept():
    out = validate_citations([{"id": "c1", "sourceId": "ielts-org", "title": "IELTS.org", "url": "https://ielts.org"}], make_retrieved())
    assert len(out) == 1
    assert out[0].source_type == "official"


def test_fabricated_citation_dropped():
    out = validate_citations([{"id": "zzz", "sourceId": "made-up", "title": "Fake", "url": "https://fake.example"}], make_retrieved())
    assert out == []


def test_duplicate_citation_deduplicated():
    c = {"id": "c1", "sourceId": "ielts-org", "title": "IELTS.org"}
    out = validate_citations([c, c], make_retrieved())
    assert len(out) == 1
