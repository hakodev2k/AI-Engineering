#!/usr/bin/env python3
import argparse,json,statistics,sys
from pathlib import Path

def load(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f'line {n}: {e}')
    return rows

def percentile(v,p):
    if not v:return 0.0
    s=sorted(v); x=(len(s)-1)*p; lo=int(x); hi=min(lo+1,len(s)-1); f=x-lo
    return s[lo]*(1-f)+s[hi]*f

def analyze(rows,t):
    required={'input_tokens','reusable_prefix_tokens','cached_tokens','ttft_ms','equivalence_pass'}
    for i,r in enumerate(rows,1):
        miss=required-r.keys()
        if miss: raise ValueError(f'row {i} missing '+','.join(sorted(miss)))
    if len(rows)<2:return {'status':'insufficient_evidence','violations':['need_at_least_two_samples']}
    reusable=[]; full=0; xs=[]; ys=[]; violations=[]
    for r in rows:
        inp=max(1,int(r['input_tokens'])); pref=max(0,int(r['reusable_prefix_tokens'])); cached=max(0,int(r['cached_tokens']))
        rr=min(1.0,pref/inp); cr=(cached/max(1,pref)) if pref else 1.0
        if rr>=float(t.get('min_reusable_prefix_ratio',0.7)):
            reusable.append(cr)
            if cr<0.05: full+=1
        xs.append(inp/1000.0); ys.append(float(r['ttft_ms']))
        if t.get('require_equivalence_pass',True) and not bool(r['equivalence_pass']): violations.append('output_equivalence_failed')
    cache_ratio=statistics.mean(reusable) if reusable else 1.0
    refill=full/max(1,len(reusable))
    xbar=statistics.mean(xs); ybar=statistics.mean(ys); denom=sum((x-xbar)**2 for x in xs)
    slope=(sum((x-xbar)*(y-ybar) for x,y in zip(xs,ys))/denom) if denom else 0.0
    if reusable and cache_ratio<float(t.get('min_cache_read_ratio_on_reusable',0.6)): violations.append('cache_read_ratio_below_threshold')
    if refill>float(t.get('max_full_refill_rate',0.2)): violations.append('full_refill_rate_above_threshold')
    if slope>float(t.get('max_ttft_growth_ms_per_1k_input_tokens',150.0)): violations.append('ttft_growth_slope_above_threshold')
    return {'status':'fail' if violations else 'pass','samples':len(rows),'mean_cache_read_ratio_on_reusable':round(cache_ratio,6),'full_refill_rate':round(refill,6),'ttft_growth_ms_per_1k_input_tokens':round(slope,3),'p50_ttft_ms':round(percentile(ys,.5),3),'p95_ttft_ms':round(percentile(ys,.95),3),'violations':sorted(set(violations))}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('trace'); ap.add_argument('--thresholds',required=True); a=ap.parse_args()
    try:r=analyze(load(a.trace),json.loads(Path(a.thresholds).read_text(encoding='utf-8'))); print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r['status']=='pass' else 3
    except Exception as e: print(str(e),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
