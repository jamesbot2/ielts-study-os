"""Runtime provider resolution tests: BYOK path, server fallback, validation."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from pydantic import ValidationError

from app.llm.provider import (
    RuntimeProviderConfig,
    build_runtime_llm,
    parse_runtime_provider,
    resolve_llm,
)
from tests.fakes import FakeLlm

PUBLIC = "https://api.deepseek.com/v1"


def _pub_resolver(host, port):
    return ["93.184.216.34"]


@pytest.fixture(autouse=True)
def _no_real_dns(monkeypatch):
    """Route all validation DNS through a public-only stub so tests are offline."""
    import app.llm.provider as provider_mod
    import app.llm.ssrf as ssrf_mod

    monkeypatch.setattr(ssrf_mod, "validate_provider_url", _stub_validate)
    monkeypatch.setattr(provider_mod, "validate_provider_url", _stub_validate)


def _stub_validate(url, *, require_https=None, resolver=None):
    from urllib.parse import urlparse

    from app.llm.ssrf import SSRFError

    if not url.startswith("https://"):
        raise SSRFError("Base URL must use https")
    parsed = urlparse(url)
    if parsed.hostname in ("localhost", "127.0.0.1") or parsed.hostname.startswith(("10.", "192.168.", "172.")):
        raise SSRFError("private")
    if parsed.username or parsed.password:
        raise SSRFError("credentials")
    return url


def test_parse_none_returns_none():
    assert parse_runtime_provider(None) is None
    assert parse_runtime_provider({}) is None
    assert parse_runtime_provider({"baseUrl": "", "model": ""}) is None


def test_parse_valid_provider():
    cfg = parse_runtime_provider({"baseUrl": PUBLIC, "model": "deepseek-chat", "apiKey": "sk-test", "name": "DS"})
    assert cfg is not None
    assert cfg.baseUrl == PUBLIC
    assert cfg.model == "deepseek-chat"
    assert cfg.apiKey == "sk-test"


def test_parse_blank_api_key_becomes_none():
    cfg = parse_runtime_provider({"baseUrl": PUBLIC, "model": "m", "apiKey": "   "})
    assert cfg is not None
    assert cfg.apiKey is None


def test_parse_rejects_http_base_url():
    with pytest.raises(ValidationError):
        parse_runtime_provider({"baseUrl": "http://api.deepseek.com/v1", "model": "m"})


def test_parse_rejects_private_base_url():
    with pytest.raises(ValidationError):
        parse_runtime_provider({"baseUrl": "https://localhost/v1", "model": "m"})


def test_parse_rejects_credentials_in_url():
    with pytest.raises(ValidationError):
        parse_runtime_provider({"baseUrl": "https://user:pass@api.deepseek.com/v1", "model": "m"})


def test_parse_rejects_overlong_api_key():
    with pytest.raises(ValidationError):
        parse_runtime_provider({"baseUrl": PUBLIC, "model": "m", "apiKey": "k" * 600})


def test_build_runtime_llm_returns_client():
    cfg = RuntimeProviderConfig(baseUrl=PUBLIC, model="m", apiKey="sk-1")
    llm = build_runtime_llm(cfg)
    assert llm is not None
    assert llm.model == "m"
    assert llm.api_key == "sk-1"
    assert llm.base_url == PUBLIC


def test_resolve_uses_runtime_provider_when_supplied():
    server = FakeLlm([])
    llm, error = resolve_llm({"baseUrl": PUBLIC, "model": "m", "apiKey": "sk"}, server)
    assert error is None
    assert llm is not None
    assert llm.api_key == "sk"  # per-request provider wins


def test_resolve_falls_back_to_server_llm():
    server = FakeLlm([])
    llm, error = resolve_llm(None, server)
    assert error is None
    assert llm is server


def test_resolve_returns_clear_error_when_nothing_configured():
    llm, error = resolve_llm(None, None)
    assert llm is None
    assert "not configured" in (error or "").lower()


def test_resolve_rejects_invalid_provider_payload():
    llm, error = resolve_llm({"baseUrl": "http://localhost/x", "model": "m"}, FakeLlm([]))
    assert llm is None
    assert error  # user-facing validation message
