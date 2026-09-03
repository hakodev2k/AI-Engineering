#!/usr/bin/env python3
"""Validate resume input reconstructability from a local JSON task record."""
from __future__ import annotations
import argparse, hashlib, json, pathlib, sys

VALID_KINDS={"durable","reconstructable","runtime-only"}

def fingerprint(values: dict) -> str:
    raw=json.dumps(values,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()

def evaluate(record: dict) -> dict:
    deps=record.get("dependencies")
    if not isinstance(deps,list):
        raise ValueError("dependencies must be a list")
    missing=[]; fp_values={}
    for dep in deps:
        if not isinstance(dep,dict): raise ValueError("dependency entries must be objects")
        name=dep.get("name"); kind=dep.get("kind"); required=bool(dep.get("required",True))
        if not name or kind not in VALID_KINDS: raise ValueError("dependency requires name and valid kind")
        available=bool(dep.get("available",False))
        if required and not available:
            missing.append(name)
        if available and kind in {"durable","reconstructable"}:
            fp_values[name]=dep.get("value_descriptor")
    current=fingerprint(fp_values)
    expected=record.get("original_fingerprint")
    fp_match=(expected is None or expected==current)
    completed=bool(record.get("completed",False))
    side_effecting=bool(record.get("side_effecting",False))
    idempotent=bool(record.get("idempotent",False))
    duplicate_risk=completed and side_effecting and not idempotent
    ok=not missing and fp_match and not duplicate_risk
    return {"ok":ok,"missing_required":missing,"fingerprint":current,"fingerprint_match":fp_match,"duplicate_side_effect_risk":duplicate_risk}

def main(argv=None):
    p=argparse.ArgumentParser(); p.add_argument("record",type=pathlib.Path)
    a=p.parse_args(argv)
    try:
        record=json.loads(a.record.read_text(encoding="utf-8")); result=evaluate(record)
    except (OSError,json.JSONDecodeError,ValueError) as exc:
        print(json.dumps({"ok":False,"error":str(exc)})); return 2
    print(json.dumps(result,sort_keys=True)); return 0 if result["ok"] else 1
if __name__=="__main__": sys.exit(main())
