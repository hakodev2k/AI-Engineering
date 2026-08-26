#!/usr/bin/env python3
import json,statistics,sys
from pathlib import Path

def load(path):
    rows=[]
    for i,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f'line {i}: {e}')
    return rows

def pct(values,p):
    if not values:return 0.0
    s=sorted(values); k=(len(s)-1)*p; lo=int(k); hi=min(lo+1,len(s)-1); f=k-lo
    return s[lo]*(1-f)+s[hi]*f

def analyze(rows):
    required={'event','tool_schema_count','cache_read_tokens','cache_creation_tokens','input_tokens','latency_ms'}
    for r in rows:
        miss=required-r.keys()
        if miss: raise ValueError('missing:'+','.join(sorted(miss)))
    points=[]
    for i,r in enumerate(rows[:-1]):
        if r['event']!='tool_discovery': continue
        n=rows[i+1]
        denom=max(1,n['input_tokens'])
        read_ratio=n['cache_read_tokens']/denom
        create_ratio=n['cache_creation_tokens']/denom
        points.append({'batch':r['tool_schema_count'],'next_cache_read_ratio':read_ratio,'next_cache_creation_ratio':create_ratio,'next_latency_ms':n['latency_ms']})
    if not points:return {'status':'insufficient_evidence','breakpoints':[]}
    suspicious=[p for p in points if p['next_cache_read_ratio']<0.5 or p['next_cache_creation_ratio']>0.5]
    batches=sorted({p['batch'] for p in suspicious})
    rec=max(1,min(batches)-1) if batches else None
    return {'status':'measured','breakpoints':suspicious,'recommended_max_batch':rec,'p50_post_discovery_latency_ms':pct([p['next_latency_ms'] for p in points],0.5),'p95_post_discovery_latency_ms':pct([p['next_latency_ms'] for p in points],0.95)}

def main():
    if len(sys.argv)!=2: print('usage: cache_breakpoint_profiler.py trace.jsonl',file=sys.stderr); return 2
    try:r=analyze(load(sys.argv[1])); print(json.dumps(r,indent=2,sort_keys=True)); return 0
    except Exception as e: print(str(e),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
