#!/usr/bin/env python3
import argparse, json
from pathlib import Path

REQUIRED = {"current_context_tokens", "pending_user_tokens", "pending_tool_tokens", "pending_retrieval_tokens", "idle_seconds", "cache_read_tokens", "cache_creation_tokens"}


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def evaluate(state, policy):
    missing = sorted(REQUIRED - set(state))
    if missing:
        return {"ok": False, "decision": "checkpoint_or_compact", "reasons": ["missing:" + x for x in missing]}
    vals = {k: int(state[k]) for k in REQUIRED}
    if any(v < 0 for v in vals.values()):
        return {"ok": False, "decision": "checkpoint_or_compact", "reasons": ["negative_metric"]}

    max_ctx = int(policy["max_context_tokens"])
    safety = int(policy.get("safety_margin_tokens", 0))
    pending = vals["pending_user_tokens"] + vals["pending_tool_tokens"] + vals["pending_retrieval_tokens"]
    projected = vals["current_context_tokens"] + pending + safety
    utilization = projected / max_ctx if max_ctx else 1.0
    runway = max_ctx - projected
    cache_total = vals["cache_read_tokens"] + vals["cache_creation_tokens"]
    cache_read_ratio = vals["cache_read_tokens"] / cache_total if cache_total else 1.0

    reasons = []
    decision = "continue"
    if projected >= max_ctx or utilization >= float(policy.get("hard_utilization", 0.90)):
        decision = "new_session_with_checkpoint" if runway < 0 else "checkpoint_or_compact"
        reasons.append("hard_context_budget")
    elif utilization >= float(policy.get("soft_utilization", 0.78)):
        decision = "checkpoint_or_compact"
        reasons.append("soft_context_budget")

    if runway < int(policy.get("minimum_runway_tokens", 0)):
        if decision == "continue": decision = "checkpoint_or_compact"
        reasons.append("insufficient_runway")

    if vals["idle_seconds"] >= int(policy.get("idle_cache_risk_seconds", 14400)) and vals["current_context_tokens"] > max_ctx * 0.5:
        if decision == "continue": decision = "checkpoint_or_compact"
        reasons.append("idle_cache_expiry_risk")

    if cache_read_ratio < float(policy.get("minimum_cache_read_ratio", 0.5)) and vals["current_context_tokens"] > max_ctx * 0.5:
        if decision == "continue": decision = "checkpoint_or_compact"
        reasons.append("low_cache_read_ratio")

    return {"ok": True, "decision": decision, "projected_tokens": projected, "projected_utilization": round(utilization, 6), "runway_tokens": runway, "cache_read_ratio": round(cache_read_ratio, 6), "reasons": sorted(set(reasons))}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--state", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load_json(args.state), load_json(args.policy))
    except Exception as exc:
        result = {"ok": False, "decision": "checkpoint_or_compact", "reasons": ["input_error:" + str(exc)]}
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
