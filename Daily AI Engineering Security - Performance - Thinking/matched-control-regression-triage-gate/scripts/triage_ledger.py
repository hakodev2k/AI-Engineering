#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    data=json.loads(Path(path).read_text(encoding='utf-8'))
    if not isinstance(data,dict): raise ValueError('ledger must be an object')
    return data

def nonempty(v): return isinstance(v,(str,list,dict)) and bool(v)

def check(data,stage):
    f=[]
    if not nonempty(data.get('failing_case')): f.append('missing_failing_case')
    search=data.get('control_search',{})
    status=search.get('status')
    if status not in ('found','not_found'): f.append('control_search_incomplete')
    if status=='found':
        if not nonempty(search.get('passing_control')): f.append('missing_passing_control')
        if not nonempty(search.get('evidence')): f.append('missing_control_evidence')
    if status=='not_found':
        if int(search.get('candidates_checked',0))<int(data.get('min_control_candidates',2)): f.append('control_search_not_bounded')
        if not nonempty(search.get('evidence')): f.append('missing_control_search_evidence')
    if stage in ('repair','verify'):
        if not nonempty(data.get('differences')): f.append('missing_difference_set')
        hyps=data.get('hypotheses',[])
        if not hyps: f.append('missing_hypotheses')
        for i,h in enumerate(hyps):
            if h.get('status','open')=='open':
                if not nonempty(h.get('evidence')): f.append(f'hypothesis_{i}_missing_evidence')
                if not nonempty(h.get('falsification_test')): f.append(f'hypothesis_{i}_missing_falsification')
        attempts=data.get('attempts',[]); max_attempts=int(data.get('max_attempts',3))
        if len(attempts)>max_attempts: f.append('attempt_budget_exceeded')
        seen=set()
        for i,a in enumerate(attempts):
            sig=(str(a.get('hypothesis','')),str(a.get('test','')))
            if sig in seen and not nonempty(a.get('new_evidence')): f.append(f'duplicate_attempt_without_evidence_{i}')
            seen.add(sig)
    if stage=='verify':
        v=data.get('verification',{})
        if v.get('status')!='passed': f.append('verification_not_passed')
        if not nonempty(v.get('evidence')): f.append('missing_verification_evidence')
        if not nonempty(v.get('control_regression_evidence')): f.append('missing_control_regression_evidence')
    return f

def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest='cmd',required=True)
    c=sub.add_parser('check'); c.add_argument('--ledger',required=True); c.add_argument('--stage',choices=['diagnose','repair','verify'],required=True)
    a=ap.parse_args()
    try: data=load(a.ledger); findings=check(data,a.stage)
    except Exception as e: print(json.dumps({'status':'error','error':str(e)})); return 2
    out={'status':'pass' if not findings else 'block','stage':a.stage,'findings':findings,'attempts':len(data.get('attempts',[])),'hypotheses':len(data.get('hypotheses',[]))}
    print(json.dumps(out,indent=2,sort_keys=True)); return 0 if not findings else 1

if __name__=='__main__': sys.exit(main())