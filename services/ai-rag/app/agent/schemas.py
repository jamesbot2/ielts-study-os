"""Pydantic schemas for agent tool calls and results."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, ValidationError, field_validator

ALLOWED_ACTION_TYPES = {"create_study_task", "open_lesson", "open_practice", "open_vocabulary"}
ALLOWED_ACTION_PREFIXES = ("/learn", "/practice", "/mistakes", "/vocabulary", "/plan", "/mock", "/library", "/settings", "/coach")


def is_allowed_action_href(href: str | None) -> bool:
    if not href:
        return True
    h = href.strip().lower()
    if h.startswith(("javascript:", "data:", "//")):
        return False
    if not h.startswith("/"):
        return False
    return any(h == p or h.startswith(p + "/") for p in ALLOWED_ACTION_PREFIXES)


class ActionProposal(BaseModel):
    type: str
    title: str = Field(min_length=1, max_length=200)
    titleZh: str | None = None
    href: str | None = None
    date: str | None = None
    estimatedMinutes: int | None = Field(default=None, ge=1, le=480)
    description: str | None = None

    @field_validator("type")
    @classmethod
    def _type_allowed(cls, v: str) -> str:
        if v not in ALLOWED_ACTION_TYPES:
            raise ValueError(f"unknown action type: {v}")
        return v

    @field_validator("date")
    @classmethod
    def _date_iso(cls, v: str | None) -> str | None:
        if v is not None:
            import re

            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", v):
                raise ValueError("date must be YYYY-MM-DD")
        return v

    @field_validator("href")
    @classmethod
    def _href_safe(cls, v: str | None) -> str | None:
        if not is_allowed_action_href(v):
            raise ValueError("unsafe href")
        return v


def validate_actions(raw: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Validate + sanitize model actions. Invalid/unknown actions are dropped."""
    out: list[dict[str, Any]] = []
    for item in raw or []:
        if not isinstance(item, dict):
            continue
        try:
            out.append(ActionProposal.model_validate(item).model_dump())
        except ValidationError:
            continue
    return out


class ToolCall(BaseModel):
    tool: str = Field(description="Name of the tool to call.")
    args: dict[str, Any] = Field(default_factory=dict, description="Tool arguments.")


class FinalAnswer(BaseModel):
    text: str
    citations: list[dict[str, Any]] = Field(default_factory=list)
    actions: list[dict[str, Any]] = Field(default_factory=list)


# JSON schema the LLM must follow each step: either call a tool or give a final answer.
AGENT_STEP_SCHEMA = {
    "type": "object",
    "properties": {
        "tool": {"type": ["string", "null"]},
        "args": {"type": "object"},
        "text": {"type": "string"},
        "citations": {"type": "array", "items": {"type": "object"}},
        "actions": {"type": "array", "items": {"type": "object"}},
    },
    "required": [],
}
