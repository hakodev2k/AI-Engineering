#!/usr/bin/env python3
import json, sys
REQ=['id','question','decision','owner','priority','deadline','population','grain','metrics','time_window','sources','assumptions','restricted_data']
PRIOR={'critical','high','medium','low'}
def fail(msg,code=1): print(f'ERROR: {msg}',file=sys.stderr); sys.exit(code)
if len(sys.argv)!=2: fail('usage: validate-analysis-contract.py <contract.json>',2)
try:
    with open(sys.argv[1],encoding='utf-8') as f: d=json.load(f)
except Exception as e: fail(f'cannot read JSON: {e}',2)
missing=[k for k in REQ if k not in d]
if missing: fail('missing: '+', '.join(missing))
if d['priority'] not in PRIOR: fail('invalid priority')
for k in ['metrics','sources']:
    if not isinstance(d[k],list) or not d[k]: fail(f'{k} must be non-empty list')
if not isinstance(d['time_window'],dict) or any(k not in d['time_window'] for k in ['start','end','timezone']): fail('time_window requires start,end,timezone')
if not isinstance(d['restricted_data'],bool): fail('restricted_data must be boolean')
print('OK: analysis contract is structurally valid')
