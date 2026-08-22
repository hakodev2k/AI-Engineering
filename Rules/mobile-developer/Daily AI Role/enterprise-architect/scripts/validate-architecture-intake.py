#!/usr/bin/env python3
import json,sys
REQ=['request_id','decision','decision_owner','business_outcome','scope','source_refs']
def fail(msg,code=1): print(f'ERROR: {msg}',file=sys.stderr); sys.exit(code)
if len(sys.argv)!=2: fail('usage: validate-architecture-intake.py <file.json>',2)
try:
 d=json.load(open(sys.argv[1],encoding='utf-8'))
except Exception as e: fail(str(e),2)
if not isinstance(d,dict): fail('root must be object')
for k in REQ:
 if k not in d: fail(f'missing {k}')
for k in ['request_id','decision','decision_owner','business_outcome']:
 if not isinstance(d[k],str) or not d[k].strip(): fail(f'{k} must be non-empty string')
for k in ['scope','source_refs']:
 if not isinstance(d[k],list) or not d[k] or len(d[k])!=len(set(d[k])): fail(f'{k} must be non-empty unique string array')
print('OK: architecture intake valid')