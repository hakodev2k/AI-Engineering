#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

REQUIRED_VERIFICATION = ["static_scan", "targeted_tests", "diff_review", "independent_review"]
VALID_STATUS = {"pass", "fail", "needs-approval", "blocked"}

def fail(msg):
    print(f"error: {msg}")
    return 1

def main():
    parser = argparse.ArgumentParser(description="Validate async cancellation assessment JSON.")
    parser.add_argument("assessment")
    args = parser.parse_args()
    path = Path(args.assessment)
    if not path.is_file():
        return fail(f"assessment not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return fail(f"invalid JSON: {exc}")
    if data.get("status") not in VALID_STATUS:
        return fail("invalid or missing status")
    if not isinstance(data.get("scope"), list) or not data["scope"]:
        return fail("scope must be a non-empty array")
    if not isinstance(data.get("findings"), list):
        return fail("findings must be an array")
    if not isinstance(data.get("tests"), list):
        return fail("tests must be an array")
    verification = data.get("verification")
    if not isinstance(verification, dict):
        return fail("verification must be an object")
    missing = [k for k in REQUIRED_VERIFICATION if k not in verification]
    if missing:
        return fail("missing verification fields: " + ", ".join(missing))
    for index, finding in enumerate(data["findings"]):
        for key in ["file", "line", "kind", "evidence", "risk", "recommended_action"]:
            if key not in finding:
                return fail(f"finding {index} missing {key}")
    if data["status"] == "pass" and not all(verification[k] is True for k in REQUIRED_VERIFICATION):
        return fail("pass requires all verification checks true")
    print("assessment valid")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
