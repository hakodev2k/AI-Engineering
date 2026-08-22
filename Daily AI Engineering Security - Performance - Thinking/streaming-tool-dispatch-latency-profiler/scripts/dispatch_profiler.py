#!/usr/bin/env python3
"""Profile streaming tool dispatch latency from JSONL lifecycle events.
Exit 0 valid report, 2 invalid input, 3 safety/timestamp violation.
Each line: {call_id,tool,call_complete_ms,safety_ready_ms,tool_start_ms,tool_end_ms}.
"""
from __future__ import annotations
import argparse,json,math,sys
from pathlib import Path


def percentile(values,p):
    if not values:return None
    s=sorted(values); k=(len(s)-1)*p; lo=math.floor(k); hi=math.ceil(k)
    if lo==hi:return s[lo]
    return s[lo]+(s[hi]-s[lo])*(k-lo)


def load(path):
    try: lines=Path(path).read_text(encoding='utf-8').splitlines()
    except OSError as exc: raise ValueError(f'cannot read trace: {exc}') from exc
    rows=[]
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try:r=json.loads(line)
        except json.JSONDecodeError as exc: raise ValueError(f'line {n}: invalid JSON: {exc}') from exc
        if not isinstance(r,dict): raise ValueError(f'line {n}: object required')
        for k in ('call_id','tool'):
            if not isinstance(r.get(k),str) or not r[k]: raise ValueError(f'line {n}: {k} required')
        for k in ('call_complete_ms','safety_ready_ms','tool_start_ms','tool_end_ms'):
            if not isinstance(r.get(k),(int,float)): raise ValueError(f'line {n}: {k} must be numeric')
        rows.append(r)
    if not rows: raise ValueError('trace is empty')
    return rows


def analyze(rows,threshold):
    violations=[]; waits=[]; durations=[]; eligible=0; by_tool={}
    seen=set()
    for r in rows:
        cid=r['call_id']
        if cid in seen: violations.append({'call_id':cid,'type':'duplicate_call_id'})
        seen.add(cid)
        ready=max(r['call_complete_ms'],r['safety_ready_ms'])
        wait=r['tool_start_ms']-ready; dur=r['tool_end_ms']-r['tool_start_ms']
        if r['tool_start_ms'] < r['safety_ready_ms']: violations.append({'call_id':cid,'type':'tool_started_before_safety_ready'})
        if wait < 0: violations.append({'call_id':cid,'type':'negative_dispatch_wait','value_ms':wait})
        if dur < 0: violations.append({'call_id':cid,'type':'negative_tool_duration','value_ms':dur})
        waits.append(wait); durations.append(dur)
        if wait >= threshold and r['tool_start_ms'] >= r['safety_ready_ms']: eligible+=1
        by_tool.setdefault(r['tool'],[]).append(wait)
    tools={k:{'samples':len(v),'dispatch_wait_p50_ms':percentile(v,.5),'dispatch_wait_p95_ms':percentile(v,.95)} for k,v in sorted(by_tool.items())}
    return {'samples':len(rows),'threshold_ms':threshold,'dispatch_wait_p50_ms':percentile(waits,.5),'dispatch_wait_p95_ms':percentile(waits,.95),'tool_duration_p50_ms':percentile(durations,.5),'tool_duration_p95_ms':percentile(durations,.95),'eager_opportunity_count':eligible,'eager_opportunity_ratio':eligible/len(rows),'tools':tools,'violations':violations}


def main():
    ap=argparse.ArgumentParser(); ap.add_argument('trace'); ap.add_argument('--threshold-ms',type=float,default=100.0); a=ap.parse_args()
    if a.threshold_ms < 0: print(json.dumps({'error':'threshold must be >= 0'}),file=sys.stderr); return 2
    try: report=analyze(load(a.trace),a.threshold_ms)
    except ValueError as exc: print(json.dumps({'error':str(exc)}),file=sys.stderr); return 2
    print(json.dumps(report,indent=2))
    return 3 if report['violations'] else 0
if __name__=='__main__': raise SystemExit(main())
