#!/usr/bin/env python3
"""Validate required Customer Success Engineer package artifacts.
Exit codes: 0 valid, 1 missing/invalid package, 2 usage error.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REQUIRED = [
    "README.md",
    "rules/operating-rules.md",
    "skills/technical-onboarding.md",
    "skills/issue-triage.md",
    "skills/adoption-analysis.md",
    "skills/success-planning.md",
    "skills/risk-management.md",
    "subagents/integration-investigator.md",
    "subagents/adoption-analyst.md",
    "subagents/risk-reviewer.md",
    "subagents/communication-reviewer.md",
    "workflows/new-customer-onboarding.md",
    "workflows/technical-escalation.md",
    "workflows/health-review.md",
    "workflows/renewal-risk-recovery.md",
    "knowledge/customer-success-framework.md",
    "knowledge/technical-escalation-patterns.md",
    "hooks/lifecycle-hooks.md",
    "templates/success-plan.md",
    "templates/escalation-packet.md",
    "templates/handoff.md",
    "templates/failure-learning-record.md",
    "checklists/definition-of-done.md",
    "metrics/customer-health.md",
    "schemas/account-health.schema.json",
    "examples/account-health.example.json",
    "scripts/validate-account-health.py",
    "scripts/validate-package.py",
]


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) == 2 else Path(__file__).resolve().parents[1]
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    empty = [p for p in REQUIRED if (root / p).is_file() and (root / p).stat().st_size == 0]
    errors: list[str] = []
    if missing:
        errors.append("missing: " + ", ".join(missing))
    if empty:
        errors.append("empty: " + ", ".join(empty))
    for rel in ("schemas/account-health.schema.json", "examples/account-health.example.json"):
        path = root / rel
        if path.is_file():
            try:
                json.loads(path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError) as exc:
                errors.append(f"invalid JSON {rel}: {exc}")
    readme = root / "README.md"
    if readme.is_file():
        text = readme.read_text(encoding="utf-8")
        for rel in REQUIRED:
            if rel == "README.md":
                continue
            # README lists package tree at directory level; direct references are validated when present.
            if rel in text and not (root / rel).exists():
                errors.append(f"README references missing file: {rel}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"Package valid: {len(REQUIRED)} required files present and non-empty.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
