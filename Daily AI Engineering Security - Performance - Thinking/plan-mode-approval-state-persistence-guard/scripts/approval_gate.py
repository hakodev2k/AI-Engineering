#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path
MUTATING_ACTIONS={"write","edit","delete","commit","push","deploy","tool_mutation"}
def load_json(path):
    try:return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e: raise SystemExit(f"input_error: {e}")
def evaluate(doc):
    mode=doc.get("mode"); epoch=doc.get("session_epoch"); plan=doc.get("plan_hash"); events=doc.get("events",[])
    if mode not in {"plan","default","acceptEdits","auto","dontAsk","bypassPermissions"}: return {"ok":False,"reason":"invalid_mode"}
    if not isinstance(events,list): return {"ok":False,"reason":"events_must_be_list"}
    approved=False; approval_id=None
    for i,ev in enumerate(events):
        if not isinstance(ev,dict): return {"ok":False,"reason":f"event_{i}_not_object"}
        typ=ev.get("type")
        if typ=="approval":
            approved=bool(ev.get("accepted")) and ev.get("plan_hash")==plan and ev.get("session_epoch")==epoch and bool(ev.get("approval_id"))
            approval_id=ev.get("approval_id") if approved else None
        elif typ=="resume":
            if mode=="plan" and not approved and ev.get("reported_mode")!="plan":
                return {"ok":False,"reason":"unapproved_plan_mode_drop","event_index":i,"required_mode":"plan"}
        elif typ=="action":
            if ev.get("action") in MUTATING_ACTIONS and mode=="plan" and not approved:
                return {"ok":False,"reason":"mutation_without_bound_approval","event_index":i,"action":ev.get("action")}
        elif typ=="plan_changed":
            if not ev.get("plan_hash"): return {"ok":False,"reason":"plan_changed_missing_hash","event_index":i}
            plan=ev["plan_hash"]; approved=False; approval_id=None
        elif typ in {"question","question_failed","notice","read"}: pass
        else:return {"ok":False,"reason":"unknown_event_type","event_index":i,"type":typ}
    return {"ok":True,"effective_mode":mode,"approval_bound":approved,"approval_id":approval_id,"plan_hash":plan}
def main():
    p=argparse.ArgumentParser(description="Fail-closed verifier for plan-mode approval persistence."); p.add_argument("input"); p.add_argument("--pretty",action="store_true"); a=p.parse_args()
    r=evaluate(load_json(a.input)); print(json.dumps(r,indent=2 if a.pretty else None,sort_keys=True)); return 0 if r.get("ok") else 2
if __name__=="__main__": sys.exit(main())
