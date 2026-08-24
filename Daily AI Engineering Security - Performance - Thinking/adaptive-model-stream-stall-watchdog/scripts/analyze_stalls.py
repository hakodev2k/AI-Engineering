#!/usr/bin/env python3
"""Analyze JSONL model-stream traces and recommend bounded adaptive watchdogs."""
import argparse, json, math, sys
from collections import defaultdict
from pathlib import Path
REQUIRED={"timestamp_ms","request_id","phase","event"}
def qtile(xs,q):
    if not xs: return None
    ys=sorted(xs); i=max(0,min(len(ys)-1,math.ceil(q*len(ys))-1)); return ys[i]
def load(path):
    out=[]
    for n,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: x=json.loads(line)
        except json.JSONDecodeError as e: raise ValueError(f"line {n}: invalid JSON: {e}")
        miss=REQUIRED-set(x)
        if miss: raise ValueError(f"line {n}: missing {sorted(miss)}")
        if x['phase'] not in ('ttft','stream'): raise ValueError(f"line {n}: phase must be ttft|stream")
        out.append(x)
    return out
def analyze(events, policy):
    req=defaultdict(list)
    for e in events: req[e['request_id']].append(e)
    healthy=defaultdict(list); timeouts=[]
    for rid,es in req.items():
        es.sort(key=lambda x:x['timestamp_ms']); start=es[0]['timestamp_ms']; bucket=es[0].get('bucket','default'); terminal=es[-1]['event']; phase=es[-1]['phase']; dur=max(0,es[-1]['timestamp_ms']-start)
        if terminal=='completed': healthy[(bucket,phase)].append(dur)
        elif terminal=='timeout': timeouts.append({'request_id':rid,'bucket':bucket,'phase':phase,'duration_ms':dur})
    rec={}
    for (bucket,phase),vals in healthy.items():
        if len(vals)<policy['min_samples']: continue
        raw=qtile(vals,policy['quantile'])*policy['multiplier']; floor=policy[f'{phase}_floor_ms']; ceil=policy[f'{phase}_ceiling_ms']
        rec[f'{bucket}:{phase}']={'healthy_samples':len(vals),'healthy_p99_ms':qtile(vals,0.99),'recommended_ms':int(max(floor,min(ceil,raw)))}
    for t in timeouts:
        r=rec.get(f"{t['bucket']}:{t['phase']}"); t['inside_healthy_tail']=bool(r and t['duration_ms'] <= r['healthy_p99_ms'])
    return {'recommendations':rec,'timeouts':timeouts,'timeout_count':len(timeouts)}
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('trace'); ap.add_argument('--policy',required=True); ap.add_argument('--output'); a=ap.parse_args()
    try: policy=json.loads(Path(a.policy).read_text(encoding='utf-8')); result=analyze(load(a.trace),policy)
    except (OSError,ValueError,KeyError,json.JSONDecodeError) as e: print(f'error: {e}',file=sys.stderr); return 2
    text=json.dumps(result,indent=2,sort_keys=True)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    else: print(text)
    return 0
if __name__=='__main__': raise SystemExit(main())
