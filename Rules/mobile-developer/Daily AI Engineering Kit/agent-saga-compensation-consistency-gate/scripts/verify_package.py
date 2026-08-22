#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[
    'README.md',
    'config/policy.yaml',
    'schemas/saga-result.schema.json',
    'rules/saga-safety.md',
    'skills/saga-assessment.md',
    'skills/compensation-design.md',
    'subagents/saga-explorer.md',
    'subagents/verification-agent.md',
    'workflows/saga-compensation-workflow.md',
    'hooks/lifecycle.md',
    'scripts/saga_gate.py',
    'scripts/verify_package.py',
    'examples/saga-plan.json',
    'tests/test_saga_gate.py'
]

missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
    print('Missing required files:')
    for p in missing: print(f'- {p}')
    sys.exit(2)

forbidden=('TODO','implementation omitted','remaining files omitted','same as above','add logic here','continue similarly','other files omitted for brevity')
violations=[]
for rel in REQUIRED:
    text=(ROOT/rel).read_text(encoding='utf-8')
    for token in forbidden:
        if token.lower() in text.lower(): violations.append(f'{rel}: {token}')
if violations:
    print('Forbidden placeholder text found:')
    for v in violations: print(f'- {v}')
    sys.exit(3)

print(f'Package verification passed: {len(REQUIRED)} required files present; no forbidden placeholders found.')
