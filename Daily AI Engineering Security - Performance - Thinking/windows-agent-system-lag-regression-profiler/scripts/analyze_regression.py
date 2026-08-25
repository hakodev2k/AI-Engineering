#!/usr/bin/env python3
import argparse,csv,json,math,statistics,sys
METRICS=("cpu_percent","read_mb_s","write_mb_s","working_set_mb","handles","threads","input_stall_ms")

def read_csv(path):
    rows=[]
    with open(path,newline="",encoding="utf-8-sig") as f:
        for i,r in enumerate(csv.DictReader(f),2):
            x={"scenario":r.get("scenario","")}
            for m in METRICS:
                v=r.get(m,"")
                if v in ("",None): x[m]=None
                else:
                    try: x[m]=float(v)
                    except ValueError: raise ValueError(f"{path}:{i}: invalid {m}")
            rows.append(x)
    return rows

def pct(vals,p):
    vals=sorted(v for v in vals if v is not None)
    if not vals: return None
    if len(vals)==1: return vals[0]
    k=(len(vals)-1)*p; lo=math.floor(k); hi=math.ceil(k)
    return vals[lo] if lo==hi else vals[lo]*(hi-k)+vals[hi]*(k-lo)

def summarize(rows):
    out={}
    for m in METRICS:
        vals=[r[m] for r in rows if r[m] is not None]
        out[m]={"n":len(vals),"median":statistics.median(vals) if vals else None,"p95":pct(vals,.95)}
    return out

def analyze(base,current,policy):
    nmin=int(policy.get("min_samples_per_scenario",10)); reasons=[]; regressions=[]
    if len(base)<nmin or len(current)<nmin: reasons.append(f"need at least {nmin} samples per scenario")
    b=summarize(base); c=summarize(current); ratios={}
    for m in METRICS:
        bv=b[m]["p95"]; cv=c[m]["p95"]
        if bv is None or cv is None: continue
        if bv>0:
            ratio=cv/bv; ratio_for_report=ratio
        elif cv>0:
            ratio=float("inf"); ratio_for_report="infinite"
        else:
            ratio=1.0; ratio_for_report=1.0
        ratios[m]=ratio_for_report
        rt=policy.get("ratio_thresholds",{}).get(m); at=policy.get("absolute_thresholds",{}).get(m)
        if (rt is not None and ratio>=float(rt)) or (at is not None and cv>=float(at)):
            regressions.append({"metric":m,"baseline_p95":bv,"current_p95":cv,"ratio":ratio_for_report})
    status="invalid" if reasons else ("regression" if regressions else "pass")
    return {"status":status,"baseline":b,"current":c,"p95_ratios":ratios,"regressions":regressions,"reasons":reasons}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("baseline"); ap.add_argument("current"); ap.add_argument("--policy",required=True); ap.add_argument("--output")
    a=ap.parse_args()
    try:
        base=read_csv(a.baseline); cur=read_csv(a.current)
        with open(a.policy,encoding="utf-8") as f: policy=json.load(f)
        rep=analyze(base,cur,policy)
    except (OSError,ValueError,json.JSONDecodeError) as e:
        print(f"input error: {e}",file=sys.stderr); return 3
    txt=json.dumps(rep,indent=2,sort_keys=True,allow_nan=False)
    if a.output:
        with open(a.output,"w",encoding="utf-8") as f: f.write(txt+"\n")
    else: print(txt)
    return 0 if rep["status"]=="pass" else 2

if __name__=="__main__": raise SystemExit(main())
