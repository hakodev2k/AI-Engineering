#!/usr/bin/env python3
"""Deterministic MCP OAuth resource/audience conformance checks.

This utility validates sanitized OAuth request parameters and decoded test claim sets.
It intentionally does NOT verify JWT signatures and must not replace production JWT/OAuth
middleware. It also compares bearer-token fingerprints without printing token values.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

EXIT_OK = 0
EXIT_FAIL = 2
EXIT_INPUT = 3


def load_json(path: str) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            value = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"JSON root must be an object: {path}")
    return value


def absolute_https_uri(value: str) -> bool:
    try:
        parsed = urlparse(value)
        return parsed.scheme == "https" and bool(parsed.netloc) and not parsed.fragment
    except Exception:
        return False


def normalize_aud(aud) -> list[str]:
    if isinstance(aud, str):
        return [aud]
    if isinstance(aud, list) and all(isinstance(x, str) for x in aud):
        return aud
    return []


def normalize_scopes(claims: dict) -> set[str]:
    raw = claims.get("scope", claims.get("scp", []))
    if isinstance(raw, str):
        return {x for x in raw.split() if x}
    if isinstance(raw, list):
        return {x for x in raw if isinstance(x, str)}
    return set()


def result(ok: bool, checks: list[dict], **extra) -> int:
    payload = {"ok": ok, "checks": checks, **extra}
    print(json.dumps(payload, indent=2, sort_keys=True))
    return EXIT_OK if ok else EXIT_FAIL


def check_policy(policy: dict) -> int:
    checks = []
    resource = policy.get("canonical_resource", "")
    checks.append({"name": "canonical_resource_https", "pass": absolute_https_uri(resource)})
    issuers = policy.get("trusted_issuers", [])
    checks.append({"name": "trusted_issuers_nonempty", "pass": isinstance(issuers, list) and len(issuers) > 0})
    checks.append({"name": "require_audience", "pass": policy.get("require_audience") is True})
    checks.append({"name": "reject_sibling_audience", "pass": policy.get("reject_sibling_audience") is True})
    checks.append({"name": "forbid_passthrough", "pass": policy.get("forbid_inbound_token_passthrough") is True})
    checks.append({"name": "fail_closed", "pass": policy.get("fail_closed") is True})
    retries = policy.get("max_validation_retries")
    checks.append({"name": "bounded_retries", "pass": isinstance(retries, int) and 0 <= retries <= 3})
    return result(all(c["pass"] for c in checks), checks)


def check_request(policy: dict, stage: str, request: dict) -> int:
    required_flag = {
        "authorize": "require_resource_on_authorization_request",
        "token": "require_resource_on_token_request",
        "refresh": "require_resource_on_refresh_request",
    }[stage]
    resource = request.get("resource")
    expected = policy.get("canonical_resource")
    required = policy.get(required_flag, False)
    checks = [
        {"name": "resource_present", "pass": (not required) or isinstance(resource, str)},
        {"name": "resource_exact_match", "pass": (not required) or resource == expected},
    ]
    if stage == "authorize":
        response_type = request.get("response_type")
        checks.append({"name": "authorization_code_flow", "pass": response_type in (None, "code")})
    if stage in ("token", "refresh"):
        grant = request.get("grant_type")
        expected_grant = "authorization_code" if stage == "token" else "refresh_token"
        checks.append({"name": "grant_type", "pass": grant == expected_grant})
    return result(all(c["pass"] for c in checks), checks, stage=stage)


def check_token(policy: dict, claims: dict, now: int | None = None) -> int:
    now = int(time.time()) if now is None else now
    skew = int(policy.get("clock_skew_seconds", 0))
    expected_resource = policy.get("canonical_resource")
    audiences = normalize_aud(claims.get("aud"))
    issuers = set(policy.get("trusted_issuers", []))
    required_scopes = set(policy.get("required_scopes", []))
    actual_scopes = normalize_scopes(claims)
    checks = []

    if policy.get("require_issuer", True):
        checks.append({"name": "issuer_trusted", "pass": claims.get("iss") in issuers})
    if policy.get("require_audience", True):
        checks.append({"name": "audience_present", "pass": len(audiences) > 0})
        checks.append({"name": "audience_contains_resource", "pass": expected_resource in audiences})
        if policy.get("reject_sibling_audience", True):
            checks.append({"name": "no_unexpected_audience", "pass": set(audiences) == {expected_resource}})
    if policy.get("require_exp", True):
        exp = claims.get("exp")
        checks.append({"name": "exp_numeric", "pass": isinstance(exp, (int, float))})
        checks.append({"name": "not_expired", "pass": isinstance(exp, (int, float)) and exp + skew >= now})
    checks.append({"name": "required_scopes", "pass": required_scopes.issubset(actual_scopes)})

    return result(all(c["pass"] for c in checks), checks, audience=audiences, issuer=claims.get("iss"))


def token_fingerprint(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def compare_tokens(policy: dict, inbound_env: str, outbound_env: str) -> int:
    inbound = os.environ.get(inbound_env)
    outbound = os.environ.get(outbound_env)
    if not inbound or not outbound:
        print(json.dumps({"ok": False, "error": "required token environment variable is missing"}))
        return EXIT_INPUT
    in_fp = token_fingerprint(inbound)
    out_fp = token_fingerprint(outbound)
    equal = in_fp == out_fp
    forbidden = policy.get("forbid_inbound_token_passthrough", True)
    checks = [{"name": "token_passthrough_forbidden", "pass": not (forbidden and equal)}]
    # Fingerprints are safe enough for test correlation, but token values are never emitted.
    return result(all(c["pass"] for c in checks), checks, inbound_sha256=in_fp, outbound_sha256=out_fp)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("check-policy")
    p.add_argument("--policy", required=True)

    p = sub.add_parser("check-request")
    p.add_argument("--policy", required=True)
    p.add_argument("--stage", choices=["authorize", "token", "refresh"], required=True)
    p.add_argument("--input", required=True)

    p = sub.add_parser("check-token")
    p.add_argument("--policy", required=True)
    p.add_argument("--claims", required=True)
    p.add_argument("--now", type=int)

    p = sub.add_parser("compare-tokens")
    p.add_argument("--policy", required=True)
    p.add_argument("--inbound-env", required=True)
    p.add_argument("--outbound-env", required=True)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    try:
        policy = load_json(args.policy)
        if args.command == "check-policy":
            return check_policy(policy)
        if args.command == "check-request":
            return check_request(policy, args.stage, load_json(args.input))
        if args.command == "check-token":
            return check_token(policy, load_json(args.claims), args.now)
        if args.command == "compare-tokens":
            return compare_tokens(policy, args.inbound_env, args.outbound_env)
    except ValueError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        return EXIT_INPUT
    return EXIT_INPUT


if __name__ == "__main__":
    sys.exit(main())
