#!/usr/bin/env python3
"""Validate approval-aware tool timing and report phase attribution.

Input is JSONL. Required fields per record:
  call_id, approval_required, requested_ms, execution_start_ms, execution_end_ms
Approval-gated calls additionally require approval_required_ms and approval_decision_ms.
Optional: postprocess_end_ms, baseline_execution_ms.

Exit codes: 0 valid/no configured regression, 2 invalid input/config,
3 timing integrity failure, 4 regression threshold exceeded.
"""
from __future__ import annotations

import argparse
import json
import statistics
import sys
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("policy must be a JSON object")
    return value


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read trace {path}: {exc}") from exc
    rows: list[dict[str, Any]] = []
    for number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {number}: invalid JSON: {exc}") from exc
        if not isinstance(row, dict):
            raise ValueError(f"line {number}: record must be an object")
        rows.append(row)
    if not rows:
        raise ValueError("trace contains no records")
    return rows


def number(row: dict[str, Any], key: str, required: bool = True) -> float | None:
    value = row.get(key)
    if value is None and not required:
        return None
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise ValueError(f"{key} must be numeric")
    return float(value)


def percentile(values: list[float], p: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    index = (len(ordered) - 1) * p
    lo = int(index)
    hi = min(lo + 1, len(ordered) - 1)
    fraction = index - lo
    return ordered[lo] * (1 - fraction) + ordered[hi] * fraction


def analyze(rows: list[dict[str, Any]], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    skew = float(policy.get("max_clock_skew_ms", 50))
    threshold = float(policy.get("regression_threshold_percent", 20.0))
    min_samples = int(policy.get("minimum_samples", 5))
    if skew < 0 or threshold < 0 or min_samples < 1:
        raise ValueError("policy thresholds are invalid")

    reports: list[dict[str, Any]] = []
    execution_values: list[float] = []
    approval_values: list[float] = []
    baseline_values: list[float] = []
    violations: list[str] = []

    for index, row in enumerate(rows, 1):
        call_id = row.get("call_id")
        if not isinstance(call_id, str) or not call_id:
            raise ValueError(f"record {index}: call_id required")
        approval_required = row.get("approval_required")
        if not isinstance(approval_required, bool):
            raise ValueError(f"record {index}: approval_required must be boolean")
        requested = number(row, "requested_ms")
        exec_start = number(row, "execution_start_ms")
        exec_end = number(row, "execution_end_ms")
        post_end = number(row, "postprocess_end_ms", required=False)
        baseline = number(row, "baseline_execution_ms", required=False)

        approval_wait = 0.0
        decision = None
        required_at = None
        if approval_required:
            required_at = number(row, "approval_required_ms")
            decision = number(row, "approval_decision_ms")
            if required_at + skew < requested:
                violations.append(f"{call_id}: approval_required precedes request")
            if decision + skew < required_at:
                violations.append(f"{call_id}: approval_decision precedes approval_required")
            if exec_start + skew < decision:
                violations.append(f"{call_id}: execution starts before approval decision")
            approval_wait = max(0.0, decision - required_at)
            approval_values.append(approval_wait)
        else:
            if exec_start + skew < requested:
                violations.append(f"{call_id}: execution starts before request")

        if exec_end + skew < exec_start:
            violations.append(f"{call_id}: execution ends before it starts")
        if post_end is not None and post_end + skew < exec_end:
            violations.append(f"{call_id}: postprocess ends before execution")

        execution = max(0.0, exec_end - exec_start)
        postprocess = max(0.0, (post_end if post_end is not None else exec_end) - exec_end)
        total = max(0.0, (post_end if post_end is not None else exec_end) - requested)
        execution_values.append(execution)
        if baseline is not None:
            baseline_values.append(baseline)
        reports.append({
            "call_id": call_id,
            "approval_required": approval_required,
            "approval_wait_ms": round(approval_wait, 3),
            "tool_execution_ms": round(execution, 3),
            "postprocess_ms": round(postprocess, 3),
            "total_wall_ms": round(total, 3),
        })

    summary: dict[str, Any] = {
        "valid": not violations,
        "violations": violations,
        "samples": len(rows),
        "tool_execution_ms": {
            "mean": round(statistics.fmean(execution_values), 3),
            "p50": round(percentile(execution_values, 0.50), 3),
            "p95": round(percentile(execution_values, 0.95), 3),
        },
        "approval_wait_ms": {
            "mean": round(statistics.fmean(approval_values), 3) if approval_values else 0.0,
            "p50": round(percentile(approval_values, 0.50), 3) if approval_values else 0.0,
            "p95": round(percentile(approval_values, 0.95), 3) if approval_values else 0.0,
        },
        "records": reports,
    }

    exit_code = 0
    if violations:
        exit_code = 3
    if baseline_values and len(rows) >= min_samples:
        baseline_mean = statistics.fmean(baseline_values)
        current_mean = statistics.fmean(execution_values)
        change = 0.0 if baseline_mean == 0 else ((current_mean - baseline_mean) / baseline_mean) * 100
        summary["baseline_execution_mean_ms"] = round(baseline_mean, 3)
        summary["execution_change_percent"] = round(change, 3)
        summary["regression"] = change > threshold
        if change > threshold and exit_code == 0:
            exit_code = 4
    else:
        summary["regression"] = None
        summary["regression_note"] = "baseline absent or minimum sample count not met"
    return summary, exit_code


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("trace", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        report, code = analyze(load_jsonl(args.trace), load_json(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"valid": False, "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return code if args.strict else (3 if code == 3 else 0)


if __name__ == "__main__":
    raise SystemExit(main())
