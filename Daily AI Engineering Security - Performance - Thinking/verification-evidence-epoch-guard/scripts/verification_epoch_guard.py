#!/usr/bin/env python3
import argparse, json, time
from pathlib import Path

def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def evaluate(state, policy, now=None):
    now = int(time.time() if now is None else now)
    required = ["verification_epoch", "verification_exit_code", "verified_snapshot", "current_snapshot", "verified_at"]
    missing = [key for key in required if key not in state]
    if missing:
        return {"ok": False, "decision": "block", "reasons": ["missing:" + key for key in missing]}
    reasons = []
    epoch = state["verification_epoch"]
    previous = state.get("previous_verification_epoch", -1)
    if not isinstance(epoch, int) or epoch < 0:
        reasons.append("invalid_verification_epoch")
    elif policy.get("require_monotonic_verification_epoch", True) and epoch <= previous:
        reasons.append("verification_epoch_not_monotonic")
    if state["verification_exit_code"] != 0:
        reasons.append("verification_failed")
    if state["verified_snapshot"] != state["current_snapshot"]:
        reasons.append("snapshot_changed_after_verification")
    ttl = int(policy.get("verification_ttl_seconds", 3600))
    if now - int(state["verified_at"]) > ttl:
        reasons.append("verification_ttl_expired")
    if policy.get("require_clean_or_captured_diff", True) and state.get("worktree_dirty", False) and not state.get("dirty_diff_captured", False):
        reasons.append("dirty_diff_not_captured")
    return {"ok": not reasons, "decision": "fresh" if not reasons else "reverify", "reasons": sorted(set(reasons)), "verification_epoch": epoch}

def main():
    parser = argparse.ArgumentParser(description="Validate verification freshness against an immutable snapshot and monotonic epoch")
    parser.add_argument("--state", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load_json(args.state), load_json(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "block", "reasons": ["input_error:" + str(exc)]}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())
