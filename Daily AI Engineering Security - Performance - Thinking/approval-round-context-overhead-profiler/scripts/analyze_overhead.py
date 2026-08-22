#!/usr/bin/env python3
"""Analyze repeated context-provider work across approval rounds.
Exit 0 pass, 2 invalid input, 3 regression in --strict mode.
"""
from __future__ import annotations
import argparse, json, statistics, sys
from collections import defaultdict
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


def load_events(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    events: list[dict[str, Any]] = []
    for number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {number}: invalid JSON: {exc}") from exc
        required = {"turn_id", "approval_round", "provider", "input_fingerprint", "duration_ms", "status"}
        if not isinstance(row, dict) or not required.issubset(row):
            raise ValueError(f"line {number}: missing required fields")
        if not isinstance(row["duration_ms"], (int, float)) or row["duration_ms"] < 0:
            raise ValueError(f"line {number}: duration_ms must be non-negative")
        if row["status"] not in {"ok", "error"}:
            raise ValueError(f"line {number}: status must be ok|error")
        events.append(row)
    if not events:
        raise ValueError("no telemetry events")
    return events


def percentile(values: list[float], p: float) -> float:
    values = sorted(values)
    if len(values) == 1:
        return values[0]
    k = (len(values) - 1) * p
    lo, hi = int(k), min(int(k) + 1, len(values) - 1)
    frac = k - lo
    return values[lo] * (1 - frac) + values[hi] * frac


def summarize(events: list[dict[str, Any]]) -> dict[str, Any]:
    groups: dict[tuple[str, str, str], list[dict[str, Any]]] = defaultdict(list)
    by_turn: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in events:
        key = (str(row["turn_id"]), str(row["provider"]), str(row["input_fingerprint"]))
        groups[key].append(row)
        by_turn[str(row["turn_id"])].append(row)
    repeated = sum(max(0, len(rows) - 1) for rows in groups.values())
    turn_times = [sum(float(r["duration_ms"]) for r in rows) for rows in by_turn.values()]
    approval_rounds = [len({int(r["approval_round"]) for r in rows}) for rows in by_turn.values()]
    return {
        "turns": len(by_turn),
        "provider_invocations": len(events),
        "repeated_provider_invocations": repeated,
        "mean_provider_ms_per_turn": round(statistics.mean(turn_times), 3),
        "p95_provider_ms_per_turn": round(percentile(turn_times, 0.95), 3),
        "mean_approval_rounds_per_turn": round(statistics.mean(approval_rounds), 3),
        "error_count": sum(1 for r in events if r["status"] == "error"),
    }


def compare(base: dict[str, Any], cand: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    p95_base = float(base["p95_provider_ms_per_turn"])
    p95_cand = float(cand["p95_provider_ms_per_turn"])
    regression = 0.0 if p95_base == 0 else ((p95_cand - p95_base) / p95_base) * 100
    repeated_base = int(base["repeated_provider_invocations"])
    repeated_cand = int(cand["repeated_provider_invocations"])
    savings = 0.0 if repeated_base == 0 else ((repeated_base - repeated_cand) / repeated_base) * 100
    failures: list[str] = []
    if regression > float(policy.get("max_p95_regression_percent", 5)):
        failures.append("p95_regression")
    if repeated_base > 0 and savings < float(policy.get("min_reuse_savings_percent", 20)):
        failures.append("insufficient_repeated_work_reduction")
    if cand["error_count"] > base["error_count"]:
        failures.append("error_count_increased")
    return {"p95_change_percent": round(regression, 3), "repeated_work_savings_percent": round(savings, 3), "failures": failures}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("telemetry", type=Path)
    ap.add_argument("--baseline", type=Path)
    ap.add_argument("--policy", type=Path, default=Path("config/policy.json"))
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    try:
        candidate = summarize(load_events(args.telemetry))
        report: dict[str, Any] = {"candidate": candidate}
        failures: list[str] = []
        if args.baseline:
            baseline = summarize(load_events(args.baseline))
            policy = load_json(args.policy)
            comparison = compare(baseline, candidate, policy)
            failures = comparison["failures"]
            report.update({"baseline": baseline, "comparison": comparison})
    except (ValueError, TypeError) as exc:
        print(json.dumps({"status": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    report["status"] = "fail" if failures else "pass"
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 3 if args.strict and failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
