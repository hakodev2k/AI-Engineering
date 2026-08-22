#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path
REQUIRED=['README.md','config/gate-policy.json','schemas/finding.schema.json','scripts/scan-resilience.py','scripts/verify-package.py','skills/investigate-failure-isolation.md','skills/design-resilience-change.md','rules/resilience-safety.md','subagents/resilience-investigator.md','subagents/verification-agent.md','workflows/circuit-breaker-gate.md','hooks/pre-change-scan.md','hooks/final-verification.md','examples/sample-client.cs']
def main():
 p=argparse.ArgumentParser(); p.add_argument('--root',default='.'); a=p.parse_args(); r=Path(a.root).resolve(); missing=[x for x in REQUIRED if not (r/x).is_file()]
 bad=[]
 for rel in REQUIRED:
  f=r/rel
  if f.is_file():
   t=f.read_text(encoding='utf-8',errors='ignore').lower()
   if not t.strip() or 'implementation omitted' in t or 'remaining files omitted' in t or 'same as above' in t: bad.append(rel)
 for rel in ['config/gate-policy.json','schemas/finding.schema.json']:
  try: json.loads((r/rel).read_text(encoding='utf-8'))
  except Exception: bad.append(rel)
 print(json.dumps({'missing':missing,'invalid':sorted(set(bad))},indent=2)); return 1 if missing or bad else 0
if __name__=='__main__': sys.exit(main())
