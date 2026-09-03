#!/usr/bin/env python3
"""Deterministic Host/Origin policy oracle for MCP HTTP boundary tests.

This script does not contact a network endpoint. It evaluates request fixtures against
an explicit policy so CI and integration tests share the same expected decisions.
Exit codes: 0 all expectations match, 1 invalid input/config, 2 expectation mismatch.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.parse import urlsplit


def load_json(path: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def normalize_host(value: str) -> str:
    value = value.strip().lower()
    if not value or any(ch in value for ch in "\r\n/\\"):
        raise ValueError("malformed host")
    return value


def normalize_origin(value: str) -> str:
    value = value.strip()
    if value == "*":
        return "*"
    p = urlsplit(value)
    if p.scheme not in {"http", "https"} or not p.hostname or p.username or p.password:
        raise ValueError("malformed origin")
    if p.path not in {"", "/"} or p.query or p.fragment:
        raise ValueError("origin must not contain path/query/fragment")
    host = p.hostname.lower()
    if ":" in host and not host.startswith("["):
        host = f"[{host}]"
    port = p.port
    default = (p.scheme == "http" and port == 80) or (p.scheme == "https" and port == 443)
    port_part = "" if port is None or default else f":{port}"
    return f"{p.scheme.lower()}://{host}{port_part}"


def validate_policy(policy: dict) -> dict:
    hosts = policy.get("allowed_hosts")
    origins = policy.get("allowed_origins")
    if not isinstance(hosts, list) or not hosts:
        raise ValueError("allowed_hosts must be a non-empty list")
    if not isinstance(origins, list) or not origins:
        raise ValueError("allowed_origins must be a non-empty list")
    norm_hosts = {normalize_host(str(x)) for x in hosts}
    norm_origins = {normalize_origin(str(x)) for x in origins}
    if policy.get("forbid_wildcard_origin", True) and "*" in norm_origins:
        raise ValueError("wildcard origin is forbidden")
    bind_modes = policy.get("allowed_bind_modes", [])
    if not isinstance(bind_modes, list) or not bind_modes:
        raise ValueError("allowed_bind_modes must be a non-empty list")
    return {
        **policy,
        "allowed_hosts": norm_hosts,
        "allowed_origins": norm_origins,
        "allow_missing_origin": bool(policy.get("allow_missing_origin", False)),
        "require_authentication": bool(policy.get("require_authentication", True)),
        "allowed_bind_modes": set(map(str, bind_modes)),
    }


def evaluate(policy: dict, case: dict) -> tuple[bool, str]:
    try:
        host = normalize_host(str(case.get("host", "")))
    except ValueError:
        return False, "invalid_host"
    if host not in policy["allowed_hosts"]:
        return False, "host_not_allowed"

    origin = case.get("origin")
    if origin is None or origin == "":
        if not policy["allow_missing_origin"]:
            return False, "origin_required"
    else:
        try:
            norm_origin = normalize_origin(str(origin))
        except (ValueError, UnicodeError):
            return False, "invalid_origin"
        if norm_origin not in policy["allowed_origins"]:
            return False, "origin_not_allowed"

    bind_mode = str(case.get("bind_mode", ""))
    if bind_mode not in policy["allowed_bind_modes"]:
        return False, "bind_mode_not_allowed"

    authenticated = bool(case.get("authenticated", False))
    if policy["require_authentication"] and not authenticated:
        return False, "authentication_required"

    return True, "allowed"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--policy", required=True)
    ap.add_argument("--cases", required=True)
    args = ap.parse_args()
    try:
        policy = validate_policy(load_json(args.policy))
        cases = load_json(args.cases)
        if not isinstance(cases, list) or not cases:
            raise ValueError("cases must be a non-empty JSON list")
    except ValueError as exc:
        print(f"INPUT_ERROR: {exc}", file=sys.stderr)
        return 1

    mismatches = 0
    for index, case in enumerate(cases):
        if not isinstance(case, dict) or "expect" not in case:
            print(f"case[{index}] invalid: object with expect required", file=sys.stderr)
            return 1
        allowed, reason = evaluate(policy, case)
        expected = str(case["expect"]).lower()
        actual = "allow" if allowed else "reject"
        ok = expected == actual
        if not ok:
            mismatches += 1
        print(json.dumps({"case": case.get("name", index), "actual": actual, "reason": reason, "match": ok}))
    return 2 if mismatches else 0


if __name__ == "__main__":
    raise SystemExit(main())
