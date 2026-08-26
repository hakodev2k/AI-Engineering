#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load_jsonl(path):
    rows = []
    for n, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except Exception as e:
            raise ValueError(f"line {n}: {e}")
    return rows

def evaluate(rows, policy):
    max_retries = int(policy.get("max_consecutive_retries", 4))
    max_same = int(policy.get("max_same_action", 5))
    max_no_progress = int(policy.get("max_no_progress_steps", 8))
    retries = same = no_progress = 0
    prev_sig = None
    reasons = []
    for row in rows:
        if row.get("event") == "retry":
            retries += 1
        else:
            retries = 0
        sig = row.get("action_signature")
        if sig and sig == prev_sig:
            same += 1
        elif sig:
            same = 1
        else:
            same = 0
        if sig:
            prev_sig = sig
        if row.get("progress") is True:
            no_progress = 0
        elif row.get("event") in {"retry", "tool", "model", "compact"}:
            no_progress += 1
        if retries >= max_retries:
            reasons.append("retry_budget_exhausted")
        if same >= max_same:
            reasons.append("same_action_limit_exceeded")
        if no_progress >= max_no_progress:
            reasons.append("no_progress_budget_exhausted")
    counters = {"consecutive_retries": retries, "same_action": same, "no_progress_steps": no_progress}
    if reasons:
        return {"ok": False, "decision": "halt_and_escalate", "reasons": sorted(set(reasons)), "counters": counters}
    return {"ok": True, "decision": "continue", "counters": counters}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--trace", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        rows = load_jsonl(args.trace)
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        result = evaluate(rows, policy)
    except Exception as e:
        print(str(e), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())
