#!/usr/bin/env python3
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1]
required=['README.md','rules/operating-rules.md','hooks/lifecycle-hooks.md','checklists/definition-of-done.md','schemas/prompt-spec.schema.json','examples/prompt-spec.example.json','scripts/validate-prompt-spec.py']
missing=[p for p in required if not (root/p).exists()]
if missing:
 print('ERROR missing: '+', '.join(missing),file=sys.stderr); sys.exit(1)
for p in ['schemas/prompt-spec.schema.json','examples/prompt-spec.example.json']:
 try: json.loads((root/p).read_text())
 except Exception as e: print(f'ERROR {p}: {e}',file=sys.stderr); sys.exit(1)
print('OK: package manifest and JSON files valid')
