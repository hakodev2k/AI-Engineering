#!/usr/bin/env python3
import json, os, sys

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REQUIRED=[
 'README.md','config/retry-after-policy.json','hooks/post-rate-limit-response.md',
 'rules/retry-after-rules.md','schemas/retry-decision.schema.json',
 'scripts/retry_after_gate.py','scripts/verify_package.py',
 'skills/triage-rate-limit-retry.md','subagents/retry-policy-investigator.md',
 'subagents/verification-agent.md','templates/retry-investigation-report.md',
 'tests/test_retry_after_gate.py','workflows/retry-after-compliance-gate.md',
 'examples/retry-decision.example.json'
]

def main():
    missing=[p for p in REQUIRED if not os.path.isfile(os.path.join(ROOT,p))]
    empty=[p for p in REQUIRED if os.path.isfile(os.path.join(ROOT,p)) and os.path.getsize(os.path.join(ROOT,p))==0]
    if missing or empty:
        if missing: print('missing: '+', '.join(missing), file=sys.stderr)
        if empty: print('empty: '+', '.join(empty), file=sys.stderr)
        return 2
    for p in ('config/retry-after-policy.json','schemas/retry-decision.schema.json','examples/retry-decision.example.json'):
        with open(os.path.join(ROOT,p),encoding='utf-8') as f: json.load(f)
    banned=('implementation omitted','remaining files omitted','same as above','add logic here','continue similarly','other files omitted for brevity')
    for rel in REQUIRED:
        if rel.endswith(('.md','.py','.json')):
            text=open(os.path.join(ROOT,rel),encoding='utf-8').read().lower()
            for token in banned:
                if token in text:
                    print(f'banned placeholder in {rel}: {token}',file=sys.stderr); return 3
    print(f'package verification passed: {len(REQUIRED)} files')
    return 0

if __name__=='__main__': raise SystemExit(main())
