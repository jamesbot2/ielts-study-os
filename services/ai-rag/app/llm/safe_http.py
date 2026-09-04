"""Safe outbound HTTP for user-controlled (BYOK) provider endpoints.

Closes the DNS-rebinding / SSRF validate→connect TOCTOU:

- pre-flight ``validate_provider_url`` remains as a fast friendly check
- the ACTUAL connection goes through ``PinnedNetworkBackend.connect_tcp``,
  which resolves the hostname ONCE, requires every resolved address to be
  public, and then opens the TCP socket to a validated PUBLIC IP literal
  (no second DNS resolution by the HTTP stack).
- httpcore then performs TLS with ``server_hostname`` = the ORIGINAL hostname,
  so TLS certificate verification + SNI + HTTP Host/authority semantics are all
  against the hostname the user configured — never weakened.

Redirects are disabled (httpx follow_redirects=False is explicit on every
provider client): a public origin cannot redirect us into localhost/RFC1918.
"""

from __future__ import annotations

import ssl
import typing

import anyio
import httpcore
import httpx

from .ssrf import SSRFError, resolve_public_addresses

SOCKET_OPTION = tuple

_DEFAULT_LIMITS = httpx.Limits(max_connections=10, max_keepalive_connections=5, keepalive_expiry=5.0)


def _looks_literal_public_ip(host: str) -> bool:
    """True when host is a bare IP that is NOT rejected by range checks — the
    caller still resolves it for uniformity (IP literals resolve to themselves,
    never through DNS)."""
    return False  # handled uniformly by resolve_public_addresses


class _PinnedStream(httpcore.AsyncNetworkStream):
    """Wraps a connected anyio byte stream. TLS is applied on top by httpcore
    with the ORIGINAL hostname as server_hostname."""

    def __init__(self, stream: anyio.abc.ByteStream, tls_wrap=None) -> None:
        self._stream = stream
        self._tls_wrap = tls_wrap

    async def read(self, max_bytes: int, timeout: float | None = None) -> bytes:
        with anyio.fail_after(timeout):
            try:
                return await self._stream.receive(max_bytes=max_bytes)
            except anyio.EndOfStream:
                return b""

    async def write(self, buffer: bytes, timeout: float | None = None) -> None:
        if not buffer:
            return
        with anyio.fail_after(timeout):
            await self._stream.send(item=buffer)

    async def aclose(self) -> None:
        await self._stream.aclose()

    async def start_tls(
        self,
        ssl_context: ssl.SSLContext,
        server_hostname: str | None = None,
        timeout: float | None = None,
    ) -> httpcore.AsyncNetworkStream:
        if self._tls_wrap is not None:
            wrapped = await self._tls_wrap(self._stream, ssl_context, server_hostname)
            return _PinnedStream(wrapped, tls_wrap=self._tls_wrap)
        with anyio.fail_after(timeout):
            tls_stream = await anyio.streams.tls.TLSStream.wrap(
                self._stream,
                ssl_context=ssl_context,
                hostname=server_hostname,
                standard_compatible=False,
                server_side=False,
            )
        return _PinnedStream(tls_stream, tls_wrap=None)

    def get_extra_info(self, info: str) -> typing.Any:
        if info == "ssl_object":
            return self._stream.extra(anyio.streams.tls.TLSAttribute.ssl_object, None)
        if info == "client_addr":
            return self._stream.extra(anyio.abc.SocketAttribute.local_address, None)
        if info == "server_addr":
            return self._stream.extra(anyio.abc.SocketAttribute.remote_address, None)
        if info == "socket":
            return self._stream.extra(anyio.abc.SocketAttribute.raw_socket, None)
        return None


