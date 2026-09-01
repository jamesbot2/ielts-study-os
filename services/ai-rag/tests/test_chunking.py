import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.rag.chunking import SourceSection, chunk_sections, estimate_tokens


def test_small_sections_kept_whole():
    sections = [SourceSection("Format", "IELTS Academic Reading lasts 60 minutes.")]
    chunks = chunk_sections(sections)
    assert len(chunks) == 1
    assert chunks[0].heading == "Format"
    assert chunks[0].content_hash


def test_long_section_split_with_overlap():
    words = " ".join(f"word{i}" for i in range(500))
    sections = [SourceSection("Strategy", words)]
    chunks = chunk_sections(sections, max_tokens=200, overlap_tokens=30)
    assert len(chunks) > 1
    # All chunks have hashes and preserve source heading on first chunk.
    assert all(c.content_hash for c in chunks)
    assert chunks[0].heading == "Strategy"


def test_estimate_tokens_positive():
    assert estimate_tokens("") >= 1
    assert estimate_tokens("hello world") == 2
