#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "block", "reasons": [f"invalid_json:{exc}"]}))
        raise SystemExit(2)


def canonical_payload(event):
    return {
        "tool_call_id": event.get("tool_call_id"),
        "leaf_tool": event.get("leaf_tool"),
        "arguments": event.get("arguments"),
        "delegation_chain": event.get("delegation_chain", []),
        "consequence": event.get("consequence"),
        "destination": event.get("destination"),
    }


def fingerprint(payload):
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def validate(event, policy, mode):
    reasons = []
    if not event.get("tool_call_id"):
        reasons.append("missing_tool_call_id")
    if policy.get("require_leaf_tool", True) and not event.get("leaf_tool"):
        reasons.append("missing_leaf_tool")
    args = event.get("arguments")
    if policy.get("require_parsed_arguments", True) and not isinstance(args, dict):
        reasons.append("arguments_missing_or_unparsed")
    chain = event.get("delegation_chain", [])
    if not isinstance(chain, list):
        reasons.append("delegation_chain_not_list")
    elif len(chain) > int(policy.get("max_delegation_depth", 8)):
        reasons.append("delegation_depth_exceeded")
    consequence = event.get("consequence")
    allowed = set(policy.get("high_risk_consequences", [])) | {"read-only", "low-risk"}
    if policy.get("deny_unknown_consequence", True) and consequence not in allowed:
        reasons.append("unknown_consequence")
    high = consequence in set(policy.get("high_risk_consequences", []))
    if high and policy.get("require_consequence_summary_for_high_risk", True) and not event.get("consequence_summary"):
        reasons.append("missing_consequence_summary")
    if high and policy.get("require_destination_for_high_risk", True) and not event.get("destination"):
        reasons.append("missing_destination")
    payload = canonical_payload(event)
    current = fingerprint(payload)
    if mode == "execute":
        approved = event.get("approved_fingerprint")
        if not approved:
            reasons.append("missing_approved_fingerprint")
        elif approved != current:
            reasons.append("approval_fingerprint_mismatch")
        if event.get("approval_decision") != "approve":
            reasons.append("not_approved")
    if reasons:
        return {"ok": False, "decision": "block", "fingerprint": current, "reasons": sorted(set(reasons))}
    return {"ok": True, "decision": "request-approval" if mode == "request" else "allow-execution", "fingerprint": current, "envelope": payload}


def main():
    parser = argparse.ArgumentParser(description="Bind approval to an exact executable leaf tool call.")
    parser.add_argument("--event", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--mode", choices=["request", "execute"], required=True)
    args = parser.parse_args()
    result = validate(load_json(args.event), load_json(args.policy), args.mode)
    print(json.dumps(result, indent=2, sort_keys=True, ensure_ascii=False))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    sys.exit(main())
