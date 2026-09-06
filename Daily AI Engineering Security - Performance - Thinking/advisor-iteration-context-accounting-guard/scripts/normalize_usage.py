#!/usr/bin/env python3
"""Normalize multi-iteration LLM usage for context-occupancy decisions.

The script separates current executor occupancy from cumulative executor processing
and advisor/sub-inference usage. It is intentionally provider-shape conservative.

Exit codes: 0 success, 1 invalid/unsupported input.
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path
from typing import Any

INPUT_FIELDS = ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens")
KNOWN_ITERATION_TYPES = {"message", "advisor_message"}


def as_nonnegative_int(value: Any, field: str) -> int:
    if value is None:
        return 0
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        raise ValueError(f"{field} must be a non-negative integer when present")
    return value


def input_like(obj: dict[str, Any], prefix: str) -> int:
    return sum(as_nonnegative_int(obj.get(name, 0), f"{prefix}.{name}") for name in INPUT_FIELDS)


def normalize_usage(usage: dict[str, Any], context_window: int, threshold_pct: float) -> dict[str, Any]:
    if context_window <= 0:
        raise ValueError("context_window must be > 0")
    if not (0 < threshold_pct <= 100):
        raise ValueError("threshold_pct must be in (0, 100]")

    top_level = input_like(usage, "usage")
    iterations = usage.get("iterations")
    advisor_input = 0
    cumulative_executor = 0

    if iterations is None:
        occupancy = top_level
        source = "top_level_fallback"
    else:
        if not isinstance(iterations, list) or not iterations:
            raise ValueError("usage.iterations must be a non-empty list when present")
        message_totals: list[int] = []
        for i, item in enumerate(iterations):
            if not isinstance(item, dict):
                raise ValueError(f"usage.iterations[{i}] must be an object")
            kind = item.get("type")
            if kind not in KNOWN_ITERATION_TYPES:
                raise ValueError(f"unsupported iteration type at index {i}: {kind!r}")
            total = input_like(item, f"usage.iterations[{i}]")
            if kind == "message":
                message_totals.append(total)
                cumulative_executor += total
            else:
                advisor_input += total
        if not message_totals:
            raise ValueError("usage.iterations contains no executor/message iteration")
        occupancy = message_totals[-1]
        source = "final_message_iteration"

    threshold_tokens = math.floor(context_window * threshold_pct / 100.0)
    ratio = (top_level / occupancy) if occupancy else (1.0 if top_level == 0 else None)
    return {
        "occupancy_tokens": occupancy,
        "occupancy_source": source,
        "top_level_input_like_tokens": top_level,
        "cumulative_executor_input_tokens": cumulative_executor if iterations is not None else top_level,
        "advisor_input_tokens": advisor_input,
        "inflation_ratio": ratio,
        "inflation_alert": bool(ratio is not None and ratio > 1.25),
        "context_window_tokens": context_window,
        "threshold_pct": threshold_pct,
        "threshold_tokens": threshold_tokens,
        "should_compact": occupancy >= threshold_tokens,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalize provider usage for context occupancy")
    parser.add_argument("usage_file", type=Path, help="JSON file containing either a usage object or {\"usage\": ...}")
    parser.add_argument("--context-window", type=int, required=True, help="Effective model context window in tokens")
    parser.add_argument("--threshold-pct", type=float, default=95.0, help="Compaction threshold percentage (default: 95)")
    args = parser.parse_args()

    try:
        raw = json.loads(args.usage_file.read_text(encoding="utf-8"))
        if not isinstance(raw, dict):
            raise ValueError("root JSON value must be an object")
        usage = raw.get("usage", raw)
        if not isinstance(usage, dict):
            raise ValueError("usage must be an object")
        result = normalize_usage(usage, args.context_window, args.threshold_pct)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"status": "ERROR", "error": str(exc)}), file=sys.stderr)
        return 1

    print(json.dumps({"status": "PASS", **result}, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
