#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQUIRED = ['status','stream','ordering_key','sequence_strategy','duplicate_strategy','replay_strategy','findings','verification']
VERIFY = ['out_of_order','duplicate_replay','stale_event','parallel_consumer']

if len(sys.argv) != 2:
    print('usage: validate-assessment.py <assessment.json>', file=sys.stderr); sys.exit(64)
p=Path(sys.argv[1])
try: data=json.loads(p.read_text())
except Exception as e:
    print(f'invalid json: {e}', file=sys.stderr); sys.exit(65)
missing=[k for k in REQUIRED if k not in data]
if missing:
    print('missing: '+', '.join(missing), file=sys.stderr); sys.exit(2)
if data['status'] not in {'pass','fail','needs-approval','blocked'}:
    print('invalid status', file=sys.stderr); sys.exit(2)
if not isinstance(data['findings'], list):
    print('findings must be array', file=sys.stderr); sys.exit(2)
for i,f in enumerate(data['findings']):
    for k in ('severity','finding','evidence','recommended_action'):
        if not f.get(k): print(f'finding[{i}] missing {k}', file=sys.stderr); sys.exit(2)
ver=data.get('verification',{})
for k in VERIFY:
    if not isinstance(ver.get(k), bool): print(f'verification.{k} must be boolean', file=sys.stderr); sys.exit(2)
if data['status']=='pass' and not all(ver[k] for k in VERIFY):
    print('pass requires all verification checks true', file=sys.stderr); sys.exit(3)
print('assessment valid')
