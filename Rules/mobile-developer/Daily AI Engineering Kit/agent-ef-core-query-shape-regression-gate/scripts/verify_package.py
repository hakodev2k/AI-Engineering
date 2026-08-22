#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQ=['README.md','config/policy.yaml','scripts/scan_ef_queries.py','scripts/verify_package.py','skills/query-shape-investigation.md','skills/query-regression-remediation.md','rules/ef-core-query-safety.md','subagents/query-investigator.md','subagents/query-verifier.md','workflows/query-shape-regression-gate.md','hooks/lifecycle.md','schemas/scan-result.schema.json','examples/problematic-query.cs','tests/test_scan_ef_queries.py']
missing=[p for p in REQ if not (ROOT/p).is_file()]
if missing:
 print('Missing: '+', '.join(missing)); sys.exit(2)
for p in ROOT.rglob('*'):
 if p.is_file() and p.stat().st_size==0:
  print('Empty: '+str(p.relative_to(ROOT))); sys.exit(3)
print(f'Package verification passed: {len(REQ)} files present.')
