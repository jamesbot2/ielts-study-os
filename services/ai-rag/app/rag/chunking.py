"""Structural chunking: split on heading/section boundaries before raw token
slicing. Deterministic and offline-testable."""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, field


@dataclass
class SourceSection:
    heading: str
    content: str


@dataclass
class Chunk:
    heading: str
    content: str
    section_index: int
    chunk_index: int
    content_hash: str = ""

    @property
    def text(self) -> str:
        return f"{self.heading}\n{self.content}".strip()


def estimate_tokens(text: str) -> int:
    # Rough English token estimate (~4 chars/token), stable and dependency-free.
    return max(1, len(re.findall(r"[A-Za-z0-9_'\u4e00-\u9fff]+", text)))


def _slice_words(text: str, max_words: int, overlap_words: int) -> list[str]:
    words = text.split()
    if not words:
        return [text] if text else []
    out: list[str] = []
    start = 0
    while start < len(words):
        end = min(start + max_words, len(words))
        out.append(" ".join(words[start:end]))
        if end >= len(words):
            break
        start = max(start + max_words - overlap_words, start + 1)
    return out


def chunk_sections(sections: list[SourceSection], max_tokens: int = 750, overlap_tokens: int = 100) -> list[Chunk]:
    """Split sections into ~max_tokens chunks with token overlap, preferring
    section boundaries. Small sections are kept whole."""
    chunks: list[Chunk] = []
    # Convert token budget to a word budget (≈0.75 word/token is overkill; use 0.6).
    max_words = max(40, int(max_tokens * 0.6))
    overlap_words = max(5, int(overlap_tokens * 0.6))

    for si, section in enumerate(sections):
        body = (section.content or "").strip()
        if estimate_tokens(section.heading + "\n" + body) <= max_tokens and body:
            chunks.append(Chunk(section.heading, body, si, 0))
            continue
        # Split long body; keep heading attached to the first piece only.
        pieces = _slice_words(body, max_words, overlap_words) if body else []
        if not pieces:
            chunks.append(Chunk(section.heading, "", si, 0))
            continue
        for ci, piece in enumerate(pieces):
            heading = section.heading if ci == 0 else f"{section.heading} (cont.)"
            chunks.append(Chunk(heading, piece, si, ci))

    for i, ch in enumerate(chunks):
        ch.content_hash = hashlib.sha256(ch.text.encode()).hexdigest()
    return chunks


def hash_text(text: str) -> str:
    return hashlib.sha256(text.strip().encode()).hexdigest()
