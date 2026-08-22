#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("contract", nargs="?", default="acceptance-contract.json")
    parser.add_argument("--phase", choices=["pre-implementation", "pre-completion"], default="pre-implementation")
    args = parser.parse_args()

    path = Path(args.contract)
    if not path.exists():
        print(f"ERROR: contract not found: {path}", file=sys.stderr)
        sys.exit(1)

    data = json.loads(path.read_text(encoding="utf-8"))
    errors = []

    for ambiguity in data.get("ambiguities", []):
        if ambiguity.get("severity") == "blocking" and ambiguity.get("status") == "open":
            errors.append(f"blocking ambiguity open: {ambiguity.get('id', '<no-id>')}")

    for obligation in data.get("obligations", []):
        if not obligation.get("required", True):
            continue
        oid = obligation.get("id", "<no-id>")
        status = obligation.get("status")
        verification = obligation.get("verification") or []
        if not verification:
            errors.append(f"{oid} has no verification plan")
        if args.phase == "pre-implementation" and status not in {"accepted", "implemented", "verified"}:
            errors.append(f"{oid} is not accepted for implementation: {status}")
        if args.phase == "pre-completion" and status != "verified":
            errors.append(f"{oid} is not verified: {status}")

    pending_approvals = [a for a in data.get("approvals", []) if a.get("required") and a.get("status") != "approved"]
    for approval in pending_approvals:
        errors.append(f"required approval missing: {approval.get('id', '<no-id>')}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)

    print(f"OK: no blocking unresolved obligations for phase {args.phase}")


if __name__ == "__main__":
    main()
