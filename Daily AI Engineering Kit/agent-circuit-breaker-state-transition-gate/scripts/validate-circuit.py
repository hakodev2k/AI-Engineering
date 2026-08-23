#!/usr/bin/env python3
import argparse,json,sys,time
from pathlib import Path

def load(p):
    try:return json.loads(Path(p).read_text(encoding='utf-8'))
    except Exception as e: print(f'ERROR: {e}',file=sys.stderr);sys.exit(2)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('evidence');ap.add_argument('--min-requests',type=int,default=10);ap.add_argument('--threshold',type=float,default=.5);a=ap.parse_args()
    d=load(a.evidence); obs=d.get('observations',[])
    if not isinstance(obs,list): print('ERROR: observations must be array',file=sys.stderr);return 2
    counted=[x for x in obs if x.get('outcome') in ('success','retryable-failure')]
    failures=sum(x.get('outcome')=='retryable-failure' for x in counted)
    rate=failures/len(counted) if counted else 0
    expected='open' if len(counted)>=a.min_requests and rate>=a.threshold else 'closed'
    actual=d.get('state')
    print(json.dumps({'requests':len(counted),'failures':failures,'failure_rate':round(rate,4),'expected_baseline_state':expected,'reported_state':actual},indent=2))
    if actual not in ('closed','open','half-open'): return 2
    if actual=='half-open': return 0
    return 0 if actual==expected else 1
if __name__=='__main__': sys.exit(main())
