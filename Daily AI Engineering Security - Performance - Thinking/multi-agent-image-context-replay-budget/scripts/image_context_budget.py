#!/usr/bin/env python3
"""Deterministic budget gate for normalized multimodal agent telemetry JSONL."""
import argparse, json, math, sys
from pathlib import Path

REQUIRED = {"thread_id","parent_thread_id","input_tokens","cached_input_tokens","image_payload_bytes","inherited_image_bytes","rollout_bytes","latency_ms"}

def percentile(values, p):
    if not values: return 0.0
    s=sorted(values); k=(len(s)-1)*p; lo=math.floor(k); hi=math.ceil(k)
    return float(s[lo] if lo==hi else s[lo]+(s[hi]-s[lo])*(k-lo))

def load_jsonl(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        try: row=json.loads(line)
        except json.JSONDecodeError as e: raise ValueError(f"line {n}: invalid JSON: {e}")
        missing=REQUIRED-row.keys()
        if missing: raise ValueError(f"line {n}: missing {','.join(sorted(missing))}")
        for key in REQUIRED-{"thread_id","parent_thread_id"}:
            if not isinstance(row[key],(int,float)) or row[key] < 0: raise ValueError(f"line {n}: {key} must be non-negative number")
        rows.append(row)
    if not rows: raise ValueError("no telemetry rows")
    return rows

def evaluate(rows, policy):
    threads={r["thread_id"] for r in rows}; parents={r["parent_thread_id"] for r in rows if r["parent_thread_id"]}
    roots=threads-parents
    descendants=max(0,len(threads)-max(1,len(roots)))
    max_inherited=max(r["inherited_image_bytes"] for r in rows)
    rollout_by_thread={}
    for r in rows: rollout_by_thread[r["thread_id"]]=max(rollout_by_thread.get(r["thread_id"],0),r["rollout_bytes"])
    rollout_total=sum(rollout_by_thread.values())
    max_input=max(r["input_tokens"] for r in rows)
    max_image=max(r["image_payload_bytes"] for r in rows)
    p95=percentile([r["latency_ms"] for r in rows],.95)
    total_input=sum(r["input_tokens"] for r in rows); total_cached=sum(r["cached_input_tokens"] for r in rows)
    cached_fraction=(total_cached/total_input) if total_input else 0.0
    metrics={"threads":len(threads),"descendants":descendants,"max_inherited_image_bytes":max_inherited,"task_family_rollout_bytes":rollout_total,"max_input_tokens_per_turn":max_input,"max_image_payload_bytes_per_turn":max_image,"p95_latency_ms":p95,"cached_input_fraction":cached_fraction}
    limits=[("descendants","max_descendants"),("max_inherited_image_bytes","max_inherited_image_bytes_per_child"),("task_family_rollout_bytes","max_task_family_rollout_bytes"),("max_input_tokens_per_turn","max_input_tokens_per_turn"),("max_image_payload_bytes_per_turn","max_image_payload_bytes_per_turn"),("p95_latency_ms","max_p95_latency_ms")]
    violations=[f"{m}>{p}" for m,p in limits if metrics[m] > policy[p]]
    warnings=[]
    if cached_fraction >= policy.get("minimum_cached_fraction_warning",1.1) and violations:
        warnings.append("high_cache_hit_fraction_does_not_remove_resource_amplification")
    return {"ok":not violations,"decision":"allow" if not violations else "narrow-context-before-fanout","metrics":metrics,"violations":violations,"warnings":warnings}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--input",required=True); ap.add_argument("--policy",required=True); a=ap.parse_args()
    try:
        rows=load_jsonl(a.input); policy=json.loads(Path(a.policy).read_text(encoding="utf-8")); result=evaluate(rows,policy)
    except Exception as e:
        print(json.dumps({"ok":False,"error":str(e)})); return 2
    print(json.dumps(result,indent=2,sort_keys=True)); return 0 if result["ok"] else 3
if __name__=="__main__": raise SystemExit(main())
