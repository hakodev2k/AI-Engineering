#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load(path):
    value = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def estimate_tokens(value):
    text = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return max(1, (len(text) + 3) // 4)


def evaluate(before, after, checkpoint, policy):
    reasons = []
    required = policy.get("required_checkpoint_fields", [])
    missing_fields = [name for name in required if name not in checkpoint]
    if missing_fields:
        reasons.append("missing_checkpoint_fields:" + ",".join(sorted(missing_fields)))

    before_epoch = before.get("epoch_id")
    after_epoch = after.get("epoch_id")
    checkpoint_epoch = checkpoint.get("epoch_id")
    if not isinstance(after_epoch, str) or not after_epoch:
        reasons.append("missing_after_epoch")
    elif after_epoch == before_epoch:
        reasons.append("epoch_not_rotated")
    if checkpoint_epoch != after_epoch:
        reasons.append("checkpoint_epoch_mismatch")

    before_context = before.get("active_context", {})
    after_context = after.get("active_context", {})
    if not isinstance(before_context, dict) or not isinstance(after_context, dict):
        reasons.append("active_context_not_object")
        before_context = before_context if isinstance(before_context, dict) else {}
        after_context = after_context if isinstance(after_context, dict) else {}

    missing_keys = [key for key in before_context if key not in after_context]
    changed_keys = [key for key in before_context if key in after_context and after_context[key] != before_context[key]]
    declared_keys = checkpoint.get("active_context_keys", [])
    if not isinstance(declared_keys, list):
        reasons.append("active_context_keys_not_list")
        declared_keys = []
    undeclared = [key for key in before_context if key not in declared_keys]

    critical_prefixes = tuple(policy.get("critical_context_prefixes", []))
    missing_critical = [key for key in missing_keys if key.startswith(critical_prefixes)] if critical_prefixes else []
    if missing_keys:
        reasons.append("missing_active_context:" + ",".join(sorted(missing_keys)))
    if changed_keys:
        reasons.append("changed_active_context:" + ",".join(sorted(changed_keys)))
    if undeclared:
        reasons.append("checkpoint_omits_active_keys:" + ",".join(sorted(undeclared)))
    if missing_critical and policy.get("fail_closed_on_missing_critical_context", True):
        reasons.append("missing_critical_context:" + ",".join(sorted(missing_critical)))

    checkpoint_tokens = int(after.get("checkpoint_tokens", estimate_tokens(checkpoint)))
    rehydration_tokens = int(after.get("rehydration_tokens", estimate_tokens(after_context)))
    raw_tail_tokens = int(after.get("raw_tail_tokens", 0))
    total_tokens = int(after.get("total_post_compaction_tokens", checkpoint_tokens + rehydration_tokens + raw_tail_tokens))

    limits = {
        "checkpoint_tokens": int(policy.get("max_checkpoint_tokens", 2500)),
        "rehydration_tokens": int(policy.get("max_rehydration_tokens", 12000)),
        "raw_tail_tokens": int(policy.get("max_raw_tail_tokens", 16000)),
        "total_post_compaction_tokens": int(policy.get("max_total_post_compaction_tokens", 36000)),
    }
    actual = {
        "checkpoint_tokens": checkpoint_tokens,
        "rehydration_tokens": rehydration_tokens,
        "raw_tail_tokens": raw_tail_tokens,
        "total_post_compaction_tokens": total_tokens,
    }
    for name, value in actual.items():
        if value < 0:
            reasons.append(f"negative_metric:{name}")
        elif value > limits[name]:
            reasons.append(f"budget_exceeded:{name}:{value}>{limits[name]}")

    status = "pass" if not reasons else "block"
    return {
        "status": status,
        "reasons": sorted(set(reasons)),
        "before_epoch": before_epoch,
        "after_epoch": after_epoch,
        "missing_active_context": sorted(missing_keys),
        "changed_active_context": sorted(changed_keys),
        "metrics": actual,
        "limits": limits,
    }


def main():
    parser = argparse.ArgumentParser(description="Validate post-compaction state continuity and token budgets")
    parser.add_argument("--before", required=True)
    parser.add_argument("--after", required=True)
    parser.add_argument("--checkpoint", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load(args.before), load(args.after), load(args.checkpoint), load(args.policy))
    except Exception as exc:
        print(json.dumps({"status": "block", "reasons": [f"guard_error:{exc}"]}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["status"] == "pass" else 3


if __name__ == "__main__":
    raise SystemExit(main())
