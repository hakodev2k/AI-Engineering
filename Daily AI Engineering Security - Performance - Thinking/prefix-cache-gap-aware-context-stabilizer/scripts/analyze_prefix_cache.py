#!/usr/bin/env python3
"""Analyze prefix-cache effectiveness from JSONL agent-step telemetry.

Each JSONL row must contain:
  ts_ms: non-negative integer timestamp
  input_tokens: non-negative integer
  cached_tokens: non-negative integer <= input_tokens
Optional:
  trigger: string (for example user/tool)
  prefix_fingerprint: string
  ttft_ms: non-negative number

Exit codes: 0 success, 2 invalid input/config, 3 threshold violation in --strict mode.
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
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("policy must be a JSON object")
    return value


def load_rows(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read telemetry: {exc}") from exc
    rows: list[dict[str, Any]] = []
    for lineno, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {lineno}: invalid JSON: {exc}") from exc
        if not isinstance(row, dict):
            raise ValueError(f"line {lineno}: row must be an object")
        for key in ("ts_ms", "input_tokens", "cached_tokens"):
            if not isinstance(row.get(key), int) or row[key] < 0:
                raise ValueError(f"line {lineno}: {key} must be a non-negative integer")
        if row["cached_tokens"] > row["input_tokens"]:
            raise ValueError(f"line {lineno}: cached_tokens cannot exceed input_tokens")
        if "ttft_ms" in row and (not isinstance(row["ttft_ms"], (int, float)) or row["ttft_ms"] < 0):
            raise ValueError(f"line {lineno}: ttft_ms must be non-negative")
        if "prefix_fingerprint" in row and not isinstance(row["prefix_fingerprint"], str):
            raise ValueError(f"line {lineno}: prefix_fingerprint must be a string")
        rows.append(row)
    if not rows:
        raise ValueError("telemetry contains no rows")
    rows.sort(key=lambda r: r["ts_ms"])
    return rows


def bucket_name(gap: int, limits: list[int]) -> str:
    prev = 0
    for limit in limits:
        if gap < limit:
            return f"{prev}-{limit}ms"
        prev = limit
    return f">={prev}ms"


def percentile(values: list[float], p: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    idx = min(len(ordered) - 1, max(0, round((len(ordered) - 1) * p)))
    return float(ordered[idx])


def analyze(rows: list[dict[str, Any]], policy: dict[str, Any]) -> dict[str, Any]:
    limits = policy.get("gap_buckets_ms", [60000, 300000, 1800000, 3600000])
    if not isinstance(limits, list) or not limits or not all(isinstance(x, int) and x > 0 for x in limits):
        raise ValueError("gap_buckets_ms must be a non-empty list of positive integers")
    limits = sorted(set(limits))
    min_input = int(policy.get("min_input_tokens", 0))
    selected = [r for r in rows if r["input_tokens"] >= min_input]
    if not selected:
        raise ValueError("no rows remain after min_input_tokens filtering")

    total_input = sum(r["input_tokens"] for r in selected)
    total_cached = sum(r["cached_tokens"] for r in selected)
    uncached = total_input - total_cached
    hit_rate = total_cached / total_input if total_input else 1.0

    ttfts = [float(r["ttft_ms"]) for r in selected if "ttft_ms" in r]
    churn_n = 0
    fp_pairs = 0
    previous_fp: str | None = None
    gap_stats: dict[str, dict[str, int]] = {}
    previous_ts: int | None = None
    for row in selected:
        fp = row.get("prefix_fingerprint")
        if fp is not None and previous_fp is not None:
            fp_pairs += 1
            if fp != previous_fp:
                churn_n += 1
        if fp is not None:
            previous_fp = fp
        if previous_ts is not None:
            gap = row["ts_ms"] - previous_ts
            name = bucket_name(gap, limits)
            stat = gap_stats.setdefault(name, {"steps": 0, "input_tokens": 0, "cached_tokens": 0})
            stat["steps"] += 1
            stat["input_tokens"] += row["input_tokens"]
            stat["cached_tokens"] += row["cached_tokens"]
        previous_ts = row["ts_ms"]

    buckets: dict[str, Any] = {}
    for name, stat in gap_stats.items():
        inp = stat["input_tokens"]
        buckets[name] = {
            **stat,
            "weighted_hit_rate": stat["cached_tokens"] / inp if inp else 1.0,
            "uncached_tokens": inp - stat["cached_tokens"],
        }

    churn = churn_n / fp_pairs if fp_pairs else 0.0
    warnings: list[str] = []
    if hit_rate < float(policy.get("warn_weighted_hit_rate_below", 0.0)):
        warnings.append("weighted_cache_hit_rate_below_policy")
    if churn > float(policy.get("warn_fingerprint_churn_rate_above", 1.0)):
        warnings.append("prefix_fingerprint_churn_above_policy")

    return {
        "steps": len(selected),
        "input_tokens": total_input,
        "cached_tokens": total_cached,
        "uncached_tokens": uncached,
        "weighted_cache_hit_rate": hit_rate,
        "prefix_fingerprint_churn_rate": churn,
        "ttft_ms": {
            "count": len(ttfts),
            "mean": statistics.fmean(ttfts) if ttfts else None,
            "p50": percentile(ttfts, 0.50),
            "p95": percentile(ttfts, 0.95),
        },
        "gap_buckets": buckets,
        "warnings": warnings,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("telemetry", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    try:
        report = analyze(load_rows(args.telemetry), load_json(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False, sort_keys=True))
    return 3 if args.strict and report["warnings"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
