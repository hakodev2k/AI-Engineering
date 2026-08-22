#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','config/policy.yaml','scripts/scan_selectors.py','scripts/verify_package.py','skills/selector-hardening.md','skills/failed-locator-recovery.md','rules/playwright-resilience.md','subagents/browser-test-investigator.md','subagents/browser-test-verifier.md','workflows/selector-resilience-workflow.md','hooks/lifecycle.md','schemas/selector-gate-result.schema.json','templates/locator-evidence.md','examples/resilient.spec.ts','examples/brittle.spec.ts','tests/test_scan_selectors.py']
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing: print('Missing: '+', '.join(missing)); sys.exit(2)
for p in ROOT.rglob('*'):
    if p.is_file() and p.stat().st_size==0: print('Empty: '+str(p.relative_to(ROOT))); sys.exit(3)
print(f'Package verification passed: {len(REQUIRED)} required files present.')
