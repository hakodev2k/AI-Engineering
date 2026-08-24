#!/usr/bin/env python3
"""Validate a plan-mode capability transition against a durable approval ledger."""
import argparse
import hashlib
import json
import sys
from pathlib import Path


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def validate(ledger, current_hash, requested_mode, epoch):
    errors = []
    if ledger.get("approval_status") != "accepted":
        errors.append("approval_status is not accepted")
    if not ledger.get("approval_id"):
        errors.append("approval_id missing")
    if not ledger.get("plan_id"):
        errors.append("plan_id missing")
    if ledger.get("plan_hash") != current_hash:
        errors.append("plan_hash mismatch")
    if ledger.get("mode_before") != "plan":
        errors.append("mode_before must be plan")
    if ledger.get("mode_after") != requested_mode:
        errors.append("requested mode does not match approved mode_after")
    if str(ledger.get("transition_epoch")) != str(epoch):
        errors.append("transition_epoch mismatch")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ledger", required=True)
    parser.add_argument("--plan", required=True)
    parser.add_argument("--requested-mode", required=True)
    parser.add_argument("--epoch", required=True)
    args = parser.parse_args()
    try:
        ledger = json.loads(Path(args.ledger).read_text(encoding="utf-8"))
        if not isinstance(ledger, dict):
            raise ValueError("ledger must be a JSON object")
        current_hash = sha256(args.plan)
    except Exception as exc:
        print(json.dumps({"valid": False, "input_error": str(exc)}))
        return 2
    errors = validate(ledger, current_hash, args.requested_mode, args.epoch)
    print(json.dumps({"valid": not errors, "plan_hash": current_hash, "errors": errors}, sort_keys=True))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
