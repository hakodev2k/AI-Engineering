#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path

ALLOWED_TASK={"executed","failed","blocked"}; ALLOWED_VERIFY={"verified","failed","blocked","not_run"}

def fail(msg): print(msg,file=sys.stderr); return 2

def main():
    p=argparse.ArgumentParser(); p.add_argument("--evidence",required=True); p.add_argument("--schema",required=True); a=p.parse_args()
    try: ev=json.loads(Path(a.evidence).read_text(encoding="utf-8")); json.loads(Path(a.schema).read_text(encoding="utf-8"))
    except Exception as e: return fail(f"json error: {e}")
    required={"task_status","verification_status","repository","findings","provenance","checks","remaining_risks"}
    if not isinstance(ev,dict) or required-set(ev): return fail("missing required evidence fields: "+", ".join(sorted(required-set(ev))))
    if ev["task_status"] not in ALLOWED_TASK or ev["verification_status"] not in ALLOWED_VERIFY: return fail("invalid status")
    for name in ("findings","provenance","checks","remaining_risks"):
        if not isinstance(ev[name],list): return fail(f"{name} must be array")
    unresolved=[f for f in ev["findings"] if f.get("severity")=="blocking" and f.get("status")=="unresolved"]
    unknown=[x for x in ev["provenance"] if x.get("classification")=="unknown"]
    failed=[c for c in ev["checks"] if c.get("status")=="failed"]
    pending=[x for x in ev.get("approvals",[]) if x.get("status") in {"pending","denied"}]
    if ev["verification_status"]=="verified" and (unresolved or unknown or failed or pending): return fail("verified evidence contains unresolved blocker, unknown provenance, failed check, or pending approval")
    if not ev["checks"]: return fail("at least one check required")
    print("evidence valid"); return 0
if __name__=="__main__": raise SystemExit(main())
