#!/usr/bin/env python3
"""Deterministic MCP argument preflight and retry-budget gate.

Usage:
  python scripts/mcp_preflight.py request.json --policy config/policy.json

Input request JSON:
{
  "tool_name": "example",
  "schema": {"type":"object", ...},
  "arguments": {...},
  "prior_invalid_fingerprints": ["..."],
  "requested_timeout_seconds": 120
}

Exit codes:
  0 allow dispatch
  2 invalid input/policy
  3 repair required (known schema violation)
  4 identical invalid retry budget exhausted
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def type_ok(value: Any, expected: str) -> bool:
    checks = {
        "object": lambda v: isinstance(v, dict),
        "array": lambda v: isinstance(v, list),
        "string": lambda v: isinstance(v, str),
        "number": lambda v: isinstance(v, (int, float)) and not isinstance(v, bool),
        "integer": lambda v: isinstance(v, int) and not isinstance(v, bool),
        "boolean": lambda v: isinstance(v, bool),
        "null": lambda v: v is None,
    }
    return checks.get(expected, lambda _v: True)(value)


def validate(value: Any, schema: Any, path: str = "$") -> list[dict[str, str]]:
    if not isinstance(schema, dict):
        return []
    errors: list[dict[str, str]] = []

    if schema.get("nullable") is True and value is None:
        return errors

    expected = schema.get("type")
    if isinstance(expected, str) and not type_ok(value, expected):
        return [{"path": path, "constraint": "type", "message": f"expected {expected}"}]
    if isinstance(expected, list) and not any(isinstance(t, str) and type_ok(value, t) for t in expected):
        return [{"path": path, "constraint": "type", "message": f"expected one of {expected}"}]

    if "enum" in schema and value not in schema["enum"]:
        errors.append({"path": path, "constraint": "enum", "message": "value is not in enum"})
    if "const" in schema and value != schema["const"]:
        errors.append({"path": path, "constraint": "const", "message": "value does not equal const"})

    if isinstance(value, dict):
        props = schema.get("properties", {}) if isinstance(schema.get("properties", {}), dict) else {}
        required = schema.get("required", []) if isinstance(schema.get("required", []), list) else []
        for key in required:
            if isinstance(key, str) and key not in value:
                errors.append({"path": f"{path}.{key}", "constraint": "required", "message": "required property missing"})
        if schema.get("additionalProperties") is False:
            for key in value:
                if key not in props:
                    errors.append({"path": f"{path}.{key}", "constraint": "additionalProperties", "message": "unexpected property"})
        for key, child in value.items():
            if key in props:
                errors.extend(validate(child, props[key], f"{path}.{key}"))

    if isinstance(value, list) and isinstance(schema.get("items"), dict):
        for i, item in enumerate(value):
            errors.extend(validate(item, schema["items"], f"{path}[{i}]"))

    if isinstance(value, str):
        if isinstance(schema.get("minLength"), int) and len(value) < schema["minLength"]:
            errors.append({"path": path, "constraint": "minLength", "message": "string too short"})
        if isinstance(schema.get("maxLength"), int) and len(value) > schema["maxLength"]:
            errors.append({"path": path, "constraint": "maxLength", "message": "string too long"})
        pattern = schema.get("pattern")
        if isinstance(pattern, str):
            try:
                if re.search(pattern, value) is None:
                    errors.append({"path": path, "constraint": "pattern", "message": "string does not match pattern"})
            except re.error:
                pass

    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if isinstance(schema.get("minimum"), (int, float)) and value < schema["minimum"]:
            errors.append({"path": path, "constraint": "minimum", "message": "number below minimum"})
        if isinstance(schema.get("maximum"), (int, float)) and value > schema["maximum"]:
            errors.append({"path": path, "constraint": "maximum", "message": "number above maximum"})

    return errors


def fingerprint(tool_name: str, arguments: Any, errors: list[dict[str, str]]) -> str:
    payload = json.dumps({"tool": tool_name, "arguments": arguments, "errors": errors}, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("request", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        request = load_json(args.request)
        policy = load_json(args.policy)
        tool = request.get("tool_name")
        arguments = request.get("arguments")
        schema = request.get("schema")
        if not isinstance(tool, str) or not tool.strip():
            raise ValueError("tool_name must be a non-empty string")
        if not isinstance(arguments, dict):
            raise ValueError("arguments must be a JSON object")
        prior = request.get("prior_invalid_fingerprints", [])
        if not isinstance(prior, list) or not all(isinstance(x, str) for x in prior):
            raise ValueError("prior_invalid_fingerprints must be an array of strings")

        requested_timeout = request.get("requested_timeout_seconds", policy.get("default_timeout_seconds", 60))
        if not isinstance(requested_timeout, (int, float)) or isinstance(requested_timeout, bool) or requested_timeout <= 0:
            raise ValueError("requested_timeout_seconds must be positive")
        timeout = min(float(requested_timeout), float(policy.get("max_timeout_seconds", 600)))

        if not isinstance(schema, dict) or not schema:
            decision = "allow" if policy.get("fail_open_when_schema_unavailable", True) else "repair_required"
            result = {"decision": decision, "tool_name": tool, "timeout_seconds": timeout, "schema_status": "unavailable", "errors": []}
            print(json.dumps(result, indent=2))
            return 0 if decision == "allow" else 3

        errors = validate(arguments, schema)
        fp = fingerprint(tool, arguments, errors) if errors else None
        if errors:
            max_retries = int(policy.get("max_identical_invalid_retries", 1))
            seen = sum(1 for x in prior if x == fp)
            if seen >= max_retries:
                print(json.dumps({"decision": "block_retry", "tool_name": tool, "failure_fingerprint": fp, "errors": errors}, indent=2))
                return 4
            print(json.dumps({"decision": "repair_required", "tool_name": tool, "failure_fingerprint": fp, "errors": errors, "dispatch": False}, indent=2))
            return 3

        print(json.dumps({"decision": "allow", "tool_name": tool, "arguments": arguments, "timeout_seconds": timeout, "dispatch": True, "errors": []}, indent=2))
        return 0
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
