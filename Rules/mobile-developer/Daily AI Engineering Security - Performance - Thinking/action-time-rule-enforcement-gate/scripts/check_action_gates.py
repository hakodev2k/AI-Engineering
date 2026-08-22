#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone
from pathlib import Path


def load(path):
    try:
        obj=json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read JSON {path}: {e}")
    if not isinstance(obj, dict): raise ValueError("JSON root must be object")
    return obj

def ts(value):
    if not isinstance(value,str): raise ValueError("observed_at must be ISO timestamp string")
    return datetime.fromisoformat(value.replace("Z","+00:00")).astimezone(timezone.utc)

def emit(decision, **data):
    print(json.dumps({"decision":decision,**data},sort_keys=True))

def main():
    p=argparse.ArgumentParser(description="Evaluate action-time hard-rule gates")
    p.add_argument("--registry",required=True); p.add_argument("--action",required=True); p.add_argument("--evidence",required=True)
    a=p.parse_args()
    try:
        reg, action, evidence=load(a.registry),load(a.action),load(a.evidence)
        gates=reg.get("gates")
        if not isinstance(gates,list): raise ValueError("registry.gates must be list")
        action_type=action.get("type"); epoch=action.get("epoch")
        if not isinstance(action_type,str) or not action_type: raise ValueError("action.type required")
        now=datetime.now(timezone.utc); matched=[]; problems=[]; review=False
        records=evidence.get("records",{})
        if not isinstance(records,dict): raise ValueError("evidence.records must be object")
        for gate in gates:
            if not isinstance(gate,dict): raise ValueError("gate must be object")
            actions=gate.get("actions",[])
            if action_type not in actions: continue
            gid=gate.get("id","unnamed"); matched.append(gid)
            for req in gate.get("required_evidence",[]):
                key=req.get("key"); rec=records.get(key)
                if not isinstance(rec,dict):
                    problems.append({"gate":gid,"key":key,"reason":"missing"}); continue
                if "equals" in req and rec.get("value") != req["equals"]:
                    problems.append({"gate":gid,"key":key,"reason":"unexpected-value"}); continue
                max_age=req.get("max_age_seconds")
                if max_age is not None:
                    age=(now-ts(rec.get("observed_at"))).total_seconds()
                    if age < 0 or age > float(max_age): problems.append({"gate":gid,"key":key,"reason":"stale","age_seconds":round(age,3)}); continue
                if req.get("same_epoch") and rec.get("epoch") != epoch:
                    problems.append({"gate":gid,"key":key,"reason":"epoch-mismatch"}); continue
            if gate.get("on_failure") == "review": review=True
        if problems:
            decision="review" if review else "block"; emit(decision,matched_gates=matched,problems=problems); return 3 if decision=="review" else 2
        emit("allow",matched_gates=matched,problems=[]); return 0
    except ValueError as e:
        emit("review",error=str(e)); return 3
    except Exception as e:
        emit("review",error=f"unexpected: {e}"); return 4

if __name__=="__main__": sys.exit(main())
