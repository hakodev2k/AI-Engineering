#!/usr/bin/env python3
"""Analyze JSONL child-agent request traces for rate-limit amplification.

Required fields per line: timestamp, child_id, provider, model, status_code, latency_ms.
Optional: attempt, retry_after_ms, quota_domain.
"""
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from pathlib import Path


def load(path: Path):
    rows=[]
    with path.open('r', encoding='utf-8') as f:
        for n,line in enumerate(f,1):
            if not line.strip(): continue
            try: r=json.loads(line)
            except json.JSONDecodeError as e: raise ValueError(f'line {n}: invalid JSON: {e}')
            for k in ('timestamp','child_id','provider','model','status_code','latency_ms'):
                if k not in r: raise ValueError(f'line {n}: missing {k}')
            try:
                r['status_code']=int(r['status_code']); r['latency_ms']=float(r['latency_ms']); r['attempt']=int(r.get('attempt',1))
            except (TypeError,ValueError): raise ValueError(f'line {n}: invalid numeric field')
            rows.append(r)
    if not rows: raise ValueError('trace has no events')
    return rows


def analyze(rows):
    buckets=defaultdict(lambda:{'requests':0,'success':0,'rate_limited':0,'latencies':[],'children':set(),'attempts':0})
    child_success=set()
    for r in rows:
        key=f"{r['provider']}|{r['model']}|{r.get('quota_domain','default')}"
        b=buckets[key]; b['requests']+=1; b['attempts']+=r['attempt']; b['latencies'].append(r['latency_ms']); b['children'].add(str(r['child_id']))
        if 200 <= r['status_code'] < 300: b['success']+=1; child_success.add(str(r['child_id']))
        if r['status_code']==429: b['rate_limited']+=1
    out={'total_requests':len(rows),'unique_children':len({str(r['child_id']) for r in rows}),'successful_children':len(child_success),'buckets':{}}
    for key,b in sorted(buckets.items()):
        ls=sorted(b['latencies'])
        def pct(p):
            i=min(len(ls)-1,max(0,round((len(ls)-1)*p))); return round(ls[i],2)
        out['buckets'][key]={
            'requests':b['requests'],'success_responses':b['success'],'rate_limited':b['rate_limited'],
            'rate_limit_rate':round(b['rate_limited']/b['requests'],4),
            'p50_latency_ms':pct(.5),'p95_latency_ms':pct(.95),
            'unique_children':len(b['children']),
            'requests_per_success':round(b['requests']/b['success'],3) if b['success'] else None,
        }
    out['child_completion_rate']=round(out['successful_children']/out['unique_children'],4) if out['unique_children'] else 0
    return out


def main():
    ap=argparse.ArgumentParser(); ap.add_argument('trace', type=Path); ap.add_argument('--json', action='store_true')
    args=ap.parse_args()
    try: result=analyze(load(args.trace))
    except (OSError,ValueError) as e:
        print(f'error: {e}', file=sys.stderr); return 2
    if args.json: print(json.dumps(result, indent=2, sort_keys=True))
    else:
        print(f"children: {result['successful_children']}/{result['unique_children']} ({result['child_completion_rate']:.1%})")
        for k,b in result['buckets'].items(): print(f"{k}: requests={b['requests']} 429={b['rate_limited']} ({b['rate_limit_rate']:.1%}) p95={b['p95_latency_ms']}ms")
    return 1 if any(b['rate_limit_rate']>0.10 for b in result['buckets'].values()) else 0

if __name__=='__main__': raise SystemExit(main())
