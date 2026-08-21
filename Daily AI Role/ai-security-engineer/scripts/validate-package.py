#!/usr/bin/env python3
"""Validate the standalone AI Security Engineer package without external dependencies."""

from __future__ import annotations

import ast
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = (
    "README.md",
    "checklists/review-checklist.md",
    "hooks/pre-review-validation.md",
    "knowledge/risk-framework.md",
    "knowledge/security-principles.md",
    "rules/security-rules.md",
    "scripts/security_scan.py",
    "scripts/validate-package.py",
    "skills/security-assessment.md",
    "skills/threat-modeling.md",
    "subagents/risk-analyst.md",
    "subagents/security-reviewer.md",
    "templates/security-assessment.md",
    "tests/test_security_scan.py",
    "workflows/incident-analysis.md",
    "workflows/security-review.md",
)
FORBIDDEN = (
    "implementation omitted",
    "remaining files omitted",
    "same as above",
    "lorem ipsum",
)


def main() -> int:
    errors: list[str] = []
    for relative_path in REQUIRED:
        path = ROOT / relative_path
        if not path.is_file():
            errors.append(f"missing: {relative_path}")
            continue
        if path.stat().st_size == 0:
            errors.append(f"empty: {relative_path}")
            continue
        if path.suffix.lower() in {".md", ".py"}:
            text = path.read_text(encoding="utf-8", errors="replace")
            for phrase in FORBIDDEN:
                if phrase in text.lower():
                    errors.append(f"placeholder in {relative_path}: {phrase}")
            if path.suffix.lower() == ".py":
                try:
                    ast.parse(text, filename=relative_path)
                except SyntaxError as error:
                    errors.append(f"invalid Python in {relative_path}:{error.lineno}: {error.msg}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"Package valid: {len(REQUIRED)} required files present; Python syntax parsed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
