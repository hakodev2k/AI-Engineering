#!/usr/bin/env python3
import argparse,json,sys

def main():
    p=argparse.ArgumentParser(); p.add_argument('evidence'); a=p.parse_args()
    try:
        d=json.load(open(a.evidence,encoding='utf-8'))
    except Exception as e:
        print(f'INVALID evidence: {e}',file=sys.stderr); return 2
    errors=[]
    if d.get('status') not in {'pass','fail','blocked'}: errors.append('invalid status')
    v=d.get('verification',{})
    for k in ('contention','expiry','stale_owner'):
        if not isinstance(v.get(k),bool): errors.append(f'verification.{k} must be boolean')
    for i,f in enumerate(d.get('findings',[])):
        for k in ('id','risk','evidence','recommendation'):
            if k not in f: errors.append(f'findings[{i}] missing {k}')
    if d.get('status')=='pass' and not all(v.get(k) is True for k in ('contention','expiry','stale_owner')): errors.append('pass requires all verification checks')
    if errors:
        print('\n'.join(errors),file=sys.stderr); return 2
    print('Evidence contract valid'); return 0
if __name__=='__main__': sys.exit(main())
