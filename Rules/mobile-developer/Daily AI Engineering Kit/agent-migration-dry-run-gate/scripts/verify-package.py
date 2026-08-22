#!/usr/bin/env python3
import sys
from pathlib import Path

REQUIRED = [
    "README.md",
    "config/gate.yaml",
    "rules/migration-safety.md",
    "skills/plan-migration.md",
    "skills/verify-migration.md",
    "subagents/migration-planner.md",
    "subagents/migration-verifier.md",
    "workflows/migration-dry-run-gate.md",
    "hooks/pre-migration.md",
    "hooks/post-migration.md",
    "scripts/analyze-migration.py",
    "scripts/verify-plan.py",
    "scripts/verify-package.py",
    "templates/migration-plan.yaml",
]

REFERENCES = [
    "config/gate.yaml",
    "rules/migration-safety.md",
    "scripts/analyze-migration.py",
    "scripts/verify-plan.py",
    "templates/migration-plan.yaml",
    "skills/plan-migration.md",
    "skills/verify-migration.md",
    "subagents/migration-planner.md",
    "subagents/migration-verifier.md",
    "hooks/pre-migration.md",
    "hooks/post-migration.md",
    "workflows/migration-dry-run-gate.md",
]

def main():
    root = Path(__file__).resolve().parents[1]
    errors = []
    for rel in REQUIRED:
        p = root / rel
        if not p.is_file() or p.stat().st_size == 0:
            errors.append(f"missing or empty: {rel}")
    readme = (root / "README.md").read_text(encoding="utf-8", errors="replace") if (root / "README.md").is_file() else ""
    for rel in REFERENCES:
        if rel not in readme:
            errors.append(f"README missing reference: {rel}")
    for rel in REQUIRED:
        p = root / rel
        if p.is_file():
            text = p.read_text(encoding="utf-8", errors="replace")
            for forbidden in ("implementation omitted", "remaining files omitted", "same as above", "add logic here"):
                if forbidden in text.lower():
                    errors.append(f"forbidden placeholder in {rel}: {forbidden}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"package verification passed: {len(REQUIRED)} required files")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
