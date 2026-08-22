#!/usr/bin/env python3
"""Compare authoritative governance constraints with compacted-context pins.

Both files are JSON arrays of objects:
{"id":"policy-1","version":"3","sha256":"<64 hex>","scope":"tool:deploy","active":true}

Exit codes: 0 pass, 2 invalid input, 4 coverage/integrity failure.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

HEX64=re.compile(r"^[0-9a-fA-F]{64}$")
REQ={"id","version","sha256","scope","active"}


def load(path: Path):
    try: data=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data,list): raise ValueError(f"{path} must contain an array")
    out={}
    for i,item in enumerate(data):
        if not isinstance(item,dict) or not REQ.issubset(item): raise ValueError(f"{path}[{i}] missing required fields")
        if not all(isinstance(item[k],str) and item[k] for k in ("id","version","sha256","scope")): raise ValueError(f"{path}[{i}] string fields invalid")
        if not HEX64.match(item["sha256"]): raise ValueError(f"{path}[{i}] sha256 must be 64 hex characters")
        if not isinstance(item["active"],bool): raise ValueError(f"{path}[{i}] active must be boolean")
        if item["id"] in out: raise ValueError(f"{path}: duplicate id {item['id']}")
        out[item["id"]]=item
    return out


def main():
    p=argparse.ArgumentParser(); p.add_argument("required",type=Path); p.add_argument("pins",type=Path); a=p.parse_args()
    try: required,pins=load(a.required),load(a.pins)
    except ValueError as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}),file=sys.stderr); return 2
    active={k:v for k,v in required.items() if v["active"]}
    missing=[]; mismatched=[]
    for cid,r in active.items():
        pin=pins.get(cid)
        if pin is None:
            missing.append(cid); continue
        diffs={k:{"expected":r[k],"actual":pin.get(k)} for k in ("version","sha256","scope","active") if pin.get(k)!=r[k]}
        if diffs: mismatched.append({"id":cid,"differences":diffs})
    unexpected_active=[cid for cid,pin in pins.items() if pin.get("active") and cid not in required]
    status="pass" if not missing and not mismatched and not unexpected_active else "fail"
    result={"status":status,"required_active":len(active),"covered":len(active)-len(missing)-len(mismatched),"missing":missing,"mismatched":mismatched,"unexpected_active":unexpected_active}
    print(json.dumps(result,indent=2))
    return 0 if status=="pass" else 4

if __name__=="__main__": raise SystemExit(main())
