#!/usr/bin/env python3
import json, sys
from pathlib import Path
FAIL_WORDS=("permission denied","unauthorized","forbidden","validation error","tool error")
SUCCESS_STATES={"completed","success","succeeded"}
FAIL_STATES={"error","failed","failure","denied"}

def classify(e):
    iserr=e.get("isError")
    state=str(e.get("runtime_status","")).lower()
    text=str(e.get("output","")).lower()
    thrown=bool(e.get("thrown",False))
    reasons=[]
    if iserr is True or thrown or state in FAIL_STATES: base="failure"
    elif iserr is False and state in SUCCESS_STATES: base="success"
    else: base="unknown"
    if iserr is True and state in SUCCESS_STATES: reasons.append("isError=true mapped to success state")
    if any(w in text for w in FAIL_WORDS) and base=="success": reasons.append("failure/denial content mapped to success")
    consequential=bool(e.get("consequential",False))
    if consequential and base=="success" and e.get("verified") is not True:
        reasons.append("consequential success lacks verification evidence")
    return base,reasons

def main(a):
    if len(a)!=2: print(f"usage: {a[0]} <events.jsonl>",file=sys.stderr); return 1
    try: lines=Path(a[1]).read_text(encoding="utf-8").splitlines()
    except OSError as x: print(f"ERROR: {x}",file=sys.stderr); return 1
    bad=[]
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try: e=json.loads(line)
        except json.JSONDecodeError as x: print(f"ERROR line {n}: {x}",file=sys.stderr); return 1
        if not isinstance(e,dict): print(f"ERROR line {n}: object required",file=sys.stderr); return 1
        _,r=classify(e)
        bad.extend((n,x) for x in r)
    if bad:
        print("BLOCK")
        for n,r in bad: print(f"- line {n}: {r}")
        return 4
    print(f"PASS: checked {len([x for x in lines if x.strip()])} event(s)")
    return 0
if __name__=="__main__": sys.exit(main(sys.argv))
