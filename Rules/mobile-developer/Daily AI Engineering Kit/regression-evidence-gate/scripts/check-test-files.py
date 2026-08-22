#!/usr/bin/env python3
import argparse
import json
import os
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Verify that regression evidence references existing test files.")
    parser.add_argument("--evidence", default=os.getenv("REGRESSION_EVIDENCE_FILE", "regression-evidence.json"))
    parser.add_argument("--root", default=".", help="Repository root used to resolve relative test paths.")
    args = parser.parse_args()

    evidence_path = Path(args.evidence)
    root = Path(args.root).resolve()

    try:
        data = json.loads(evidence_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"ERROR: evidence file not found: {evidence_path}", file=sys.stderr)
        raise SystemExit(1)
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON: {exc}", file=sys.stderr)
        raise SystemExit(1)

    errors = []
    checked = 0

    for item in data.get("obligations", []):
        if not isinstance(item, dict) or item.get("status") != "covered":
            continue
        if item.get("evidenceType") in {"static", "manual"}:
            continue
        oid = item.get("id", "<unknown>")
        test_file = str(item.get("testFile", "")).strip()
        if not test_file:
            errors.append(f"{oid}: missing testFile")
            continue

        candidate = (root / test_file).resolve()
        try:
            candidate.relative_to(root)
        except ValueError:
            errors.append(f"{oid}: testFile escapes repository root: {test_file}")
            continue

        if not candidate.is_file():
            errors.append(f"{oid}: test file does not exist: {test_file}")
            continue

        checked += 1

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)

    print(f"OK: {checked} covered test file reference(s) exist")


if __name__ == "__main__":
    main()
