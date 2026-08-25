#!/usr/bin/env python3
import argparse,csv,json,math,statistics,sys
from pathlib import Path
NUM=["input_latency_ms","cpu_pct","read_mb_s","write_mb_s","rss_mb","event_loop_lag_ms"]
def pct(v,q):
 v=sorted(v); p=(len(v)-1)*q; a=math.floor(p); b=math.ceil(p); return v[a] if a==b else v[a]*(b-p)+v[b]*(p-a)
def corr(x,y):
 if len(x)<3:return None
 mx,my=statistics.fmean(x),statistics.fmean(y); n=sum((a-mx)*(b-my) for a,b in zip(x,y)); dx=sum((a-mx)**2 for a in x); dy=sum((b-my)**2 for b in y)
 return None if dx==0 or dy==0 else n/(dx*dy)**0.5
def load(p):
 with open(p,newline='',encoding='utf-8') as f:
  r=csv.DictReader(f); req={"timestamp_ms","state",*NUM}; miss=req-set(r.fieldnames or [])
  if miss: raise ValueError('missing columns: '+','.join(sorted(miss)))
  out=[]
  for i,row in enumerate(r,2):
   try:
    x={"timestamp_ms":float(row["timestamp_ms"]),"state":row["state"].strip().lower()}
    if x["state"] not in {"idle","active"}: raise ValueError('state must be idle or active')
    for k in NUM:
     x[k]=float(row[k])
     if x[k]<0: raise ValueError(k+' must be non-negative')
    out.append(x)
   except ValueError as e: raise ValueError(f'row {i}: {e}') from e
 if len(out)<3: raise ValueError('at least 3 samples required')
 return out
def analyze(rows,th):
 rep={"samples":len(rows),"metrics":{},"states":{}}
 for k in NUM:
  v=[r[k] for r in rows]; rep["metrics"][k]={"p50":pct(v,.5),"p95":pct(v,.95),"p99":pct(v,.99),"max":max(v)}
 for s in ("idle","active"):
  v=[r["input_latency_ms"] for r in rows if r["state"]==s]; rep["states"][s]={"samples":len(v),"input_latency_p95_ms":pct(v,.95) if v else None}
 i=rep["states"]["idle"]["input_latency_p95_ms"]; a=rep["states"]["active"]["input_latency_p95_ms"]
 rep["active_idle_input_latency_ratio"]=(a/i if i and a is not None else None)
 il=[r["input_latency_ms"] for r in rows]; rep["correlations"]={"input_latency_vs_cpu":corr(il,[r["cpu_pct"] for r in rows]),"input_latency_vs_read":corr(il,[r["read_mb_s"] for r in rows]),"input_latency_vs_event_loop_lag":corr(il,[r["event_loop_lag_ms"] for r in rows])}; rep["correlation_note"]='Correlation is diagnostic evidence, not proof of causality.'
 checks={"input_latency_p95_ms_max":rep["metrics"]["input_latency_ms"]["p95"],"read_mb_s_p95_max":rep["metrics"]["read_mb_s"]["p95"],"cpu_pct_p95_max":rep["metrics"]["cpu_pct"]["p95"],"event_loop_lag_p95_ms_max":rep["metrics"]["event_loop_lag_ms"]["p95"],"active_idle_input_latency_ratio_max":rep["active_idle_input_latency_ratio"]}
 rep["findings"]=[{"threshold":k,"observed":v,"limit":float(th[k])} for k,v in checks.items() if k in th and v is not None and v>float(th[k])]; rep["passed"]=not rep["findings"]; return rep
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('trace'); ap.add_argument('--thresholds'); ap.add_argument('--output'); a=ap.parse_args()
 try:
  th=json.loads(Path(a.thresholds).read_text()) if a.thresholds else {}; rep=analyze(load(a.trace),th); text=json.dumps(rep,indent=2,sort_keys=True)
  Path(a.output).write_text(text+'\n') if a.output else print(text); return 0 if rep['passed'] else 2
 except (OSError,ValueError,json.JSONDecodeError) as e: print('error: '+str(e),file=sys.stderr); return 1
if __name__=='__main__': raise SystemExit(main())
