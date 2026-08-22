#!/usr/bin/env python3
import json,sys
REQ=['id','title','user_group','problem','desired_outcome','risk_level','status','owner']
RISKS={'low','medium','high','critical'}
STATES={'intake','discovery','design','review','handoff','validation','done','blocked'}
def fail(msg,code=1): print(f'Invalid UX work item: {msg}',file=sys.stderr); sys.exit(code)
if len(sys.argv)!=2: fail('usage: validate-ux-work-item.py <file.json>',2)
try:
    with open(sys.argv[1],encoding='utf-8') as f: d=json.load(f)
except Exception as e: fail(str(e),2)
if not isinstance(d,dict): fail('root must be an object')
for k in REQ:
    if k not in d or d[k] in ('',None): fail(f'missing required field: {k}')
if d['risk_level'] not in RISKS: fail('invalid risk_level')
if d['status'] not in STATES: fail('invalid status')
for k in ('evidence','assumptions','constraints'):
    if k in d and (not isinstance(d[k],list) or not all(isinstance(x,str) for x in d[k])): fail(f'{k} must be an array of strings')
print('UX work item valid.')
