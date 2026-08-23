#!/usr/bin/env python3
from pathlib import Path
import json, subprocess, sys, tempfile
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','skills/investigate-ordering.md','skills/repair-ordering.md','rules/message-ordering-safety.md','subagents/ordering-investigator.md','subagents/verification-agent.md','workflows/message-ordering-gate.md','hooks/pre-change.md','hooks/final-verification.md','scripts/message_order_gate.py','config/policy.json','schemas/evidence.schema.json','templates/evidence.json','examples/evidence-pass.json','tests/test_message_order_gate.py']
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
    print('missing: '+', '.join(missing),file=sys.stderr); sys.exit(1)
for p in ['config/policy.json','schemas/evidence.schema.json','templates/evidence.json','examples/evidence-pass.json']:
    json.loads((ROOT/p).read_text(encoding='utf-8'))
cmd=[sys.executable,str(ROOT/'scripts/message_order_gate.py'),'--evidence',str(ROOT/'examples/evidence-pass.json'),'--policy',str(ROOT/'config/policy.json')]
r=subprocess.run(cmd,capture_output=True,text=True)
if r.returncode!=0:
    print(r.stdout+r.stderr,file=sys.stderr); sys.exit(1)
print(f'package verified: {len(REQUIRED)} required files')
