#!/usr/bin/env python3
import json, sys
from pathlib import Path
TERMINAL={"succeeded","failed","rejected"}
VALID={"declared","dispatched","awaiting_approval"}|TERMINAL

def load(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text().splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f"line {n}: {e}")
    return rows

def reconcile(rows):
    calls={}; violations=[]
    for i,e in enumerate(rows):
        for k in ("batch_id","call_id","tool","effect","event"):
            if k not in e: raise ValueError(f"event {i} missing {k}")
        if e["effect"] not in {"read_only","idempotent","mutating"}: raise ValueError(f"event {i} invalid effect")
        if e["event"] not in VALID: raise ValueError(f"event {i} invalid lifecycle event")
        key=(e["batch_id"],e["call_id"])
        c=calls.setdefault(key,{"tool":e["tool"],"effect":e["effect"],"events":[]})
        if c["tool"]!=e["tool"] or c["effect"]!=e["effect"]:
            violations.append({"type":"identity_drift","batch_id":key[0],"call_id":key[1]})
        c["events"].append(e["event"])
    batches={}
    for (batch,cid),c in calls.items():
        batches.setdefault(batch,[]).append((cid,c))
        if "declared" not in c["events"]:
            violations.append({"type":"orphan_event","batch_id":batch,"call_id":cid})
        terms=[x for x in c["events"] if x in TERMINAL]
        if len(terms)>1:
            violations.append({"type":"multiple_terminal_outcomes","batch_id":batch,"call_id":cid,"outcomes":terms})
    out={}
    for batch,items in batches.items():
        bviol=[v for v in violations if v["batch_id"]==batch]
        pending=[]; ambiguous=[]
        for cid,c in items:
            terms=[x for x in c["events"] if x in TERMINAL]
            if not terms:
                pending.append(cid)
                if c["effect"]=="mutating" and "dispatched" in c["events"]: ambiguous.append(cid)
        decision="block" if bviol or ambiguous else ("wait" if pending else "complete")
        out[batch]={"decision":decision,"pending":sorted(pending),"ambiguous_mutating":sorted(ambiguous),"violations":bviol}
    return out

def main():
    if len(sys.argv)!=2: print("usage: tool_call_ledger.py events.jsonl",file=sys.stderr); return 2
    try: print(json.dumps(reconcile(load(sys.argv[1])),indent=2,sort_keys=True)); return 0
    except Exception as e: print(e,file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
