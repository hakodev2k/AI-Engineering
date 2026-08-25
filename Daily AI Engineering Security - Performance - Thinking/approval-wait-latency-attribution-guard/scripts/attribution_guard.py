#!/usr/bin/env python3
import json, sys
from collections import defaultdict

EVENTS = {"approval_requested", "approval_decided", "execution_started", "execution_finished", "result_consumed"}
ORDER = ["approval_requested", "approval_decided", "execution_started", "execution_finished", "result_consumed"]

def load(path):
    rows=[]
    with open(path, encoding="utf-8") as f:
        for n,line in enumerate(f,1):
            if not line.strip(): continue
            try: r=json.loads(line)
            except json.JSONDecodeError as e: raise ValueError(f"line {n}: invalid JSON: {e.msg}")
            if not isinstance(r,dict) or not isinstance(r.get("tool_id"),str) or r.get("event") not in EVENTS or not isinstance(r.get("ts_ms"),(int,float)):
                raise ValueError(f"line {n}: require tool_id:str, event:{sorted(EVENTS)}, ts_ms:number")
            rows.append(r)
    if not rows: raise ValueError("empty trace")
    return rows

def analyze(rows):
    grouped=defaultdict(dict); violations=defaultdict(list)
    for r in rows:
        t,e=r["tool_id"],r["event"]
        if e in grouped[t]: violations[t].append(f"duplicate:{e}")
        else: grouped[t][e]=r["ts_ms"]
    out=[]
    for t,m in grouped.items():
        seq=[(ORDER.index(e),ts,e) for e,ts in m.items()]
        for a,b in zip(sorted(seq), sorted(seq)[1:]):
            if a[1] > b[1]: violations[t].append(f"timestamp_order:{a[2]}>{b[2]}")
        if ("approval_requested" in m) != ("approval_decided" in m): violations[t].append("incomplete_approval_boundary")
        if "execution_started" not in m or "execution_finished" not in m: violations[t].append("missing_execution_boundary")
        if "execution_started" in m and "execution_finished" in m and m["execution_finished"] < m["execution_started"]: violations[t].append("negative_execution")
        def delta(a,b): return m[b]-m[a] if a in m and b in m else None
        approval=delta("approval_requested","approval_decided")
        execution=delta("execution_started","execution_finished")
        post=delta("execution_finished","result_consumed")
        first=min(m.values()); last=max(m.values())
        status="attributable" if execution is not None and not violations[t] else "unsafe_attribution"
        out.append({"tool_id":t,"status":status,"approval_wait_ms":approval,"execution_ms":execution,"postprocess_ms":post,"wall_ms":last-first,"violations":violations[t]})
    return sorted(out,key=lambda x:x["tool_id"])

def main(argv):
    if len(argv)!=2:
        print("usage: attribution_guard.py TRACE.jsonl",file=sys.stderr); return 1
    try: result=analyze(load(argv[1]))
    except (OSError,ValueError) as e:
        print(str(e),file=sys.stderr); return 1
    print(json.dumps(result,indent=2,sort_keys=True))
    return 2 if any(x["status"]!="attributable" for x in result) else 0

if __name__=="__main__": raise SystemExit(main(sys.argv))
