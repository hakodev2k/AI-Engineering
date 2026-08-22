#!/usr/bin/env python3
from pathlib import Path
import json, sys

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = [
"README.md","checklists/definition-of-done.md","config/role-config.yaml",
"examples/accessibility-work-item.example.json","hooks/lifecycle-hooks.md",
"knowledge/wcag-and-testing-model.md","knowledge/assistive-technology-and-input.md",
"metrics/accessibility-quality.md","rules/operating-rules.md",
"schemas/accessibility-work-item.schema.json",
"scripts/validate-accessibility-work-item.py","scripts/validate-package.py",
"skills/requirements-and-risk-assessment.md","skills/semantic-structure.md",
"skills/keyboard-and-focus.md","skills/screen-reader-compatibility.md",
"skills/visual-motion-media.md","skills/audit-triage-remediation.md",
"subagents/semantic-reviewer.md","subagents/interaction-reviewer.md",
"subagents/assistive-technology-reviewer.md","subagents/evidence-reviewer.md",
"templates/audit-report.md","templates/remediation-plan.md","templates/handoff.md",
"templates/failure-learning-record.md","workflows/feature-accessibility-review.md",
"workflows/release-accessibility-audit.md","workflows/defect-remediation.md",
"workflows/accessibility-regression.md"]

errors=[]
for rel in EXPECTED:
    p=ROOT/rel
    if not p.is_file(): errors.append(f"missing: {rel}")
    elif p.stat().st_size == 0: errors.append(f"empty: {rel}")
for rel in ["schemas/accessibility-work-item.schema.json","examples/accessibility-work-item.example.json"]:
    try: json.loads((ROOT/rel).read_text(encoding="utf-8"))
    except Exception as exc: errors.append(f"invalid JSON {rel}: {exc}")
actual=sorted(str(p.relative_to(ROOT)).replace('\\','/') for p in ROOT.rglob('*') if p.is_file())
extra=sorted(set(actual)-set(EXPECTED))
if extra: errors.append("unexpected files: " + ", ".join(extra))
if errors:
    print("PACKAGE INVALID", file=sys.stderr)
    for e in errors: print("- "+e, file=sys.stderr)
    raise SystemExit(1)
print(f"OK: {len(EXPECTED)} files present and basic contracts parse")