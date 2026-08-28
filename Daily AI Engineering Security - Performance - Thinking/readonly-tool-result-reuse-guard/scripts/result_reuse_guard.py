#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def canon(v): return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False)
def sha(v): return hashlib.sha256(v.encode()).hexdigest()
def load_json(p): return json.loads(Path(p).read_text())
def load_jsonl(p):
    out=[]
    for n,line in enumerate(Path(p).read_text().splitlines(),1):
        if not line.strip(): continue
        try: out.append(json.loads(line))
        except Exception as e: raise ValueError(f"invalid JSONL line {n}: {e}")
    return out

def evaluate(events,policy):
    eligible=set(policy.get("eligible_tools",[])); ttl=int(policy.get("max_reference_age_seconds",300))
    require_dep=bool(policy.get("require_dependency_fingerprint",True))
    markers=policy.get("secret_markers",[]) if policy.get("deny_if_contains_secret_marker",True) else []
    seen={}; decisions=[]
    for i,e in enumerate(events):
        for k in ("tool","args","result","timestamp"):
            if k not in e: raise ValueError(f"event {i} missing {k}")
        if not isinstance(e["result"],str): raise ValueError(f"event {i} result must be string")
        key=sha(e["tool"]+"|"+canon(e["args"])); rh=sha(e["result"]); dep=e.get("dependency_fingerprint")
        if e["tool"] not in eligible: action,reason="send_full","tool_not_eligible"
        elif any(m and m in e["result"] for m in markers): action,reason="send_full","secret_marker_present"
        elif require_dep and not dep: action,reason="send_full","dependency_fingerprint_missing"
        else:
            prev=seen.get(key)
            if prev and prev["hash"]==rh and prev["dep"]==dep and e["timestamp"]-prev["ts"]<=ttl:
                action,reason="reuse_reference","unchanged_result_and_dependency"
            else: action,reason="send_full","first_or_changed_result"
        decisions.append({"index":i,"action":action,"reason":reason,"reference":"tool-result:"+rh[:16],"result_sha256":rh})
        if e["tool"] in eligible and not any(m and m in e["result"] for m in markers):
            seen[key]={"hash":rh,"dep":dep,"ts":e["timestamp"]}
    return decisions

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--events",required=True); ap.add_argument("--policy",required=True); a=ap.parse_args()
    try: print(json.dumps(evaluate(load_jsonl(a.events),load_json(a.policy)),indent=2)); return 0
    except Exception as e: print(e,file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
