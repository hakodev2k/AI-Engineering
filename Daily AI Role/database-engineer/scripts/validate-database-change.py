#!/usr/bin/env python3
import json, sys

REQUIRED = {"id","owner","environment","engine","change_type","affected_objects","risk","goal","verification","recovery","approval_required"}
ENV = {"development","test","staging","production"}
RISK = {"low","medium","high","critical"}
TYPES = {"schema","index","data-backfill","configuration","maintenance","recovery","repair"}

def fail(msg, code=2):
    print(f"ERROR: {msg}", file=sys.stderr); return code

def main():
    if len(sys.argv) != 2: return fail("usage: validate-database-change.py <change.json>")
    try:
        with open(sys.argv[1], encoding="utf-8") as f: d=json.load(f)
    except (OSError, json.JSONDecodeError) as e: return fail(str(e))
    missing=sorted(REQUIRED-set(d))
    if missing: return fail("missing fields: "+", ".join(missing))
    if d["environment"] not in ENV: return fail("invalid environment")
    if d["risk"] not in RISK: return fail("invalid risk")
    if d["change_type"] not in TYPES: return fail("invalid change_type")
    if not isinstance(d["affected_objects"], list) or not d["affected_objects"]: return fail("affected_objects must be non-empty list")
    if not isinstance(d["verification"], list) or not d["verification"]: return fail("verification must be non-empty list")
    if d["environment"] == "production" and d["risk"] in {"high","critical"} and not d["approval_required"]:
        return fail("high/critical production change must require approval")
    print("OK: database change contract is structurally valid")
    return 0

if __name__ == "__main__": raise SystemExit(main())
