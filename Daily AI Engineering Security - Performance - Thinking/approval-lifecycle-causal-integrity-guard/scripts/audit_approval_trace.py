#!/usr/bin/env python3
"""Audit JSONL approval lifecycle traces for semantic and timing integrity."""
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from pathlib import Path

TERMINAL = {"completed", "rejected", "failed"}
ALLOWED = {
    "requested": {"awaiting_approval", "approved", "executing", "rejected", "failed", "interrupted"},
    "awaiting_approval": {"approved", "rejected", "interrupted", "failed"},
    "approved": {"executing", "interrupted", "failed"},
    "executing": {"completed", "failed", "interrupted"},
    "interrupted": {"awaiting_approval", "approved", "executing", "rejected", "failed"},
    "completed": set(), "rejected": set(), "failed": set(),
}

def load(path: Path):
    rows=[]
    for n,line in enumerate(path.read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        try: obj=json.loads(line)
        except json.JSONDecodeError as e: raise ValueError(f"line {n}: invalid JSON: {e}")
        for key in ("call_id","state","ts_ms"):
            if key not in obj: raise ValueError(f"line {n}: missing {key}")
        if obj["state"] not in ALLOWED: raise ValueError(f"line {n}: unknown state {obj['state']!r}")
        if not isinstance(obj["ts_ms"], (int,float)): raise ValueError(f"line {n}: ts_ms must be numeric")
        rows.append((n,obj))
    return rows

def audit(rows):
    by=defaultdict(list)
    violations=[]
    for n,o in rows: by[str(o["call_id"])].append((n,o))
    metrics={"calls":len(by),"invalid_transition_count":0,"rejected_then_executed_count":0,"interrupt_as_error_count":0,"approval_time_misattribution_count":0}
    intervals={}
    for cid,events in by.items():
        events.sort(key=lambda x:x[1]["ts_ms"])
        states=[o["state"] for _,o in events]
        for (n1,a),(n2,b) in zip(events,events[1:]):
            if b["ts_ms"] < a["ts_ms"]: violations.append({"call_id":cid,"type":"non_monotonic_time","line":n2})
            if b["state"] not in ALLOWED[a["state"]]:
                metrics["invalid_transition_count"]+=1
                violations.append({"call_id":cid,"type":"invalid_transition","from":a["state"],"to":b["state"],"line":n2})
        if "rejected" in states:
            ri=states.index("rejected")
            if any(s in {"approved","executing","completed"} for s in states[ri+1:]):
                metrics["rejected_then_executed_count"]+=1
        for n,o in events:
            msg=str(o.get("message","")).lower()
            if o["state"]=="failed" and ("interrupt" in msg or "approval" in msg and "pause" in msg):
                metrics["interrupt_as_error_count"]+=1
                violations.append({"call_id":cid,"type":"interrupt_as_error","line":n})
        t={o["state"]:o["ts_ms"] for _,o in events}
        approval=None; execution=None
        if "awaiting_approval" in t and "approved" in t: approval=t["approved"]-t["awaiting_approval"]
        if "executing" in t and "completed" in t: execution=t["completed"]-t["executing"]
        for n,o in events:
            claimed=o.get("duration_ms")
            if claimed is not None and o.get("duration_kind")=="execution" and approval and execution is not None and claimed > execution + max(100, approval*0.5):
                metrics["approval_time_misattribution_count"]+=1
                violations.append({"call_id":cid,"type":"approval_time_misattributed_as_execution","line":n,"claimed_ms":claimed,"derived_execution_ms":execution})
        intervals[cid]={"approval_wait_ms":approval,"execution_ms":execution}
    blocking=sum(metrics[k] for k in ("invalid_transition_count","rejected_then_executed_count","interrupt_as_error_count","approval_time_misattribution_count"))
    return {"blocking_violations":blocking,"metrics":metrics,"intervals":intervals,"violations":violations}

def main():
    p=argparse.ArgumentParser(); p.add_argument("trace",type=Path); p.add_argument("--pretty",action="store_true"); a=p.parse_args()
    try: report=audit(load(a.trace))
    except (OSError,ValueError) as e:
        print(json.dumps({"error":str(e)}),file=sys.stderr); return 1
    print(json.dumps(report,indent=2 if a.pretty else None,sort_keys=True))
    return 2 if report["blocking_violations"] else 0
if __name__=="__main__": raise SystemExit(main())
