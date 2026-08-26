#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

EXIT_BLOCK = 3

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot read {path}: {exc}"}))
        raise SystemExit(2)

def digest_history(history):
    canonical = json.dumps(history, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

def evaluate(event, policy):
    reasons = []
    required = ["context_tokens", "context_window", "token_scope", "history", "history_checkpoint_durable", "tool_calls"]
    for key in required:
        if key not in event:
            reasons.append(f"missing:{key}")
    if reasons:
        return {"ok": False, "decision": "block", "reasons": reasons}

    if event["context_window"] <= 0 or event["context_tokens"] < 0:
        reasons.append("invalid_token_measurement")
    if policy.get("require_context_snapshot_scope", True) and event["token_scope"] != "current_context":
        reasons.append("token_scope_not_current_context")
    if policy.get("require_durable_history_checkpoint", True) and not event["history_checkpoint_durable"]:
        reasons.append("history_not_durable")

    side_effecting = set(policy.get("side_effecting_tools", []))
    unresolved = []
    for call in event["tool_calls"]:
        if call.get("tool") in side_effecting and call.get("state") not in {"committed", "failed_confirmed"}:
            unresolved.append(call.get("id", "unknown"))
    if unresolved and policy.get("block_on_unresolved_side_effects", True):
        reasons.append("unresolved_side_effects:" + ",".join(sorted(unresolved)))

    history_digest = digest_history(event["history"])
    retry_count = int(event.get("retry_count_for_digest", 0))
    if retry_count >= int(policy.get("max_compaction_retries_per_digest", 2)):
        reasons.append("retry_budget_exhausted")

    utilization = event["context_tokens"] / max(1, event["context_window"])
    trigger = utilization >= float(policy.get("max_context_utilization", 0.80))
    if not trigger:
        reasons.append("below_compaction_threshold")

    if reasons:
        return {"ok": False, "decision": "defer", "history_digest": history_digest, "utilization": utilization, "reasons": reasons}
    return {"ok": True, "decision": "prepare_compaction", "history_digest": history_digest, "utilization": utilization}

def verify_result(before_tokens, after_tokens, policy):
    if before_tokens <= 0 or after_tokens < 0:
        return {"ok": False, "reason": "invalid_compaction_measurement"}
    reduction = (before_tokens - after_tokens) / before_tokens
    required = float(policy.get("minimum_reduction_ratio", 0.15))
    return {"ok": reduction >= required and after_tokens < before_tokens, "reduction_ratio": reduction, "required_ratio": required}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--event", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--verify-after", type=int)
    args = parser.parse_args()
    event, policy = load_json(args.event), load_json(args.policy)
    result = evaluate(event, policy)
    if result["ok"] and args.verify_after is not None:
        result["postcheck"] = verify_result(event["context_tokens"], args.verify_after, policy)
        if not result["postcheck"]["ok"]:
            result["ok"] = False
            result["decision"] = "rollback"
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else EXIT_BLOCK

if __name__ == "__main__":
    raise SystemExit(main())
