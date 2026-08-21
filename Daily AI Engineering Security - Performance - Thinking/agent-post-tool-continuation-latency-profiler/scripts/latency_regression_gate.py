#!/usr/bin/env python3
"""Compare latency summaries against budgets and a baseline.
Exit codes: 0 pass, 2 regression/budget failure, 3 invalid input.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any

MAP = {
    "tool_runtime_p95": "tool_runtime_ms",
    "result_ingestion_p95": "result_ingestion_ms",
    "continuation_gap_p95": "continuation_gap_ms",
    "model_continuation_p95": "model_continuation_ms",
    "tool_cycle_p95": "tool_cycle_ms",
}


def load(path: str) -> dict[str, Any]:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path}: root must be object")
    return data


def p95(summary: dict[str, Any], metric: str) -> float | None:
    value = summary.get("metrics", {}).get(metric, {}).get("p95_ms")
    return None if value is None else float(value)


def gate(current: dict[str, Any], policy: dict[str, Any], baseline: dict[str, Any] | None) -> dict[str, Any]:
    failures, checks = [], []
    minimum = int(policy.get("regression", {}).get("minimum_samples", 1))
    samples = int(current.get("complete_cycles", 0))
    if samples < minimum:
        failures.append(f"insufficient samples: {samples} < {minimum}")

    for budget_name, metric in MAP.items():
        cur = p95(current, metric)
        limit = policy.get("budgets_ms", {}).get(budget_name)
        if cur is None:
            failures.append(f"missing current p95 for {metric}")
            continue
        check = {"metric": metric, "current_p95_ms": cur, "budget_ms": limit}
        if limit is not None and cur > float(limit):
            failures.append(f"{metric} p95 {cur:.1f}ms exceeds budget {float(limit):.1f}ms")
        if baseline is not None:
            base = p95(baseline, metric)
            check["baseline_p95_ms"] = base
            if base is not None:
                rel = float(policy.get("regression", {}).get("max_relative_increase", 0.20))
                abs_ms = float(policy.get("regression", {}).get("max_absolute_increase_ms", 2000))
                allowed = max(base * (1.0 + rel), base + abs_ms)
                check["regression_ceiling_ms"] = allowed
                if cur > allowed:
                    failures.append(f"{metric} regressed: {cur:.1f}ms > allowed {allowed:.1f}ms from baseline {base:.1f}ms")
        checks.append(check)

    ratio_threshold = float(policy.get("classification", {}).get("continuation_dominance_ratio", 3.0))
    dominant = []
    for c in current.get("cycles", []):
        ratio = c.get("continuation_tool_ratio")
        if ratio is not None and float(ratio) >= ratio_threshold:
            dominant.append({"run_id": c.get("run_id"), "cycle_id": c.get("cycle_id"), "tool": c.get("tool"), "ratio": ratio})

    return {"passed": not failures, "failures": failures, "checks": checks, "continuation_dominant_cycles": dominant}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--current", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--baseline")
    ap.add_argument("--output")
    args = ap.parse_args()
    try:
        result = gate(load(args.current), load(args.policy), load(args.baseline) if args.baseline else None)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 3
    text = json.dumps(result, indent=2)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    else:
        print(text)
    return 0 if result["passed"] else 2

if __name__ == "__main__":
    raise SystemExit(main())