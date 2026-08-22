#!/usr/bin/env python3
"""Deterministically validate MCP OAuth authorization/callback transaction binding.

Exit codes: 0 allow, 2 invalid input/config, 5 deny.
No secrets or authorization codes are written by this program.
"""
from __future__ import annotations
import argparse
import hashlib
import ipaddress
import json
import secrets
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ALLOW, INVALID, DENY = 0, 2, 5


def load_json(path: Path) -> dict[str, Any]:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return obj


def normalize_url(value: str) -> str:
    p = urlparse(value)
    if not p.scheme or not p.hostname:
        raise ValueError("URL must include scheme and hostname")
    host = p.hostname.lower().rstrip(".")
    port = p.port
    default = (p.scheme.lower() == "https" and port in (None, 443)) or (p.scheme.lower() == "http" and port in (None, 80))
    authority = host if default else f"{host}:{port}"
    path = p.path or "/"
    return f"{p.scheme.lower()}://{authority}{path}" + (f"?{p.query}" if p.query else "")


def is_loopback(host: str) -> bool:
    if host.lower() == "localhost":
        return True
    try:
        return ipaddress.ip_address(host).is_loopback
    except ValueError:
        return False


def validate_auth_url(url: str, policy: dict[str, Any]) -> list[str]:
    problems: list[str] = []
    try:
        p = urlparse(url)
        scheme = p.scheme.lower()
        host = p.hostname or ""
    except ValueError:
        return ["malformed_authorization_url"]
    if scheme in set(policy.get("dangerous_schemes", [])):
        problems.append("dangerous_authorization_scheme")
    allowed = set(policy.get("allowed_authorization_schemes", ["https"]))
    if scheme not in allowed:
        if not (scheme == "http" and policy.get("allow_http_loopback", False) and is_loopback(host)):
            problems.append("authorization_scheme_not_allowed")
    if p.username or p.password:
        problems.append("authorization_url_userinfo_forbidden")
    return problems


def fingerprint(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def evaluate(record: dict[str, Any], policy: dict[str, Any], phase: str, now: int) -> dict[str, Any]:
    required = ["state", "client_id", "redirect_uri", "authorization_url", "pkce_method", "consent_session_hash", "issued_at", "expires_at"]
    missing = [k for k in required if k not in record]
    if missing:
        raise ValueError("missing fields: " + ",".join(missing))
    if not all(isinstance(record[k], str) for k in ["state", "client_id", "redirect_uri", "authorization_url", "pkce_method", "consent_session_hash"]):
        raise ValueError("transaction string fields have invalid types")
    if not isinstance(record["issued_at"], int) or not isinstance(record["expires_at"], int):
        raise ValueError("issued_at/expires_at must be integer epoch seconds")

    violations = validate_auth_url(record["authorization_url"], policy)
    ttl = int(policy.get("transaction_ttl_seconds", 600))
    skew = int(policy.get("max_clock_skew_seconds", 30))
    if record["expires_at"] - record["issued_at"] > ttl:
        violations.append("transaction_ttl_too_long")
    if now + skew < record["issued_at"]:
        violations.append("transaction_from_future")
    if now - skew > record["expires_at"]:
        violations.append("transaction_expired")
    if policy.get("require_pkce_s256", True) and record["pkce_method"] != "S256":
        violations.append("pkce_s256_required")
    if not record["consent_session_hash"]:
        violations.append("missing_consent_session_binding")
    if policy.get("require_resource_binding", True) and not record.get("resource"):
        violations.append("missing_resource_binding")
    if policy.get("require_live_loopback_listener", True):
        redirect_host = urlparse(record["redirect_uri"]).hostname or ""
        if is_loopback(redirect_host) and record.get("loopback_listener_live") is not True:
            violations.append("loopback_listener_not_attested")

    if phase == "callback":
        callback = record.get("callback")
        if not isinstance(callback, dict):
            raise ValueError("callback object required for callback phase")
        if callback.get("state") != record["state"]:
            violations.append("state_mismatch")
        if callback.get("consent_session_hash") != record["consent_session_hash"]:
            violations.append("consent_session_mismatch")
        if policy.get("single_use_state", True) and record.get("consumed") is True:
            violations.append("state_replay")
        if policy.get("require_exact_redirect_match", True):
            try:
                if normalize_url(str(callback.get("redirect_uri", ""))) != normalize_url(record["redirect_uri"]):
                    violations.append("redirect_uri_mismatch")
            except ValueError:
                violations.append("redirect_uri_invalid")
        for field in ("client_id", "resource", "scope"):
            if field in record and callback.get(field) != record.get(field):
                violations.append(f"{field}_binding_mismatch")
        if callback.get("pkce_challenge_hash") != record.get("pkce_challenge_hash"):
            violations.append("pkce_binding_mismatch")

    return {
        "decision": "deny" if violations else "allow",
        "phase": phase,
        "transaction_fingerprint": fingerprint(record["state"] + "|" + record["client_id"]),
        "violations": sorted(set(violations)),
        "checked_at": now,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("record", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--phase", choices=["authorize", "callback"], required=True)
    ap.add_argument("--now", type=int, default=None, help="epoch seconds; defaults to current time")
    args = ap.parse_args()
    try:
        result = evaluate(load_json(args.record), load_json(args.policy), args.phase, args.now or int(time.time()))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, sort_keys=True))
    return DENY if result["decision"] == "deny" else ALLOW


if __name__ == "__main__":
    raise SystemExit(main())
