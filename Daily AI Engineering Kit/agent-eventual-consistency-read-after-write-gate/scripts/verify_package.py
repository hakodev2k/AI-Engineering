#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQUIRED = [
 'README.md','config/policy.yaml','scripts/consistency_gate.py','scripts/verify_package.py',
 'skills/investigate-consistency.md','skills/verify-read-after-write.md','rules/safety.md',
 'subagents/consistency-investigator.md','subagents/verification-agent.md',
 'workflows/read-after-write-gate.md','hooks/lifecycle.md','schemas/result.schema.json',
 'examples/sample-request.json','tests/test_consistency_gate.py'
]

def main():
    root = Path(__file__).resolve().parent.parent
    missing = [p for p in REQUIRED if not (root/p).is_file() or (root/p).stat().st_size == 0]
    banned = ['implementation omitted','remaining files omitted','same as above','continue similarly']
    bad=[]
    for rel in REQUIRED:
        p=root/rel
        if p.exists() and p.suffix in {'.md','.py','.json','.yaml','.yml'}:
            text=p.read_text(encoding='utf-8', errors='replace').lower()
            if any(x in text for x in banned): bad.append(rel)
    out={'status':'verified' if not missing and not bad else 'failed','missing':missing,'banned_content':bad}
    print(json.dumps(out))
    return 0 if out['status']=='verified' else 2
if __name__=='__main__': raise SystemExit(main())