class PinnedNetworkBackend(httpcore.AsyncNetworkBackend):
    """Resolves once, validates every address public, connects ONLY to a
    validated public IP. TLS (with the original hostname) is applied later by
    httpcore on the returned stream."""

    def __init__(
        self,
        *,
        resolver=None,
        connector=None,
        tls_wrap=None,
    ) -> None:
        """``resolver``, ``connector`` and ``tls_wrap`` are test-only overrides
        (never used in production)."""
        self._resolver = resolver
        self._connector = connector
        self._tls_wrap = tls_wrap

    async def connect_tcp(
        self,
        host: str,
        port: int,
        timeout: float | None = None,
        local_address: str | None = None,
        socket_options: typing.Iterable[SOCKET_OPTION] | None = None,
    ) -> httpcore.AsyncNetworkStream:
        # Resolve once and require every address to be public. This is the ONLY
        # resolution: the socket below connects to the returned IP literal.
        public_ips = resolve_public_addresses(host, port, resolver=self._resolver)
        if not public_ips:
            raise SSRFError("Base URL host did not resolve to any public address")
        ip = public_ips[0]
        if self._connector is not None:
            stream = await self._connector(ip, port)
        else:
            try:
                with anyio.fail_after(timeout):
                    stream = await anyio.connect_tcp(remote_host=ip, remote_port=port, local_host=local_address)
            except TimeoutError:
                from httpcore import ConnectTimeout

                raise ConnectTimeout(f"timed out connecting to {host}") from None
            except OSError as e:
                from httpcore import ConnectError

                raise ConnectError(str(e)) from e
        return _PinnedStream(stream, tls_wrap=self._tls_wrap)

    async def connect_unix_socket(
        self,
        path: str,
        timeout: float | None = None,
        socket_options: typing.Iterable[SOCKET_OPTION] | None = None,
    ) -> httpcore.AsyncNetworkStream:
        # Unix sockets are never permitted for provider endpoints.
        from httpcore import ConnectError

        raise ConnectError("unix sockets are not allowed for provider connections")

    async def sleep(self, seconds: float) -> None:
        await anyio.sleep(seconds)


class PinnedAsyncHTTPTransport(httpx.AsyncHTTPTransport):
    """httpx.AsyncHTTPTransport whose connection pool uses
    PinnedNetworkBackend — every provider request is DNS-rebinding-safe."""

    def __init__(
        self,
        *,
        verify: ssl.SSLContext | str | bool = True,
        trust_env: bool = True,
        http1: bool = True,
        http2: bool = False,
        limits: httpx.Limits = _DEFAULT_LIMITS,
        local_address: str | None = None,
        retries: int = 0,
        network_backend: httpcore.AsyncNetworkBackend | None = None,
    ) -> None:
        # Deliberately do NOT call super().__init__: we need to inject a custom
        # httpcore network backend, which httpx does not expose. We replicate
        # httpx's no-proxy pool construction with our backend.
        self._pool = httpcore.AsyncConnectionPool(
            ssl_context=httpx._config.create_ssl_context(verify=verify, trust_env=trust_env),
            max_connections=limits.max_connections,
            max_keepalive_connections=limits.max_keepalive_connections,
            keepalive_expiry=limits.keepalive_expiry,
            http1=http1,
            http2=http2,
            local_address=local_address,
            retries=retries,
            network_backend=network_backend or PinnedNetworkBackend(),
        )

    async def __aenter__(self) -> typing.Self:
        await self._pool.__aenter__()
        return self

    async def __aexit__(self, *args: object) -> None:
        await self._pool.__aexit__(*args)

    async def aclose(self) -> None:
        await self._pool.aclose()


def build_provider_client(
    timeout: float = 60.0,
    *,
    network_backend: httpcore.AsyncNetworkBackend | None = None,
) -> httpx.AsyncClient:
    """AsyncClient for runtime user-controlled provider endpoints.

    - connections pinned to validated public IPs (DNS-rebinding safe)
    - redirects DISABLED (a provider can never redirect us to a private host)
    - TLS verification enabled (hostname verified against the original host)
    - no environment proxies trusted (proxy env vars would bypass pinning)
    """
    return httpx.AsyncClient(
        transport=PinnedAsyncHTTPTransport(network_backend=network_backend),
        timeout=timeout,
        follow_redirects=False,
        trust_env=False,
    )
