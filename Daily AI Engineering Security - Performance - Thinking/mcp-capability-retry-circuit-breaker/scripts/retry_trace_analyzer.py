#!/usr/bin/env python3
"""Analyze JSONL retry events and fail if retry budgets are violated."""
import argparse, json, sys
from collections import defaultdict

def main():
    p=argparse.ArgumentParser()
    p.add_argument('trace')
    p.add_argument('--transient-max',type=int,default=4)
    a=p.parse_args()
    counts=defaultdict(int); violations=[]; unsupported=set()
    try:
        fh=open(a.trace,encoding='utf-8')
    except OSError as e:
        print(e,file=sys.stderr); return 2
    for n,line in enumerate(fh,1):
        if not line.strip(): continue
        try: e=json.loads(line)
        except Exception as ex:
            print(f'line {n}: {ex}',file=sys.stderr); return 2
        for k in ('server','method','epoch','class'):
            if k not in e: print(f'line {n}: missing {k}',file=sys.stderr); return 2
        key=(str(e['server']),str(e['method']),str(e['epoch']))
        counts[(key,e['class'])]+=1
        if e['class']=='unsupported-terminal':
            if key in unsupported: violations.append({'key':key,'reason':'unsupported method retried'})
            unsupported.add(key)
    for (key,cls),count in counts.items():
        if cls=='transient' and count>a.transient_max:
            violations.append({'key':key,'reason':f'transient attempts {count}>{a.transient_max}'})
        if cls=='unknown' and count>2:
            violations.append({'key':key,'reason':f'unknown attempts {count}>2'})
    out={'distinct_keys':len({k for k,_ in counts}), 'events':sum(counts.values()), 'violations':violations}
    print(json.dumps(out,indent=2))
    return 3 if violations else 0

if __name__=='__main__': raise SystemExit(main())
