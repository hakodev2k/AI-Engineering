#!/usr/bin/env python3
"""Validate a credential-bearing outbound destination before a tool sends a request.

Exit codes: 0 allow, 2 invalid input/config, 4 approval required, 5 deny.
This script performs validation only; callers MUST also disable redirects and enforce
network egress policy in the HTTP/network layer.
"""
from __future__ import annotations
import argparse
import ipaddress
import json
import socket
import sys
from pathlib import Path
from urllib.parse import urlsplit

ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def resolve(host: str) -> list[str]:
    try:
        records = socket.getaddrinfo(host, None, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise ValueError(f"DNS resolution failed for {host}: {exc}") from exc
    return sorted({r[4][0] for r in records})


def is_global(address: str) -> bool:
    try:
        return ipaddress.ip_address(address).is_global
    except ValueError:
        return False


def host_allowed(host: str, policy: dict) -> tuple[bool, bool]:
    exact = {str(x).lower().rstrip('.') for x in policy.get("allowed_hosts", [])}
    suffixes = [str(x).lower().rstrip('.') for x in policy.get("allowed_host_suffixes", [])]
    h = host.lower().rstrip('.')
    if h in exact:
        return True, True
    for suffix in suffixes:
        if not suffix.startswith('.'):
            raise ValueError("allowed_host_suffixes entries must begin with '.'")
        if h.endswith(suffix) and h != suffix[1:]:
            return True, False
    return False, False


def evaluate(data: dict, policy: dict) -> tuple[dict, int]:
    url = data.get("url")
    cred = data.get("credential_class")
    operation = data.get("operation", "unspecified")
    approval = data.get("approval") or {}
    if not isinstance(url, str) or not url:
        raise ValueError("url must be a non-empty string")
    if not isinstance(cred, str) or not cred:
        raise ValueError("credential_class must be a non-empty string")
    if not isinstance(approval, dict):
        raise ValueError("approval must be an object")

    guarded = set(map(str, policy.get("credential_classes_requiring_guard", [])))
    if cred not in guarded:
        raise ValueError(f"credential_class {cred!r} is not configured for this guard")

    parsed = urlsplit(url)
    findings: list[str] = []
    allowed_schemes = set(map(str, policy.get("allowed_schemes", ["https"])))
    if parsed.scheme.lower() not in allowed_schemes:
        findings.append("scheme is not allowed")
    if not parsed.hostname:
        findings.append("hostname is missing")
    if policy.get("reject_userinfo", True) and (parsed.username is not None or parsed.password is not None):
        findings.append("userinfo is forbidden")

    try:
        port = parsed.port or (443 if parsed.scheme.lower() == "https" else 80)
    except ValueError:
        findings.append("invalid port")
        port = -1
    if port not in {int(x) for x in policy.get("allowed_ports", [443])}:
        findings.append("port is not allowed")

    host = (parsed.hostname or "").lower().rstrip('.')
    exact = False
    if host:
        ok, exact = host_allowed(host, policy)
        if not ok:
            findings.append("host is not allowlisted")

    addresses: list[str] = []
    if host and not findings:
        addresses = resolve(host)
        if policy.get("require_global_ip", True):
            bad = [x for x in addresses if not is_global(x)]
            if bad:
                findings.append("host resolves to non-global address(es): " + ",".join(bad))

    normalized = f"{parsed.scheme.lower()}://{host}:{port}"
    if findings:
        return {"decision":"deny","normalized_destination":normalized,"credential_class":cred,"operation":operation,"addresses":addresses,"findings":findings}, DENY

    if policy.get("redirects_allowed", False):
        return {"decision":"deny","normalized_destination":normalized,"credential_class":cred,"operation":operation,"addresses":addresses,"findings":["policy must disable redirects for credential-bearing requests"]}, DENY

    approval_required = bool(policy.get("require_approval_when_host_not_exact", True) and not exact)
    if approval_required:
        bound = approval.get("granted") is True and approval.get("destination") == normalized and approval.get("credential_class") == cred and approval.get("operation") == operation
        if not bound:
            return {"decision":"approval_required","normalized_destination":normalized,"credential_class":cred,"operation":operation,"addresses":addresses,"findings":["suffix-only destination requires action-bound approval"]}, APPROVAL

    return {"decision":"allow","normalized_destination":normalized,"credential_class":cred,"operation":operation,"addresses":addresses,"findings":[]}, ALLOW


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path, help="JSON request envelope")
    p.add_argument("--policy", type=Path, required=True)
    args = p.parse_args()
    try:
        result, code = evaluate(load_json(args.input), load_json(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2))
    return code

if __name__ == "__main__":
    raise SystemExit(main())
