#!/usr/bin/env python3
"""Evaluate normalized compaction telemetry for cost/context regressions."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

REQUIRED = {
    "pre_tokens", "post_tokens", "uncached_input_tokens",
    "cached_input_tokens", "repeated_payload_bytes", "turns_to_next_compaction",
    "critical_markers_expected", "critical_markers_retained"
}

def load(path: str) -> dict:
    try:
        obj = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read telemetry: {exc}") from exc
    missing = REQUIRED - obj.keys()
    if missing:
        raise ValueError("missing fields: " + ", ".join(sorted(missing)))
    return obj

def evaluate(m: dict, max_post_ratio: float, max_uncached_ratio: float,
             max_repeat_bytes: int, min_turns: int) -> dict:
    for key in ("pre_tokens", "post_tokens", "uncached_input_tokens", "cached_input_tokens",
                "repeated_payload_bytes", "turns_to_next_compaction"):
        if not isinstance(m[key], (int, float)) or m[key] < 0:
            raise ValueError(f"{key} must be a non-negative number")
    expected = set(m["critical_markers_expected"])
    retained = set(m["critical_markers_retained"])
    reasons = []
    pre = max(float(m["pre_tokens"]), 1.0)
    total_input = max(float(m["uncached_input_tokens"] + m["cached_input_tokens"]), 1.0)
    post_ratio = float(m["post_tokens"]) / pre
    uncached_ratio = float(m["uncached_input_tokens"]) / total_input
    if post_ratio > max_post_ratio:
        reasons.append("post_compaction_context_too_large")
    if uncached_ratio > max_uncached_ratio:
        reasons.append("uncached_input_ratio_regression")
    if int(m["repeated_payload_bytes"]) > max_repeat_bytes:
        reasons.append("repeated_payload_bytes_regression")
    if 0 < int(m["turns_to_next_compaction"]) < min_turns:
        reasons.append("compaction_thrashing")
    missing_markers = sorted(expected - retained)
    if missing_markers:
        reasons.append("critical_context_loss")
    return {
        "status": "fail" if reasons else "pass",
        "reasons": reasons,
        "metrics": {
            "post_pre_token_ratio": round(post_ratio, 4),
            "uncached_input_ratio": round(uncached_ratio, 4),
            "repeated_payload_bytes": int(m["repeated_payload_bytes"]),
            "turns_to_next_compaction": int(m["turns_to_next_compaction"]),
            "missing_critical_markers": missing_markers,
        }
    }

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("telemetry")
    ap.add_argument("--max-post-ratio", type=float, default=0.35)
    ap.add_argument("--max-uncached-ratio", type=float, default=0.40)
    ap.add_argument("--max-repeat-bytes", type=int, default=65536)
    ap.add_argument("--min-turns-to-next-compaction", type=int, default=8)
    args = ap.parse_args()
    try:
        result = evaluate(load(args.telemetry), args.max_post_ratio, args.max_uncached_ratio,
                          args.max_repeat_bytes, args.min_turns_to_next_compaction)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["status"] == "pass" else 3

if __name__ == "__main__":
    raise SystemExit(main())
