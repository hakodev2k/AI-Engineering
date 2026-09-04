#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

REQUIRED = {"topic", "status", "boundaries", "checks", "verification_status", "risks"}
CHECK_STATUSES = {"pass", "fail", "not-applicable", "blocked"}
VERIFY = {"unverified", "blocked", "verified"}


def validate(data):
    errors = []
    missing = sorted(REQUIRED - data.keys())
    if missing:
        errors.append("missing fields: " + ", ".join(missing))
    if data.get("topic") != "agent-webhook-signature-replay-protection-gate":
        errors.append("topic mismatch")
    if not isinstance(data.get("boundaries"), list) or not data.get("boundaries"):
        errors.append("boundaries must be a non-empty list")
    checks = data.get("checks")
    if not isinstance(checks, list) or len(checks) < 5:
        errors.append("checks must contain at least five entries")
    else:
        for i, check in enumerate(checks):
            if not isinstance(check, dict):
                errors.append(f"check {i} must be an object")
                continue
            if check.get("status") not in CHECK_STATUSES:
                errors.append(f"check {i} has invalid status")
            if not check.get("name") or not check.get("evidence"):
                errors.append(f"check {i} needs name and evidence")
    if data.get("verification_status") not in VERIFY:
        errors.append("invalid verification_status")
    if data.get("verification_status") == "verified":
        bad = [c.get("name", "unnamed") for c in checks or [] if c.get("status") in {"fail", "blocked"}]
        if bad:
            errors.append("verified evidence contains failed/blocked checks: " + ", ".join(bad))
        if not data.get("verifier"):
            errors.append("verified evidence requires verifier")
    return errors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--evidence", required=True)
    ap.add_argument("--schema", required=False, help="Accepted for path consistency; standard-library validation is applied.")
    args = ap.parse_args()
    path = Path(args.evidence)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(json.dumps({"valid": False, "errors": [str(exc)]}, indent=2))
        raise SystemExit(2)
    errors = validate(data)
    print(json.dumps({"valid": not errors, "errors": errors}, indent=2))
    raise SystemExit(0 if not errors else 2)


if __name__ == "__main__":
    main()
