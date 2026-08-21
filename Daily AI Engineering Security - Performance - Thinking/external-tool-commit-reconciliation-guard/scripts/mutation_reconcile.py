#!/usr/bin/env python3
"""Decide whether a previously dispatched mutation may be retried.

This script never performs the mutation. It only evaluates durable evidence.
"""
import argparse, json, pathlib, sys

VALID_RISK = {"low", "medium", "high", "irreversible"}
VALID_DISPATCH = {"not_dispatched", "dispatched", "unknown"}
VALID_READBACK = {"committed", "absent", "unknown", "not_attempted"}

def decide(r):
    required = ["operation_id", "dispatch_state", "risk", "readback"]
    missing = [k for k in required if k not in r]
    if missing:
        raise ValueError("missing fields: " + ", ".join(missing))
    if r["risk"] not in VALID_RISK or r["dispatch_state"] not in VALID_DISPATCH or r["readback"] not in VALID_READBACK:
        raise ValueError("invalid enum value")
    if r["dispatch_state"] == "not_dispatched":
        return {"outcome":"not_dispatched", "action":"retry_allowed", "reason":"dispatch definitely did not begin"}
    if r["readback"] == "committed":
        return {"outcome":"committed", "action":"reuse_committed_result", "reason":"readback proves intended remote state exists"}
    if r["readback"] in {"unknown", "not_attempted"}:
        return {"outcome":"unknown", "action":"block_and_readback", "reason":"remote outcome is not proven"}
    # readback == absent
    retry_safe = bool(r.get("retry_safe", False))
    approved = bool(r.get("human_approved_retry", False))
    if not retry_safe:
        return {"outcome":"failed", "action":"block_retry", "reason":"absence observed but retry safety is not established"}
    if r["risk"] in {"high", "irreversible"} and not approved:
        return {"outcome":"failed", "action":"require_human_approval", "reason":"high-risk retry requires explicit approval"}
    return {"outcome":"failed", "action":"retry_allowed", "reason":"readback proves absence and retry safety is established"}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("record")
    args = p.parse_args()
    try:
        record = json.loads(pathlib.Path(args.record).read_text(encoding="utf-8"))
        if not isinstance(record, dict): raise ValueError("record must be a JSON object")
        result = decide(record)
        print(json.dumps(result, indent=2))
        return 0 if result["action"] in {"retry_allowed", "reuse_committed_result"} else 3
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
