#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','config/policy.yaml','scripts/resilience_gate.py','scripts/verify_package.py','skills/resilient-tool-call.md','skills/resilience-policy-review.md','rules/resilience-safety.md','subagents/call-executor.md','subagents/resilience-verifier.md','workflows/resilient-external-call.md','hooks/lifecycle.md','schemas/decision.schema.json','templates/call-request.md','examples/retryable-503.json','tests/test_resilience_gate.py']
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
 print('Missing files: '+', '.join(missing)); sys.exit(2)
for p in ROOT.rglob('*'):
 if p.is_file() and p.stat().st_size==0:
  print('Empty file: '+str(p.relative_to(ROOT))); sys.exit(3)
print(f'Package verification passed: {len(REQUIRED)} required files present.')
