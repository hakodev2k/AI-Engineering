#!/usr/bin/env python3
"""Compare baseline/candidate prompt cache-compression metrics.

Aggregate JSON shape:
{
  "effective_cost": 1.23,
  "latency_ms": 1200,
  "cache_hit_ratio": 0.72,
  "quality_score": 0.94,
  "critical_context_failures": 0,
  "input_tokens": 20000,
  "cached_tokens": 15000,
  "cache_write_tokens": 0
}
Exit 0 accept, 2 invalid input, 3 reject in --strict mode.
"""
from __future__ import annotations
import argparse
import json
import math
import sys
from pathlib import Path


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def number(data: dict, key: str, *, minimum: float = 0.0) -> float:
    value = data.get(key)
    if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value):
        raise ValueError(f"{key} must be a finite number")
    if value < minimum:
        raise ValueError(f"{key} must be >= {minimum}")
    return float(value)


def ratio_improvement(old: float, new: float) -> float:
    if old == 0:
        return 0.0 if new == 0 else -math.inf
    return (old - new) / old


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("baseline", type=Path)
    parser.add_argument("candidate", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        base, cand, policy = load(args.baseline), load(args.candidate), load(args.policy)
        for obj in (base, cand):
            number(obj, "effective_cost")
            number(obj, "latency_ms")
            chr_ = number(obj, "cache_hit_ratio")
            qs = number(obj, "quality_score")
            if chr_ > 1 or qs > 1:
                raise ValueError("cache_hit_ratio and quality_score must be <= 1")
            number(obj, "critical_context_failures")
            number(obj, "input_tokens")
            number(obj, "cached_tokens")
            if "cache_write_tokens" in obj:
                number(obj, "cache_write_tokens")

        cost_improvement = ratio_improvement(number(base, "effective_cost"), number(cand, "effective_cost"))
        latency_change = -ratio_improvement(number(base, "latency_ms"), number(cand, "latency_ms"))
        quality_regression = number(base, "quality_score") - number(cand, "quality_score")
        failures = int(number(cand, "critical_context_failures"))
        cache_hit = number(cand, "cache_hit_ratio")

        reasons = []
        if failures > int(policy.get("max_critical_context_failures", 0)):
            reasons.append("critical context failure threshold exceeded")
        if quality_regression > float(policy.get("max_quality_regression", 0.01)):
            reasons.append("quality regression threshold exceeded")
        if cost_improvement < float(policy.get("min_effective_cost_improvement", 0.05)):
            reasons.append("effective cost improvement below threshold")
        if latency_change > float(policy.get("max_latency_regression", 0.05)):
            reasons.append("latency regression threshold exceeded")
        if cache_hit < float(policy.get("min_cache_hit_ratio", 0.5)):
            reasons.append("cache hit ratio below threshold")

        result = {
            "decision": "accept" if not reasons else "reject",
            "cost_improvement": cost_improvement,
            "latency_regression": latency_change,
            "quality_regression": quality_regression,
            "cache_hit_ratio": cache_hit,
            "critical_context_failures": failures,
            "reasons": reasons,
        }
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return 3 if args.strict and result["decision"] == "reject" else 0


if __name__ == "__main__":
    raise SystemExit(main())
