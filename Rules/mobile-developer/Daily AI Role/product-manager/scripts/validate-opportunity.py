#!/usr/bin/env python3
import json, sys

REQ=['id','title','target_user','problem','evidence','desired_outcomes','metrics','strategic_fit','confidence','risk','assumptions','dependencies','review_date','stop_conditions','human_approval']

def fail(msg, code=2):
    print(f'ERROR: {msg}', file=sys.stderr); sys.exit(code)

def main():
    if len(sys.argv)!=2: fail('usage: validate-opportunity.py <file.json>')
    try:
        d=json.load(open(sys.argv[1], encoding='utf-8'))
    except Exception as e: fail(f'cannot read JSON: {e}')
    missing=[k for k in REQ if k not in d]
    if missing: fail('missing fields: '+', '.join(missing))
    for k in ['id','title','target_user','problem','strategic_fit','review_date']:
        if not isinstance(d[k],str) or not d[k].strip(): fail(f'{k} must be non-empty string')
    if d['confidence'] not in {'low','medium','high'}: fail('invalid confidence')
    if d['risk'] not in {'low','medium','high','critical'}: fail('invalid risk')
    for k in ['evidence','desired_outcomes','metrics','stop_conditions']:
        if not isinstance(d[k],list) or not d[k]: fail(f'{k} must be non-empty array')
    if not isinstance(d['human_approval'], bool): fail('human_approval must be boolean')
    if d['risk'] in {'high','critical'} and not d['human_approval']:
        fail('high/critical risk requires human_approval=true')
    print('OK: opportunity contract is valid')

if __name__=='__main__': main()
