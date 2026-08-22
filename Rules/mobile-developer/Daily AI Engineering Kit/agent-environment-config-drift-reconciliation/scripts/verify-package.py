#!/usr/bin/env python3
from pathlib import Path
import json, sys
ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
 'README.md','config/drift-policy.json','schemas/drift-report.schema.json',
 'skills/config-drift-analysis.md','rules/config-drift-safety.md',
 'subagents/config-drift-investigator.md','subagents/config-drift-verifier.md',
 'workflows/reconcile-config-drift.md','hooks/pre-reconcile.md','hooks/post-reconcile.md',
 'scripts/scan-config-drift.py','scripts/verify-package.py',
 'examples/inventory.json','examples/production.json','examples/staging.json'
]
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
 print('missing required files: '+', '.join(missing), file=sys.stderr); sys.exit(2)
for rel in ['config/drift-policy.json','schemas/drift-report.schema.json','examples/inventory.json','examples/production.json','examples/staging.json']:
 try: json.loads((ROOT/rel).read_text(encoding='utf-8'))
 except Exception as e:
  print(f'invalid JSON {rel}: {e}', file=sys.stderr); sys.exit(3)
readme=(ROOT/'README.md').read_text(encoding='utf-8')
for rel in REQUIRED[1:]:
 if rel not in readme:
  print(f'README missing reference: {rel}', file=sys.stderr); sys.exit(4)
print(f'package verified: {len(REQUIRED)} required files present and JSON inputs valid')
