#!/usr/bin/env python3
"""Deterministic pre-compaction token-accounting integrity gate."""
import argparse
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def evaluate(snapshot, policy):
    required = {
        "current_prompt_tokens",
        "cumulative_usage_tokens",
        "configured_context_capacity",
        "effective_context_capacity",
        "reserve_tokens",
        "snapshot_turn",
        "current_turn",
        "snapshot_source",
    }
    missing = sorted(required - snapshot.keys())
    if missing:
        return {"ok": False, "decision": "block_accounting_error", "reasons": ["missing:" + x for x in missing]}

    reasons = []
    ints = [
        "current_prompt_tokens", "cumulative_usage_tokens", "configured_context_capacity",
        "effective_context_capacity", "reserve_tokens", "snapshot_turn", "current_turn"
    ]
    for key in ints:
        value = snapshot[key]
        if not isinstance(value, int) or value < 0:
            reasons.append(f"invalid_nonnegative_integer:{key}")

    if reasons:
        return {"ok": False, "decision": "block_accounting_error", "reasons": reasons}

    current = snapshot["current_prompt_tokens"]
    cumulative = snapshot["cumulative_usage_tokens"]
    configured = snapshot["configured_context_capacity"]
    effective = snapshot["effective_context_capacity"]
    reserve = max(snapshot["reserve_tokens"], int(policy.get("minimum_reserve_tokens", 0)))
    age = snapshot["current_turn"] - snapshot["snapshot_turn"]
    source = snapshot["snapshot_source"]

    if source not in set(policy.get("allowed_snapshot_sources", ["current_prompt", "last_call_prompt"])):
        reasons.append("untrusted_snapshot_source")
    if age < 0:
        reasons.append("snapshot_from_future_turn")
    if age > int(policy.get("max_snapshot_age_turns", 1)):
        reasons.append("stale_snapshot")
    if effective <= reserve:
        reasons.append("reserve_exhausts_effective_capacity")
    if configured <= 0 or effective <= 0:
        reasons.append("nonpositive_capacity")
    if effective > configured:
        reasons.append("effective_capacity_exceeds_configured")
    if configured > 0:
        mismatch = abs(configured - effective) / configured
        if mismatch > float(policy.get("max_capacity_mismatch_ratio", 0.02)):
            reasons.append("configured_effective_capacity_mismatch")
    if current > effective:
        reasons.append("current_prompt_exceeds_effective_capacity")
    if cumulative < current:
        reasons.append("cumulative_usage_less_than_current_prompt")

    if reasons:
        return {
            "ok": False,
            "decision": "block_accounting_error",
            "reasons": sorted(set(reasons)),
            "snapshot_age_turns": age,
        }

    usable = effective - reserve
    utilization = current / usable if usable else 1.0
    threshold = float(policy.get("compact_at_utilization", 0.8))
    decision = "allow_compaction" if utilization >= threshold else "defer"
    return {
        "ok": True,
        "decision": decision,
        "current_prompt_tokens": current,
        "cumulative_usage_tokens": cumulative,
        "effective_usable_tokens": usable,
        "utilization": round(utilization, 6),
        "snapshot_age_turns": age,
        "snapshot_source": source,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--snapshot", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load_json(args.snapshot), load_json(args.policy))
    except ValueError as exc:
        print(json.dumps({"ok": False, "decision": "block_accounting_error", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
