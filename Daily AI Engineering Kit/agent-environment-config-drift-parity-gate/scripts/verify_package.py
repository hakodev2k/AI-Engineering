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
    "schemas/report.schema.json",
    "scripts/config_parity_gate.py",
    "scripts/verify_package.py",
    "skills/discover-config-contract.md",
    "skills/remediate-config-drift.md",
    "rules/config-safety.md",
    "subagents/config-explorer.md",
    "subagents/remediation-planner.md",
    "subagents/verification-agent.md",
    "workflows/config-parity.md",
    "hooks/pre-change.md",
    "hooks/post-change.md",
    "examples/dev.json",
    "examples/staging.json",
    "examples/production.json",
    "tests/test_config_parity_gate.py"
]


def main() -> int:
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    if missing:
        print("missing package files:\n" + "\n".join(missing), file=sys.stderr)
        return 1
    for path in ["config/policy.json", "schemas/report.schema.json", "examples/dev.json", "examples/staging.json", "examples/production.json"]:
        json.loads((ROOT / path).read_text(encoding="utf-8"))
    test = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"], cwd=ROOT, check=False)
    if test.returncode:
        return test.returncode
    out = ROOT / ".parity-report.json"
    gate = subprocess.run([
        sys.executable, str(ROOT / "scripts/config_parity_gate.py"),
        "--policy", str(ROOT / "config/policy.json"),
        "--manifest", str(ROOT / "examples/dev.json"),
        "--manifest", str(ROOT / "examples/staging.json"),
        "--manifest", str(ROOT / "examples/production.json"),
        "--output", str(out)
    ], cwd=ROOT, check=False)
    if gate.returncode != 1:
        print(f"expected example drift to fail with exit 1, got {gate.returncode}", file=sys.stderr)
        return 1
    report = json.loads(out.read_text(encoding="utf-8"))
    out.unlink(missing_ok=True)
    if report["summary"]["errors"] < 1:
        print("example drift produced no errors", file=sys.stderr)
        return 1
    print("Package verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
