#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','config/policy.yaml','scripts/sql_safety_gate.py','scripts/verify_package.py','skills/sql-investigation.md','skills/sql-change-review.md','rules/sql-safety.md','subagents/sql-investigator.md','subagents/sql-verifier.md','workflows/sql-gated-execution.md','hooks/lifecycle.md','schemas/gate-result.schema.json','templates/sql-request.md','examples/safe-select.sql','examples/unsafe-update.sql','tests/test_sql_safety_gate.py']
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
 print('Missing files: '+', '.join(missing)); sys.exit(2)
for p in ROOT.rglob('*'):
 if p.is_file() and p.stat().st_size==0: print('Empty file: '+str(p.relative_to(ROOT))); sys.exit(3)
print(f'Package verification passed: {len(REQUIRED)} required files present.')
