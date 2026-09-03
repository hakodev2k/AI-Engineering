#!/usr/bin/env python3
"""Deterministic URL destination policy checker for SSRF defenses.

This reference tool does not perform network requests and does not resolve DNS by
itself. Production callers should feed the exact addresses returned by their
resolver/HTTP stack and re-run the same policy on every redirect/connect attempt.
"""

from __future__ import annotations

import argparse
import ipaddress
import json
import sys
from pathlib import Path
from urllib.parse import urlsplit


class PolicyError(ValueError):
    pass


def load_policy(path: str) -> dict:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise PolicyError(f"cannot load policy: {exc}") from exc
    schemes = data.get("allowed_schemes")
    if not isinstance(schemes, list) or not schemes:
        raise PolicyError("allowed_schemes must be a non-empty list")
    return data


def normalize_ip(value: str) -> ipaddress._BaseAddress:
    try:
        addr = ipaddress.ip_address(value.strip().strip("[]"))
    except ValueError as exc:
        raise PolicyError(f"invalid IP address: {value}") from exc
    if isinstance(addr, ipaddress.IPv6Address) and addr.ipv4_mapped:
        return addr.ipv4_mapped
    return addr


def classify_unsafe(addr: ipaddress._BaseAddress) -> list[str]:
    reasons: list[str] = []
    if addr.is_loopback:
        reasons.append("loopback")
    if addr.is_private:
        reasons.append("private")
    if addr.is_link_local:
        reasons.append("link_local")
    if addr.is_multicast:
        reasons.append("multicast")
    if addr.is_reserved:
        reasons.append("reserved")
    if addr.is_unspecified:
        reasons.append("unspecified")
    return reasons


def evaluate(url: str, resolved_ips: list[str], policy: dict) -> dict:
    parsed = urlsplit(url)
    if not parsed.scheme or not parsed.hostname:
        return {"allowed": False, "reason": "invalid_url", "url": url}

    scheme = parsed.scheme.lower()
    allowed_schemes = {str(x).lower() for x in policy["allowed_schemes"]}
    if scheme not in allowed_schemes:
        return {"allowed": False, "reason": "scheme_denied", "scheme": scheme}
    if parsed.username is not None or parsed.password is not None:
        return {"allowed": False, "reason": "userinfo_denied", "host": parsed.hostname}
    if not resolved_ips:
        return {"allowed": False, "reason": "no_resolution_evidence", "host": parsed.hostname}

    rejected_classes = set(policy.get("reject_address_classes", []))
    evaluated = []
    for raw in resolved_ips:
        try:
            addr = normalize_ip(raw)
        except PolicyError as exc:
            return {"allowed": False, "reason": "invalid_resolution", "detail": str(exc)}
        classes = classify_unsafe(addr)
        evaluated.append({"input": raw, "normalized": str(addr), "classes": classes})
        blocked = sorted(rejected_classes.intersection(classes))
        if blocked:
            return {
                "allowed": False,
                "reason": "unsafe_resolved_address",
                "host": parsed.hostname,
                "blocked_classes": blocked,
                "evaluated": evaluated,
            }

    return {
        "allowed": True,
        "reason": "destination_allowed",
        "scheme": scheme,
        "host": parsed.hostname,
        "evaluated": evaluated,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Check a URL and supplied resolved IPs against SSRF policy")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--url", required=True)
    parser.add_argument("--resolved-ip", action="append", default=[], help="Repeat for every address the client may connect to")
    args = parser.parse_args()

    try:
        policy = load_policy(args.policy)
        result = evaluate(args.url, args.resolved_ip, policy)
    except PolicyError as exc:
        print(json.dumps({"allowed": False, "reason": "policy_error", "detail": str(exc)}))
        return 2

    print(json.dumps(result, sort_keys=True))
    return 0 if result.get("allowed") else 1


if __name__ == "__main__":
    sys.exit(main())
