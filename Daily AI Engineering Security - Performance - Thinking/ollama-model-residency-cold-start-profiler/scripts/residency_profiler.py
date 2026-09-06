#!/usr/bin/env python3
import argparse, json, math, sys
from datetime import datetime

REQUIRED = ("timestamp", "model", "total_duration_ms", "load_duration_ms")

def parse_ts(v):
    if isinstance(v, (int, float)): return float(v)
    s=str(v).replace("Z", "+00:00")
    return datetime.fromisoformat(s).timestamp()

def pct(xs, p):
    if not xs: return None
    ys=sorted(xs); k=(len(ys)-1)*p; a=math.floor(k); b=math.ceil(k)
    return ys[a] if a==b else ys[a]*(b-k)+ys[b]*(k-a)

def load(path):
    rows=[]; bad=0
    with open(path, encoding="utf-8") as f:
        for n,line in enumerate(f,1):
            if not line.strip(): continue
            try:
                r=json.loads(line)
                for k in REQUIRED:
                    if k not in r: raise ValueError(f"missing {k}")
                r["_ts"]=parse_ts(r["timestamp"])
                r["total_duration_ms"]=float(r["total_duration_ms"])
                r["load_duration_ms"]=float(r["load_duration_ms"])
                if r["total_duration_ms"] < 0 or r["load_duration_ms"] < 0: raise ValueError("negative duration")
                rows.append(r)
            except Exception as e:
                bad += 1
                print(f"invalid line {n}: {e}", file=sys.stderr)
    if not rows: raise ValueError("no valid rows")
    if bad/(bad+len(rows)) > .05: raise ValueError("more than 5% invalid rows")
    return sorted(rows, key=lambda r:r["_ts"]), bad

def summarize(rows,bad):
    totals=[r["total_duration_ms"] for r in rows]
    loads=[r["load_duration_ms"] for r in rows]
    # A cold request is one where loading is both non-trivial and >=20% of total latency.
    cold=[r for r in rows if r["load_duration_ms"] >= 250 and r["load_duration_ms"] >= .20*r["total_duration_ms"]]
    gaps=[]
    last={}
    for r in rows:
        m=r["model"]
        if m in last: gaps.append((r["_ts"]-last[m])*1000)
        last[m]=r["_ts"]
    return {
        "sample_count":len(rows), "invalid_count":bad,
        "cold_start_count":len(cold), "cold_start_rate":len(cold)/len(rows),
        "total_latency_ms":{"p50":pct(totals,.5),"p95":pct(totals,.95)},
        "load_duration_ms":{"p50":pct(loads,.5),"p95":pct(loads,.95)},
        "load_duration_share":sum(loads)/sum(totals) if sum(totals) else 0,
        "idle_gap_ms":{"p50":pct(gaps,.5),"p95":pct(gaps,.95)},
        "models":sorted({r["model"] for r in rows})
    }

def main():
    ap=argparse.ArgumentParser(description="Profile local-model residency and cold-start latency from JSONL telemetry")
    ap.add_argument("trace"); ap.add_argument("--out"); ap.add_argument("--compare")
    a=ap.parse_args()
    try:
        rows,bad=load(a.trace); base=summarize(rows,bad)
    except Exception as e:
        print(f"input error: {e}", file=sys.stderr); return 2
    if base["sample_count"] < 20:
        print(json.dumps(base,indent=2)); print("insufficient sample size: need >=20",file=sys.stderr); return 3
    result={"baseline":base}
    if a.compare:
        try:
            rows2,bad2=load(a.compare); cand=summarize(rows2,bad2)
        except Exception as e:
            print(f"comparison input error: {e}",file=sys.stderr); return 2
        if cand["sample_count"] < 20:
            print("comparison sample size must be >=20",file=sys.stderr); return 3
        result["candidate"]=cand
        result["delta"]={
            "cold_start_rate":cand["cold_start_rate"]-base["cold_start_rate"],
            "p95_total_latency_ms":cand["total_latency_ms"]["p95"]-base["total_latency_ms"]["p95"],
            "p95_load_duration_ms":cand["load_duration_ms"]["p95"]-base["load_duration_ms"]["p95"]
        }
    text=json.dumps(result,indent=2)
    if a.out:
        with open(a.out,"w",encoding="utf-8") as f:f.write(text+"\n")
    print(text); return 0
if __name__=="__main__": raise SystemExit(main())
