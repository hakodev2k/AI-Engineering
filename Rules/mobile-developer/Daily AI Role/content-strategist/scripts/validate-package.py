#!/usr/bin/env python3
"""Validate the Content Strategist package manifest and machine-readable artifacts.
Exit codes: 0 valid, 1 package invalid/incomplete, 2 invocation/runtime error.
Uses only the Python standard library and never modifies files.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

MANIFEST = {
    "README.md",
    "checklists/definition-of-done.md",
    "config/role-config.yaml",
    "examples/content-work-item.example.json",
    "hooks/lifecycle-hooks.md",
    "knowledge/content-strategy-principles.md",
    "knowledge/measurement-and-governance.md",
    "knowledge/prioritization-and-collaboration.md",
    "metrics/content-quality-metrics.md",
    "rules/operating-rules.md",
    "schemas/content-work-item.schema.json",
    "scripts/validate-package.py",
    "scripts/validate-work-item.py",
    "skills/audience-and-problem-research.md",
    "skills/content-architecture.md",
    "skills/content-briefing.md",
    "skills/content-performance-analysis.md",
    "skills/editorial-review.md",
    "skills/repurposing-and-channel-adaptation.md",
    "subagents/audience-researcher.md",
    "subagents/claims-verifier.md",
    "subagents/editorial-reviewer.md",
    "subagents/performance-analyst.md",
    "templates/content-brief.md",
    "templates/content-handoff.md",
    "templates/strategy-plan.md",
    "workflows/content-production-and-publishing.md",
    "workflows/content-refresh-and-retirement.md",
    "workflows/content-strategy-cycle.md",
    "workflows/urgent-content-response.md",
}


def main() -> int:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) == 2 else Path(__file__).resolve().parents[1]
    if len(sys.argv) > 2:
        print("Usage: validate-package.py [package-root]", file=sys.stderr)
        return 2
    errors: list[str] = []
    actual = {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file()}
    missing = sorted(MANIFEST - actual)
    unexpected = sorted(actual - MANIFEST)
    if missing:
        errors.append("missing files: " + ", ".join(missing))
    if unexpected:
        errors.append("unexpected files: " + ", ".join(unexpected))
    for rel in sorted(MANIFEST & actual):
        p = root / rel
        try:
            if p.stat().st_size == 0:
                errors.append(f"empty file: {rel}")
        except OSError as exc:
            errors.append(f"cannot stat {rel}: {exc}")
    for rel in ["schemas/content-work-item.schema.json", "examples/content-work-item.example.json"]:
        p = root / rel
        if p.exists():
            try:
                json.loads(p.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError) as exc:
                errors.append(f"invalid JSON {rel}: {exc}")
    required_readme_terms = ["Mission", "Responsibilities", "Non-responsibilities", "Inputs", "Outputs", "Stakeholders", "Prioritization", "Human approval", "Failure", "Definition of Done"]
    readme = root / "README.md"
    if readme.exists():
        try:
            text = readme.read_text(encoding="utf-8")
            for term in required_readme_terms:
                if term.lower() not in text.lower():
                    errors.append(f"README missing required concept: {term}")
        except OSError as exc:
            errors.append(f"cannot read README.md: {exc}")
    if errors:
        for err in errors:
            print(f"ERROR: {err}", file=sys.stderr)
        return 1
    print(f"OK: package complete ({len(MANIFEST)} files) at {root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
