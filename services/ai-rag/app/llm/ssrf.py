"""SSRF guard for user-supplied provider Base URLs.

The public AI/RAG backend accepts an OpenAI-compatible Base URL from the
browser (BYOK). That must never become a proxy into private networks or cloud
metadata endpoints. Every runtime provider URL is validated here before any
request is made.

Rejected:
- non-http(s) schemes (file://, ftp://, gopher://, unix sockets, …)
- URLs embedding credentials (user:pass@host)
- localhost / loopback (127.0.0.0/8, ::1)
- RFC1918 private ranges (10/8, 172.16/12, 192.168/16)
- link-local / CGNAT / reserved ranges (169.254/16 incl. 169.254.169.254,
  fe80::/10, 100.64/10, 0.0.0.0/8, 198.18/15, 240.0.0.0/4, …)
- non-HTTPS custom URLs in production
- obvious internal hostnames (.local, .internal, .localhost, bare "localhost")

The guard resolves the host and verifies EVERY returned address, so DNS tricks
that alternate between public and private IPs are rejected as well.
"""

from __future__ import annotations

import ipaddress
import socket
from urllib.parse import urlparse

from ..config import settings

# https://www.iana.org/assignments/iana-ipv4-special-purpose-registry/
# and the IPv6 equivalents. We reject anything that is not global unicast.
_PRIVATE_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("100.64.0.0/10"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.0.0.0/24"),
    ipaddress.ip_network("192.0.2.0/24"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("198.18.0.0/15"),
    ipaddress.ip_network("198.51.100.0/24"),
    ipaddress.ip_network("203.0.113.0/24"),
    ipaddress.ip_network("224.0.0.0/4"),
    ipaddress.ip_network("240.0.0.0/4"),
    ipaddress.ip_network("255.255.255.255/32"),
]

_PRIVATE_NETWORKS_V6 = [
    ipaddress.ip_network("::/128"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("::ffff:0:0/96"),  # IPv4-mapped, checked below too
    ipaddress.ip_network("64:ff9b::/96"),  # NAT64
    ipaddress.ip_network("100::/64"),
    ipaddress.ip_network("2001:db8::/32"),
    ipaddress.ip_network("fc00::/7"),  # ULA
    ipaddress.ip_network("fe80::/10"),  # link-local
    ipaddress.ip_network("ff00::/8"),  # multicast
]

# Obvious internal hostnames that should never be contacted even if they
# resolve to a public-looking address (DNS-rebinding host entries etc.).
_INTERNAL_HOST_SUFFIXES = (
    ".localhost",
    ".local",
    ".internal",
    ".home.arpa",
    ".lan",
    ".corp",
    ".example.com",  # reserved documentation domain (RFC 2606)
    ".example.net",
    ".example.org",
    ".invalid",
    ".test",
)
_INTERNAL_HOST_NAMES = {
    "localhost",
    "metadata.google.internal",
    "metadata",
}


class SSRFError(ValueError):
    """Raised when a provider URL is not safe to contact from the backend."""


def _is_private_ip(ip: ipaddress.IPv4Address | ipaddress.IPv6Address) -> bool:
    if isinstance(ip, ipaddress.IPv4Address):
        return any(ip in net for net in _PRIVATE_NETWORKS)
    return any(ip in net for net in _PRIVATE_NETWORKS_V6)


def _looks_internal_hostname(host: str) -> bool:
    h = host.strip().rstrip(".").lower()
    if h in _INTERNAL_HOST_NAMES:
        return True
    return any(h.endswith(sfx) for sfx in _INTERNAL_HOST_SUFFIXES)


def _literal_ip_is_private(host: str) -> bool:
    """Check a literal IP host (no DNS) against private ranges."""
    bare = host.split("%")[0]
    try:
        ip = ipaddress.ip_address(bare)
    except ValueError:
        return False
    return _is_private_ip(ip)


def validate_provider_url(url: str, *, require_https: bool | None = None, resolver=None) -> str:
    """Validate a provider Base URL for SSRF safety.

    Returns the normalized URL on success, raises SSRFError otherwise.
    ``require_https`` defaults to the production setting (https enforced).
    ``resolver`` is an optional ``(host, port) -> list[str]`` DNS override used
    by tests (never in production); when omitted the real resolver runs and
    EVERY resolved address must be public.
    """
    if require_https is None:
        require_https = settings.enforce_https_providers

    if not url or not isinstance(url, str):
        raise SSRFError("Base URL is required")
    if len(url) > settings.max_provider_url_length:
        raise SSRFError("Base URL is too long")

    try:
        parsed = urlparse(url)
    except ValueError as e:
        raise SSRFError(f"Invalid Base URL: {e}") from e

    scheme = (parsed.scheme or "").lower()
    if scheme not in ("http", "https"):
        raise SSRFError("Base URL must use http or https")
    if require_https and scheme != "https":
        raise SSRFError("Base URL must use https")

    if parsed.username or parsed.password:
        raise SSRFError("Base URL must not contain credentials")

    try:
        port = parsed.port
    except ValueError:
        raise SSRFError("Base URL contains an invalid port")

    host = parsed.hostname
    if not host:
        raise SSRFError("Base URL is missing a host")

    if _looks_internal_hostname(host):
        raise SSRFError("Base URL must point to a public host")

    # Literal private IPs are rejected without any DNS involvement.
    if _literal_ip_is_private(host):
        raise SSRFError("Base URL must not point to a private or local address")

    # Resolve the host and reject if ANY resolved address is private
    # (DNS-rebinding defence). Tests may inject a resolver.
    if resolver is not None:
        addresses = resolver(host, port)
    else:
        try:
            infos = socket.getaddrinfo(host, port or (443 if scheme == "https" else 80), proto=socket.IPPROTO_TCP)
        except socket.gaierror as e:
            raise SSRFError(f"Base URL host could not be resolved: {e}") from e
        addresses = [info[4][0] for info in infos]

    if not addresses:
        raise SSRFError("Base URL host did not resolve to any address")

    seen: set[str] = set()
    for addr in addresses:
        bare = addr.split("%")[0]
        if bare in seen:
            continue
        seen.add(bare)
        try:
            ip = ipaddress.ip_address(bare)
        except ValueError:
            continue
        if _is_private_ip(ip):
            raise SSRFError("Base URL must not point to a private or local address")

    return url


def is_safe_provider_url(url: str, *, require_https: bool | None = None, resolver=None) -> bool:
    """Boolean convenience wrapper (does not raise)."""
    try:
        validate_provider_url(url, require_https=require_https, resolver=resolver)
        return True
    except SSRFError:
        return False
