#!/usr/bin/env python3
"""Reconcile emitted user-facing assistant text with persisted transcript records."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

REQUIRED_KIND = "assistant_text"

def load(path: Path):
    rows=[]
    try:
        with path.open("r", encoding="utf-8") as f:
            for n,line in enumerate(f,1):
                if not line.strip(): continue
                obj=json.loads(line)
                if not isinstance(obj,dict): raise ValueError(f"line {n}: object required")
                for key in ("event_id","kind","content"):
                    if key not in obj or not isinstance(obj[key],str): raise ValueError(f"line {n}: string {key} required")
                rows.append(obj)
    except (OSError,json.JSONDecodeError,ValueError) as e:
        raise RuntimeError(f"{path}: {e}") from e
    return rows

def digest(text:str)->str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def index(rows):
    out={}; dup=[]
    for r in rows:
        if r["kind"]!=REQUIRED_KIND: continue
        eid=r["event_id"]
        if eid in out: dup.append(eid)
        else: out[eid]=digest(r["content"])
    return out, sorted(set(dup))

def reconcile(emitted,persisted):
    e,ed=index(emitted); p,pd=index(persisted)
    missing=sorted(set(e)-set(p))
    unexpected=sorted(set(p)-set(e))
    mismatched=sorted(k for k in set(e)&set(p) if e[k]!=p[k])
    errors=bool(ed or pd or missing or unexpected or mismatched)
    return {"emitted":len(e),"persisted":len(p),"missing":missing,"unexpected":unexpected,"mismatched":mismatched,"duplicate_emitted_ids":ed,"duplicate_persisted_ids":pd,"integrity_rate": (len(e)-len(missing)-len(mismatched))/len(e) if e else 1.0,"verified":not errors}

def main(argv=None):
    ap=argparse.ArgumentParser()
    ap.add_argument("--emitted",type=Path,required=True)
    ap.add_argument("--persisted",type=Path,required=True)
    ns=ap.parse_args(argv)
    try: result=reconcile(load(ns.emitted),load(ns.persisted))
    except RuntimeError as e:
        print(json.dumps({"verified":False,"error":str(e)})); return 2
    print(json.dumps(result,sort_keys=True))
    return 0 if result["verified"] else 1
if __name__=="__main__": raise SystemExit(main())
