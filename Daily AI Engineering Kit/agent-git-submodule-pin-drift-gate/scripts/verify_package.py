#!/usr/bin/env python3
from __future__ import annotations
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
  "README.md", "config/policy.json", "schemas/submodule-report.schema.json",
  "schemas/approval-record.schema.json", "scripts/scan_submodules.py",
  "scripts/verify_package.py", "skills/investigate-submodule-drift.md",
  "skills/review-submodule-update.md", "rules/submodule-safety.md",
  "subagents/submodule-reviewer.md", "subagents/verification-agent.md",
  "workflows/submodule-change-gate.md", "hooks/pre-commit.md",
  "hooks/post-change.md", "examples/approval-record.json",
  "tests/test_scan_submodules.py"
]

def main() -> int:
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    if missing:
        print("Missing files: " + ", ".join(missing), file=sys.stderr)
        return 1
    for p in ["config/policy.json", "schemas/submodule-report.schema.json", "schemas/approval-record.schema.json", "examples/approval-record.json"]:
        json.loads((ROOT / p).read_text(encoding="utf-8"))
    r = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"], cwd=ROOT, check=False)
    if r.returncode != 0:
        return r.returncode
    r = subprocess.run([sys.executable, "scripts/scan_submodules.py", "--repo", ".", "--policy", "config/policy.json", "--baseline", "HEAD"], cwd=ROOT, check=False)
    if r.returncode not in {0, 2, 3}:
        return r.returncode
    print("Package verification passed.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
