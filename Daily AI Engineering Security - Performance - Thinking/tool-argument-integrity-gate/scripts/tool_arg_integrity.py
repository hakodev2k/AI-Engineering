#!/usr/bin/env python3
"""Schema-aware detector for silently corrupted parsed tool arguments.

Input call format:
  {"tool": "remember", "arguments": {"content": "...", "reason": null}}

Policy format:
  {
    "tools": {
      "remember": {
        "properties": {"content": "string", "reason": "string"},
        "required": ["content"],
        "critical": ["reason"],
        "allow_transport_markup": false
      }
    }
  }
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

PARAM_RE = re.compile(r"<parameter\s+name\s*=\s*(['\"])([^'\"]+)\1\s*>", re.IGNORECASE)
INVOKE_END_RE = re.compile(r"</invoke\s*>", re.IGNORECASE)
PARAM_END_RE = re.compile(r"</parameter\s*>", re.IGNORECASE)


def read_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def type_ok(value: Any, expected: str) -> bool:
    if value is None:
        return True
    return {
        "string": isinstance(value, str),
        "integer": isinstance(value, int) and not isinstance(value, bool),
        "number": isinstance(value, (int, float)) and not isinstance(value, bool),
        "boolean": isinstance(value, bool),
        "object": isinstance(value, dict),
        "array": isinstance(value, list),
    }.get(expected, True)


def validate_policy(policy: Any, tool: str) -> dict[str, Any]:
    if not isinstance(policy, dict) or not isinstance(policy.get("tools"), dict):
        raise ValueError("policy must contain object field 'tools'")
    cfg = policy["tools"].get(tool)
    if not isinstance(cfg, dict):
        raise ValueError(f"no policy for tool {tool!r}")
    props = cfg.get("properties", {})
    required = cfg.get("required", [])
    critical = cfg.get("critical", [])
    if not isinstance(props, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in props.items()):
        raise ValueError("properties must map field names to simple type names")
    if not isinstance(required, list) or not all(isinstance(x, str) for x in required):
        raise ValueError("required must be an array of field names")
    if not isinstance(critical, list) or not all(isinstance(x, str) for x in critical):
        raise ValueError("critical must be an array of field names")
    unknown = (set(required) | set(critical)) - set(props)
    if unknown:
        raise ValueError(f"required/critical fields missing from properties: {sorted(unknown)}")
    cfg = dict(cfg)
    cfg["properties"] = props
    cfg["required"] = required
    cfg["critical"] = critical
    cfg["allow_transport_markup"] = bool(cfg.get("allow_transport_markup", False))
    return cfg


def inspect_call(call: Any, policy: Any) -> dict[str, Any]:
    if not isinstance(call, dict) or not isinstance(call.get("tool"), str) or not isinstance(call.get("arguments"), dict):
        raise ValueError("call must contain string 'tool' and object 'arguments'")
    tool = call["tool"]
    args = call["arguments"]
    cfg = validate_policy(policy, tool)
    props: dict[str, str] = cfg["properties"]
    reasons: list[str] = []
    residue_fields: set[str] = set()
    missing_declared: set[str] = set()
    missing_critical: set[str] = set()
    type_errors: set[str] = set()

    for field in cfg["required"]:
        if field not in args or args[field] is None:
            reasons.append("MISSING_REQUIRED")
            missing_declared.add(field)
    for field in cfg["critical"]:
        if field not in args or args[field] is None:
            reasons.append("MISSING_CRITICAL")
            missing_critical.add(field)

    for field, expected in props.items():
        if field in args and not type_ok(args[field], expected):
            reasons.append("TYPE_MISMATCH")
            type_errors.add(field)

    for host_field, value in args.items():
        if not isinstance(value, str):
            continue
        embedded = [m.group(2) for m in PARAM_RE.finditer(value)]
        for sibling in embedded:
            if sibling in props and sibling != host_field and (sibling not in args or args[sibling] is None):
                reasons.append("SWALLOWED_SIBLING")
                residue_fields.add(host_field)
                missing_declared.add(sibling)
        if not cfg["allow_transport_markup"] and (INVOKE_END_RE.search(value) or PARAM_END_RE.search(value)):
            reasons.append("TRANSPORT_BOUNDARY_RESIDUE")
            residue_fields.add(host_field)

    reason_codes = sorted(set(reasons))
    return {
        "tool": tool,
        "decision": "BLOCK" if reason_codes else "ALLOW",
        "reason_codes": reason_codes,
        "residue_fields": sorted(residue_fields),
        "missing_declared_fields": sorted(missing_declared),
        "missing_critical_fields": sorted(missing_critical),
        "type_error_fields": sorted(type_errors),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--call", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = inspect_call(read_json(args.call), read_json(args.policy))
    except ValueError as exc:
        print(json.dumps({"decision": "BLOCK", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return 3 if result["decision"] == "BLOCK" else 0


if __name__ == "__main__":
    raise SystemExit(main())
