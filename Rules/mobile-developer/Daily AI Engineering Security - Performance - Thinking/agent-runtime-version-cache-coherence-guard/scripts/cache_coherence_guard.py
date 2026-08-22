#!/usr/bin/env python3
"""Pre-resume prompt-cache coherence gate.

Input JSON contains `previous`, `current`, `estimated_context_tokens`, and optional
`rebaseline_reason`. Exit codes: 0 allow, 3 rebaseline required, 4 block, 2 invalid.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

ALLOW, INVALID, REBASELINE, BLOCK = 0, 2, 3, 4


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def version_tuple(value: str) -> tuple[int, ...]:
    nums = re.findall(r"\d+", value)
    return tuple(int(x) for x in nums[:3]) if nums else ()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    args = parser.parse_args()
    try:
        data, policy = load(args.input), load(args.policy)
        previous, current = data.get("previous"), data.get("current")
        if not isinstance(previous, dict) or not isinstance(current, dict):
            raise ValueError("previous and current must be objects")
        estimated = data.get("estimated_context_tokens", 0)
        if not isinstance(estimated, int) or isinstance(estimated, bool) or estimated < 0:
            raise ValueError("estimated_context_tokens must be a non-negative integer")
        fields = policy.get("fingerprint_fields", [])
        if not isinstance(fields, list) or not all(isinstance(x, str) for x in fields):
            raise ValueError("fingerprint_fields must be a string array")
        missing = [f for f in fields if f not in previous or f not in current]
        if missing:
            raise ValueError("missing fingerprint fields: " + ", ".join(missing))
        mismatches = []
        for field in fields:
            if previous[field] != current[field]:
                mismatches.append({"field": field, "previous": previous[field], "current": current[field]})
        if policy.get("allow_version_patch_drift", False):
            mismatches = [m for m in mismatches if not (
                m["field"] == "client_version" and
                version_tuple(str(m["previous"]))[:2] == version_tuple(str(m["current"]))[:2]
            )]
        critical = set()
        if policy.get("require_same_model", True): critical.add("model")
        if policy.get("require_same_entrypoint", True): critical.add("entrypoint")
        if policy.get("require_same_client_major_minor", True): critical.add("client_version")
        critical_mismatch = [m for m in mismatches if m["field"] in critical]
        threshold = int(policy.get("max_predicted_rewrite_tokens", 200000))
        min_context = int(policy.get("min_context_tokens_for_blocking", 100000))
        reason = data.get("rebaseline_reason")
        reason_ok = isinstance(reason, str) and bool(reason.strip())
        large = estimated >= min_context and estimated >= threshold
        if not mismatches:
            decision, code = "allow", ALLOW
        elif large and critical_mismatch and policy.get("require_reason_for_rebaseline", True) and not reason_ok:
            decision, code = "block", BLOCK
        else:
            decision, code = "rebaseline_required", REBASELINE
        print(json.dumps({
            "decision": decision,
            "estimated_rewrite_tokens": estimated if mismatches else 0,
            "mismatches": mismatches,
            "critical_mismatches": critical_mismatch,
            "rebaseline_reason_present": reason_ok
        }, indent=2))
        return code
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
