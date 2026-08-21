#!/usr/bin/env python3
"""Verify declared agent tool policy against effective provider/runtime tools.

Input JSON example:
{
  "mode": "interactive",
  "allowlist_present": true,
  "allowlist": [],
  "denylist": [],
  "known_tools": ["read_file", "write_file", "terminal"],
  "provider_visible_tools": [],
  "runtime_executable_tools": []
}

Exit codes: 0=pass, 2=invalid input/config, 3=policy violation.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

PASS, INVALID, VIOLATION = 0, 2, 3


def load_object(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def string_set(data: dict, key: str) -> set[str]:
    value = data.get(key, [])
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{key} must be an array of non-empty strings")
    if len(value) != len(set(value)):
        raise ValueError(f"{key} contains duplicates")
    return set(value)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--config", required=True, type=Path)
    args = parser.parse_args()
    try:
        data = load_object(args.input)
        cfg = load_object(args.config)
        present = data.get("allowlist_present")
        if not isinstance(present, bool):
            raise ValueError("allowlist_present must be boolean")
        mode = data.get("mode")
        if not isinstance(mode, str) or not mode.strip():
            raise ValueError("mode must be a non-empty string")
        known = string_set(data, "known_tools")
        allow = string_set(data, "allowlist")
        deny = string_set(data, "denylist")
        provider = string_set(data, "provider_visible_tools")
        runtime = string_set(data, "runtime_executable_tools")
        if present and not allow.issubset(known):
            unknown = sorted(allow - known)
            if cfg.get("fail_closed_on_unknown_tool", True):
                raise ValueError(f"allowlist contains unknown tools: {unknown}")
        unknown_deny = deny - known
        if unknown_deny and cfg.get("fail_closed_on_unknown_tool", True):
            raise ValueError(f"denylist contains unknown tools: {sorted(unknown_deny)}")
        if present:
            allowed = set(allow)
        else:
            missing = cfg.get("semantics", {}).get("missing_allowlist", "all_known_tools")
            if missing != "all_known_tools":
                raise ValueError(f"unsupported missing_allowlist semantics: {missing}")
            allowed = set(known)
        allowed -= deny
        violations: list[str] = []
        extra_provider = provider - allowed
        extra_runtime = runtime - allowed
        if extra_provider:
            violations.append(f"provider exposes forbidden tools: {sorted(extra_provider)}")
        if extra_runtime:
            violations.append(f"runtime exposes forbidden tools: {sorted(extra_runtime)}")
        if cfg.get("require_provider_runtime_consistency", True):
            runtime_only = runtime - provider
            if runtime_only:
                violations.append(f"runtime-executable tools hidden from provider policy view: {sorted(runtime_only)}")
        denied_exposed = (provider | runtime) & deny
        if denied_exposed:
            violations.append(f"denylisted tools remain exposed: {sorted(denied_exposed)}")
        high = set(cfg.get("high_impact_tools", []))
        result = {
            "decision": "block" if violations else "pass",
            "mode": mode,
            "allowlist_present": present,
            "normalized_allowed_tools": sorted(allowed),
            "effective_provider_tools": sorted(provider),
            "effective_runtime_tools": sorted(runtime),
            "high_impact_exposed": sorted((provider | runtime) & high),
            "violations": violations,
        }
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, sort_keys=True))
    return VIOLATION if violations else PASS


if __name__ == "__main__":
    raise SystemExit(main())
