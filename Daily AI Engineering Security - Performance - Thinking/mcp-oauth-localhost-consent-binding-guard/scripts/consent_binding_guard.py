#!/usr/bin/env python3
"""Create or verify a one-time MCP OAuth transaction binding.

No secrets are stored. Values such as state, PKCE challenge, browser session, and
client metadata are hashed before persistence. Exit codes: 0 allow/create,
2 invalid input, 4 approval required, 5 deny.
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
from urllib.parse import urlparse

ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def digest(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def nonempty(data: dict, key: str) -> str:
    value = data.get(key)
    if not isinstance(value, str) or not value:
        raise ValueError(f"{key} must be a non-empty string")
    return value


def is_loopback_host(host: str | None, allowed: list[str]) -> bool:
    if not host:
        return False
    if host.lower() in {h.lower() for h in allowed}:
        return True
    try:
        return ipaddress.ip_address(host).is_loopback
    except ValueError:
        return False


def validate_redirect(uri: str, policy: dict) -> tuple[bool, str | None]:
    parsed = urlparse(uri)
    if parsed.fragment:
        return False, "redirect_uri must not contain fragment"
    loopback = is_loopback_host(parsed.hostname, policy.get("allowed_loopback_hosts", []))
    if loopback:
        if parsed.scheme != "http" and parsed.scheme != "https":
            return False, "loopback redirect must use http or https"
    elif policy.get("require_https_non_loopback", True) and parsed.scheme != "https":
        return False, "non-loopback redirect must use https"
    if not parsed.hostname:
        return False, "redirect_uri missing hostname"
    return loopback, None


def create_record(data: dict, policy: dict) -> tuple[dict, int]:
    now = int(time.time())
    redirect = nonempty(data, "redirect_uri")
    loopback, error = validate_redirect(redirect, policy)
    if error:
        return {"decision": "deny", "reason": error}, DENY
    if policy.get("require_pkce_s256", True) and data.get("pkce_method") != "S256":
        return {"decision": "deny", "reason": "PKCE S256 required"}, DENY
    consent = data.get("consent_granted") is True
    if loopback and policy.get("require_explicit_loopback_consent", True) and not consent:
        return {"decision": "approval_required", "reason": "explicit loopback consent required"}, APPROVAL
    if loopback and policy.get("require_attestation_for_loopback", False) and not data.get("attestation_verified"):
        return {"decision": "deny", "reason": "loopback attestation required"}, DENY
    ttl = int(policy.get("transaction_ttl_seconds", 300))
    if ttl < 30 or ttl > 3600:
        raise ValueError("transaction_ttl_seconds must be between 30 and 3600")
    record = {
        "record_version": 1,
        "transaction_id": secrets.token_urlsafe(18),
        "created_at": now,
        "expires_at": now + ttl,
        "used": False,
        "client_id": nonempty(data, "client_id"),
        "client_metadata_sha256": digest(nonempty(data, "client_metadata")),
        "redirect_uri": redirect,
        "loopback": loopback,
        "issuer": nonempty(data, "issuer"),
        "resource": nonempty(data, "resource"),
        "scopes": sorted(set(data.get("scopes", []))),
        "pkce_method": nonempty(data, "pkce_method"),
        "pkce_challenge_sha256": digest(nonempty(data, "pkce_challenge")),
        "state_sha256": digest(nonempty(data, "state")),
        "browser_session_sha256": digest(nonempty(data, "browser_session")),
        "consent_granted": consent,
        "attestation_verified": data.get("attestation_verified") is True
    }
    if not all(isinstance(x, str) for x in record["scopes"]):
        raise ValueError("scopes must be strings")
    return {"decision": "created", "record": record}, ALLOW


def verify_record(data: dict, record: dict, policy: dict) -> tuple[dict, int]:
    reasons: list[str] = []
    now = int(time.time())
    if policy.get("require_single_use", True) and record.get("used") is True:
        reasons.append("transaction already used")
    if now > int(record.get("expires_at", 0)):
        reasons.append("transaction expired")
    expected = {
        "client_id": nonempty(data, "client_id"),
        "redirect_uri": nonempty(data, "redirect_uri"),
        "issuer": nonempty(data, "issuer"),
        "resource": nonempty(data, "resource")
    }
    for key, value in expected.items():
        if record.get(key) != value:
            reasons.append(f"{key} mismatch")
    if policy.get("require_client_metadata_hash_match", True):
        if record.get("client_metadata_sha256") != digest(nonempty(data, "client_metadata")):
            reasons.append("client metadata changed")
    if record.get("state_sha256") != digest(nonempty(data, "state")):
        reasons.append("state mismatch")
    if record.get("browser_session_sha256") != digest(nonempty(data, "browser_session")):
        reasons.append("browser session mismatch")
    if record.get("pkce_challenge_sha256") != digest(nonempty(data, "pkce_challenge")):
        reasons.append("PKCE challenge mismatch")
    if sorted(set(data.get("scopes", []))) != record.get("scopes"):
        reasons.append("scope mismatch")
    if record.get("consent_granted") is not True:
        reasons.append("consent not granted")
    decision = "deny" if reasons else "allow"
    if not reasons:
        record["used"] = True
        record["used_at"] = now
    return {"decision": decision, "reasons": reasons, "record": record}, DENY if reasons else ALLOW


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["create", "verify"])
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--record", type=Path)
    args = parser.parse_args()
    try:
        data = load_json(args.input)
        policy = load_json(args.policy)
        if args.mode == "create":
            result, code = create_record(data, policy)
        else:
            if not args.record:
                raise ValueError("--record is required for verify")
            record = load_json(args.record)
            result, code = verify_record(data, record, policy)
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, sort_keys=True))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
