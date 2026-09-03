#!/usr/bin/env python3
import argparse
import json
import re
import sys
from pathlib import Path

HEX64 = re.compile(r"^[a-f0-9]{64}$")


def main():
    p = argparse.ArgumentParser(description="Verify DLQ replay evidence consistency")
    p.add_argument("--evidence", required=True)
    args = p.parse_args()
    try:
        data = json.loads(Path(args.evidence).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    errors = []
    for key in ["environment", "queue", "plan_sha256", "attempted_message_ids", "receipts", "verification_status", "remaining_risks"]:
        if key not in data:
            errors.append(f"missing required field: {key}")
    if not HEX64.match(str(data.get("plan_sha256", ""))):
        errors.append("plan_sha256 must be 64 lowercase hex characters")
    ids = data.get("attempted_message_ids", [])
    if not isinstance(ids, list) or len(ids) != len(set(ids)):
        errors.append("attempted_message_ids must be a unique array")
    receipts = data.get("receipts", [])
    if not isinstance(receipts, list):
        errors.append("receipts must be an array")
        receipts = []
    receipt_ids = [r.get("message_id") for r in receipts if isinstance(r, dict)]
    if sorted(ids) != sorted(receipt_ids):
        errors.append("receipt message IDs must match attempted_message_ids exactly")
    statuses = [r.get("status") for r in receipts if isinstance(r, dict)]
    if any(s not in {"accepted", "rejected", "unknown"} for s in statuses):
        errors.append("receipt contains invalid status")
    if "unknown" in statuses and data.get("verification_status") == "verified":
        errors.append("unknown receipt cannot be verified")
    if data.get("verification_status") == "verified" and any(s != "accepted" for s in statuses):
        errors.append("verified evidence requires all receipts accepted")
    if data.get("verification_status") == "verified" and not data.get("post_replay_checks"):
        errors.append("verified evidence requires post_replay_checks")

    if errors:
        for err in errors:
            print(f"error: {err}", file=sys.stderr)
        return 1
    print(f"evidence consistent status={data.get('verification_status')} receipts={len(receipts)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
