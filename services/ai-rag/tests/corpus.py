"""Shared filter-parity corpus. Seed any KnowledgeRepository with the same rows."""

from __future__ import annotations

from app.storage.repository import KnowledgeChunk, KnowledgeSource


def seed_corpus(repo, dim: int) -> None:
    sources = [
        KnowledgeSource(
            id="src-acad-reading", title="Academic Reading", provider="IELTS", url="https://ielts.org/reading",
            source_type="official", official=True, license=None, redistribution_policy="metadata_only",
            language="en", skill="reading", test_type="academic", topics=["reading"], last_verified="2026-09-01",
        ),
        KnowledgeSource(
            id="src-gen-reading", title="General Reading", provider="IELTS", url="https://ielts.org/reading",
            source_type="official", official=True, license=None, redistribution_policy="metadata_only",
            language="en", skill="reading", test_type="general", topics=["reading"], last_verified="2026-09-01",
        ),
        KnowledgeSource(
            id="src-acad-writing", title="Academic Writing", provider="IELTS Study OS", url=None,
            source_type="original", official=False, license="CC0", redistribution_policy="original_full",
            language="en", skill="writing", test_type="academic", topics=["writing"], last_verified="2026-09-01",
        ),
        KnowledgeSource(
            id="src-gen-writing", title="General Writing", provider="IELTS Study OS", url=None,
            source_type="original", official=False, license="CC0", redistribution_policy="original_full",
            language="en", skill="writing", test_type="general", topics=["writing"], last_verified="2026-09-01",
        ),
    ]
    for s in sources:
        repo.upsert_source(s)

    chunks = [
        KnowledgeChunk(
            id="c-acad-read-mh", source_id="src-acad-reading", heading="Matching Headings",
            content="Academic Reading Matching Headings requires matching each paragraph to a heading.",
            language="en", skill="reading", test_type="academic", topics=["reading"],
            question_types=["matching_headings"], chunk_index=0, content_hash="h-acad-read-mh",
            embedding=[0.1] * dim, embedding_fingerprint="fp1",
        ),
        KnowledgeChunk(
            id="c-gen-read-mc", source_id="src-gen-reading", heading="Multiple Choice",
            content="General Training Reading Multiple Choice appears in everyday texts.",
            language="en", skill="reading", test_type="general", topics=["reading"],
            question_types=["multiple_choice"], chunk_index=0, content_hash="h-gen-read-mc",
            embedding=[0.2] * dim, embedding_fingerprint="fp1",
        ),
        KnowledgeChunk(
            id="c-acad-write-proc", source_id="src-acad-writing", heading="Process diagram",
            content="Academic Writing Task 1 process diagrams describe a sequence of stages.",
            language="en", skill="writing", test_type="academic", topics=["writing"],
            question_types=["process"], chunk_index=0, content_hash="h-acad-write-proc",
            embedding=[0.3] * dim, embedding_fingerprint="fp1",
        ),
        KnowledgeChunk(
            id="c-gen-write-letter", source_id="src-gen-writing", heading="Complaint letter",
            content="General Training Writing Task 1 letters include complaints and requests.",
            language="en", skill="writing", test_type="general", topics=["writing"],
            question_types=["letter"], chunk_index=0, content_hash="h-gen-write-letter",
            embedding=[0.4] * dim, embedding_fingerprint="fp1",
        ),
    ]
    repo.upsert_chunks(chunks)
