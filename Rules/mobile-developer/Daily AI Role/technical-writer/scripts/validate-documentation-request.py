#!/usr/bin/env python3
import json, sys
REQ=['request_id','title','audience','documentation_type','product_area','version_scope','goal','source_artifacts','risk_level','owner']
TYPES={'tutorial','how-to','concept','reference','troubleshooting','runbook','release-note','migration-guide'}
RISKS={'low','medium','high','critical'}
def fail(msg,code=1): print('ERROR:',msg,file=sys.stderr); sys.exit(code)
if len(sys.argv)!=2: fail('usage: validate-documentation-request.py <request.json>',2)
try:
    d=json.load(open(sys.argv[1],encoding='utf-8'))
except Exception as e: fail(f'cannot read JSON: {e}',2)
missing=[k for k in REQ if k not in d]
if missing: fail('missing required fields: '+', '.join(missing))
for k in ['request_id','title','product_area','goal','owner']:
    if not isinstance(d[k],str) or not d[k].strip(): fail(f'{k} must be non-empty string')
for k in ['audience','version_scope','source_artifacts']:
    if not isinstance(d[k],list) or not d[k] or not all(isinstance(x,str) and x.strip() for x in d[k]): fail(f'{k} must be non-empty string array')
if d['documentation_type'] not in TYPES: fail('invalid documentation_type')
if d['risk_level'] not in RISKS: fail('invalid risk_level')
print('OK: documentation request is structurally valid')