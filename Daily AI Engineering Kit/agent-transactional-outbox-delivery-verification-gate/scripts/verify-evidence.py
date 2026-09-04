#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

REQUIRED_TOP = {"status", "affected_path", "facts", "failure_windows", "verification", "risks"}
VALID_STATUS = {"investigating", "implemented", "blocked", "verified", "failed"}
VALID_VERIFY = {"pending", "verified", "failed", "blocked"}


def fail(message):
    print(f"ERROR: {message}")
    return 2


def main():
    parser = argparse.ArgumentParser(description="Validate outbox verification evidence without third-party dependencies.")
    parser.add_argument("--evidence", required=True)
    args = parser.parse_args()
    path = Path(args.evidence)
    if not path.is_file():
        return fail(f"evidence file does not exist: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return fail(f"invalid JSON: {exc}")
    missing = REQUIRED_TOP - set(data)
    if missing:
        return fail("missing fields: " + ", ".join(sorted(missing)))
    if data["status"] not in VALID_STATUS:
        return fail("invalid status")
    if not isinstance(data["facts"], list) or not data["facts"]:
        return fail("facts must contain at least one evidence-backed finding")
    for index, fact in enumerate(data["facts"]):
        if not isinstance(fact, dict) or not fact.get("finding") or not fact.get("evidence"):
            return fail(f"fact {index} must contain finding and evidence")
    if not isinstance(data["failure_windows"], list):
        return fail("failure_windows must be an array")
    verification = data["verification"]
    required_verify = {"atomic_persistence", "retry_behavior", "duplicate_tolerance", "independent_review", "verification_status"}
    if not isinstance(verification, dict) or not required_verify.issubset(verification):
        return fail("verification object is incomplete")
    if verification["verification_status"] not in VALID_VERIFY:
        return fail("invalid verification_status")
    if data["status"] == "verified":
        checks = [verification["atomic_persistence"], verification["retry_behavior"], verification["duplicate_tolerance"], verification["independent_review"]]
        if not all(check is True for check in checks):
            return fail("verified status requires all verification booleans to be true")
        if verification["verification_status"] != "verified":
            return fail("top-level verified status requires verification_status=verified")
    if not isinstance(data["risks"], list):
        return fail("risks must be an array")
    print("evidence valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
