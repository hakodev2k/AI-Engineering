#!/usr/bin/env python3
import sys
from pathlib import Path

REQUIRED = [
    "README.md",
    "skills/requirement-elicitation.md",
    "skills/process-analysis.md",
    "skills/acceptance-criteria-engineering.md",
    "skills/gap-and-impact-analysis.md",
    "skills/traceability-management.md",
    "rules/operating-rules.md",
    "subagents/elicitation-specialist.md",
    "subagents/process-modeler.md",
    "subagents/acceptance-verifier.md",
    "subagents/traceability-reviewer.md",
    "workflows/new-requirement-delivery.md",
    "workflows/change-request-control.md",
    "workflows/ambiguity-and-conflict-resolution.md",
    "hooks/lifecycle-hooks.md",
    "knowledge/requirement-quality.md",
    "knowledge/process-and-change-analysis.md",
    "templates/requirement-spec.md",
    "templates/decision-record.md",
    "templates/failure-learning-record.md",
    "templates/handoff.md",
    "checklists/definition-of-done.md",
    "config/role-config.yaml",
    "schemas/requirement.schema.json",
    "examples/requirement.example.json",
    "metrics/analysis-quality.md",
    "scripts/validate-requirements.py",
    "scripts/validate-package.py",
]

root = Path(__file__).resolve().parents[1]
missing = [p for p in REQUIRED if not (root / p).is_file()]
if missing:
    print("ERROR: missing required package files:", file=sys.stderr)
    for item in missing:
        print(f" - {item}", file=sys.stderr)
    raise SystemExit(2)
print(f"OK: package manifest complete ({len(REQUIRED)} files)")
