"""Pydantic schemas for agent tool calls and results."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


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
