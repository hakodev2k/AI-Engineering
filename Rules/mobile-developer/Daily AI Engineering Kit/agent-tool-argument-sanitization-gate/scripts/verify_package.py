#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','config/policy.yaml','scripts/tool_argument_gate.py','scripts/verify_package.py','skills/tool-request-validation.md','skills/high-risk-command-review.md','rules/tool-argument-safety.md','subagents/tool-request-planner.md','subagents/tool-request-verifier.md','workflows/gated-tool-execution.md','hooks/lifecycle.md','schemas/tool-request.schema.json','schemas/gate-result.schema.json','templates/tool-request.json','examples/safe-request.json','examples/blocked-request.json','tests/test_tool_argument_gate.py']
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
 print('Missing files: '+', '.join(missing)); sys.exit(2)
for p in ROOT.rglob('*'):
 if p.is_file() and p.stat().st_size==0:
  print('Empty file: '+str(p.relative_to(ROOT))); sys.exit(3)
print(f'Package verification passed: {len(REQUIRED)} required files present.')
