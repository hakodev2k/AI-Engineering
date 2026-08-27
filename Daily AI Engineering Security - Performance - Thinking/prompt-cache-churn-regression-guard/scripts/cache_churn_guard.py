#!/usr/bin/env python3
import argparse, json, math, sys
from pathlib import Path

REQUIRED={"request_id","input_tokens","cache_read_input_tokens","cache_creation_input_tokens","latency_ms","prefix_fingerprint"}
POLICY={"min_large_context_tokens":100000,"min_expected_cache_read_ratio":0.70,"max_cache_creation_ratio":0.20,"max_consecutive_churn_events":1,"max_prefix_changes_per_20_requests":3}

def load_trace(path):
    rows=[]
    for i,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        try: row=json.loads(line)
        except Exception as e: raise ValueError(f"line {i}: invalid JSON: {e}")
        missing=REQUIRED-row.keys()
        if missing: raise ValueError(f"line {i}: missing fields: {','.join(sorted(missing))}")
        for k in ("input_tokens","cache_read_input_tokens","cache_creation_input_tokens","latency_ms"):
            if not isinstance(row[k],(int,float)) or row[k] < 0: raise ValueError(f"line {i}: {k} must be non-negative")
        rows.append(row)
    if not rows: raise ValueError("trace is empty")
    return rows

def percentile(values,p):
    s=sorted(values); x=(len(s)-1)*p; lo=math.floor(x); hi=math.ceil(x)
    return float(s[lo]) if lo==hi else s[lo]*(hi-x)+s[hi]*(x-lo)

def analyze(rows,policy=POLICY):
    events=[]; consecutive=0; worst=0
    for r in rows:
        total=max(1.0,float(r["input_tokens"]+r["cache_read_input_tokens"]+r["cache_creation_input_tokens"]))
        read=float(r["cache_read_input_tokens"])/total; create=float(r["cache_creation_input_tokens"])/total
        churn=total>=policy["min_large_context_tokens"] and read<policy["min_expected_cache_read_ratio"] and create>policy["max_cache_creation_ratio"]
        consecutive=consecutive+1 if churn else 0; worst=max(worst,consecutive)
        if churn: events.append({"request_id":r["request_id"],"read_ratio":round(read,4),"creation_ratio":round(create,4),"rewritten_tokens":r["cache_creation_input_tokens"],"prefix_fingerprint":r["prefix_fingerprint"]})
    changes=0; prev=None
    for r in rows[-20:]:
        fp=r["prefix_fingerprint"]
        if prev is not None and fp!=prev: changes+=1
        prev=fp
    reasons=[]
    if worst>policy["max_consecutive_churn_events"]: reasons.append(f"consecutive_churn_events:{worst}>{policy['max_consecutive_churn_events']}")
    if changes>policy["max_prefix_changes_per_20_requests"]: reasons.append(f"prefix_changes_last20:{changes}>{policy['max_prefix_changes_per_20_requests']}")
    latency=[float(r["latency_ms"]) for r in rows]
    return {"ok":not reasons,"requests":len(rows),"churn_events":events,"worst_consecutive_churn":worst,"prefix_changes_last20":changes,"p50_latency_ms":round(percentile(latency,.5),2),"p95_latency_ms":round(percentile(latency,.95),2),"total_cache_creation_tokens":sum(r["cache_creation_input_tokens"] for r in rows),"total_cache_read_tokens":sum(r["cache_read_input_tokens"] for r in rows),"reasons":reasons}

def main():
    ap=argparse.ArgumentParser(description="Detect prompt-cache churn in AI-agent usage traces."); ap.add_argument("trace"); a=ap.parse_args()
    try: result=analyze(load_trace(a.trace))
    except Exception as e: print(json.dumps({"ok":False,"error":str(e)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2,sort_keys=True)); return 0 if result["ok"] else 3

if __name__=="__main__": raise SystemExit(main())
