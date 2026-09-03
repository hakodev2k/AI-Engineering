#!/usr/bin/env python3
"""Deterministic MCP HTTP Host/Origin policy gate.

Reads a JSON policy and a JSON request metadata document. This is an offline
reference implementation intended for pre-dispatch integration tests and hooks.
Exit codes: 0 allow, 2 policy deny, 64 invalid input/configuration.
"""
from __future__ import annotations

import argparse
import ipaddress
import json
import sys
from pathlib import Path
from urllib.parse import urlsplit


def load_json(path: str) -> dict:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def normalize_host(value: str) -> str:
    value = value.strip().lower()
    if not value or any(c in value for c in "\r\n/\\"):
        raise ValueError("malformed Host")
    return value


def normalize_origin(value: str) -> str:
    value = value.strip()
    parsed = urlsplit(value)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("malformed Origin")
    if parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
        raise ValueError("Origin must not contain path/query/fragment")
    host = parsed.hostname.lower()
    default = 80 if parsed.scheme == "http" else 443
    port = parsed.port
    authority = host if port in {None, default} else f"{host}:{port}"
    return f"{parsed.scheme.lower()}://{authority}"


def is_ip(value: str) -> bool:
    try:
        ipaddress.ip_address(value)
        return True
    except ValueError:
        return False


def evaluate(policy: dict, request: dict) -> tuple[bool, str]:
    required_policy = ["allowed_hosts", "allowed_origins", "allow_missing_origin", "allowed_bind_addresses"]
    if any(k not in policy for k in required_policy):
        return False, "invalid_policy_missing_required_key"

    try:
        host = normalize_host(str(request.get("host", "")))
    except ValueError:
        return False, "malformed_host"

    allowed_hosts = {normalize_host(str(x)) for x in policy["allowed_hosts"]}
    if "*" in allowed_hosts or host not in allowed_hosts:
        return False, "host_not_allowed"

    bind = str(request.get("bind_address", "")).strip().lower()
    if bind not in {str(x).strip().lower() for x in policy["allowed_bind_addresses"]}:
        return False, "bind_address_not_allowed"

    origin_raw = request.get("origin")
    if origin_raw in {None, ""}:
        if not bool(policy["allow_missing_origin"]):
            return False, "origin_required"
    else:
        try:
            origin = normalize_origin(str(origin_raw))
            allowed_origins = {normalize_origin(str(x)) for x in policy["allowed_origins"]}
        except ValueError:
            return False, "malformed_origin"
        if "*" in allowed_origins or origin not in allowed_origins:
            return False, "origin_not_allowed"

    forwarded = request.get("forwarded_host")
    if forwarded:
        if not policy.get("trust_forwarded_headers", False):
            return False, "untrusted_forwarded_host"
        remote_ip = str(request.get("remote_ip", ""))
        if not is_ip(remote_ip) or remote_ip not in set(policy.get("trusted_proxy_ips", [])):
            return False, "forwarded_host_from_untrusted_peer"
        try:
            forwarded_norm = normalize_host(str(forwarded))
        except ValueError:
            return False, "malformed_forwarded_host"
        if forwarded_norm not in allowed_hosts:
            return False, "forwarded_host_not_allowed"

    return True, "allowed"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--policy", required=True)
    parser.add_argument("--request", required=True)
    args = parser.parse_args()
    try:
        policy = load_json(args.policy)
        request = load_json(args.request)
        allowed, reason = evaluate(policy, request)
    except ValueError as exc:
        print(json.dumps({"allowed": False, "reason": "invalid_input", "error": str(exc)}))
        return 64
    print(json.dumps({"allowed": allowed, "reason": reason}, sort_keys=True))
    return 0 if allowed else 2


if __name__ == "__main__":
    sys.exit(main())
