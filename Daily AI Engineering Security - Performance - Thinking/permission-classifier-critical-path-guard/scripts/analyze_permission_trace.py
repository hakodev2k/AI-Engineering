#!/usr/bin/env python3
"""Analyze authorization-path latency from JSONL trace events.

Each line must contain: {"op_id":"...", "event":"...", "ts_ms": 123.0}
Supported events: tool_proposed, classifier_start, classifier_end,
approval_start, approval_end, tool_dispatch, tool_result, classifier_error.
Optional classifier_error lines may include an `error` string.
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from collections import defaultdict, Counter
from pathlib import Path
from typing import Any

EVENTS = {
    "tool_proposed", "classifier_start", "classifier_end", "approval_start",
    "approval_end", "tool_dispatch", "tool_result", "classifier_error"
}


def percentile(values: list[float], p: float) -> float | None:
    if not values:
        return None
    xs = sorted(values)
    if len(xs) == 1:
        return xs[0]
    rank = (len(xs) - 1) * p
    lo = math.floor(rank)
    hi = math.ceil(rank)
    if lo == hi:
        return xs[lo]
    return xs[lo] + (xs[hi] - xs[lo]) * (rank - lo)


def stats(values: list[float]) -> dict[str, float | int | None]:
    return {
        "count": len(values),
        "p50_ms": percentile(values, 0.50),
        "p95_ms": percentile(values, 0.95),
        "p99_ms": percentile(values, 0.99),
        "max_ms": max(values) if values else None,
    }


def read_events(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            if not line.strip():
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as e:
                raise ValueError(f"line {lineno}: invalid JSON: {e}") from e
            if not isinstance(obj, dict):
                raise ValueError(f"line {lineno}: object required")
            op_id = obj.get("op_id")
            event = obj.get("event")
            ts = obj.get("ts_ms")
            if not isinstance(op_id, str) or not op_id:
                raise ValueError(f"line {lineno}: non-empty op_id required")
            if event not in EVENTS:
                raise ValueError(f"line {lineno}: unsupported event {event!r}")
            if not isinstance(ts, (int, float)) or isinstance(ts, bool):
                raise ValueError(f"line {lineno}: numeric ts_ms required")
            rows.append(obj)
    return rows


def analyze(rows: list[dict[str, Any]], classifier_budget: float, dispatch_budget: float) -> dict[str, Any]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        grouped[row["op_id"]].append(row)

    classifier_ms: list[float] = []
    dispatch_gap_ms: list[float] = []
    approval_ms: list[float] = []
    execution_ms: list[float] = []
    end_to_end_ms: list[float] = []
    violations: list[dict[str, Any]] = []
    malformed_ops: list[str] = []
    errors: list[str] = []

    for op_id, events in grouped.items():
        events = sorted(events, key=lambda x: x["ts_ms"])
        first: dict[str, dict[str, Any]] = {}
        seen_counts = Counter(e["event"] for e in events)
        for e in events:
            first.setdefault(e["event"], e)
            if e["event"] == "classifier_error":
                errors.append(str(e.get("error", "<unspecified>")))
        if any(seen_counts[name] > 1 for name in ("classifier_start", "classifier_end", "tool_dispatch", "tool_result")):
            malformed_ops.append(op_id)

        def delta(a: str, b: str) -> float | None:
            if a in first and b in first:
                d = float(first[b]["ts_ms"]) - float(first[a]["ts_ms"])
                if d < 0:
                    malformed_ops.append(op_id)
                    return None
                return d
            return None

        d = delta("classifier_start", "classifier_end")
        if d is not None:
            classifier_ms.append(d)
            if d > classifier_budget:
                violations.append({"op_id": op_id, "type": "classifier_budget", "duration_ms": d})
        d = delta("classifier_end", "tool_dispatch")
        if d is not None:
            dispatch_gap_ms.append(d)
            if d > dispatch_budget:
                violations.append({"op_id": op_id, "type": "dispatch_budget", "duration_ms": d})
        d = delta("approval_start", "approval_end")
        if d is not None:
            approval_ms.append(d)
        d = delta("tool_dispatch", "tool_result")
        if d is not None:
            execution_ms.append(d)
        d = delta("tool_proposed", "tool_result")
        if d is not None:
            end_to_end_ms.append(d)

    error_counts = Counter(errors)
    repeated_errors = [
        {"error": err, "count": count}
        for err, count in error_counts.most_common()
        if count > 1
    ]

    classifier_total = sum(classifier_ms)
    e2e_total = sum(end_to_end_ms)
    return {
        "operations": len(grouped),
        "classifier": stats(classifier_ms),
        "dispatch_gap": stats(dispatch_gap_ms),
        "manual_approval": stats(approval_ms),
        "tool_execution": stats(execution_ms),
        "end_to_end": stats(end_to_end_ms),
        "classifier_share_of_observed_e2e": (classifier_total / e2e_total) if e2e_total > 0 else None,
        "violations": violations,
        "repeated_classifier_errors": repeated_errors,
        "malformed_ops": sorted(set(malformed_ops)),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("trace", help="JSONL trace path")
    parser.add_argument("--classifier-budget-ms", type=float, default=30000.0)
    parser.add_argument("--dispatch-budget-ms", type=float, default=5000.0)
    args = parser.parse_args()
    if args.classifier_budget_ms <= 0 or args.dispatch_budget_ms <= 0:
        print("budgets must be > 0", file=sys.stderr)
        return 2
    path = Path(args.trace)
    if not path.is_file():
        print(f"trace not found: {path}", file=sys.stderr)
        return 2
    try:
        rows = read_events(path)
        if not rows:
            raise ValueError("trace contains no events")
        report = analyze(rows, args.classifier_budget_ms, args.dispatch_budget_ms)
    except (OSError, ValueError) as e:
        print(str(e), file=sys.stderr)
        return 2
    print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))
    if report["malformed_ops"]:
        return 2
    return 1 if report["violations"] else 0


if __name__ == "__main__":
    sys.exit(main())
