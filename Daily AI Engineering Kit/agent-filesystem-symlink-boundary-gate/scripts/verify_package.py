#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/policy.json",
    "schemas/boundary-report.schema.json",
    "scripts/path_boundary_gate.py",
    "scripts/verify_package.py",
    "skills/audit-workspace-boundaries.md",
    "skills/validate-edit-plan.md",
    "rules/workspace-boundary-safety.md",
    "subagents/boundary-explorer.md",
    "subagents/verification-agent.md",
    "workflows/safe-filesystem-edit.md",
    "hooks/pre-task.md",
    "hooks/pre-write.md",
    "hooks/final-verification.md",
    "examples/paths.txt",
    "tests/test_path_boundary_gate.py",
]


def main() -> int:
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    if missing:
        print("missing files:\n" + "\n".join(missing), file=sys.stderr)
        return 1
    for p in ["config/policy.json", "schemas/boundary-report.schema.json"]:
        json.loads((ROOT / p).read_text(encoding="utf-8"))
    tests = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"],
        cwd=ROOT,
        check=False,
    )
    if tests.returncode:
        return tests.returncode
    report = ROOT / ".boundary-verify.json"
    gate = subprocess.run(
        [sys.executable, str(ROOT / "scripts/path_boundary_gate.py"), "--root", str(ROOT), "--paths-file", str(ROOT / "examples/paths.txt"), "--output", str(report)],
        cwd=ROOT,
        check=False,
    )
    if gate.returncode != 0:
        return gate.returncode
    parsed = json.loads(report.read_text(encoding="utf-8"))
    report.unlink(missing_ok=True)
    if parsed["status"] != "pass" or parsed["summary"]["violations"] != 0:
        return 1
    print("Package verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
