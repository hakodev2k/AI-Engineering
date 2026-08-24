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
    "examples/baseline.json",
    "examples/compatible-candidate.json",
    "examples/breaking-candidate.json",
    "schemas/cli-contract.schema.json",
    "schemas/cli-report.schema.json",
    "scripts/compare_cli_contract.py",
    "scripts/verify_package.py",
    "skills/capture-cli-contract.md",
    "skills/review-cli-regression.md",
    "rules/cli-compatibility.md",
    "subagents/cli-contract-explorer.md",
    "subagents/verification-agent.md",
    "workflows/cli-contract-change.md",
    "hooks/post-edit.md",
    "hooks/pre-merge.md",
    "tests/test_compare_cli_contract.py",
]


def run(command: list[str], expected: set[int]) -> None:
    proc = subprocess.run(command, cwd=ROOT, text=True, capture_output=True, check=False)
    if proc.returncode not in expected:
        raise RuntimeError(f"command failed ({proc.returncode}): {' '.join(command)}\n{proc.stdout}\n{proc.stderr}")


def main() -> int:
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    if missing:
        print("Missing required files:\n- " + "\n- ".join(missing), file=sys.stderr)
        return 1
    for path in [
        "config/policy.json", "examples/baseline.json", "examples/compatible-candidate.json",
        "examples/breaking-candidate.json", "schemas/cli-contract.schema.json", "schemas/cli-report.schema.json",
    ]:
        json.loads((ROOT / path).read_text(encoding="utf-8"))
    run([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"], {0})
    gate = str(ROOT / "scripts/compare_cli_contract.py")
    policy = str(ROOT / "config/policy.json")
    baseline = str(ROOT / "examples/baseline.json")
    run([sys.executable, gate, "--baseline", baseline, "--candidate", str(ROOT / "examples/compatible-candidate.json"), "--policy", policy], {0})
    run([sys.executable, gate, "--baseline", baseline, "--candidate", str(ROOT / "examples/breaking-candidate.json"), "--policy", policy], {2})
    print("Package verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
