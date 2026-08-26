#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f'line {n}: {e}')
    return rows

def analyze(rows,cfg):
    streak=0; episodes=[]; rewritten=0
    for i,r in enumerate(rows,1):
        need={'input_tokens','cache_read_tokens','cache_write_tokens','latency_ms'}
        missing=need-r.keys()
        if missing: return {'status':'invalid','step':i,'reason':'missing:'+','.join(sorted(missing))}
        total=max(1,int(r['input_tokens']))
        read=max(0,int(r['cache_read_tokens'])); write=max(0,int(r['cache_write_tokens']))
        read_ratio=read/total; write_ratio=write/total
        collapse=(total>=int(cfg['min_context_tokens']) and read_ratio<=float(cfg['max_cache_read_ratio']) and write_ratio>=float(cfg['min_cache_write_ratio']))
        streak=streak+1 if collapse else 0
        if collapse: rewritten+=write
        if streak==int(cfg['min_consecutive_collapse_requests']):
            episodes.append({'end_step':i,'start_step':i-streak+1,'event':r.get('event'),'context_tokens':total})
    lat=[int(r['latency_ms']) for r in rows]
    def percentile(p):
        if not lat:return 0
        s=sorted(lat); idx=round((len(s)-1)*p); return s[idx]
    return {'status':'collapse_detected' if episodes else 'healthy_or_insufficient','episodes':episodes,'estimated_rewritten_tokens_in_collapse_requests':rewritten,'p50_latency_ms':percentile(.5),'p95_latency_ms':percentile(.95),'requests':len(rows)}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--trace',required=True); ap.add_argument('--config',required=True); a=ap.parse_args()
    try: result=analyze(load(a.trace),json.loads(Path(a.config).read_text(encoding='utf-8')))
    except Exception as e: print(str(e),file=sys.stderr); return 2
    print(json.dumps(result,indent=2,sort_keys=True)); return 3 if result['status']=='collapse_detected' else (2 if result['status']=='invalid' else 0)
if __name__=='__main__': raise SystemExit(main())
