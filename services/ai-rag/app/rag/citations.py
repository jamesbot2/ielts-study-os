"""Citation validation: only allow citations whose IDs came from retrieved chunks."""

from __future__ import annotations

from dataclasses import dataclass

from .retrieval import RetrievedChunk


@dataclass
class ValidatedCitation:
    id: str
    source_id: str
    title: str
    url: str | None
    section: str | None
    source_type: str | None


def validate_citations(citations: list[dict], retrieved: list[RetrievedChunk]) -> list[ValidatedCitation]:
    """Drop any citation whose chunk/source ID was never actually retrieved.
    Never emit fabricated citations."""
    known_ids = {r.chunk_id for r in retrieved}
    known_sources = {(r.source_id, r.title, r.url) for r in retrieved}
    out: list[ValidatedCitation] = []
    seen: set[str] = set()
    for c in citations:
        cid = str(c.get("id") or "")
        source_id = str(c.get("sourceId") or "")
        title = str(c.get("title") or "")
        # A citation is valid if its chunk id or source id matches a retrieved chunk.
        valid = cid in known_ids or any(source_id == s and title == t for s, t, _ in known_sources)
        if not valid:
            continue
        if cid in seen:
            continue
        seen.add(cid or f"{source_id}:{title}")
        match = next((r for r in retrieved if r.chunk_id == cid or (r.source_id == source_id and r.title == title)), None)
        out.append(
            ValidatedCitation(
                id=cid,
                source_id=source_id,
                title=title,
                url=(c.get("url") or (match.url if match else None)),
                section=c.get("section"),
                source_type=(match.fields.get("source_type") if match else None),
            )
        )
    return out
