#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ALLOWED_STATUS = {"draft", "discovery", "review-required", "blocked", "pending-approval", "approved", "superseded", "complete"}
ALLOWED_RISK = {"low", "medium", "high", "critical"}
REQUIRED = ["id", "title", "objective", "statement", "source", "owner", "status", "acceptance_criteria"]


def fail(message, code=2):
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(code)


def main():
    if len(sys.argv) != 2:
        fail("usage: validate-requirements.py <requirement.json>", 64)
    path = Path(sys.argv[1])
    if not path.is_file():
        fail(f"file not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"invalid JSON: {exc}")
    missing = [k for k in REQUIRED if not data.get(k)]
    if missing:
        fail("missing required fields: " + ", ".join(missing))
    if data["status"] not in ALLOWED_STATUS:
        fail(f"invalid status: {data['status']}")
    risk = data.get("risk", "medium")
    if risk not in ALLOWED_RISK:
        fail(f"invalid risk: {risk}")
    criteria = data["acceptance_criteria"]
    if not isinstance(criteria, list) or not criteria or any(not isinstance(x, str) or not x.strip() for x in criteria):
        fail("acceptance_criteria must contain non-empty strings")
    if data["status"] in {"approved", "complete"} and not data.get("approval_evidence"):
        fail("approved/complete requirement requires approval_evidence")
    if risk in {"high", "critical"} and data["status"] == "complete" and data.get("open_questions"):
        fail("high/critical complete requirement cannot retain open questions")
    print(f"OK: {data['id']} ({data['status']}, risk={risk})")


if __name__ == "__main__":
    main()
