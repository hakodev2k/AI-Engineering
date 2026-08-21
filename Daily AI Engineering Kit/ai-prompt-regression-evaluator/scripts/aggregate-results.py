#!/usr/bin/env python3
import argparse, json, statistics, sys
from collections import defaultdict
from pathlib import Path

def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def load_jsonl(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f"invalid JSONL line {n}: {e}")
    return rows

def mean(vals): return statistics.fmean(vals) if vals else None

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--suite", required=True); p.add_argument("--runs", required=True)
    p.add_argument("--side", required=True, choices=["baseline","candidate"]); p.add_argument("--output", required=True)
    a=p.parse_args()
    try:
        suite=load_json(a.suite); rows=load_jsonl(a.runs); cases={c["id"]:c for c in suite["cases"]}
        grouped=defaultdict(list); errors=[]
        for r in rows:
            if r.get("suite_id")!=suite["suite_id"] or r.get("suite_version")!=suite["version"]: errors.append(f"identity mismatch run {r.get('run_id')}")
            elif r.get("side")!=a.side: errors.append(f"wrong side run {r.get('run_id')}")
            elif r.get("case_id") not in cases: errors.append(f"unknown case {r.get('case_id')}")
            else: grouped[r["case_id"]].append(r)
        out_cases=[]
        for cid,c in cases.items():
            rs=grouped.get(cid,[])
            if not rs:
                out_cases.append({"id":cid,"run_count":0,"status":"missing"}); continue
            rubric_dims={x["dimension"]:x["weight"] for x in c["rubric"]}
            per_run=[]
            for r in rs:
                if r.get("error"):
                    per_run.append(0.0); continue
                scores=r.get("rubric_scores",{})
                denom=sum(rubric_dims.values())
                if denom<=0 or any(d not in scores for d in rubric_dims):
                    per_run.append(0.0)
                else:
                    per_run.append(sum(float(scores[d])*w for d,w in rubric_dims.items())/denom)
            costs=[float(r["cost"]) for r in rs if r.get("cost") is not None]
            lats=[float(r["latency_ms"]) for r in rs if r.get("latency_ms") is not None]
            out_cases.append({"id":cid,"severity":c["severity"],"high_impact":c["high_impact"],"weight":c["weight"],"run_count":len(rs),"assertion_pass_rate":sum(1 for r in rs if r.get("assertions_passed") and not r.get("error"))/len(rs),"quality_mean":mean(per_run),"quality_worst":min(per_run),"cost_mean":mean(costs),"latency_mean_ms":mean(lats),"error_count":sum(1 for r in rs if r.get("error")),"status":"ok"})
        if errors: raise ValueError("; ".join(errors))
        valid=[x for x in out_cases if x.get("status")=="ok"]
        denom=sum(x["weight"] for x in valid)
        quality=sum(x["quality_mean"]*x["weight"] for x in valid)/denom if denom else 0.0
        result={"suite_id":suite["suite_id"],"suite_version":suite["version"],"side":a.side,"quality":quality,"cost_mean":mean([x["cost_mean"] for x in valid if x["cost_mean"] is not None]),"latency_mean_ms":mean([x["latency_mean_ms"] for x in valid if x["latency_mean_ms"] is not None]),"cases":out_cases}
        Path(a.output).parent.mkdir(parents=True, exist_ok=True); Path(a.output).write_text(json.dumps(result,indent=2),encoding="utf-8")
        print(json.dumps({"written":a.output,"case_count":len(out_cases),"quality":quality}))
        return 0
    except Exception as e:
        print(json.dumps({"error":str(e)})); return 2
if __name__=="__main__": sys.exit(main())
