#!/usr/bin/env python3
import sys
from pathlib import Path
REQUIRED=['README.md','config/gate.yaml','schemas/finding.schema.json','skills/investigate-poison-message.md','skills/design-quarantine-path.md','rules/queue-safety.md','subagents/queue-explorer.md','subagents/implementation-agent.md','subagents/verification-agent.md','workflows/poison-message-gate.md','hooks/pre-task.md','hooks/final-verification.md','scripts/scan_queue_handlers.py','scripts/verify_package.py','templates/investigation-report.md']
def main():
 root=Path(sys.argv[1] if len(sys.argv)>1 else '.'); missing=[p for p in REQUIRED if not (root/p).is_file()]
 empty=[p for p in REQUIRED if (root/p).is_file() and (root/p).stat().st_size==0]
 if missing or empty:
  print('missing:',*missing,sep='\n- ');print('empty:',*empty,sep='\n- ');return 1
 banned=['implementation omitted','remaining files omitted','same as above','add logic here','continue similarly','other files omitted for brevity']
 bad=[]
 for p in REQUIRED:
  t=(root/p).read_text(encoding='utf-8',errors='ignore').lower()
  if any(x in t for x in banned): bad.append(p)
 if bad: print('banned placeholder text:',*bad,sep='\n- ');return 1
 print(f'PASS: {len(REQUIRED)} required files present, non-empty, placeholder-free');return 0
if __name__=='__main__': raise SystemExit(main())
