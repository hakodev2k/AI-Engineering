#!/usr/bin/env python3
"""Compare two cache-health reports and enforce regression thresholds."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def load(path: str) -> dict:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def metric(report: dict, name: str) -> float:
    try:
        value = report["metrics"][name]
    except KeyError as exc:
        raise ValueError(f"report missing metrics.{name}") from exc
    if not isinstance(value, (int, float)):
        raise ValueError(f"metrics.{name} must be numeric")
    return float(value)


def pct_change(base: float, candidate: float) -> float:
    if base == 0:
        return 0.0 if candidate == 0 else float("inf")
    return (candidate - base) * 100.0 / base


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--baseline", required=True)
    ap.add_argument("--candidate", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--output")
    args = ap.parse_args()
    try:
        baseline, candidate, policy = load(args.baseline), load(args.candidate), load(args.policy)
        if baseline.get("status") == "insufficient_data" or candidate.get("status") == "insufficient_data":
            raise ValueError("cannot compare insufficient-data report")

        br = metric(baseline, "cache_read_ratio")
        cr = metric(candidate, "cache_read_ratio")
        ba = metric(baseline, "cache_creation_amplification")
        ca = metric(candidate, "cache_creation_amplification")
        bu = metric(baseline, "unexplained_resets_per_100_requests")
        cu = metric(candidate, "unexplained_resets_per_100_requests")
        bp95 = metric(baseline, "latency_p95_ms")
        cp95 = metric(candidate, "latency_p95_ms")
        latency_delta = pct_change(bp95, cp95)

        violations = []
        if candidate.get("status") != "pass":
            violations.append("candidate_health_report_failed")
        if cr + 1e-9 < br:
            violations.append("cache_read_ratio_regressed")
        if ca > ba + 1e-9:
            violations.append("cache_creation_amplification_regressed")
        if cu > bu + 1e-9:
            violations.append("unexplained_reset_rate_regressed")
        if latency_delta > float(policy.get("maximum_p95_latency_regression_percent", 20)):
            violations.append("p95_latency_regressed")

        result = {
            "status": "fail" if violations else "pass",
            "deltas": {
                "cache_read_ratio": round(cr - br, 6),
                "cache_creation_amplification": round(ca - ba, 6),
                "unexplained_resets_per_100_requests": round(cu - bu, 6),
                "p95_latency_percent": round(latency_delta, 6) if latency_delta != float("inf") else "infinity"
            },
            "violations": violations
        }
        text = json.dumps(result, indent=2, sort_keys=True)
        if args.output:
            Path(args.output).write_text(text + "\n", encoding="utf-8")
        print(text)
        return 0 if result["status"] == "pass" else 3
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
