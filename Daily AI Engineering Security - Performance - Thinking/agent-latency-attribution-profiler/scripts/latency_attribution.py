#!/usr/bin/env python3
import json,sys,math
from pathlib import Path
PHASES={"approval_wait":("approval_started","approval_ended"),"dispatch_overhead":("dispatch_started","tool_started"),"tool_execution":("tool_started","tool_ended"),"result_propagation":("tool_ended","result_received"),"resume_overhead":("result_received","turn_resumed"),"end_to_end":("requested","turn_resumed")}
def percentile(xs,p):
 xs=sorted(xs)
 if not xs:return None
 k=(len(xs)-1)*p;lo=math.floor(k);hi=math.ceil(k);return xs[lo] if lo==hi else xs[lo]*(hi-k)+xs[hi]*(k-lo)
def duration(c,a,b):
 if a not in c or b not in c:return None
 x,y=c[a],c[b]
 if not isinstance(x,(int,float)) or not isinstance(y,(int,float)) or y<x:return None
 return (y-x)*1000.0
def load_jsonl(p):
 out=[]
 for n,line in enumerate(Path(p).read_text(encoding="utf-8").splitlines(),1):
  if not line.strip():continue
  try:v=json.loads(line)
  except json.JSONDecodeError as e:raise ValueError(f"line {n}: {e}")
  if not isinstance(v,dict):raise ValueError(f"line {n}: object required")
  out.append(v)
 return out
def main(a):
 if len(a)!=3:print(f"usage: {a[0]} trace.jsonl thresholds.json",file=sys.stderr);return 1
 try:
  calls=load_jsonl(a[1]);cfg=json.loads(Path(a[2]).read_text(encoding="utf-8"))
  if not calls:raise ValueError("no calls")
  min_cov=float(cfg.get("min_attribution_coverage",.95));max_p95=float(cfg.get("max_p95_end_to_end_ms",1e18));min_samples=int(cfg.get("minimum_samples",1));vals={k:[] for k in PHASES};complete=0
  for c in calls:
   ok=True
   for name,(x,y) in PHASES.items():
    d=duration(c,x,y)
    if d is not None:vals[name].append(d)
    elif name!="approval_wait":ok=False
   if ok:complete+=1
  cov=complete/len(calls);print(f"calls={len(calls)} attribution_coverage={cov:.3f}")
  for k,xs in vals.items():
   if xs:print(f"{k}: n={len(xs)} p50_ms={percentile(xs,.5):.1f} p95_ms={percentile(xs,.95):.1f}")
  if len(calls)<min_samples or cov<min_cov:print("BLOCK insufficient samples/attribution coverage");return 2
  p95=percentile(vals["end_to_end"],.95)
  if p95 is None:return 2
  if p95>max_p95:print("BLOCK p95 end-to-end threshold exceeded");return 3
  return 0
 except (OSError,ValueError,TypeError,json.JSONDecodeError) as e:print("ERROR: "+str(e),file=sys.stderr);return 1
if __name__=="__main__":sys.exit(main(sys.argv))
