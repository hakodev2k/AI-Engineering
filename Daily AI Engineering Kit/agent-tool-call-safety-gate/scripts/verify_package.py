#!/usr/bin/env python3
"""Verify package structure, JSON assets, tests, and example gate behavior."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/policy.json",
    "schemas/tool-call.schema.json",
    "schemas/gate-decision.schema.json",
    "scripts/gate_tool_call.py",
    "scripts/verify_package.py",
    "skills/evaluate-tool-call.md",
    "skills/review-policy-exception.md",
    "rules/tool-call-safety.md",
    "subagents/policy-evaluator.md",
    "subagents/verification-agent.md",
    "workflows/tool-call-gating.md",
    "hooks/pre-tool-call.md",
    "hooks/post-tool-call.md",
    "examples/safe-read.json",
    "examples/destructive-shell.json",
    "examples/approval.json",
    "tests/test_gate_tool_call.py",
]


def run(command: list[str], expected: set[int]) -> None:
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True, check=False)
    if result.returncode not in expected:
        raise RuntimeError(f"command failed ({result.returncode}): {' '.join(command)}\n{result.stdout}\n{result.stderr}")


def main() -> int:
    missing = [path for path in REQUIRED if not (ROOT / path).is_file()]
    if missing:
        print("Missing required files:", *missing, sep="\n- ", file=sys.stderr)
        return 1
    for relative in ["config/policy.json", "schemas/tool-call.schema.json", "schemas/gate-decision.schema.json", "examples/safe-read.json", "examples/destructive-shell.json", "examples/approval.json"]:
        with (ROOT / relative).open("r", encoding="utf-8") as handle:
            json.load(handle)
    run([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"], {0})
    gate = str(ROOT / "scripts/gate_tool_call.py")
    policy = str(ROOT / "config/policy.json")
    run([sys.executable, gate, "--request", str(ROOT / "examples/safe-read.json"), "--policy", policy], {0})
    run([sys.executable, gate, "--request", str(ROOT / "examples/destructive-shell.json"), "--policy", policy], {2})
    print("Package verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
