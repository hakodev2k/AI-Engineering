#!/usr/bin/env python3
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REQ=['README.md','config/policy.json','schemas/evidence.schema.json','scripts/scan-taint.py','scripts/verify-package.py','skills/trace-untrusted-data.md','skills/contain-and-sanitize.md','rules/taint-safety.md','subagents/taint-investigator.md','subagents/independent-verifier.md','workflows/tool-output-taint-gate.md','hooks/pre-sensitive-action.md','tests/test-scan-taint.py','examples/untrusted-tool-output.txt']
missing=[p for p in REQ if not (ROOT/p).is_file()]
try: policy=json.loads((ROOT/'config/policy.json').read_text())
except Exception as e: print(f'policy invalid: {e}');sys.exit(2)
errors=[]
if policy.get('max_retries')!=2: errors.append('max_retries must be 2')
for p in REQ:
 if (ROOT/p).is_file() and (ROOT/p).stat().st_size==0: errors.append(f'empty: {p}')
if missing: errors += [f'missing: {p}' for p in missing]
if errors:
 print('\n'.join(errors));sys.exit(1)
print(f'package verified: {len(REQ)} required files present; policy valid')
