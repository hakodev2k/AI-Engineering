#!/usr/bin/env python3
"""Validate gate evidence using only the Python standard library.
Exit codes: 0 verified, 2 valid but not verified, 3 invalid evidence.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

REQUIRED = {"task", "status", "facts", "findings", "commands", "verification_status", "remaining_risks"}
FINDING_REQUIRED = {"finding", "evidence", "confidence", "affected_component", "risk", "recommended_action", "verification_status"}


def invalid(msg: str) -> int:
    print(f"invalid evidence: {msg}", file=sys.stderr); return 3


def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--evidence", required=True); args = ap.parse_args(); path = Path(args.evidence).resolve()
    try: data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: return invalid(str(exc))
    if not isinstance(data, dict): return invalid("root must be an object")
    missing = REQUIRED - set(data)
    if missing: return invalid("missing fields: " + ", ".join(sorted(missing)))
    if data["status"] not in {"executed", "blocked", "failed"}: return invalid("invalid status")
    if data["verification_status"] not in {"verified", "unverified", "blocked", "failed"}: return invalid("invalid verification_status")
    for key in ("facts", "findings", "commands", "remaining_risks"):
        if not isinstance(data[key], list): return invalid(f"{key} must be an array")
    for i, finding in enumerate(data["findings"]):
        if not isinstance(finding, dict): return invalid(f"findings[{i}] must be an object")
        missing_f = FINDING_REQUIRED - set(finding)
        if missing_f: return invalid(f"findings[{i}] missing: {', '.join(sorted(missing_f))}")
        if finding["confidence"] not in {"low", "medium", "high"}: return invalid(f"findings[{i}] invalid confidence")
        if finding["risk"] not in {"low", "medium", "high", "critical"}: return invalid(f"findings[{i}] invalid risk")
        if finding["verification_status"] not in {"unverified", "verified", "rejected", "blocked"}: return invalid(f"findings[{i}] invalid verification_status")
        if not isinstance(finding["evidence"], list) or not finding["evidence"]: return invalid(f"findings[{i}] evidence must be non-empty")
    for i, command in enumerate(data["commands"]):
        if not isinstance(command, dict) or not isinstance(command.get("command"), str) or not isinstance(command.get("exit_code"), int): return invalid(f"commands[{i}] invalid")
    approvals = data.get("approvals", [])
    if not isinstance(approvals, list): return invalid("approvals must be an array")
    if data["verification_status"] == "verified" and any(isinstance(a, dict) and a.get("approved") is False for a in approvals): return invalid("verified evidence contains unapproved action")
    print(json.dumps({"valid": True, "verification_status": data["verification_status"], "path": str(path)}))
    return 0 if data["verification_status"] == "verified" else 2


if __name__ == "__main__": raise SystemExit(main())
