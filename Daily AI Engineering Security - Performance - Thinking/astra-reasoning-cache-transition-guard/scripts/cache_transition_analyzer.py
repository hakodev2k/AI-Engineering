#!/usr/bin/env python3
"""Measure cache behavior around reasoning-effort transitions from JSONL telemetry.

Exit codes: 0 verified/no blocking regression; 2 measured regression or forbidden transition;
3 invalid/incomplete evidence.
"""
from __future__ import annotations

import argparse
import json
import statistics
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def load_jsonl(path: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    try:
        lines = Path(path).read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    for number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSON at line {number}: {exc}") from exc
        if not isinstance(row, dict):
            raise ValueError(f"line {number} must be an object")
        for key in ("turn", "input_tokens", "cached_input_tokens", "latency_ms", "effective_reasoning_effort", "transition_mode"):
            if key not in row:
                raise ValueError(f"line {number} missing {key}")
        if row["input_tokens"] < 0 or row["cached_input_tokens"] < 0 or row["latency_ms"] < 0:
            raise ValueError(f"line {number} has negative metrics")
        if row["cached_input_tokens"] > row["input_tokens"]:
            raise ValueError(f"line {number}: cached_input_tokens exceeds input_tokens")
        rows.append(row)
    if not rows:
        raise ValueError("telemetry is empty")
    rows.sort(key=lambda r: int(r["turn"]))
    return rows


def ratio(row: dict[str, Any]) -> float:
    total = float(row["input_tokens"])
    return float(row["cached_input_tokens"]) / total if total else 0.0


def mean(rows: list[dict[str, Any]], key: str) -> float:
    return statistics.fmean(float(r[key]) for r in rows)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--events", required=True)
    ap.add_argument("--thresholds", required=True)
    ap.add_argument("--output")
    args = ap.parse_args()

    try:
        rows = load_jsonl(args.events)
        cfg = load_json(args.thresholds)
        transitions = [i for i, r in enumerate(rows) if r["transition_mode"] != "none"]
        if len(transitions) != 1:
            raise ValueError(f"expected exactly one measured transition, found {len(transitions)}")
        idx = transitions[0]
        min_before = int(cfg.get("minimum_baseline_turns", 3))
        min_after = int(cfg.get("minimum_post_change_turns", 2))
        before = rows[max(0, idx - min_before):idx]
        after = rows[idx:idx + min_after]
        if len(before) < min_before or len(after) < min_after:
            raise ValueError("not enough baseline/post-change turns")
    except (ValueError, TypeError) as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 3

    baseline_cache = statistics.fmean(ratio(r) for r in before)
    post_cache = statistics.fmean(ratio(r) for r in after)
    baseline_input = mean(before, "input_tokens")
    post_input = mean(after, "input_tokens")
    baseline_latency = mean(before, "latency_ms")
    post_latency = mean(after, "latency_ms")

    cache_drop = baseline_cache - post_cache
    input_increase = (post_input - baseline_input) / baseline_input if baseline_input else 0.0
    latency_increase = (post_latency - baseline_latency) / baseline_latency if baseline_latency else 0.0

    failures: list[str] = []
    transition = rows[idx]
    if cfg.get("require_configuration_update", True) and transition["transition_mode"] != "configuration_update":
        failures.append(f"transition mode is {transition['transition_mode']}, expected configuration_update")
    if cache_drop > float(cfg.get("max_cache_hit_ratio_drop", 0.10)):
        failures.append(f"cache hit ratio dropped by {cache_drop:.4f}")
    if input_increase > float(cfg.get("max_input_token_increase_ratio", 0.20)):
        failures.append(f"mean input tokens increased by {input_increase:.2%}")
    if latency_increase > float(cfg.get("max_latency_increase_ratio", 0.25)):
        failures.append(f"mean latency increased by {latency_increase:.2%}")
    if not cfg.get("quality_regression_allowed", False):
        bad_quality = [r["turn"] for r in after if r.get("quality_pass") is False]
        if bad_quality:
            failures.append(f"quality regression on turns {bad_quality}")

    report = {
        "status": "regression" if failures else "verified",
        "transition_turn": transition["turn"],
        "transition_mode": transition["transition_mode"],
        "baseline_cache_hit_ratio": round(baseline_cache, 6),
        "post_cache_hit_ratio": round(post_cache, 6),
        "cache_hit_ratio_drop": round(cache_drop, 6),
        "baseline_mean_input_tokens": round(baseline_input, 2),
        "post_mean_input_tokens": round(post_input, 2),
        "input_token_increase_ratio": round(input_increase, 6),
        "baseline_mean_latency_ms": round(baseline_latency, 2),
        "post_mean_latency_ms": round(post_latency, 2),
        "latency_increase_ratio": round(latency_increase, 6),
        "failures": failures,
    }
    encoded = json.dumps(report, indent=2, sort_keys=True)
    print(encoded)
    if args.output:
        try:
            Path(args.output).write_text(encoded + "\n", encoding="utf-8")
        except OSError as exc:
            print(f"INVALID: cannot write output: {exc}", file=sys.stderr)
            return 3
    return 2 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
