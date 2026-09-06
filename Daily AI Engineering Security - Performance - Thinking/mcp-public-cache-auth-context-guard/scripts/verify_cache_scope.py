#!/usr/bin/env python3
"""Validate MCP cache admission records against authorization-boundary rules.

Input JSON shape:
{
  "responses": [
    {
      "method": "tools/list",
      "authenticated": true,
      "personalized": true,
      "cacheScope": "private",
      "cache_key_fields": ["server_id", "method", "auth_context_hash"],
      "contains_model_instructions": false,
      "server_trust": "approved",
      "public_invariance_verified": false
    }
  ]
}

Exit codes: 0 pass, 1 invalid input/runtime error, 2 policy violation.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ALLOWED_SCOPES = {"public", "private"}
REQUIRED_PRIVATE_KEY_FIELDS = {"server_id", "method", "auth_context_hash"}


def validate_record(record: dict, index: int) -> list[str]:
    errors: list[str] = []
    prefix = f"responses[{index}]"
    method = record.get("method")
    if not isinstance(method, str) or not method.strip():
        errors.append(f"{prefix}: method must be a non-empty string")

    scope = record.get("cacheScope")
    if scope not in ALLOWED_SCOPES:
        errors.append(f"{prefix}: cacheScope must be 'public' or 'private'; ambiguous scope fails closed")
        return errors

    authenticated = bool(record.get("authenticated", False))
    personalized = bool(record.get("personalized", False))
    contains_instructions = bool(record.get("contains_model_instructions", False))
    trust = record.get("server_trust", "untrusted")
    invariance = bool(record.get("public_invariance_verified", False))

    fields = record.get("cache_key_fields", [])
    if not isinstance(fields, list) or not all(isinstance(x, str) for x in fields):
        errors.append(f"{prefix}: cache_key_fields must be a list of strings")
        fields = []
    field_set = set(fields)

    forbidden_secret_names = {"token", "access_token", "refresh_token", "cookie", "api_key", "authorization"}
    secret_fields = sorted(forbidden_secret_names & {x.lower() for x in field_set})
    if secret_fields:
        errors.append(f"{prefix}: raw secret-bearing cache-key fields are forbidden: {', '.join(secret_fields)}")

    if scope == "public":
        if personalized:
            errors.append(f"{prefix}: personalized response cannot use public cache scope")
        if authenticated and not invariance:
            errors.append(f"{prefix}: authenticated public response lacks cross-context invariance evidence")
        if contains_instructions and trust != "approved":
            errors.append(f"{prefix}: untrusted model-visible instructions cannot enter a shared public cache")
    else:
        missing = sorted(REQUIRED_PRIVATE_KEY_FIELDS - field_set)
        if missing:
            errors.append(f"{prefix}: private cache key missing required fields: {', '.join(missing)}")

    return errors


def validate_document(doc: object) -> list[str]:
    if not isinstance(doc, dict):
        return ["root must be a JSON object"]
    responses = doc.get("responses")
    if not isinstance(responses, list) or not responses:
        return ["root.responses must be a non-empty list"]
    errors: list[str] = []
    for i, item in enumerate(responses):
        if not isinstance(item, dict):
            errors.append(f"responses[{i}] must be an object")
            continue
        errors.extend(validate_record(item, i))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate MCP cache authorization boundaries")
    parser.add_argument("assessment", type=Path, help="Path to assessment JSON")
    args = parser.parse_args()
    try:
        raw = args.assessment.read_text(encoding="utf-8")
        doc = json.loads(raw)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"status=ERROR error={exc}", file=sys.stderr)
        return 1

    errors = validate_document(doc)
    if errors:
        print("status=BLOCK")
        for err in errors:
            print(f"- {err}")
        return 2
    print("status=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
