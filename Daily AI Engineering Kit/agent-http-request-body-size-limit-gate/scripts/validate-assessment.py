#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQ_VERIFICATION = ["limit_enforced","oversized_request_rejected","streaming_path_reviewed","proxy_app_limits_aligned","normal_request_still_passes","independent_verification"]
STATUSES={"pass","fail","blocked","needs-approval"}

def error(msg): print(f"ERROR: {msg}", file=sys.stderr)

def validate(data):
    errors=[]
    if data.get("status") not in STATUSES: errors.append("invalid status")
    if not isinstance(data.get("entry_points"),list) or not data["entry_points"]: errors.append("entry_points must be non-empty")
    if not isinstance(data.get("findings"),list): errors.append("findings must be an array")
    v=data.get("verification")
    if not isinstance(v,dict): errors.append("verification must be an object")
    else:
        for k in REQ_VERIFICATION:
            if not isinstance(v.get(k),bool): errors.append(f"verification.{k} must be boolean")
    if not isinstance(data.get("remaining_risks"),list): errors.append("remaining_risks must be an array")
    if data.get("status")=="pass" and isinstance(v,dict):
        missing=[k for k in REQ_VERIFICATION if v.get(k) is not True]
        if missing: errors.append("pass requires all verification flags true: "+", ".join(missing))
        for f in data.get("findings",[]):
            if f.get("risk") in {"high","critical"} and f.get("verification_status")!="verified":
                errors.append("pass cannot contain unverified high/critical findings")
    return errors

def main():
    if len(sys.argv)!=2: error("usage: validate-assessment.py <assessment.json>"); return 2
    p=Path(sys.argv[1])
    try: data=json.loads(p.read_text(encoding="utf-8"))
    except Exception as ex: error(str(ex)); return 2
    errors=validate(data)
    if errors:
        for e in errors: error(e)
        return 1
    print("assessment valid")
    return 0

if __name__=="__main__": raise SystemExit(main())
