#!/usr/bin/env python3
import json, sys
from pathlib import Path

VALID={"investigating","reproduced","fix-proposed","verified","blocked"}

def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr); return 1

def main():
    if len(sys.argv)!=2: return fail("usage: validate-evidence.py <evidence.json>")
    p=Path(sys.argv[1])
    if not p.is_file(): return fail(f"file not found: {p}")
    try: d=json.loads(p.read_text(encoding="utf-8"))
    except Exception as e: return fail(f"invalid JSON: {e}")
    required={"status","database","transactions","evidence","verification"}
    missing=required-set(d)
    if missing: return fail("missing fields: "+", ".join(sorted(missing)))
    if d["status"] not in VALID: return fail("invalid status")
    if not isinstance(d["transactions"],list) or len(d["transactions"])<2: return fail("at least two transactions required")
    for i,t in enumerate(d["transactions"]):
        if not isinstance(t,dict) or not t.get("name") or not isinstance(t.get("steps"),list) or not t["steps"]: return fail(f"invalid transaction {i}")
    v=d["verification"]
    if not isinstance(v,dict) or not isinstance(v.get("reproduction_before"),bool) or not isinstance(v.get("reproduction_after"),bool): return fail("verification booleans required")
    if d["status"]=="verified" and (not v["reproduction_before"] or v["reproduction_after"]): return fail("verified requires before=true and after=false")
    print("Evidence contract valid")
    return 0

if __name__=="__main__": raise SystemExit(main())
