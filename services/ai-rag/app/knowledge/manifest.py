"""Knowledge manifest loader + validation. Sources must declare license and
redistribution policy before ingestion."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, ValidationError


class SourceManifestEntry(BaseModel):
    id: str
    title: str
    url: str | None = None
    source_type: str = Field(
        description="official | official_test_admin | open_licensed | original | user_imported | reference"
    )
    official: bool = False
    license: str | None = None
    redistribution_policy: str = "metadata_only"
    language: str = "en"
    skill: str = "all"
    test_type: str = "both"
    topics: list[str] = Field(default_factory=list)
    last_verified: str
    ingestion_mode: str = Field(
        description="original_full | open_licensed | curated_summary | metadata_only | user_explicit"
    )
    path: str | None = None  # local file for content export ingestion


class KnowledgeManifest(BaseModel):
    sources: list[SourceManifestEntry]


def load_manifest(data: dict[str, Any]) -> KnowledgeManifest:
    return KnowledgeManifest.model_validate(data)


def validate_manifest(data: dict[str, Any]) -> list[str]:
    try:
        KnowledgeManifest.model_validate(data)
        return []
    except ValidationError as e:
        return [str(err) for err in e.errors()]
