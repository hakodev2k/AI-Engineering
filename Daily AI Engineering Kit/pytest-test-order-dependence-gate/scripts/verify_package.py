#!/usr/bin/env python3
"""Self-check the package structure, JSON assets, and deterministic unit tests."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/gate-config.json",
    "examples/investigation-request.json",
    "hooks/post-edit.md",
    "hooks/pre-investigation.md",
    "rules/test-isolation-rules.md",
    "schemas/investigation-request.schema.json",
    "schemas/report.schema.json",
    "scripts/order_gate.py",
    "scripts/verify_package.py",
    "skills/investigate-order-dependence.md",
    "skills/repair-test-isolation.md",
    "subagents/repository-explorer.md",
    "subagents/implementation-agent.md",
    "subagents/verification-agent.md",
    "tests/test_order_gate.py",
    "workflows/order-dependence-workflow.md",
]
JSON_FILES = [
    "config/gate-config.json",
    "examples/investigation-request.json",
    "schemas/investigation-request.schema.json",
    "schemas/report.schema.json",
]


def main() -> int:
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    if missing:
        print("missing required files:\n" + "\n".join(missing), file=sys.stderr)
        return 1
    try:
        for relative in JSON_FILES:
            json.loads((ROOT / relative).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"invalid JSON asset: {exc}", file=sys.stderr)
        return 1
    result = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        print(result.stdout, file=sys.stderr)
        print(result.stderr, file=sys.stderr)
        return result.returncode
    print("Package verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
