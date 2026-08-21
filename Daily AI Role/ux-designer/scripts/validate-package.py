#!/usr/bin/env python3
from pathlib import Path
import os, sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','checklists/definition-of-done.md','config/role-config.yaml','examples/ux-work-item.example.json','hooks/lifecycle-hooks.md','knowledge/accessibility-and-inclusive-design.md','knowledge/ux-reasoning-principles.md','metrics/ux-quality.md','rules/operating-rules.md','schemas/ux-work-item.schema.json','scripts/validate-package.py','scripts/validate-ux-work-item.py','skills/accessibility-review.md','skills/interaction-design.md','skills/research-synthesis.md','skills/usability-evaluation.md','skills/ux-problem-framing.md','subagents/accessibility-reviewer.md','subagents/interaction-consistency-reviewer.md','subagents/research-evidence-reviewer.md','subagents/usability-risk-reviewer.md','templates/design-decision-record.md','templates/failure-learning-record.md','templates/handoff.md','templates/research-synthesis.md','templates/usability-test-plan.md','workflows/design-discovery-to-handoff.md','workflows/design-review-and-validation.md','workflows/usability-incident-response.md']
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
empty=[p for p in REQUIRED if (ROOT/p).is_file() and (ROOT/p).stat().st_size==0]
if missing or empty:
    print('Package validation failed.')
    if missing: print('Missing:', *missing, sep='\n- ')
    if empty: print('Empty:', *empty, sep='\n- ')
    sys.exit(1)
for p in ['scripts/validate-package.py','scripts/validate-ux-work-item.py']:
    if os.name != 'nt' and not ((ROOT/p).stat().st_mode & 0o111):
        print(f'Executable bit missing: {p}'); sys.exit(1)
print(f'Package valid: {len(REQUIRED)} required files present.')
