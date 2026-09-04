"""Tests for the TEMPORARY one-shot RAG admin endpoint auth (removed after use)."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi import HTTPException

from app.api.internal import _check_token


def test_correct_token_passes(monkeypatch):
    monkeypatch.setenv("INGEST_ONCE_TOKEN", "secret-token-abc")
    # must not raise
    _check_token("secret-token-abc")


def test_wrong_token_rejected(monkeypatch):
    monkeypatch.setenv("INGEST_ONCE_TOKEN", "secret-token-abc")
    with pytest.raises(HTTPException) as ei:
        _check_token("wrong-token")
    assert ei.value.status_code == 401


def test_missing_token_rejected(monkeypatch):
    monkeypatch.setenv("INGEST_ONCE_TOKEN", "secret-token-abc")
    with pytest.raises(HTTPException) as ei:
        _check_token(None)
    assert ei.value.status_code == 401


def test_no_env_rejected(monkeypatch):
    monkeypatch.delenv("INGEST_ONCE_TOKEN", raising=False)
    with pytest.raises(HTTPException) as ei:
        _check_token("anything")
    assert ei.value.status_code == 401


def test_sanitized_error_omits_secrets():
    from app.api.internal import _sanitized_error

    err = _sanitized_error(ValueError("401 auth failed for key sk-secret-xyz"))
    assert "sk-secret-xyz" not in err
    assert "401" not in err
