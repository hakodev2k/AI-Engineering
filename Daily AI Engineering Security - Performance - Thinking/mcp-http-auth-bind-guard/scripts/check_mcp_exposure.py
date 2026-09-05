#!/usr/bin/env python3
"""Fail-closed MCP listener/auth/capability policy checker."""
import json
import sys
from pathlib import Path

WILDCARD_HOSTS = {"0.0.0.0", "::", "*", "[::]"}
DANGEROUS_CAPABILITIES = {
    "command-exec", "shell", "filesystem-write", "filesystem-delete",
    "credential-access", "browser-action", "deployment", "repo-write", "cloud-admin"
}

def load(path: Path):
    try: data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError: raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc: raise ValueError(f"invalid JSON: {exc}")
    if not isinstance(data, dict) or not isinstance(data.get("listeners"), list): raise ValueError("top-level object must contain listeners: []")
    return data

def inspect_listener(item, index):
    if not isinstance(item, dict): return [f"listeners[{index}] must be an object"]
    name=str(item.get("name",f"listener-{index}")); host=str(item.get("host","")).strip(); auth=item.get("auth_required"); direct=item.get("directly_reachable",True); caps=item.get("capabilities",[]); errors=[]
    if not host: errors.append(f"{name}: host is required")
    if not isinstance(auth,bool): errors.append(f"{name}: auth_required must be boolean"); auth=False
    if not isinstance(direct,bool): errors.append(f"{name}: directly_reachable must be boolean")
    if not isinstance(caps,list) or not all(isinstance(x,str) for x in caps): errors.append(f"{name}: capabilities must be a string list"); caps=[]
    dangerous=sorted(set(caps)&DANGEROUS_CAPABILITIES)
    if direct and host in WILDCARD_HOSTS and not auth: errors.append(f"{name}: BLOCK wildcard/direct listener without authentication")
    if dangerous and not auth: errors.append(f"{name}: BLOCK dangerous capabilities without authentication: {', '.join(dangerous)}")
    if item.get("proxy_auth",False) and direct and not auth: errors.append(f"{name}: BLOCK upstream proxy auth does not protect directly reachable unauthenticated backend")
    return errors

def main(argv):
    if len(argv)!=2: print(f"usage: {argv[0]} <deployment.json>",file=sys.stderr); return 1
    try: data=load(Path(argv[1]))
    except (OSError,ValueError) as exc: print(f"ERROR: {exc}",file=sys.stderr); return 1
    findings=[]
    for i,listener in enumerate(data["listeners"]): findings.extend(inspect_listener(listener,i))
    if findings:
        print("BLOCK")
        for finding in findings: print(f"- {finding}")
        return 2
    print(f"PASS: {len(data['listeners'])} listener(s) satisfy declared MCP exposure policy"); return 0
if __name__=="__main__": sys.exit(main(sys.argv))
