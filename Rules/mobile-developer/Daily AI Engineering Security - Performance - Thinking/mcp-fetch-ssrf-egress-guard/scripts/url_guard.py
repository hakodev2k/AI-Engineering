#!/usr/bin/env python3
"""DNS-aware SSRF gate for model-controlled MCP fetch URLs.

Exit codes: 0 allow, 2 invalid input/config, 3 policy deny, 4 DNS failure.
The script performs no HTTP request; callers MUST run it before the initial
request and again for every redirect target.
"""
from __future__ import annotations

import argparse
import ipaddress
import json
import socket
import sys
from pathlib import Path
from urllib.parse import urlsplit


def load_json(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def normalize_host(host: str) -> str:
    return host.rstrip(".").encode("idna").decode("ascii").lower()


def resolve(host: str) -> list[ipaddress._BaseAddress]:
    try:
        infos = socket.getaddrinfo(host, None, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise RuntimeError(f"DNS resolution failed for {host}: {exc}") from exc
    addresses = sorted({item[4][0] for item in infos})
    return [ipaddress.ip_address(value.split("%", 1)[0]) for value in addresses]


def domain_allowed(host: str, allowlist: list[str]) -> bool:
    if not allowlist:
        return True
    for raw in allowlist:
        entry = normalize_host(raw)
        if host == entry or host.endswith("." + entry):
            return True
    return False


def evaluate(url: str, policy: dict) -> dict:
    parsed = urlsplit(url)
    schemes = policy.get("allowed_schemes", ["http", "https"])
    if parsed.scheme.lower() not in schemes:
        return {"decision": "deny", "reason": "scheme_not_allowed", "url": url}
    if parsed.username is not None or parsed.password is not None:
        return {"decision": "deny", "reason": "userinfo_not_allowed", "url": url}
    if not parsed.hostname:
        return {"decision": "deny", "reason": "missing_host", "url": url}

    host = normalize_host(parsed.hostname)
    allowlist = policy.get("domain_allowlist", [])
    if not isinstance(allowlist, list) or not all(isinstance(x, str) for x in allowlist):
        raise ValueError("domain_allowlist must be an array of strings")
    if not domain_allowed(host, allowlist):
        return {"decision": "deny", "reason": "domain_not_allowlisted", "host": host}

    try:
        literal = ipaddress.ip_address(host.split("%", 1)[0])
        addresses = [literal]
    except ValueError:
        addresses = resolve(host)
    if not addresses:
        raise RuntimeError(f"DNS returned no addresses for {host}")

    networks = []
    for raw in policy.get("blocked_cidrs", []):
        try:
            networks.append(ipaddress.ip_network(raw, strict=False))
        except ValueError as exc:
            raise ValueError(f"invalid blocked_cidr {raw}: {exc}") from exc

    blocked = []
    for address in addresses:
        intrinsic = (
            address.is_loopback or address.is_link_local or address.is_multicast
            or address.is_unspecified or address.is_reserved
            or (address.is_private and not policy.get("allow_internal_networks", False))
        )
        cidr_match = any(address in network for network in networks if address.version == network.version)
        if intrinsic or cidr_match:
            blocked.append(str(address))

    result = {
        "decision": "deny" if blocked else "allow",
        "reason": "blocked_address" if blocked else "public_destination",
        "scheme": parsed.scheme.lower(),
        "host": host,
        "port": parsed.port,
        "resolved_addresses": [str(x) for x in addresses],
        "blocked_addresses": blocked,
    }
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        policy = load_json(args.policy)
        result = evaluate(args.url, policy)
    except ValueError as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    except RuntimeError as exc:
        print(json.dumps({"decision": "dns_failure", "error": str(exc)}), file=sys.stderr)
        return 4
    print(json.dumps(result, indent=2))
    return 0 if result["decision"] == "allow" else 3


if __name__ == "__main__":
    raise SystemExit(main())
