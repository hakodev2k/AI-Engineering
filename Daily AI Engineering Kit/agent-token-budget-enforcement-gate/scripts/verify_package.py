#!/usr/bin/env python3
from pathlib import Path
import sys
REQUIRED=['README.md','config/policy.yaml','schemas/budget-report.schema.json','scripts/token_budget_gate.py','scripts/verify_package.py','skills/token-budget-audit.md','skills/context-compaction.md','rules/token-budget-safety.md','subagents/budget-auditor.md','subagents/context-optimizer.md','workflows/token-budget-enforcement.md','hooks/lifecycle.md','tests/test_token_budget_gate.py','examples/usage.json']
root=Path(__file__).resolve().parents[1]
missing=[p for p in REQUIRED if not (root/p).is_file()]
forbidden=['TODO','implementation omitted','remaining files omitted','same as above','add logic here','continue similarly','other files omitted for brevity']
violations=[]
for p in REQUIRED:
    f=root/p
    if f.is_file():
        text=f.read_text(encoding='utf-8')
        for token in forbidden:
            if token.lower() in text.lower(): violations.append(f'{p}: {token}')
if missing or violations:
    print('missing=',missing); print('violations=',violations); sys.exit(1)
print(f'package verified: {len(REQUIRED)} files')
