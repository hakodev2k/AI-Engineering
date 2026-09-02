#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/env-contract.json",
    "schemas/env-contract.schema.json",
    "scripts/check_env_contract.py",
    "scripts/verify_package.py",
    "skills/discover-environment-contract.md",
    "skills/update-environment-contract.md",
    "rules/environment-contract-rules.md",
    "subagents/config-discovery-agent.md",
    "subagents/verification-agent.md",
    "workflows/environment-contract-gating.md",
    "hooks/post-config-change.md",
    "hooks/pre-release.md",
    "examples/.env.example",
    "examples/production.env.sample",
    "tests/test_check_env_contract.py"
]


def run(cmd: list[str], expected: set[int]) -> None:
    proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, check=False)
    if proc.returncode not in expected:
        raise RuntimeError(f"command failed ({proc.returncode}): {' '.join(cmd)}\n{proc.stdout}\n{proc.stderr}")


def main() -> int:
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    if missing:
        print("missing required files: " + ", ".join(missing), file=sys.stderr)
        return 1
    for rel in ["config/env-contract.json", "schemas/env-contract.schema.json"]:
        json.loads((ROOT / rel).read_text(encoding="utf-8"))
    run([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"], {0})
    checker = str(ROOT / "scripts/check_env_contract.py")
    contract = str(ROOT / "config/env-contract.json")
    run([sys.executable, checker, "--contract", contract, "--env-file", str(ROOT / "examples/.env.example"), "--environment", "development"], {0})
    run([sys.executable, checker, "--contract", contract, "--env-file", str(ROOT / "examples/production.env.sample"), "--environment", "production"], {0})
    print("Package verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
