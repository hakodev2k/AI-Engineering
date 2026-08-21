#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

REQUIRED = {'status','window','signals','hypotheses','verification','risks'}
STATUSES = {'investigating','correlated','blocked','needs-approval','verified'}
SIGNAL_TYPES = {'logs','metrics','traces','deployments','alerts'}
RESULTS = {'not-run','failed','passed','inconclusive'}

def fail(msg):
    print(msg, file=sys.stderr); return 1

def main() -> int:
    p=argparse.ArgumentParser(description='Validate a triage report without third-party dependencies.')
    p.add_argument('report'); args=p.parse_args(); path=Path(args.report)
    if not path.is_file(): return fail('report not found')
    try: data=json.loads(path.read_text(encoding='utf-8'))
    except Exception as exc: return fail(f'invalid JSON: {exc}')
    missing=REQUIRED-set(data)
    if missing: return fail(f'missing fields: {sorted(missing)}')
    if data['status'] not in STATUSES: return fail('invalid status')
    if not isinstance(data['signals'], list) or not data['signals']: return fail('signals must be non-empty')
    for i,s in enumerate(data['signals']):
        for key in ('type','source','observed_at','finding'):
            if not s.get(key): return fail(f'signals[{i}] missing {key}')
        if s['type'] not in SIGNAL_TYPES: return fail(f'signals[{i}] invalid type')
    for i,h in enumerate(data['hypotheses']):
        c=h.get('confidence')
        if not isinstance(c,(int,float)) or c<0 or c>1: return fail(f'hypotheses[{i}] invalid confidence')
        for key in ('claim','supporting_evidence','contradicting_evidence'):
            if key not in h: return fail(f'hypotheses[{i}] missing {key}')
    v=data['verification']
    if v.get('result') not in RESULTS or not isinstance(v.get('checks'),list): return fail('invalid verification')
    if data['status']=='verified' and v['result']!='passed': return fail('verified status requires passed verification')
    print('valid')
    return 0

if __name__=='__main__': raise SystemExit(main())
