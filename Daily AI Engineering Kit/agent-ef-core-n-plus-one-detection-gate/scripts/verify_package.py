#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
'README.md','config/policy.yaml','scripts/detect_n_plus_one.py','scripts/verify_package.py',
'skills/investigate-n-plus-one.md','skills/remediate-n-plus-one.md','rules/ef-core-query-safety.md',
'subagents/query-investigator.md','subagents/verification-agent.md','workflows/n-plus-one-gate.md',
'hooks/lifecycle.md','schemas/n-plus-one-result.schema.json','tests/test_detect_n_plus_one.py',
'examples/ef-log-sample.txt','examples/expected-result.json'
]
FORBIDDEN = ['TODO','implementation omitted','remaining files omitted','same as above','continue similarly']
root=Path(__file__).resolve().parents[1]
errors=[]
for rel in REQUIRED:
    p=root/rel
    if not p.is_file() or p.stat().st_size==0: errors.append(f'missing or empty: {rel}')
    elif any(x.lower() in p.read_text(encoding='utf-8',errors='ignore').lower() for x in FORBIDDEN): errors.append(f'forbidden placeholder: {rel}')
for rel in REQUIRED:
    if rel not in (root/'README.md').read_text(encoding='utf-8',errors='ignore') and rel!='README.md': errors.append(f'README missing reference: {rel}')
if errors:
    print('\n'.join(errors)); sys.exit(2)
print(f'package verified: {len(REQUIRED)} required files present')
