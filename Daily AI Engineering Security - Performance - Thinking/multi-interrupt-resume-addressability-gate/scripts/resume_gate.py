#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path
def load(p):
    try:return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception as e: raise SystemExit(f"input_error: {e}")
def evaluate(doc):
    pending=doc.get("pending_interrupts"); resume=doc.get("resume")
    if not isinstance(pending,list) or not all(isinstance(x,dict) for x in pending): return {"ok":False,"reason":"pending_interrupts_must_be_objects"}
    ids=[x.get("id") for x in pending]
    if any(not isinstance(i,str) or not i for i in ids): return {"ok":False,"reason":"interrupt_missing_id"}
    if len(set(ids))!=len(ids): return {"ok":False,"reason":"duplicate_interrupt_id"}
    if not ids:return {"ok":False,"reason":"no_pending_interrupts"}
    if len(ids)==1:
        if isinstance(resume,dict):
            unknown=set(resume)-set(ids)
            if unknown:return {"ok":False,"reason":"unknown_resume_id","ids":sorted(unknown)}
            if ids[0] not in resume:return {"ok":False,"reason":"missing_resume_id","ids":[ids[0]]}
        return {"ok":True,"mode":"single","resumed_ids":ids}
    if not isinstance(resume,dict): return {"ok":False,"reason":"ambiguous_scalar_resume","pending_count":len(ids),"required":"object keyed by interrupt id"}
    unknown=set(resume)-set(ids)
    if unknown:return {"ok":False,"reason":"unknown_resume_id","ids":sorted(unknown)}
    if not resume:return {"ok":False,"reason":"empty_resume_map"}
    return {"ok":True,"mode":"addressed","resumed_ids":[i for i in ids if i in resume],"remaining_ids":[i for i in ids if i not in resume]}
def main():
    p=argparse.ArgumentParser(description="Reject ambiguous scalar resumes when multiple interrupts are pending."); p.add_argument("input"); p.add_argument("--pretty",action="store_true"); a=p.parse_args(); r=evaluate(load(a.input)); print(json.dumps(r,indent=2 if a.pretty else None,sort_keys=True)); return 0 if r.get("ok") else 2
if __name__=="__main__": sys.exit(main())
