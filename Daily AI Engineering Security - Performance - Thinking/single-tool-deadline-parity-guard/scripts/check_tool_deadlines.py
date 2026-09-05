#!/usr/bin/env python3
"""Check finite, consistent tool execution deadline declarations."""
import json, sys
from pathlib import Path

def load(path):
    try: d=json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError as e: raise ValueError(f"file not found: {path}") from e
    except json.JSONDecodeError as e: raise ValueError(f"invalid JSON: {e}") from e
    if not isinstance(d,dict) or not isinstance(d.get("execution_paths"),list): raise ValueError("object must contain execution_paths list")
    return d

def validate(d):
    f=[]; names=set()
    for i,p in enumerate(d["execution_paths"]):
        if not isinstance(p,dict): f.append(f"BLOCK path[{i}] must be object"); continue
        n=str(p.get("name",f"path-{i}")); names.add(n)
        hard=p.get("hard_timeout_seconds")
        if not isinstance(hard,(int,float)) or isinstance(hard,bool) or hard<=0: f.append(f"BLOCK {n}: finite positive hard_timeout_seconds required")
        idle=p.get("idle_timeout_seconds")
        if idle is not None and (not isinstance(idle,(int,float)) or isinstance(idle,bool) or idle<=0): f.append(f"BLOCK {n}: idle_timeout_seconds must be positive or null")
        if p.get("owns_cancellable_resource",False) and not p.get("cancellation_supported",False): f.append(f"BLOCK {n}: owns resource but cancellation_supported is false")
        if p.get("timeout_disposition") != "tool_timeout": f.append(f"BLOCK {n}: timeout_disposition must normalize to tool_timeout")
        retries=p.get("max_timeout_retries",0)
        if not isinstance(retries,int) or isinstance(retries,bool) or retries<0 or retries>2: f.append(f"BLOCK {n}: max_timeout_retries must be integer 0..2")
        if p.get("non_idempotent",False) and retries>0 and not p.get("retry_safety_approved",False): f.append(f"BLOCK {n}: non-idempotent timeout retry lacks explicit safety approval")
    required=set(d.get("required_path_names",[]))
    missing=required-names
    if missing: f.append("BLOCK missing required execution paths: "+", ".join(sorted(missing)))
    return f

def main(argv):
    if len(argv)!=2: print(f"usage: {argv[0]} <deadlines.json>",file=sys.stderr); return 1
    try: f=validate(load(argv[1]))
    except (OSError,ValueError) as e: print(f"ERROR: {e}",file=sys.stderr); return 1
    if f:
        print("BLOCK"); [print(f"- {x}") for x in f]; return 2
    print("PASS: all declared tool paths have bounded deadline semantics"); return 0
if __name__=="__main__": sys.exit(main(sys.argv))
