#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQUIRED = [
 'README.md','config/schema-policy.json','schemas/compatibility-report.schema.json',
 'skills/investigate-message-contract.md','skills/plan-schema-evolution.md',
 'rules/message-schema-safety.md','subagents/contract-explorer.md','subagents/compatibility-verifier.md',
 'workflows/schema-evolution-workflow.md','hooks/pre-merge-compatibility.md',
 'scripts/check-message-schema.py','scripts/verify-package.py',
 'examples/order-created-v1.schema.json','examples/order-created-v2.schema.json','tests/test-check-message-schema.py'
]
root = Path(__file__).resolve().parents[1]
errors=[]
for rel in REQUIRED:
    p=root/rel
    if not p.is_file() or p.stat().st_size == 0:
        errors.append(f'missing-or-empty:{rel}')
try:
    policy=json.loads((root/'config/schema-policy.json').read_text())
    if policy.get('max_retries') != 2: errors.append('policy:max_retries-must-be-2')
except Exception as e: errors.append(f'policy-invalid:{e}')
for rel in REQUIRED:
    if rel.endswith('.md'):
        text=(root/rel).read_text(encoding='utf-8') if (root/rel).exists() else ''
        for forbidden in ['implementation omitted','remaining files omitted','same as above','continue similarly']:
            if forbidden in text.lower(): errors.append(f'forbidden-placeholder:{rel}:{forbidden}')
if errors:
    print('\n'.join(errors), file=sys.stderr); sys.exit(1)
print(f'PASS: {len(REQUIRED)} required files present and package invariants satisfied')
