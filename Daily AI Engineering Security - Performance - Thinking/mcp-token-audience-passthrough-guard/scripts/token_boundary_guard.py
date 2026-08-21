#!/usr/bin/env python3
"""Deterministic MCP OAuth boundary policy checker.

This script consumes *validated, sanitized token metadata*. It does not verify JWT
signatures and must never receive raw bearer/refresh tokens.

Input example:
{
  "issuer": "https://auth.example.com/",
  "audience": ["https://mcp.example.com/"],
  "scopes": ["tools.read"],
  "cryptographically_validated": true,
  "outbound_host": "api.example.com",
  "inbound_token_fingerprint": "abc...",
  "outbound_credential_fingerprint": "def...",
  "outbound_credential_source": "oauth-client-credentials"
}
Exit 0 allow, 2 invalid input/config, 3 policy deny.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def as_string_set(value, name: str) -> set[str]:
    if isinstance(value, str):
        return {value}
    if isinstance(value, list) and all(isinstance(x, str) for x in value):
        return set(value)
    raise ValueError(f"{name} must be a string or list of strings")


def evaluate(data: dict, policy: dict) -> dict:
    if data.get("cryptographically_validated") is not True:
        return {"decision": "deny", "reasons": ["cryptographic validation evidence missing"]}

    issuer = data.get("issuer")
    if not isinstance(issuer, str) or not issuer:
        raise ValueError("issuer must be a non-empty string")
    trusted = policy.get("trusted_issuers", [])
    if not isinstance(trusted, list) or not all(isinstance(x, str) for x in trusted):
        raise ValueError("trusted_issuers must be a list of strings")

    resource = policy.get("mcp_resource")
    if not isinstance(resource, str) or not resource:
        raise ValueError("mcp_resource must be a non-empty string")

    reasons: list[str] = []
    if issuer not in trusted:
        reasons.append("issuer not trusted")

    audience = as_string_set(data.get("audience", []), "audience")
    audience_ok = resource in audience
    if policy.get("require_audience", True) and not audience_ok:
        reasons.append("token audience does not include canonical MCP resource")

    scopes = as_string_set(data.get("scopes", []), "scopes")
    required = policy.get("required_scopes", [])
    if not isinstance(required, list) or not all(isinstance(x, str) for x in required):
        raise ValueError("required_scopes must be a list of strings")
    missing = sorted(set(required) - scopes)
    if missing:
        reasons.append("missing required scopes: " + ", ".join(missing))

    outbound_host = data.get("outbound_host")
    if outbound_host is not None:
        if not isinstance(outbound_host, str) or not outbound_host:
            raise ValueError("outbound_host must be a non-empty string when supplied")
        allow_hosts = policy.get("allow_outbound_hosts", [])
        if not isinstance(allow_hosts, list) or not all(isinstance(x, str) for x in allow_hosts):
            raise ValueError("allow_outbound_hosts must be a list of strings")
        if outbound_host not in allow_hosts:
            reasons.append("outbound host is not allowed")

        inbound_fp = data.get("inbound_token_fingerprint")
        outbound_fp = data.get("outbound_credential_fingerprint")
        source = data.get("outbound_credential_source")
        if policy.get("forbid_inbound_token_passthrough", True):
            if not isinstance(inbound_fp, str) or not inbound_fp:
                raise ValueError("inbound_token_fingerprint required for protected egress")
            if not isinstance(outbound_fp, str) or not outbound_fp:
                raise ValueError("outbound_credential_fingerprint required for protected egress")
            if inbound_fp == outbound_fp:
                reasons.append("inbound token fingerprint reused for outbound credential")
            if not isinstance(source, str) or not source.strip():
                reasons.append("outbound credential source not identified")

    return {
        "decision": "allow" if not reasons else "deny",
        "issuer_ok": issuer in trusted,
        "audience_ok": audience_ok,
        "missing_scopes": missing,
        "egress_checked": outbound_host is not None,
        "reasons": reasons,
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    p.add_argument("--policy", type=Path, required=True)
    p.add_argument("--strict", action="store_true")
    args = p.parse_args()
    try:
        result = evaluate(load(args.input), load(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return 3 if args.strict and result["decision"] == "deny" else 0


if __name__ == "__main__":
    raise SystemExit(main())
