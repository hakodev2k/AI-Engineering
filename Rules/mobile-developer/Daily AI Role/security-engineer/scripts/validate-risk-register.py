#!/usr/bin/env python3
import json, sys

REQUIRED=['id','asset','attack_path','risk','owner','status','residual_risk','verification']
VALID_RISK={'low','medium','high','critical'}

def main():
    if len(sys.argv)!=2:
        print('usage: validate-risk-register.py risk-register.json', file=sys.stderr); return 2
    try:
        data=json.load(open(sys.argv[1],encoding='utf-8'))
    except Exception as e:
        print(f'cannot read JSON: {e}', file=sys.stderr); return 2
    if not isinstance(data,list):
        print('risk register must be a JSON array', file=sys.stderr); return 1
    errors=[]
    for i,item in enumerate(data):
        missing=[k for k in REQUIRED if not item.get(k)]
        if missing: errors.append(f'item {i}: missing {", ".join(missing)}')
        if item.get('risk') not in VALID_RISK: errors.append(f'item {i}: invalid risk')
        if item.get('risk') in {'high','critical'} and item.get('status')=='closed' and item.get('verification') in {'','pending',None}:
            errors.append(f'item {i}: high/critical closed without verification')
    if errors:
        print('\n'.join(errors), file=sys.stderr); return 1
    print('risk register validation passed'); return 0

if __name__=='__main__': raise SystemExit(main())
