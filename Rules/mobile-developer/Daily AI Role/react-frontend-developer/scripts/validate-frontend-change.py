#!/usr/bin/env python3
import json, sys
REQ=("id","goal","user_impact","routes","states","review_required")
IMPACT={"low","medium","high","critical"}; RISK={"low","medium","high"}
def fail(msg, code=1): print(f"ERROR: {msg}", file=sys.stderr); sys.exit(code)
def main():
    if len(sys.argv)!=2: fail("usage: validate-frontend-change.py <file.json>",2)
    try:
        with open(sys.argv[1],encoding="utf-8") as f: d=json.load(f)
    except Exception as e: fail(f"cannot read JSON: {e}",2)
    for k in REQ:
        if k not in d: fail(f"missing required field: {k}")
    if not isinstance(d["id"],str) or not d["id"].strip(): fail("id must be non-empty")
    if not isinstance(d["goal"],str) or not d["goal"].strip(): fail("goal must be non-empty")
    if d["user_impact"] not in IMPACT: fail("invalid user_impact")
    if not isinstance(d["routes"],list) or not d["routes"]: fail("routes must be non-empty array")
    if not isinstance(d["states"],list) or not d["states"]: fail("states must be non-empty array")
    for k in ("accessibility_risk","performance_risk"):
        if k in d and d[k] not in RISK: fail(f"invalid {k}")
    if not isinstance(d["review_required"],bool): fail("review_required must be boolean")
    print("OK: frontend change request is valid")
if __name__=="__main__": main()
