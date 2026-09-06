#!/usr/bin/env python3
import argparse, json, math, statistics, sys
from pathlib import Path

REQ = ("session_id", "turn", "input_tokens", "reused_prefix_tokens", "ttft_ms")

def load(path):
    rows=[]
    try:
        with Path(path).open(encoding="utf-8") as f:
            for n,line in enumerate(f,1):
                if not line.strip(): continue
                r=json.loads(line)
                missing=[k for k in REQ if k not in r]
                if missing: raise ValueError(f"line {n}: missing {','.join(missing)}")
                for k in ("input_tokens","reused_prefix_tokens","ttft_ms"):
                    if not isinstance(r[k],(int,float)) or r[k] < 0: raise ValueError(f"line {n}: invalid {k}")
                if r["reused_prefix_tokens"] > r["input_tokens"]: raise ValueError(f"line {n}: reused prefix exceeds input")
                rows.append(r)
    except Exception as e:
        if isinstance(e,ValueError): raise
        raise ValueError(f"cannot read {path}: {e}")
    if not rows: raise ValueError(f"{path}: empty trace")
    return rows

def percentile(values,p):
    s=sorted(values)
    if len(s)==1:return float(s[0])
    x=(len(s)-1)*p/100.0; lo=math.floor(x); hi=math.ceil(x)
    if lo==hi:return float(s[lo])
    return s[lo]*(hi-x)+s[hi]*(x-lo)

def summarize(rows):
    total_in=sum(r["input_tokens"] for r in rows)
    total_reuse=sum(r["reused_prefix_tokens"] for r in rows)
    ttft=[r["ttft_ms"] for r in rows]
    resumes=[r for r in rows if str(r.get("event","")).lower()=="resume"]
    resume_misses=[r for r in resumes if r["reused_prefix_tokens"] < r["input_tokens"]]
    avoid=sum(r["input_tokens"]-r["reused_prefix_tokens"] for r in resume_misses)
    return {
      "turns":len(rows), "sessions":len({str(r["session_id"]) for r in rows}),
      "input_tokens":total_in, "reused_prefix_tokens":total_reuse,
      "reuse_ratio": round(total_reuse/total_in,6) if total_in else 0.0,
      "ttft_median_ms":round(statistics.median(ttft),3), "ttft_p95_ms":round(percentile(ttft,95),3),
      "resume_turns":len(resumes), "resume_misses":len(resume_misses),
      "resume_miss_rate":round(len(resume_misses)/len(resumes),6) if resumes else 0.0,
      "resume_avoidable_prefill_tokens":avoid
    }

def compare(base,cand):
    keys=("reuse_ratio","ttft_median_ms","ttft_p95_ms","resume_miss_rate","resume_avoidable_prefill_tokens")
    return {k:round(cand[k]-base[k],6) for k in keys}

def main():
    ap=argparse.ArgumentParser(description="Profile agent lifecycle-aware prefix-cache reuse")
    ap.add_argument("trace"); ap.add_argument("--baseline"); ap.add_argument("--out",required=True)
    ap.add_argument("--max-p95-regression-pct",type=float,default=5.0)
    a=ap.parse_args()
    if a.max_p95_regression_pct < 0:
        print("threshold must be non-negative",file=sys.stderr); return 3
    try:
        cand=summarize(load(a.trace)); result={"candidate":cand,"status":"MEASURED"}
        exit_code=0
        if a.baseline:
            base=summarize(load(a.baseline)); delta=compare(base,cand)
            basep=base["ttft_p95_ms"]
            reg=((cand["ttft_p95_ms"]-basep)/basep*100.0) if basep else (0.0 if cand["ttft_p95_ms"]==0 else float("inf"))
            passed=reg <= a.max_p95_regression_pct
            result={"baseline":base,"candidate":cand,"delta":delta,"p95_ttft_regression_pct":round(reg,3) if math.isfinite(reg) else "inf","max_p95_regression_pct":a.max_p95_regression_pct,"status":"PASS" if passed else "BLOCK"}
            exit_code=0 if passed else 2
        Path(a.out).write_text(json.dumps(result,indent=2,sort_keys=True)+"\n",encoding="utf-8")
        print(json.dumps(result,sort_keys=True)); return exit_code
    except (ValueError,json.JSONDecodeError) as e:
        print(f"profile error: {e}",file=sys.stderr); return 3
    except OSError as e:
        print(f"I/O error: {e}",file=sys.stderr); return 4
if __name__=="__main__": sys.exit(main())
