#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    'README.md','rules/operating-rules.md','hooks/lifecycle-hooks.md',
    'skills/ci-cd-pipeline-engineering.md','skills/release-engineering.md',
    'skills/infrastructure-change-analysis.md','skills/deployment-failure-triage.md',
    'skills/environment-drift-analysis.md','subagents/pipeline-implementer.md',
    'subagents/change-risk-reviewer.md','subagents/incident-investigator.md',
    'subagents/verification-agent.md','workflows/pipeline-change.md',
    'workflows/production-release.md','workflows/deployment-recovery.md',
    'knowledge/delivery-reliability.md','knowledge/ci-cd-design-principles.md',
    'templates/release-plan.md','templates/incident-handoff.md',
    'checklists/definition-of-done.md','config/role-config.yaml',
    'schemas/release-contract.schema.json','examples/release-contract.example.json',
    'scripts/validate-release.py'
]
FORBIDDEN = ['implementation omitted','remaining files omitted','same as above','add logic here','continue similarly','other files omitted for brevity']
errors=[]
for rel in REQUIRED:
    p=ROOT/rel
    if not p.is_file() or p.stat().st_size == 0:
        errors.append(f'missing-or-empty: {rel}')
for p in ROOT.rglob('*'):
    if p.is_file() and p.suffix.lower() in {'.md','.py','.json','.yaml','.yml'}:
        text=p.read_text(encoding='utf-8', errors='replace').lower()
        for phrase in FORBIDDEN:
            if phrase in text:
                errors.append(f'forbidden-placeholder: {p.relative_to(ROOT)}: {phrase}')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'package-ok: {len(REQUIRED)+1} required artifacts checked')
