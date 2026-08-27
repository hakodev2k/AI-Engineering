#!/usr/bin/env python3
import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot_read:{path}:{exc}"}))
        raise SystemExit(2)


def load_jsonl(path):
    rows=[]
    try:
        for n,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
            if not line.strip():
                continue
            row=json.loads(line)
            row["_line"]=n
            rows.append(row)
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot_read_trace:{exc}"}))
        raise SystemExit(2)
    return rows


def analyze(rows, policy):
    required={"workload_id","input_tokens","cached_tokens","cache_write_tokens","prompt_cache_key","stable_prefix_fingerprint"}
    groups=defaultdict(list)
    invalid=[]
    for r in rows:
        missing=required-r.keys()
        if missing:
            invalid.append({"line":r.get("_line"),"missing":sorted(missing)})
            continue
        groups[str(r["workload_id"])].append(r)
    if invalid:
        return {"ok":False,"decision":"block","reasons":["invalid_trace_rows"],"invalid_rows":invalid,"groups":{}}

    group_results={}
    global_reasons=[]
    min_n=int(policy.get("minimum_requests_per_group",3))
    min_input=int(policy.get("min_repeated_input_tokens",4096))
    max_ratio=float(policy.get("max_write_to_read_ratio",0.75))
    max_zero=float(policy.get("max_zero_cache_read_fraction",0.5))

    for gid,items in groups.items():
        reasons=[]
        if len(items)<min_n:
            group_results[gid]={"status":"insufficient_evidence","requests":len(items),"reasons":[]}
            continue
        total_input=sum(max(0,int(r["input_tokens"])) for r in items)
        total_read=sum(max(0,int(r["cached_tokens"])) for r in items)
        total_write=sum(max(0,int(r["cache_write_tokens"])) for r in items)
        zero_fraction=sum(1 for r in items if int(r["cached_tokens"])==0)/len(items)
        ratio=total_write/max(1,total_read)
        keys={str(r["prompt_cache_key"]) for r in items}
        prefixes={str(r["stable_prefix_fingerprint"]) for r in items}

        if total_input>=min_input:
            if ratio>max_ratio:
                reasons.append("cache_write_to_read_ratio_exceeded")
            if zero_fraction>max_zero:
                reasons.append("zero_cache_read_fraction_exceeded")
        if policy.get("require_stable_cache_key",True) and len(keys)>1:
            reasons.append("unstable_prompt_cache_key")
        if policy.get("require_stable_prefix_fingerprint",True) and len(prefixes)>1:
            reasons.append("unstable_stable_prefix_fingerprint")

        group_results[gid]={
            "status":"measured",
            "requests":len(items),
            "total_input_tokens":total_input,
            "cached_tokens":total_read,
            "cache_write_tokens":total_write,
            "write_to_read_ratio":round(ratio,4),
            "zero_cache_read_fraction":round(zero_fraction,4),
            "cache_key_count":len(keys),
            "stable_prefix_fingerprint_count":len(prefixes),
            "reasons":sorted(set(reasons)),
        }
        global_reasons.extend(f"{gid}:{x}" for x in reasons)

    return {"ok":not global_reasons,"decision":"allow" if not global_reasons else "block","reasons":sorted(set(global_reasons)),"groups":group_results}


def main():
    ap=argparse.ArgumentParser(description="Detect GPT-5.6 prompt-cache write amplification")
    ap.add_argument("--trace",required=True,help="JSONL request usage trace")
    ap.add_argument("--policy",required=True,help="Policy JSON")
    a=ap.parse_args()
    result=analyze(load_jsonl(a.trace),load_json(a.policy))
    print(json.dumps(result,indent=2,sort_keys=True))
    return 0 if result["ok"] else 3


if __name__=="__main__":
    sys.exit(main())
