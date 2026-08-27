#!/usr/bin/env python3
import argparse, json, statistics, sys
from pathlib import Path


def load_jsonl(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip():
            continue
        try:
            row=json.loads(line)
        except Exception as exc:
            raise ValueError(f"line {n}: {exc}")
        required={"task_id","input_tokens","cache_read_tokens","cache_creation_tokens","latency_ms","tool_fingerprint","system_fingerprint","static_prefix_tokens","quality_pass"}
        missing=required-row.keys()
        if missing:
            raise ValueError(f"line {n} missing: {','.join(sorted(missing))}")
        rows.append(row)
    return rows


def pct(values,p):
    if not values: return 0.0
    s=sorted(values); k=(len(s)-1)*p; lo=int(k); hi=min(lo+1,len(s)-1); f=k-lo
    return s[lo]*(1-f)+s[hi]*f


def analyze(rows):
    if not rows:
        return {"status":"insufficient_evidence","requests":0,"tasks":0,"mutations":[]}
    mutations=[]; replay=0
    for i,row in enumerate(rows):
        denom=max(1,int(row["input_tokens"]))
        row["_read_ratio"]=float(row["cache_read_tokens"])/denom
        row["_create_ratio"]=float(row["cache_creation_tokens"])/denom
        if i:
            prev=rows[i-1]
            changed=[]
            if row["tool_fingerprint"]!=prev["tool_fingerprint"]: changed.append("tools")
            if row["system_fingerprint"]!=prev["system_fingerprint"]: changed.append("system")
            if changed:
                mutations.append({"index":i,"task_id":row["task_id"],"changed":changed,"cache_read_ratio":row["_read_ratio"],"cache_creation_ratio":row["_create_ratio"]})
        if row["_read_ratio"] < 0.5:
            replay += int(row["static_prefix_tokens"])
    tasks=len({r["task_id"] for r in rows})
    return {
        "status":"measured",
        "requests":len(rows),
        "tasks":tasks,
        "cache_read_ratio":sum(r["cache_read_tokens"] for r in rows)/max(1,sum(r["input_tokens"] for r in rows)),
        "cache_creation_ratio":sum(r["cache_creation_tokens"] for r in rows)/max(1,sum(r["input_tokens"] for r in rows)),
        "estimated_static_replay_tokens":replay,
        "estimated_static_replay_tokens_per_task":replay/max(1,tasks),
        "p50_latency_ms":pct([r["latency_ms"] for r in rows],0.5),
        "p95_latency_ms":pct([r["latency_ms"] for r in rows],0.95),
        "quality_pass_rate":sum(1 for r in rows if bool(r["quality_pass"]))/len(rows),
        "mutations":mutations
    }


def compare(before,after,thresholds):
    b=analyze(before); a=analyze(after)
    if b.get("status")!="measured" or a.get("status")!="measured":
        return {"status":"insufficient_evidence","before":b,"after":a,"verified":False}
    latency_reg=((a["p50_latency_ms"]-b["p50_latency_ms"])/max(1,b["p50_latency_ms"]))*100
    quality_drop=(b["quality_pass_rate"]-a["quality_pass_rate"])*100
    token_improved=a["estimated_static_replay_tokens_per_task"] < b["estimated_static_replay_tokens_per_task"]
    verified=(token_improved and a["cache_read_ratio"]>=float(thresholds["min_cache_read_ratio"]) and
              a["cache_creation_ratio"]<=float(thresholds["max_cache_creation_ratio"]) and
              latency_reg<=float(thresholds["max_latency_regression_pct"]) and
              a["quality_pass_rate"]>=float(thresholds["min_quality_pass_rate"]) and
              quality_drop<=float(thresholds["max_quality_regression_pct_points"]))
    return {"status":"compared","before":b,"after":a,"latency_regression_pct":latency_reg,"quality_regression_pct_points":quality_drop,"verified":verified}


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--before",required=True)
    ap.add_argument("--after")
    ap.add_argument("--thresholds")
    args=ap.parse_args()
    try:
        before=load_jsonl(args.before)
        if args.after:
            if not args.thresholds: raise ValueError("--thresholds required with --after")
            thresholds=json.loads(Path(args.thresholds).read_text(encoding="utf-8"))
            result=compare(before,load_jsonl(args.after),thresholds)
            print(json.dumps(result,indent=2,sort_keys=True)); return 0 if result.get("verified") else 3
        result=analyze(before); print(json.dumps(result,indent=2,sort_keys=True)); return 0 if result["status"]=="measured" else 3
    except Exception as exc:
        print(str(exc),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())
