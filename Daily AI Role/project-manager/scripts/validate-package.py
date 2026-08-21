#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
required = [
 'README.md','rules/operating-rules.md','hooks/lifecycle-hooks.md',
 'checklists/definition-of-done.md','config/role-config.yaml',
 'schemas/project-plan.schema.json','scripts/validate-project-plan.py',
 'skills/project-chartering.md','skills/integrated-planning.md',
 'skills/risk-issue-management.md','skills/change-control.md',
 'skills/stakeholder-communication.md',
 'workflows/project-initiation-and-planning.md',
 'workflows/delivery-monitoring-and-recovery.md',
 'workflows/change-request-control.md'
]
missing=[p for p in required if not (ROOT/p).is_file()]
if missing:
 print('Missing required artifacts:')
 for p in missing: print('-',p)
 sys.exit(2)
print(f'Package valid: {len(required)} required artifacts found.')
