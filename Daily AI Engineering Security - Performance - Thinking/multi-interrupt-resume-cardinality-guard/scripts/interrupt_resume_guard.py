#!/usr/bin/env python3
"""Validate exact pending-interrupt/resume cardinality without executing actions."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

ALLOWED = {"approved", "rejected", "cancelled", "answered"}

def _flatten(items):
    out=[]
    def walk(x):
        if isinstance(x, dict) and isinstance(x.get("id"), str):
            out.append(x["id"])
            for child in x.get("children", []): walk(child)
        elif isinstance(x, dict):
            for child in x.get("children", []): walk(child)
        elif isinstance(x, list):
            for child in x: walk(child)
    walk(items)
    return out

def validate(bundle):
    if not isinstance(bundle, dict): raise ValueError("bundle must be an object")
    pending=_flatten(bundle.get("pending_interrupts", []))
    if not pending: return False, {"reason":"no_pending_interrupts","pending":[]}
    if len(set(pending)) != len(pending):
        return False, {"reason":"duplicate_pending_ids","pending":pending}
    resume=bundle.get("resume")
    if not isinstance(resume, dict): raise ValueError("resume must be an object")
    if "scalar" in resume:
        if len(pending) != 1:
            return False, {"reason":"scalar_resume_requires_singleton","pending":pending,"pending_count":len(pending)}
        return True, {"reason":"exact_singleton","pending":pending,"response_count":1}
    responses=resume.get("responses")
    if not isinstance(responses, list): raise ValueError("resume.responses must be an array when scalar is absent")
    ids=[]
    for i,r in enumerate(responses):
        if not isinstance(r, dict) or not isinstance(r.get("id"), str) or not r["id"]:
            raise ValueError(f"response {i} requires non-empty id")
        if r.get("status") not in ALLOWED:
            raise ValueError(f"response {i} status must be one of {sorted(ALLOWED)}")
        ids.append(r["id"])
    dup=sorted({x for x in ids if ids.count(x)>1})
    missing=sorted(set(pending)-set(ids)); unknown=sorted(set(ids)-set(pending))
    ok=not dup and not missing and not unknown and len(ids)==len(pending)
    return ok, {"reason":"exact_set" if ok else "resume_set_mismatch","pending_count":len(pending),"response_count":len(ids),"missing":missing,"unknown":unknown,"duplicate_response_ids":dup}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("bundle", type=Path); args=ap.parse_args()
    try:
        bundle=json.loads(args.bundle.read_text(encoding="utf-8")); ok, report=validate(bundle)
    except (OSError, json.JSONDecodeError, ValueError) as e:
        print(f"resume_guard_error: {e}", file=sys.stderr); return 1
    print(json.dumps({"status":"valid" if ok else "blocked", **report}, sort_keys=True))
    return 0 if ok else 2
if __name__=="__main__": raise SystemExit(main())
