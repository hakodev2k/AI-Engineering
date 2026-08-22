#!/usr/bin/env python3
"""Validate JSONL escalation decisions for evidence and repeated failure signatures."""
import argparse, json, sys
from collections import defaultdict

def main():
    p=argparse.ArgumentParser()
    p.add_argument('trace')
    p.add_argument('--max-per-signature',type=int,default=1)
    a=p.parse_args()
    if a.max_per_signature < 1:
        print('max-per-signature must be >=1',file=sys.stderr); return 2
    counts=defaultdict(int); violations=[]
    try: fh=open(a.trace,encoding='utf-8')
    except OSError as e: print(e,file=sys.stderr); return 2
    for n,line in enumerate(fh,1):
        if not line.strip(): continue
        try: e=json.loads(line)
        except Exception as ex: print(f'line {n}: {ex}',file=sys.stderr); return 2
        required=('signature','decision','facts','evidence','verification_status')
        missing=[k for k in required if k not in e]
        if missing: violations.append({'line':n,'reason':'missing fields','fields':missing}); continue
        sig=str(e['signature'])
        if e['decision']=='escalate':
            counts[sig]+=1
            if not e['evidence']:
                violations.append({'line':n,'signature':sig,'reason':'escalation without evidence'})
            if e.get('boundary_crossing') is not True:
                violations.append({'line':n,'signature':sig,'reason':'escalation without verified boundary crossing'})
            if counts[sig] > a.max_per_signature:
                violations.append({'line':n,'signature':sig,'reason':'repeated escalation for same signature'})
        if e.get('approval_status')=='allowed' and e['verification_status'] not in ('verified-success','verified-failure'):
            violations.append({'line':n,'signature':sig,'reason':'approval treated without explicit postcondition verification'})
    print(json.dumps({'escalation_counts':dict(counts),'violations':violations},indent=2))
    return 3 if violations else 0

if __name__=='__main__': raise SystemExit(main())
