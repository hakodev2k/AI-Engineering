#!/usr/bin/env python3
"""Verify package structure, JSON validity, and README references."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REQUIRED = [
    "README.md",
    "config/secret-scan.json",
    "rules/secret-protection.md",
    "skills/secret-exposure-triage.md",
    "subagents/secret-verifier.md",
    "workflows/secret-exposure-response.md",
    "hooks/pre-commit-secret-scan.md",
    "scripts/scan-secrets.py",
    "scripts/verify-package.py",
    "schemas/secret-scan-report.schema.json",
    "templates/allowlist.example.json",
]
JSON_FILES = [
    "config/secret-scan.json",
    "schemas/secret-scan-report.schema.json",
    "templates/allowlist.example.json",
]


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    errors: list[str] = []

    for rel in REQUIRED:
        path = root / rel
        if not path.is_file():
            errors.append(f"missing required file: {rel}")
        elif path.stat().st_size == 0:
            errors.append(f"empty required file: {rel}")

    for rel in JSON_FILES:
        path = root / rel
        if not path.is_file():
            continue
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"invalid JSON {rel}: {exc}")

    readme_path = root / "README.md"
    if readme_path.is_file():
        readme = readme_path.read_text(encoding="utf-8")
        referenced = set(re.findall(r"`((?:skills|rules|subagents|workflows|hooks|scripts|schemas|templates|config)/[^`]+)`", readme))
        for rel in sorted(referenced):
            if not (root / rel).is_file():
                errors.append(f"README references missing file: {rel}")

    scan_script = root / "scripts/scan-secrets.py"
    if scan_script.is_file():
        source = scan_script.read_text(encoding="utf-8")
        if "-----BEGIN" not in source or "block_on_severity" not in source:
            errors.append("scanner is missing expected detector/config integration")
        if "print(value" in source or "repr(value" in source:
            errors.append("scanner appears capable of printing raw candidate values")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print(f"Package verification passed: {len(REQUIRED)} required files present and references are consistent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
