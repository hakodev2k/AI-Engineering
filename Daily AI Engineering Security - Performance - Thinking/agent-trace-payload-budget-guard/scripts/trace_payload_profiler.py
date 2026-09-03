#!/usr/bin/env python3
import argparse, json, math, sys
from pathlib import Path

def load_records(path):
    text=Path(path).read_text(encoding='utf-8').strip()
    if not text: return []
    if text.startswith('['):
        data=json.loads(text); return data if isinstance(data,list) else [data]
    return [json.loads(line) for line in text.splitlines() if line.strip()]

def size(obj):
    return len(json.dumps(obj,separators=(',',':'),ensure_ascii=False).encode('utf-8'))

def pct(vals,p):
    if not vals: return 0
    vals=sorted(vals); i=max(0,min(len(vals)-1,math.ceil(p*len(vals))-1)); return vals[i]

def analyze(records,budget):
    span_sizes=[]; max_attr=0; top=[]
    for i,r in enumerate(records):
        s=size(r); span_sizes.append(s)
        attrs=r.get('attributes',{}) if isinstance(r,dict) else {}
        if isinstance(attrs,dict):
            for k,v in attrs.items():
                b=size(v); max_attr=max(max_attr,b); top.append((b,i,str(k)))
    total=sum(span_sizes); p95=pct(span_sizes,.95); mx=max(span_sizes,default=0)
    violations=[]
    if total>budget.get('max_trace_bytes',10**18): violations.append('max_trace_bytes')
    if mx>budget.get('max_span_bytes',10**18): violations.append('max_span_bytes')
    if max_attr>budget.get('max_attribute_bytes',10**18): violations.append('max_attribute_bytes')
    top=sorted(top,reverse=True)[:10]
    return {'span_count':len(records),'total_bytes':total,'p50_span_bytes':pct(span_sizes,.50),'p95_span_bytes':p95,'max_span_bytes':mx,'max_attribute_bytes':max_attr,'top_attributes':[{'bytes':b,'span_index':i,'key':k} for b,i,k in top],'violations':violations,'status':'ok' if not violations else 'violation'}

def main():
    p=argparse.ArgumentParser(); p.add_argument('input'); p.add_argument('--budget',required=True); p.add_argument('--json-out')
    a=p.parse_args()
    try:
        rec=load_records(a.input); budget=json.loads(Path(a.budget).read_text(encoding='utf-8'))
        out=analyze(rec,budget)
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)})); return 3
    text=json.dumps(out,indent=2,sort_keys=True); print(text)
    if a.json_out: Path(a.json_out).write_text(text+'\n',encoding='utf-8')
    return 0 if out['status']=='ok' else 2
if __name__=='__main__': sys.exit(main())
