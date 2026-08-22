#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

ALLOWED_STATUS = {"ready", "blocked", "needs-approval", "rejected"}
APPROVAL_MARKERS = {"breaking-api-contract", "database-schema-change", "production-configuration-change", "security-control-change", "destructive-operation", "irreversible-migration", "large-dependency-upgrade"}

def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    return 1

def main():
    p = argparse.ArgumentParser(description="Validate an AI requirement contract before implementation.")
    p.add_argument("contract", type=Path)
    args = p.parse_args()
    if not args.contract.is_file(): return fail(f"contract not found: {args.contract}")
    try: data = json.loads(args.contract.read_text(encoding="utf-8"))
    except Exception as e: return fail(f"invalid JSON: {e}")
    required = ["task","trigger","scope","acceptance_criteria","assumptions","open_questions","evidence","risk","status"]
    missing = [k for k in required if k not in data]
    if missing: return fail("missing fields: " + ", ".join(missing))
    if data["status"] not in ALLOWED_STATUS: return fail("invalid status")
    if not isinstance(data["acceptance_criteria"], list) or not data["acceptance_criteria"]: return fail("at least one acceptance criterion is required")
    blockers = [q for q in data["open_questions"] if q.get("blocking") is True]
    high = [a for a in data["assumptions"] if a.get("risk") == "high"]
    approvals = set(data.get("approval_reasons", []))
    if data["status"] == "ready" and blockers: return fail("ready contract contains blocking questions")
    if data["status"] == "ready" and high: return fail("ready contract contains high-risk assumptions")
    if approvals & APPROVAL_MARKERS and data["status"] != "needs-approval": return fail("approval-required change must use needs-approval status")
    if data["status"] == "ready" and not data["evidence"]: return fail("ready contract requires evidence")
    print(f"OK: {args.contract} status={data['status']} criteria={len(data['acceptance_criteria'])} evidence={len(data['evidence'])}")
    return 0

if __name__ == "__main__": sys.exit(main())
