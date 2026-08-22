#!/usr/bin/env python3
"""Perform dependency-free structural and redaction checks on a drift report."""
import argparse
import json
import sys
from pathlib import Path

REQUIRED = {"status", "expected_source", "actual_source", "differences", "verification"}
VALID_STATUS = {"clean", "drift-detected", "blocked", "needs-approval", "error"}
VALID_KIND = {"missing", "unexpected", "changed"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("report")
    args = parser.parse_args()
    path = Path(args.report)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"invalid report: {exc}", file=sys.stderr)
        return 3
    missing = REQUIRED - set(data)
    errors = []
    if missing:
        errors.append("missing fields: " + ", ".join(sorted(missing)))
    if data.get("status") not in VALID_STATUS:
        errors.append("invalid status")
    if not isinstance(data.get("differences"), list):
        errors.append("differences must be an array")
    else:
        for i, item in enumerate(data["differences"]):
            if not isinstance(item, dict) or not {"path", "kind", "sensitive"}.issubset(item):
                errors.append(f"difference[{i}] missing required fields")
                continue
            if item["kind"] not in VALID_KIND:
                errors.append(f"difference[{i}] invalid kind")
            if item["sensitive"] is True:
                for field in ("expected", "actual"):
                    if field in item and item[field] != "<redacted>":
                        errors.append(f"difference[{i}] leaks sensitive {field}")
    verification = data.get("verification", {})
    if verification.get("secrets_redacted") is not True:
        errors.append("secrets_redacted must be true")
    if errors:
        print("verification failed: " + "; ".join(errors), file=sys.stderr)
        return 4
    print(f"verified report: {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
