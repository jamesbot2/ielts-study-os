"""Runtime (BYOK) LLM provider resolution.

The browser sends a per-request provider configuration (base URL, model and a
transient session-only API key). The backend validates it (SSRF-safe base URL,
bounded lengths), constructs an OpenAI-compatible client for THAT request only,
and never stores the key or mutates any global process configuration.

Fallback: if no provider config is supplied, the server-managed
LLM_BASE_URL / LLM_API_KEY / LLM_MODEL environment provider is used when
present. If neither exists, the caller receives a clear "not configured"
response.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, field_validator

from ..config import settings
from ..llm.base import LlmProvider
from ..llm.openai_compatible import OpenAICompatibleLlm
from .ssrf import SSRFError, validate_provider_url


class RuntimeProviderConfig(BaseModel):
    """Validated per-request provider configuration (BYOK)."""

    baseUrl: str = Field(min_length=1, max_length=500)
    model: str = Field(min_length=1, max_length=200)
    apiKey: str | None = Field(default=None, max_length=500)
    name: str | None = Field(default=None, max_length=120)

    @field_validator("baseUrl")
    @classmethod
    def _validate_base_url(cls, v: str) -> str:
        if len(v) > settings.max_provider_url_length:
            raise ValueError("Base URL is too long")
        try:
            validate_provider_url(v)
        except SSRFError as e:
            raise ValueError(str(e)) from e
        return v.rstrip("/")

    @field_validator("apiKey")
    @classmethod
    def _validate_api_key(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        if not v:
            return None
        if len(v) > settings.max_provider_api_key_length:
            raise ValueError("API key is too long")
        return v


def parse_runtime_provider(raw: Any) -> RuntimeProviderConfig | None:
    """Parse an optional ``provider`` request field.

    Returns None when the field is absent/empty (fall back to server config).
    Raises ValueError on a malformed provider payload.
    """
    if raw is None:
        return None
    if isinstance(raw, dict) and not raw.get("baseUrl") and not raw.get("model"):
        return None
    return RuntimeProviderConfig.model_validate(raw)


def build_runtime_llm(config: RuntimeProviderConfig) -> LlmProvider:
    """Construct an OpenAI-compatible client for one request. Never cached."""
    return OpenAICompatibleLlm(
        base_url=config.baseUrl,
        api_key=config.apiKey,
        model=config.model,
    )


def resolve_llm(
    provider_raw: Any,
    server_llm: LlmProvider | None,
) -> tuple[LlmProvider | None, str | None]:
    """Resolve the LLM for one request.

    Returns (llm, error). ``error`` is a user-facing message when no LLM is
    available (no runtime provider AND no server fallback), or when the
    supplied provider payload is invalid.
    """
    try:
        runtime = parse_runtime_provider(provider_raw)
    except ValueError as e:
        return None, str(e)
    if runtime is not None:
        return build_runtime_llm(runtime), None
    if server_llm is not None:
        return server_llm, None
    return None, "AI is not configured. Add an LLM provider in Settings or configure LLM_BASE_URL/LLM_MODEL server-side."
