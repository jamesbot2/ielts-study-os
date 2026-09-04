"""SSRF guard tests — the public backend must never proxy into private nets."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest

from app.llm.ssrf import SSRFError, is_safe_provider_url, validate_provider_url

PUBLIC_OK = "https://api.deepseek.com/v1"


def _public_resolver(host, port):
    return ["93.184.216.34"]  # example.com — public


@pytest.mark.parametrize(
    "url",
    [
        "http://localhost/v1",
        "http://localhost:8000/v1",
        "http://127.0.0.1/v1",
        "http://127.0.0.1:8000/v1",
        "http://10.0.0.1/v1",
        "http://10.255.255.255/v1",
        "http://172.16.0.1/v1",
        "http://172.31.255.255/v1",
        "http://192.168.0.1/v1",
        "http://169.254.169.254/latest/meta-data/",
        "http://169.254.1.1/v1",
        "http://0.0.0.0/v1",
        "http://[::1]/v1",
        "http://[fe80::1]/v1",
        "http://[fc00::1]/v1",
        "file:///etc/passwd",
        "ftp://example.com/file",
        "gopher://example.com",
        "https://user:pass@api.deepseek.com/v1",  # credentials embedded
        "not a url",
        "",
        "https://localhost/v1",
        "https://metadata.google.internal/computeMetadata/v1/",
        "https://myhost.local/v1",
        "https://api.internal.example.com/v1",
        "http://[::ffff:127.0.0.1]/v1",  # IPv4-mapped loopback
        "https://api.deepseek.com:badport/v1",  # invalid port
        "https://api.deepseek.com:99999/v1",  # out-of-range port
    ],
)
def test_rejects_private_and_unsafe(url):
    with pytest.raises(SSRFError):
        validate_provider_url(url, require_https=False, resolver=_public_resolver)


def test_accepts_public_https_with_resolver():
    assert validate_provider_url(PUBLIC_OK, resolver=_public_resolver) == PUBLIC_OK


def test_rejects_http_when_https_required():
    with pytest.raises(SSRFError):
        validate_provider_url("http://api.example.com/v1", require_https=True, resolver=_public_resolver)


def test_accepts_https_when_https_required():
    assert validate_provider_url("https://api.deepseek.com/v1", resolver=_public_resolver)


def test_boolean_helper_with_resolver():
    assert is_safe_provider_url(PUBLIC_OK, resolver=_public_resolver) is True
    assert is_safe_provider_url("http://127.0.0.1/v1", require_https=False, resolver=_public_resolver) is False
    assert is_safe_provider_url("file:///etc/passwd") is False


def test_rejects_overlong_url():
    with pytest.raises(SSRFError):
        validate_provider_url("https://api.deepseek.com/" + "a" * 600, require_https=False, resolver=_public_resolver)


def test_rejects_dns_rebinding_private_resolution():
    """A public-looking hostname that resolves to a private IP must be rejected."""
    def evil_resolver(host, port):
        return ["10.0.0.5"]

    with pytest.raises(SSRFError):
        validate_provider_url("https://api.deepseek.com/v1", require_https=False, resolver=evil_resolver)


def test_rejects_mixed_public_and_private_resolution():
    """If ANY resolved address is private the URL is rejected."""
    def mixed_resolver(host, port):
        return ["93.184.216.34", "192.168.1.10"]

    with pytest.raises(SSRFError):
        validate_provider_url("https://api.deepseek.com/v1", require_https=False, resolver=mixed_resolver)
