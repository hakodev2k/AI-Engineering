#!/usr/bin/env python3
"""Verify package structure, JSON assets, tests, and scanner behavior."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/policy.json",
    "examples/expected-report.json",
    "hooks/post-edit.md",
    "hooks/pre-complete.md",
    "rules/repository-case-safety.md",
    "schemas/report.schema.json",
    "scripts/case_portability_gate.py",
    "scripts/verify_package.py",
    "skills/diagnose-case-defect.md",
    "skills/repair-case-defect.md",
    "subagents/repository-portability-reviewer.md",
    "subagents/verification-agent.md",
    "tests/test_case_portability_gate.py",
    "workflows/case-portability-gate.md"
]


def main() -> int:
    missing = [item for item in REQUIRED if not (ROOT / item).is_file()]
    if missing:
        print("Missing required package files:", *missing, sep="\n- ", file=sys.stderr)
        return 1
    for item in ["config/policy.json", "examples/expected-report.json", "schemas/report.schema.json"]:
        with (ROOT / item).open("r", encoding="utf-8") as handle:
            json.load(handle)
    result = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        print(result.stdout, result.stderr, sep="\n", file=sys.stderr)
        return result.returncode
    print("Package verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
