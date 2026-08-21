#!/usr/bin/env python3
import json,sys
REQ=['id','problem','target_users','outcome','acceptance_criteria','priority','decision_owner']
VALID={'low','medium','high','critical'}
def fail(msg,code=2): print(f'ERROR: {msg}',file=sys.stderr); sys.exit(code)
if len(sys.argv)!=2: fail('usage: validate-product-item.py <item.json>')
try: data=json.load(open(sys.argv[1],encoding='utf-8'))
except Exception as e: fail(f'invalid JSON: {e}')
missing=[k for k in REQ if k not in data]
if missing: fail('missing fields: '+', '.join(missing))
for k in ['id','problem','outcome','decision_owner']:
    if not isinstance(data[k],str) or not data[k].strip(): fail(f'{k} must be non-empty text')
for k in ['target_users','acceptance_criteria']:
    if not isinstance(data[k],list) or not data[k] or any(not isinstance(x,str) or not x.strip() for x in data[k]): fail(f'{k} must be a non-empty string array')
if data['priority'] not in VALID: fail('priority must be low|medium|high|critical')
if data['priority'] in {'high','critical'} and not data.get('risks'): fail('high/critical items require risks')
print('OK: product item contract is structurally valid')
