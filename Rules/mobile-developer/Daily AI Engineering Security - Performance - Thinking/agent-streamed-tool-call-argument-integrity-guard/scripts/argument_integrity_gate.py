#!/usr/bin/env python3
"""Fail-closed gate for streamed tool-call arguments.

Input JSON fields:
 tool, raw_arguments, stream_complete, repair, schema_required, executed, retry_count
Exit codes: 0 allow, 3 retry, 4 block, 2 invalid input.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

ALLOW, INVALID, RETRY, BLOCK = 0, 2, 3, 4


def load(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("input/policy must be JSON objects")
    return data


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("input", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ns = ap.parse_args()
    try:
        d, p = load(ns.input), load(ns.policy)
        tool = d.get("tool")
        raw = d.get("raw_arguments")
        complete = d.get("stream_complete")
        repair = d.get("repair", "none")
        required = d.get("schema_required", [])
        executed = d.get("executed", False)
        retry_count = d.get("retry_count", 0)
        if not isinstance(tool, str) or not tool:
            raise ValueError("tool must be a non-empty string")
        if not isinstance(raw, str):
            raise ValueError("raw_arguments must be a string")
        if not isinstance(complete, bool) or not isinstance(executed, bool):
            raise ValueError("stream_complete/executed must be boolean")
        if not isinstance(required, list) or not all(isinstance(x, str) for x in required):
            raise ValueError("schema_required must be an array of strings")
        if not isinstance(retry_count, int) or retry_count < 0:
            raise ValueError("retry_count must be a non-negative integer")

        stripped = raw.strip()
        parsed = None
        parse_error = None
        if stripped:
            try:
                parsed = json.loads(stripped)
            except json.JSONDecodeError as exc:
                parse_error = str(exc)
        else:
            parsed = {}

        side = tool in set(p.get("side_effecting_tools", []))
        lossy = repair in {"substituted_empty_object", "truncated", "lossy"}
        legitimate_empty = (not stripped) and not required and p.get("allow_empty_object_for_zero_required_fields", True)
        integrity_bad = (not complete) or lossy or parse_error is not None
        findings = []
        if not complete:
            findings.append("stream_incomplete")
        if lossy:
            findings.append("lossy_repair")
        if parse_error:
            findings.append("invalid_json")

        if legitimate_empty and complete and not lossy:
            decision, code, canonical = "allow", ALLOW, {}
        elif integrity_bad and side:
            max_retries = int(p.get("max_retries_before_execution", 2))
            if not executed and retry_count < max_retries:
                decision, code, canonical = "retry", RETRY, None
            else:
                decision, code, canonical = "block", BLOCK, None
        elif parse_error:
            decision, code, canonical = "block", BLOCK, None
        else:
            decision, code, canonical = "allow", ALLOW, parsed

        out = {
            "decision": decision,
            "tool": tool,
            "side_effecting": side,
            "raw_sha256": hashlib.sha256(raw.encode()).hexdigest(),
            "raw_bytes": len(raw.encode()),
            "stream_complete": complete,
            "repair": repair,
            "findings": findings,
            "canonical_arguments": canonical,
            "retry_count": retry_count
        }
        print(json.dumps(out, indent=2, sort_keys=True))
        return code
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
