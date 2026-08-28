#!/usr/bin/env python3
import argparse, hashlib, json, statistics, sys
from pathlib import Path

def canon_tools(tools):
    if not isinstance(tools, list):
        return []
    def name(t):
        if not isinstance(t, dict): return str(t)
        fn=t.get('function') if isinstance(t.get('function'),dict) else t
        return str(fn.get('name',''))
    normalized=[t for t in tools if isinstance(t,dict)]
    return sorted(normalized,key=lambda t:(name(t),json.dumps(t,sort_keys=True,separators=(',',':'))))

def digest(obj):
    raw=json.dumps(obj,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()

def percentile(vals,p):
    if not vals:return None
    s=sorted(float(v) for v in vals); k=(len(s)-1)*p; lo=int(k); hi=min(lo+1,len(s)-1); f=k-lo
    return s[lo]*(1-f)+s[hi]*f

def analyze(rows,budget=None):
    budget=budget or {}
    req=[]
    for i,r in enumerate(rows,1):
        if not isinstance(r,dict): raise ValueError(f'row {i} is not an object')
        pt=int(r.get('prompt_tokens',0) or 0); ct=int(r.get('cached_tokens',0) or 0)
        if pt<0 or ct<0 or ct>pt: raise ValueError(f'row {i} invalid token counts')
        tools=r.get('tools',[]) or []
        ordered=digest(tools); canonical=digest(canon_tools(tools)); schema_bytes=len(json.dumps(tools,separators=(',',':'),ensure_ascii=False).encode())
        req.append({'prompt_tokens':pt,'cached_tokens':ct,'uncached_tokens':pt-ct,'cache_ratio':ct/pt if pt else 0.0,'ordered_fp':ordered,'set_fp':canonical,'schema_bytes':schema_bytes,'ttft_ms':r.get('ttft_ms'),'latency_ms':r.get('latency_ms'),'quality_pass':r.get('quality_pass')})
    groups={}
    for x in req: groups.setdefault(x['set_fp'],set()).add(x['ordered_fp'])
    order_drift=sum(1 for v in groups.values() if len(v)>1)
    total_prompt=sum(x['prompt_tokens'] for x in req); total_cached=sum(x['cached_tokens'] for x in req)
    quality=[x['quality_pass'] for x in req if isinstance(x['quality_pass'],bool)]
    report={'requests':len(req),'cache_hit_ratio':total_cached/total_prompt if total_prompt else 0.0,'uncached_tokens_total':sum(x['uncached_tokens'] for x in req),'tool_schema_bytes_total':sum(x['schema_bytes'] for x in req),'same_set_order_drift_groups':order_drift,'ttft_p50_ms':percentile([x['ttft_ms'] for x in req if x['ttft_ms'] is not None],.5),'ttft_p95_ms':percentile([x['ttft_ms'] for x in req if x['ttft_ms'] is not None],.95),'latency_p95_ms':percentile([x['latency_ms'] for x in req if x['latency_ms'] is not None],.95),'quality_pass_rate':sum(quality)/len(quality) if quality else None}
    violations=[]
    if report['cache_hit_ratio'] < float(budget.get('min_cache_hit_ratio',0)): violations.append('cache_hit_ratio_below_budget')
    if order_drift > int(budget.get('max_order_drift_groups',0)): violations.append('tool_order_drift')
    if report['quality_pass_rate'] is not None and report['quality_pass_rate'] < float(budget.get('min_quality_pass_rate',0)): violations.append('quality_regression')
    report['violations']=violations; report['ok']=not violations
    return report

def load_rows(path):
    rows=[]
    for i,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f'line {i}: {e}')
    return rows

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('trace'); ap.add_argument('--budget'); ap.add_argument('--json-out')
    a=ap.parse_args()
    try:
        budget=json.loads(Path(a.budget).read_text()) if a.budget else {}
        report=analyze(load_rows(a.trace),budget)
        text=json.dumps(report,indent=2,sort_keys=True); print(text)
        if a.json_out: Path(a.json_out).write_text(text+'\n',encoding='utf-8')
        return 0 if report['ok'] else 3
    except Exception as e:
        print(str(e),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
