#!/usr/bin/env python3
"""Validate redacted MCP OAuth issuer/resource binding evidence.

Exit codes: 0 allow, 2 invalid input, 4 reauthorization required, 5 deny.
No token/code/secret values are accepted or emitted.
"""
from __future__ import annotations
import argparse
import json
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

ALLOW, INVALID, REAUTHORIZE, DENY = 0, 2, 4, 5
FORBIDDEN_KEYS = {"access_token", "refresh_token", "authorization_code", "code", "client_secret", "pkce_verifier"}


def load_object(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def valid_url(value: object) -> bool:
    if not isinstance(value, str) or not value:
        return False
    parsed = urlparse(value)
    return parsed.scheme in {"https", "http"} and bool(parsed.hostname)


def reject_secret_keys(value: object, prefix: str = "") -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            if key.lower() in FORBIDDEN_KEYS:
                raise ValueError(f"secret-bearing field is forbidden: {prefix}{key}")
            reject_secret_keys(child, prefix + key + ".")
    elif isinstance(value, list):
        for i, child in enumerate(value):
            reject_secret_keys(child, f"{prefix}{i}.")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        data, policy = load_object(args.input), load_object(args.policy)
        reject_secret_keys(data)
        expected_issuer = data.get("expected_issuer")
        observed_issuer = data.get("observed_issuer")
        expected_resource = data.get("expected_resource")
        observed_resource = data.get("observed_resource")
        credential_has_provenance = data.get("credential_has_provenance", False)
        issuer_changed = data.get("issuer_changed", False)
        callback_started_at = data.get("callback_started_at_epoch")

        for name, value in (("expected_issuer", expected_issuer), ("observed_issuer", observed_issuer), ("expected_resource", expected_resource), ("observed_resource", observed_resource)):
            if not valid_url(value):
                raise ValueError(f"{name} must be an absolute http(s) URL")
        if not isinstance(credential_has_provenance, bool) or not isinstance(issuer_changed, bool):
            raise ValueError("credential_has_provenance and issuer_changed must be booleans")
        if callback_started_at is not None and not isinstance(callback_started_at, (int, float)):
            raise ValueError("callback_started_at_epoch must be numeric when present")

        findings: list[str] = []
        if callback_started_at is not None:
            age = time.time() - float(callback_started_at)
            if age < -30 or age > int(policy.get("max_callback_age_seconds", 600)):
                findings.append("callback age outside policy")
        if policy.get("require_issuer_binding", True) and expected_issuer.rstrip("/") != observed_issuer.rstrip("/"):
            findings.append("issuer mismatch")
        if policy.get("require_resource_binding", True) and expected_resource.rstrip("/") != observed_resource.rstrip("/"):
            findings.append("resource/audience mismatch")
        if issuer_changed and policy.get("invalidate_on_issuer_change", True):
            findings.append("issuer relationship changed")

        if findings:
            result = {"decision": "deny", "findings": findings}
            code = DENY
        elif not credential_has_provenance:
            mode = policy.get("legacy_credentials_without_provenance", "reauthorize")
            if mode == "reauthorize":
                result = {"decision": "reauthorize", "findings": ["credential lacks issuer/resource provenance"]}
                code = REAUTHORIZE
            else:
                result = {"decision": "deny", "findings": ["credential lacks issuer/resource provenance"]}
                code = DENY
        else:
            result = {"decision": "allow", "findings": []}
            code = ALLOW
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
