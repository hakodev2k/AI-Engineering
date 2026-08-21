#!/usr/bin/env python3
"""Model-aware request admission guard.

This utility never claims a heuristic estimate is exact. Give --exact-count when a
provider/local tokenizer has counted the final rendered request. Without it, the
script uses a deliberately conservative fallback and refuses near-boundary sends.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import pathlib
import sys
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        data = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def read_request(path: str) -> tuple[bytes, str]:
    try:
        raw = pathlib.Path(path).read_bytes()
        text = raw.decode("utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        raise ValueError(f"cannot read UTF-8 request {path}: {exc}") from exc
    return raw, text


def positive_int(name: str, value: int) -> int:
    if value <= 0:
        raise ValueError(f"{name} must be > 0")
    return value


def conservative_estimate(raw: bytes, text: str, policy: dict[str, Any]) -> int:
    fallback = policy.get("fallback", {})
    if not fallback.get("enabled", False):
        raise ValueError("fallback estimation is disabled")
    bpt = float(fallback.get("bytes_per_token_floor", 1.5))
    cpt = float(fallback.get("chars_per_token_floor", 1.5))
    multiplier = float(fallback.get("multiplier", 1.20))
    if bpt <= 0 or cpt <= 0 or multiplier < 1:
        raise ValueError("invalid fallback parameters")
    by_bytes = math.ceil(len(raw) / bpt)
    by_chars = math.ceil(len(text) / cpt)
    return math.ceil(max(by_bytes, by_chars) * multiplier)


def decision(args: argparse.Namespace) -> tuple[dict[str, Any], int]:
    policy = load_json(args.policy)
    raw, text = read_request(args.request)
    context_limit = positive_int("context-limit", args.context_limit)
    reserve_output = args.reserve_output
    if reserve_output is None:
        reserve_output = int(policy.get("reserve_output_tokens", 0))
    reserve_reasoning = args.reserve_reasoning
    if reserve_reasoning is None:
        reserve_reasoning = int(policy.get("reserve_reasoning_tokens", 0))
    if reserve_output < 0 or reserve_reasoning < 0:
        raise ValueError("reserves must be >= 0")

    margin_ratio = float(policy.get("default_safety_margin_ratio", 0.08))
    minimum_margin = int(policy.get("minimum_safety_margin_tokens", 4096))
    if not 0 <= margin_ratio < 1 or minimum_margin < 0:
        raise ValueError("invalid safety margin policy")
    margin = max(minimum_margin, math.ceil(context_limit * margin_ratio))
    admissible = context_limit - reserve_output - reserve_reasoning - margin
    if admissible <= 0:
        raise ValueError("reserves and safety margin leave no admissible input budget")

    if args.exact_count is not None:
        count = positive_int("exact-count", args.exact_count)
        source = "exact"
    else:
        count = conservative_estimate(raw, text, policy)
        source = "estimated"

    request_hash = hashlib.sha256(raw).hexdigest()
    utilization = count / context_limit
    headroom = admissible - count

    if count > admissible:
        state = "REDUCE"
        code = 2
    elif source == "estimated":
        exact_threshold = float(policy.get("exact_counter_required_above_utilization", 0.80))
        fallback_max = float(policy.get("fallback", {}).get("max_utilization", 0.70))
        threshold = min(exact_threshold, fallback_max)
        if utilization >= threshold:
            state = "RECOUNT_REQUIRED"
            code = 3
        else:
            state = "ALLOW"
            code = 0
    else:
        state = "ALLOW"
        code = 0

    result = {
        "decision": state,
        "request_sha256": request_hash,
        "model": args.model,
        "count_source": source,
        "input_tokens": count,
        "context_limit": context_limit,
        "reserve_output_tokens": reserve_output,
        "reserve_reasoning_tokens": reserve_reasoning,
        "safety_margin_tokens": margin,
        "admissible_input_tokens": admissible,
        "headroom_tokens": headroom,
        "utilization": round(utilization, 6),
        "required_reduction_tokens": max(0, -headroom),
        "request_bytes": len(raw),
        "request_chars": len(text),
    }
    return result, code


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Model-aware context preflight guard")
    sub = parser.add_subparsers(dest="command", required=True)
    check = sub.add_parser("check", help="evaluate one final rendered request")
    check.add_argument("--request", required=True, help="UTF-8 final serialized request file")
    check.add_argument("--model", required=True, help="actual target model identifier")
    check.add_argument("--context-limit", required=True, type=int, help="effective model context limit")
    check.add_argument("--exact-count", type=int, help="token count from provider/local tokenizer")
    check.add_argument("--reserve-output", type=int)
    check.add_argument("--reserve-reasoning", type=int)
    check.add_argument("--policy", required=True)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    try:
        result, code = decision(args)
    except ValueError as exc:
        print(json.dumps({"decision": "BLOCK_CONFIGURATION", "error": str(exc)}), file=sys.stderr)
        return 4
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
