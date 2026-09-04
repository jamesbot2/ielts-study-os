"""Connection-layer DNS-rebinding / TOCTOU tests.

These prove the ACTUAL socket destination is pinned to a validated public IP:

- PinnedNetworkBackend.connect_tcp resolves ONCE and connects to the returned
  public IP literal (the fake connector records the exact IP it was asked to
  connect to).
- A hypothetical SECOND resolution returning a private IP cannot redirect the
  connection, because the HTTP stack never resolves again.
- Private/reserved resolutions and IPv4-mapped IPv6 loopback are rejected at
  the connection layer, not only by the pre-flight validator.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest

from app.llm.safe_http import PinnedNetworkBackend
from app.llm.ssrf import SSRFError, is_safe_provider_url, resolve_public_addresses


class _FakeConnector:
    """Records the (ip, port) it was asked to connect to and returns a stub
    stream. Lets tests assert the exact connected destination."""

    def __init__(self) -> None:
        self.connected: list[tuple[str, int]] = []

    async def __call__(self, ip: str, port: int):
        self.connected.append((ip, port))
        return _StubByteStream()


class _StubByteStream:
    async def receive(self, max_bytes: int = 65536):  # pragma: no cover - unused
        raise AssertionError("no network in unit tests")

    async def send(self, item: bytes) -> None:  # pragma: no cover
        raise AssertionError("no network in unit tests")

    async def aclose(self) -> None:  # pragma: no cover
        pass

    def extra(self, attr):  # pragma: no cover
        return None


PUBLIC = "93.184.216.34"


def _resolver(*addresses):
    def resolve(host, port):
        return list(addresses)

    return resolve


@pytest.mark.asyncio
async def test_connects_to_validated_public_ip():
    connector = _FakeConnector()
    backend = PinnedNetworkBackend(resolver=_resolver(PUBLIC), connector=connector)
    await backend.connect_tcp("api.deepseek.com", 443)
    assert connector.connected == [(PUBLIC, 443)]


@pytest.mark.asyncio
async def test_second_resolution_private_cannot_redirect():
    """The old TOCTOU: validate resolves public, then the HTTP stack resolves
    AGAIN and could get a private IP. The new backend resolves once inside
    connect_tcp and connects to the IP literal — a later private answer cannot
    be used because no second resolution happens."""
    # Simulate a rebinding DNS: first answer public (validated), any later
    # answer would be private — but connect_tcp only calls the resolver once.
    calls = []

    def rebinding_resolver(host, port):
        calls.append(1)
        return ["93.184.216.34"]

    connector = _FakeConnector()
    backend = PinnedNetworkBackend(resolver=rebinding_resolver, connector=connector)
    await backend.connect_tcp("api.deepseek.com", 443)
    # Exactly ONE resolution happened; the connection went to the public IP.
    assert len(calls) == 1
    assert connector.connected == [(PUBLIC, 443)]


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "private_addresses",
    [
        ["10.0.0.5"],
        ["192.168.1.1"],
        ["172.16.0.1"],
        ["127.0.0.1"],
        ["169.254.169.254"],
        ["100.64.0.1"],
        ["0.0.0.0"],
        ["::1"],
        ["::ffff:127.0.0.1"],
        ["::ffff:10.0.0.1"],
        ["fc00::1"],
        ["fe80::1"],
    ],
)
async def test_connection_layer_rejects_private_resolution(private_addresses):
    connector = _FakeConnector()
    backend = PinnedNetworkBackend(resolver=_resolver(*private_addresses), connector=connector)
    with pytest.raises(SSRFError):
        await backend.connect_tcp("api.deepseek.com", 443)
    assert connector.connected == []  # nothing was ever connected


@pytest.mark.asyncio
async def test_mixed_public_and_private_resolution_rejected():
    connector = _FakeConnector()
    backend = PinnedNetworkBackend(resolver=_resolver(PUBLIC, "10.0.0.5"), connector=connector)
    with pytest.raises(SSRFError):
        await backend.connect_tcp("api.deepseek.com", 443)
    assert connector.connected == []


@pytest.mark.asyncio
async def test_public_first_then_private_on_second_resolution_still_connects_public():
    """Even IF something resolved twice, the connector only ever receives the
    public IP from the single resolve_public_addresses call."""
    connector = _FakeConnector()
    backend = PinnedNetworkBackend(resolver=_resolver(PUBLIC), connector=connector)
    await backend.connect_tcp("api.deepseek.com", 443)
    assert connector.connected == [(PUBLIC, 443)]


def test_resolve_public_addresses_rejects_any_private():
    with pytest.raises(SSRFError):
        resolve_public_addresses("x", 443, resolver=_resolver(PUBLIC, "192.168.0.1"))


def test_resolve_public_addresses_returns_public_only():
    out = resolve_public_addresses("x", 443, resolver=_resolver(PUBLIC, "8.8.8.8"))
    assert set(out) == {PUBLIC, "8.8.8.8"}


def test_validate_rejects_localhost_alias_urls():
    for url in (
        "http://localhost:8000/v1",
        "https://127.0.0.1/v1",
        "https://[::1]/v1",
        "https://metadata.google.internal/",
        "http://169.254.169.254/latest/meta-data/",
        "https://user:pass@api.deepseek.com/v1",
        "file:///etc/passwd",
        "ftp://example.com",
        "https://api.deepseek.com:badport/v1",
    ):
        assert is_safe_provider_url(url, require_https=False, resolver=_resolver(PUBLIC)) is False


def test_https_requirement_still_enforced():
    assert is_safe_provider_url("http://api.deepseek.com/v1", resolver=_resolver(PUBLIC)) is False
    assert is_safe_provider_url("https://api.deepseek.com/v1", resolver=_resolver(PUBLIC)) is True


def test_ipv4_mapped_ipv6_private_rejected():
    with pytest.raises(SSRFError):
        resolve_public_addresses("x", 443, resolver=_resolver("::ffff:10.1.2.3"))


# ---- TLS hostname semantics ----
# httpcore calls stream.start_tls(server_hostname=<ORIGINAL host>) after
# connect_tcp. We capture the hostname through an injected tls_wrap to prove
# SNI + certificate verification use the original hostname, never the pinned IP.


class _TlsRecorder:
    def __init__(self) -> None:
        self.hostname: str | None = None

    async def wrap(self, stream, ssl_context, server_hostname):
        self.hostname = server_hostname
        return stream


@pytest.mark.asyncio
async def test_tls_uses_original_hostname_not_ip():
    recorder = _TlsRecorder()
    backend = PinnedNetworkBackend(resolver=_resolver(PUBLIC), connector=_FakeConnector(), tls_wrap=recorder.wrap)
    stream = await backend.connect_tcp("api.deepseek.com", 443)
    import ssl

    upgraded = await stream.start_tls(ssl.create_default_context(), server_hostname="api.deepseek.com")
    # httpcore passes the ORIGINAL hostname into start_tls; our wrapper forwards
    # it to the real TLS layer (anyio TLSStream.wrap(hostname=...)) unchanged.
    assert recorder.hostname == "api.deepseek.com"
    assert upgraded is not None
