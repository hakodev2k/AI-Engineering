#!/usr/bin/env python3
"""Detect unexplained prompt-cache churn in JSONL model-turn telemetry."""
import argparse
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot load policy {path}: {exc}") from exc


def load_jsonl(path):
    rows = []
    try:
        lines = Path(path).read_text(encoding="utf-8").splitlines()
    except Exception as exc:
        raise ValueError(f"cannot read telemetry {path}: {exc}") from exc
    for number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except Exception as exc:
            raise ValueError(f"invalid JSON on line {number}: {exc}") from exc
        rows.append(row)
    return rows


def analyze(rows, policy):
    required = {"input_tokens", "cached_tokens", "latency_ms", "semantic_progress"}
    min_large = int(policy.get("min_large_context_tokens", 50000))
    healthy = float(policy.get("healthy_cache_ratio", 0.8))
    collapse = float(policy.get("collapse_cache_ratio", 0.4))
    max_collapses = int(policy.get("max_unexplained_collapses", 2))
    max_noop = int(policy.get("max_expensive_noop_turns", 2))
    require_prefix = bool(policy.get("require_prefix_id_for_large_context", True))

    previous = None
    unexplained = []
    expensive_noop_streak = 0
    max_noop_streak = 0
    total_input = 0
    total_cached = 0

    for index, row in enumerate(rows):
        missing = required - row.keys()
        if missing:
            raise ValueError(f"row {index}: missing {','.join(sorted(missing))}")
        input_tokens = int(row["input_tokens"])
        cached_tokens = int(row["cached_tokens"])
        latency_ms = float(row["latency_ms"])
        if input_tokens < 0 or cached_tokens < 0 or cached_tokens > input_tokens or latency_ms < 0:
            raise ValueError(f"row {index}: invalid token/latency values")
        total_input += input_tokens
        total_cached += cached_tokens
        ratio = cached_tokens / max(1, input_tokens)
        prefix_id = row.get("prefix_id")
        expected_invalidation = bool(row.get("expected_cache_invalidation", False))

        if input_tokens >= min_large and require_prefix and not prefix_id:
            unexplained.append({"row": index, "reason": "missing_prefix_id", "cache_ratio": ratio})

        if previous is not None:
            same_prefix = bool(prefix_id) and prefix_id == previous["prefix_id"]
            collapsed = previous["ratio"] >= healthy and ratio <= collapse
            if collapsed and same_prefix and not expected_invalidation:
                unexplained.append({
                    "row": index,
                    "reason": "cache_ratio_collapse_same_prefix",
                    "previous_cache_ratio": round(previous["ratio"], 4),
                    "cache_ratio": round(ratio, 4),
                    "input_tokens": input_tokens,
                })

        expensive_noop = input_tokens >= min_large and not bool(row["semantic_progress"])
        if expensive_noop:
            expensive_noop_streak += 1
            max_noop_streak = max(max_noop_streak, expensive_noop_streak)
        else:
            expensive_noop_streak = 0

        previous = {"ratio": ratio, "prefix_id": prefix_id, "latency_ms": latency_ms}

    aggregate_ratio = total_cached / max(1, total_input)
    reasons = []
    if len(unexplained) > max_collapses:
        reasons.append("unexplained_cache_churn_budget_exceeded")
    if max_noop_streak > max_noop:
        reasons.append("expensive_noop_turn_budget_exceeded")

    return {
        "decision": "block" if reasons else "pass",
        "reasons": reasons,
        "unexplained_events": unexplained,
        "max_expensive_noop_streak": max_noop_streak,
        "aggregate_cache_ratio": round(aggregate_ratio, 4),
        "turns": len(rows),
        "total_input_tokens": total_input,
        "total_cached_tokens": total_cached,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--telemetry", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = analyze(load_jsonl(args.telemetry), load_json(args.policy))
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["decision"] == "pass" else 3


if __name__ == "__main__":
    raise SystemExit(main())
