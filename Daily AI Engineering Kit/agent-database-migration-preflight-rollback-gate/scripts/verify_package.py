#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/policy.json",
    "schemas/migration-plan.schema.json",
    "schemas/gate-result.schema.json",
    "scripts/migration_gate.py",
    "scripts/verify_package.py",
    "skills/migration-preflight.md",
    "skills/migration-recovery.md",
    "rules/migration-safety.md",
    "subagents/migration-planner.md",
    "subagents/migration-verifier.md",
    "workflows/migration-preflight-rollout.md",
    "hooks/lifecycle.md",
    "templates/migration-plan.json",
    "examples/safe-add-column.json",
    "tests/test_migration_gate.py",
]

missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
if missing:
    print("Missing files: " + ", ".join(missing))
    sys.exit(2)

empty = [str(p.relative_to(ROOT)) for p in ROOT.rglob("*") if p.is_file() and p.stat().st_size == 0]
if empty:
    print("Empty files: " + ", ".join(empty))
    sys.exit(3)

print(f"Package verification passed: {len(REQUIRED)} required files present and non-empty.")
