#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','config/license-policy.yaml','scripts/license_gate.py','scripts/verify_package.py','skills/dependency-license-review.md','skills/license-exception-review.md','rules/dependency-license-safety.md','subagents/dependency-inventory-agent.md','subagents/license-verifier.md','workflows/license-compliance-gate.md','hooks/lifecycle.md','schemas/license-gate-result.schema.json','templates/license-exception-request.md','examples/sbom-pass.json','examples/sbom-block.json','tests/test_license_gate.py']
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
    print('Missing files: '+', '.join(missing)); sys.exit(2)
for p in ROOT.rglob('*'):
    if p.is_file() and p.stat().st_size==0:
        print('Empty file: '+str(p.relative_to(ROOT))); sys.exit(3)
print(f'Package verification passed: {len(REQUIRED)} required files present.')
