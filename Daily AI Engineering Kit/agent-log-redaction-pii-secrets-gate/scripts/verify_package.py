#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[
 'README.md','config/redaction.yaml','scripts/redact_logs.py','scripts/verify_package.py',
 'skills/log-evidence-sanitization.md','skills/redaction-policy-tuning.md','rules/sensitive-log-safety.md',
 'subagents/evidence-collector.md','subagents/redaction-verifier.md','workflows/sanitize-before-llm.md',
 'hooks/lifecycle.md','schemas/redaction-report.schema.json','templates/evidence-request.md',
 'examples/sample-unsafe.log','tests/test_redact_logs.py'
]
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
 print('Missing files: '+', '.join(missing)); sys.exit(2)
empty=[str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and p.stat().st_size==0]
if empty:
 print('Empty files: '+', '.join(empty)); sys.exit(3)
print(f'Package verification passed: {len(REQUIRED)} required files present.')
