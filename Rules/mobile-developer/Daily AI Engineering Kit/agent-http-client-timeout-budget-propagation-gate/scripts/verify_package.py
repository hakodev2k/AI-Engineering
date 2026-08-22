#!/usr/bin/env python3
import pathlib, sys
REQ=['README.md','config/policy.yaml','scripts/timeout_budget_gate.py','scripts/verify_package.py','skills/timeout-budget-investigation.md','skills/timeout-budget-remediation.md','rules/timeout-budget-safety.md','subagents/repository-explorer.md','subagents/verification-agent.md','workflows/timeout-budget-gate.md','hooks/lifecycle.md','schemas/timeout-budget-result.schema.json','tests/test_timeout_budget_gate.py']
root=pathlib.Path(__file__).resolve().parents[1]
missing=[p for p in REQ if not (root/p).exists()]
if missing:
 print('Missing files:'); [print(' - '+x) for x in missing]; sys.exit(2)
for p in REQ:
 t=(root/p).read_text(encoding='utf-8',errors='ignore')
 if 'TODO' in t or 'implementation omitted' in t:
  print('Placeholder found in '+p); sys.exit(3)
print('Package verification passed'); sys.exit(0)
