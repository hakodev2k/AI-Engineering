#!/usr/bin/env python3
import json, sys
from pathlib import Path

SUCCESS={"completed","success"}
FAILURE={"tool_deferred","stream_failed","persistence_failed","cancelled","error","unknown"}

def validate(env):
    if not isinstance(env,dict): raise ValueError("completion envelope must be an object")
    required=["terminal_reason","result","expected_deliverables","delivered","unresolved_actions","verification"]
    missing=[k for k in required if k not in env]
    if missing: return {"ok":False,"status":"incomplete","reasons":["missing:"+k for k in missing]}
    reasons=[]; terminal=str(env["terminal_reason"]); result=env["result"]
    if terminal in FAILURE: reasons.append("non_success_terminal:"+terminal)
    elif terminal not in SUCCESS: reasons.append("unrecognized_terminal:"+terminal)
    if not isinstance(result,str) or not result.strip(): reasons.append("missing_final_result")
    expected=env["expected_deliverables"]; delivered=env["delivered"]
    if not isinstance(expected,list) or not isinstance(delivered,list): reasons.append("deliverables_must_be_lists")
    else: reasons.extend("missing_deliverable:"+x for x in sorted(set(expected)-set(delivered)))
    unresolved=env["unresolved_actions"]
    if not isinstance(unresolved,list): reasons.append("unresolved_actions_must_be_list")
    elif unresolved: reasons.append("unresolved_actions_present")
    ver=env["verification"]
    if not isinstance(ver,dict): reasons.append("verification_must_be_object")
    else:
        if ver.get("required") and ver.get("status")!="passed": reasons.append("required_verification_not_passed")
        if ver.get("independent_required") and not ver.get("independent"): reasons.append("independent_verification_missing")
    if env.get("deferred_tool_use"): reasons.append("deferred_tool_use_present")
    return {"ok":not reasons,"status":"complete" if not reasons else "incomplete","reasons":sorted(set(reasons)),"implemented":bool(env.get("implemented",False)),"measured":bool(env.get("measured",False)),"verified":bool(isinstance(ver,dict) and ver.get("status")=="passed")}

def main():
    if len(sys.argv)!=2: print("usage: validate_completion.py completion.json",file=sys.stderr); return 2
    try:r=validate(json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")))
    except Exception as e: print(json.dumps({"ok":False,"status":"incomplete","error":str(e)})); return 2
    print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r["ok"] else 3
if __name__=="__main__": raise SystemExit(main())
