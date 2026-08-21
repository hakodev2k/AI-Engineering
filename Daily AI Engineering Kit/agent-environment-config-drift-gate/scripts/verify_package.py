#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','config/policy.yaml','scripts/config_drift_gate.py','scripts/verify_package.py','skills/config-baseline-capture.md','skills/config-drift-investigation.md','rules/config-drift-safety.md','subagents/config-inventory-agent.md','subagents/drift-verifier.md','workflows/config-drift-gate.md','hooks/lifecycle.md','schemas/drift-result.schema.json','templates/config-change-approval.md','examples/baseline.json','examples/current.json','tests/test_config_drift_gate.py']
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
empty=[str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and p.stat().st_size==0]
if missing:
 print('Missing files: '+', '.join(missing)); sys.exit(2)
if empty:
 print('Empty files: '+', '.join(empty)); sys.exit(3)
print(f'Package verification passed: {len(REQUIRED)} required files present.')
