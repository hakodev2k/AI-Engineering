#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED=[
'README.md','config/budget-policy.yaml','schemas/usage-event.schema.json','schemas/gate-result.schema.json',
'scripts/llm_cost_gate.py','scripts/verify_package.py','skills/cost-investigation.md','skills/budget-exception-review.md',
'rules/cost-safety.md','subagents/cost-investigator.md','subagents/verification-agent.md','workflows/cost-anomaly-gate.md',
'hooks/lifecycle.md','templates/budget-override-request.md','examples/usage-events.jsonl','tests/test_llm_cost_gate.py']

def main():
    root=Path(__file__).resolve().parents[1]
    missing=[p for p in REQUIRED if not (root/p).is_file() or (root/p).stat().st_size==0]
    if missing:
        print('Missing or empty files:')
        for p in missing: print('-',p)
        return 1
    print(f'Package verification passed: {len(REQUIRED)} required files present and non-empty.')
    return 0

if __name__=='__main__': sys.exit(main())
