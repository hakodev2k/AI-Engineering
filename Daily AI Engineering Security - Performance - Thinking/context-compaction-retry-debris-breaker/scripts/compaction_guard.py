#!/usr/bin/env python3
"""Deterministic pre-compaction gate.

Input JSON example:
{
  "retry_number": 1,
  "strategy": "drop-retry-debris",
  "previous_strategy": "raw-middle-summary",
  "previous_failed_chars": 140000,
  "items": [{"kind":"user","chars":1000},{"kind":"assistant","chars":2000}],
  "previous_verified_summary_available": true
}

Exit codes: 0 allow, 2 invalid input/config, 3 block in --strict mode.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Any


def read_obj(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def analyze(candidate: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    items = candidate.get("items")
    if not isinstance(items, list) or not items:
        raise ValueError("items must be a non-empty list")
    excluded = set(policy.get("exclude_kinds", []))
    total = 0
    bad_kinds: list[str] = []
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            raise ValueError(f"items[{i}] must be an object")
        kind = item.get("kind")
        chars = item.get("chars")
        if not isinstance(kind, str) or not kind:
            raise ValueError(f"items[{i}].kind is required")
        if not isinstance(chars, int) or chars < 0:
            raise ValueError(f"items[{i}].chars must be a non-negative integer")
        total += chars
        if kind in excluded:
            bad_kinds.append(kind)

    ceiling = int(policy.get("max_compaction_input_chars", 0))
    max_retries = int(policy.get("max_retries", 0))
    min_reduction = float(policy.get("min_payload_reduction_ratio", 0.0))
    retry = candidate.get("retry_number", 0)
    if not isinstance(retry, int) or retry < 0:
        raise ValueError("retry_number must be a non-negative integer")
    if ceiling <= 0 or max_retries < 0 or not 0 <= min_reduction < 1:
        raise ValueError("invalid policy limits")

    violations: list[str] = []
    if total > ceiling:
        violations.append("compaction_input_exceeds_ceiling")
    if bad_kinds:
        violations.append("excluded_retry_or_debug_debris_present")
    if retry > max_retries:
        violations.append("retry_budget_exhausted")

    previous = candidate.get("previous_failed_chars")
    strategy = candidate.get("strategy")
    previous_strategy = candidate.get("previous_strategy")
    reduction_ratio = None
    if retry > 0:
        if not isinstance(previous, int) or previous <= 0:
            raise ValueError("previous_failed_chars must be positive for retries")
        reduction_ratio = (previous - total) / previous
        strategy_changed = isinstance(strategy, str) and strategy and strategy != previous_strategy
        if reduction_ratio < min_reduction and not strategy_changed:
            violations.append("retry_not_materially_different")

    if policy.get("require_previous_summary_continuity", True) and retry > 0:
        if candidate.get("previous_verified_summary_available") is not True:
            violations.append("previous_verified_summary_unavailable")

    return {
        "decision": "block" if violations else "allow",
        "total_chars": total,
        "ceiling_chars": ceiling,
        "retry_number": retry,
        "reduction_ratio": reduction_ratio,
        "excluded_kinds_found": sorted(set(bad_kinds)),
        "violations": violations,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("candidate", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        report = analyze(read_obj(args.candidate), read_obj(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 3 if args.strict and report["decision"] == "block" else 0


if __name__ == "__main__":
    raise SystemExit(main())
