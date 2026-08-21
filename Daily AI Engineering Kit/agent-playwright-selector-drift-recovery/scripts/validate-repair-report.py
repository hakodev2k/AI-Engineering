#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

ALLOWED_STATUS = {"investigating", "candidate-found", "repaired", "verified", "blocked", "needs-approval"}
ALLOWED_RESULT = {"pass", "fail", "not-run"}


def fail(message: str):
    print(f"ERROR: {message}")
    raise SystemExit(1)


def main():
    parser = argparse.ArgumentParser(description="Validate selector repair report invariants.")
    parser.add_argument("report")
    args = parser.parse_args()

    path = Path(args.report)
    if not path.is_file():
        fail(f"report not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"invalid JSON: {exc}")

    for field in ["test_file", "failure", "old_locator", "candidate_locator", "evidence", "verification", "status"]:
        if field not in data:
            fail(f"missing field: {field}")
    if not isinstance(data["evidence"], list) or not data["evidence"]:
        fail("evidence must contain at least one item")
    for i, item in enumerate(data["evidence"]):
        if not isinstance(item, dict) or not item.get("source") or not item.get("finding"):
            fail(f"evidence[{i}] requires source and finding")
    if data["status"] not in ALLOWED_STATUS:
        fail(f"invalid status: {data['status']}")

    verification = data["verification"]
    for field in ["targeted_retest", "full_spec_retest"]:
        if verification.get(field) not in ALLOWED_RESULT:
            fail(f"verification.{field} must be pass/fail/not-run")

    if data["status"] == "verified":
        if verification["targeted_retest"] != "pass" or verification["full_spec_retest"] != "pass":
            fail("verified status requires both targeted and full-spec retests to pass")
        if data.get("risk") == "high":
            fail("high-risk repair cannot be marked verified without explicit manual review status")

    print("repair report valid")


if __name__ == "__main__":
    main()
