#!/usr/bin/env python3
"""Estimate whether multi-agent fan-out is token-positive before spawning."""
import argparse
import json
import sys
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        raise SystemExit(2)


def nonneg_number(value, name):
    if not isinstance(value, (int, float)) or value < 0:
        raise ValueError(f"{name} must be a non-negative number")
    return float(value)


def evaluate(m):
    try:
        n = int(m["num_children"])
        if n < 1:
            raise ValueError("num_children must be >= 1")
        parent = nonneg_number(m.get("parent_context_tokens", 0), "parent_context_tokens")
        child_fixed = nonneg_number(m["child_fixed_tokens"], "child_fixed_tokens")
        inherited = nonneg_number(m.get("inherited_tokens_per_child", 0), "inherited_tokens_per_child")
        unique = nonneg_number(m["unique_tokens_per_child"], "unique_tokens_per_child")
        polls = int(m.get("status_poll_turns", 0))
        if polls < 0:
            raise ValueError("status_poll_turns must be >= 0")
        poll_tokens = nonneg_number(m.get("tokens_per_status_poll", 0), "tokens_per_status_poll")
        synthesis = nonneg_number(m.get("synthesis_tokens", 0), "synthesis_tokens")
        serial_unique = nonneg_number(m["serial_unique_tokens"], "serial_unique_tokens")
        max_ratio = nonneg_number(m.get("max_fanout_to_serial_ratio", 1.25), "max_fanout_to_serial_ratio")
        max_total = nonneg_number(m.get("max_total_tokens", 10**18), "max_total_tokens")
        price = nonneg_number(m.get("price_per_million_input", 0), "price_per_million_input")
    except (KeyError, ValueError, TypeError) as exc:
        return {"ok": False, "decision": "block", "reasons": [str(exc)]}

    fanout = parent + n * (child_fixed + inherited + unique) + polls * poll_tokens + synthesis
    serial = parent + serial_unique + synthesis
    ratio = fanout / max(serial, 1.0)
    reasons = []
    if fanout > max_total:
        reasons.append("fanout_exceeds_total_budget")
    if ratio > max_ratio:
        reasons.append("fanout_exceeds_serial_ratio")
    fixed_overhead = n * (child_fixed + inherited) + polls * poll_tokens
    unique_total = n * unique
    result = {
        "ok": not reasons,
        "decision": "allow_fanout" if not reasons else "regroup_or_serialize",
        "predicted_fanout_tokens": round(fanout),
        "predicted_serial_tokens": round(serial),
        "fanout_to_serial_ratio": round(ratio, 4),
        "fixed_or_orchestration_overhead_tokens": round(fixed_overhead),
        "unique_child_work_tokens": round(unique_total),
        "predicted_fanout_input_cost": round(fanout / 1_000_000 * price, 6),
        "reasons": reasons,
    }
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("metrics")
    args = parser.parse_args()
    result = evaluate(load(args.metrics))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
