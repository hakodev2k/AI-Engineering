#!/usr/bin/env python3
import argparse
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse

SHELL_META=re.compile(r"[;&|`$><\n\r]")

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok":False,"error":f"cannot_read:{exc}"}))
        raise SystemExit(2)

def under_root(path, roots):
    norm=os.path.normpath(path)
    for root in roots:
        rootn=os.path.normpath(root)
        try:
            if os.path.commonpath([norm,rootn])==rootn:
                return True
        except ValueError:
            pass
    return False

def extract_host(value):
    if not isinstance(value,str):
        return None
    parsed=urlparse(value if "://" in value else "https://"+value)
    return parsed.hostname

def evaluate(event, policy):
    tool=event.get("tool")
    args=event.get("arguments")
    if not tool or not isinstance(args,dict):
        return {"ok":False,"decision":"deny","reasons":["invalid_tool_call_envelope"]}
    spec=policy.get("tools",{}).get(tool)
    if spec is None:
        return {"ok":False,"decision":"deny","reasons":["tool_not_allowlisted"]}

    reasons=[]
    if spec.get("forbid_shell_metacharacters"):
        for field in spec.get("string_fields",[]):
            value=args.get(field)
            if value is not None:
                if not isinstance(value,str):
                    reasons.append(f"non_string:{field}")
                elif SHELL_META.search(value):
                    reasons.append(f"shell_metacharacter:{field}")

    allowed_hosts=set(spec.get("allowed_hosts",[]))
    if allowed_hosts:
        for field in ("host","destination","url","endpoint"):
            if field in args:
                host=extract_host(args[field])
                if not host or host not in allowed_hosts:
                    reasons.append(f"host_not_allowlisted:{field}")

    if spec.get("forbid_proxy") and args.get("proxy"):
        reasons.append("proxy_forbidden")

    roots=spec.get("allowed_roots",[])
    symlink_map=event.get("symlink_map",{})
    for field in spec.get("path_fields",[]):
        if field not in args:
            continue
        value=args[field]
        if not isinstance(value,str):
            reasons.append(f"non_string_path:{field}")
            continue
        if not os.path.isabs(value):
            reasons.append(f"path_must_be_absolute:{field}")
            continue
        if not under_root(value,roots):
            reasons.append(f"path_outside_root:{field}")
        canonical=symlink_map.get(value)
        if canonical is not None and (not isinstance(canonical,str) or not under_root(canonical,roots)):
            reasons.append(f"canonical_path_outside_root:{field}")

    if reasons:
        return {"ok":False,"decision":"deny","tool":tool,"reasons":sorted(set(reasons))}
    return {"ok":True,"decision":"allow","tool":tool,"reasons":[]}

def main():
    ap=argparse.ArgumentParser(description="Deterministic MCP tool-argument boundary guard.")
    ap.add_argument("--event",required=True)
    ap.add_argument("--policy",required=True)
    args=ap.parse_args()
    result=evaluate(load_json(args.event),load_json(args.policy))
    print(json.dumps(result,indent=2,sort_keys=True))
    return 0 if result["ok"] else 3

if __name__=="__main__":
    raise SystemExit(main())
