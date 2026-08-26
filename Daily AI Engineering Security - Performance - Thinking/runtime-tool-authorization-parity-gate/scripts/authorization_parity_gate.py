#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read {path}: {e}")

def decide(event, policy):
    required = {"request_id", "advertised_tools", "requested_tool"}
    missing = required - event.keys()
    if missing:
        return {"ok": False, "decision": "deny", "reasons": ["missing:" + x for x in sorted(missing)]}
    advertised = set(event["advertised_tools"])
    requested = event["requested_tool"]
    reasons = []
    if requested not in advertised:
        reasons.append("requested_tool_not_advertised")
    allowed = set(policy.get("allowed_tools", []))
    if allowed and requested not in allowed:
        reasons.append("tool_not_globally_allowed")
    high = set(policy.get("high_risk_tools", []))
    if requested in high and policy.get("require_human_approval_for_high_risk", True) and not event.get("human_approved", False):
        reasons.append("high_risk_tool_requires_approval")
    if event.get("authorization_context_hash") != event.get("dispatch_context_hash"):
        reasons.append("authorization_dispatch_context_mismatch")
    if reasons:
        return {"ok": False, "decision": "deny", "request_id": event["request_id"], "reasons": sorted(set(reasons))}
    return {"ok": True, "decision": "allow", "request_id": event["request_id"], "tool": requested}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--event", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        result = decide(load(args.event), load(args.policy))
    except ValueError as e:
        print(str(e), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())
