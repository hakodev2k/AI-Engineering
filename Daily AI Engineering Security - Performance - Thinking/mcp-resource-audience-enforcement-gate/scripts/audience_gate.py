#!/usr/bin/env python3
"""Fail-closed authorization gate for already-verified OAuth claims.

Input record JSON must contain:
  claims_verified: true only when upstream cryptographic verification succeeded
  issuer: string
  audience: string or list[string]
  resource: canonical MCP resource URI associated with the token/request
  scopes: list[string] or space-delimited string
  operation: string

This script does not decode or verify JWT signatures. Feed it only claims emitted by
trusted authentication middleware. Exit: 0 allow, 2 invalid input/config, 5 deny.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOW, INVALID, DENY = 0, 2, 5


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def audiences(value: Any) -> set[str]:
    if isinstance(value, str) and value:
        return {value}
    if isinstance(value, list) and all(isinstance(x, str) and x for x in value):
        return set(value)
    raise ValueError("audience must be a non-empty string or list of non-empty strings")


def scopes(value: Any) -> set[str]:
    if isinstance(value, str):
        return {x for x in value.split() if x}
    if isinstance(value, list) and all(isinstance(x, str) and x for x in value):
        return set(value)
    raise ValueError("scopes must be a space-delimited string or list of strings")


def decide(record: dict[str, Any], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    required_keys = ("claims_verified", "issuer", "audience", "resource", "scopes", "operation")
    missing = [k for k in required_keys if k not in record]
    if missing:
        raise ValueError("missing fields: " + ", ".join(missing))

    canonical = policy.get("canonical_resource")
    if not isinstance(canonical, str) or not canonical.startswith(("https://", "http://")) or "#" in canonical:
        raise ValueError("policy canonical_resource must be an absolute http(s) URI without fragment")
    allowed_issuers = policy.get("allowed_issuers")
    allowed_audiences = policy.get("allowed_audiences")
    if not isinstance(allowed_issuers, list) or not all(isinstance(x, str) and x for x in allowed_issuers):
        raise ValueError("allowed_issuers must be a list of strings")
    if not isinstance(allowed_audiences, list) or not all(isinstance(x, str) and x for x in allowed_audiences):
        raise ValueError("allowed_audiences must be a list of strings")

    violations: list[str] = []
    if policy.get("require_verified_claims", True) and record["claims_verified"] is not True:
        violations.append("claims_not_cryptographically_verified")
    if record.get("issuer") not in allowed_issuers:
        violations.append("issuer_not_allowed")
    token_audiences = audiences(record.get("audience"))
    if not token_audiences.intersection(set(allowed_audiences)):
        violations.append("audience_not_allowed")
    resource = record.get("resource")
    if not isinstance(resource, str) or not resource:
        raise ValueError("resource must be a non-empty string")
    if policy.get("require_exact_resource_match", True):
        if resource != canonical:
            violations.append("resource_mismatch")
    elif not resource.startswith(canonical):
        violations.append("resource_outside_allowed_prefix")

    operation = record.get("operation")
    if not isinstance(operation, str) or not operation:
        raise ValueError("operation must be a non-empty string")
    required_map = policy.get("required_scopes_by_operation", {})
    if not isinstance(required_map, dict):
        raise ValueError("required_scopes_by_operation must be an object")
    required = required_map.get(operation, [])
    if not isinstance(required, list) or not all(isinstance(x, str) and x for x in required):
        raise ValueError(f"scope policy for {operation} must be a list of strings")
    granted = scopes(record.get("scopes"))
    missing_scopes = sorted(set(required) - granted)
    if missing_scopes:
        violations.append("missing_required_scope")

    result = {
        "decision": "deny" if violations else "allow",
        "operation": operation,
        "resource_matches": resource == canonical,
        "missing_scopes": missing_scopes,
        "violations": violations,
    }
    return result, DENY if violations else ALLOW


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("record", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    args = ap.parse_args()
    try:
        result, code = decide(load(args.record), load(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, ensure_ascii=False, sort_keys=True))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
