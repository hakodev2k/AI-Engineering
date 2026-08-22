#!/usr/bin/env python3
from pathlib import Path
import json, sys

ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[
 'README.md',
 'config/rate-limit-policy.yaml',
 'scripts/adaptive_throttle.py',
 'scripts/verify_package.py',
 'tests/test_adaptive_throttle.py',
 'schemas/gate-result.schema.json',
 'skills/rate-limit-investigation.md',
 'skills/adaptive-policy-change.md',
 'rules/rate-limit-safety.md',
 'subagents/rate-limit-investigator.md',
 'subagents/rate-limit-implementer.md',
 'subagents/rate-limit-verifier.md',
 'workflows/adaptive-throttling.md',
 'hooks/lifecycle.md',
 'templates/finding.md',
 'examples/gate-result.json'
]

def main():
    missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
    empty=[p for p in REQUIRED if (ROOT/p).is_file() and (ROOT/p).stat().st_size==0]
    try:
        json.loads((ROOT/'schemas/gate-result.schema.json').read_text(encoding='utf-8'))
        json.loads((ROOT/'examples/gate-result.json').read_text(encoding='utf-8'))
    except Exception as e:
        print(f'json validation failed: {e}',file=sys.stderr); return 3
    if missing or empty:
        if missing: print('missing: '+', '.join(missing),file=sys.stderr)
        if empty: print('empty: '+', '.join(empty),file=sys.stderr)
        return 2
    forbidden=['implementation omitted','remaining files omitted','same as above','continue similarly','other files omitted for brevity']
    for rel in REQUIRED:
        text=(ROOT/rel).read_text(encoding='utf-8',errors='ignore').lower()
        for phrase in forbidden:
            if phrase in text:
                print(f'forbidden placeholder phrase in {rel}: {phrase}',file=sys.stderr); return 4
    print(f'package verification passed: {len(REQUIRED)} required files present and non-empty')
    return 0

if __name__=='__main__': raise SystemExit(main())
