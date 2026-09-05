#!/usr/bin/env python3
"""Validate delegated-agent environment inheritance without reading secret values."""
import json, re, sys
from pathlib import Path

DEFAULT_SENSITIVE = [
    r"(^|_)(API_?KEY|TOKEN|SECRET|PASSWORD|PASSWD|PRIVATE_?KEY|CREDENTIALS?)($|_)",
    r"^(GH_TOKEN|GITHUB_TOKEN|AWS_SECRET_ACCESS_KEY|AWS_SESSION_TOKEN|AZURE_CLIENT_SECRET|GOOGLE_APPLICATION_CREDENTIALS)$",
]

def load_json(path):
    try: data = json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError as e: raise ValueError(f"file not found: {path}") from e
    except json.JSONDecodeError as e: raise ValueError(f"invalid JSON: {e}") from e
    if not isinstance(data, dict): raise ValueError("policy must be a JSON object")
    return data

def is_sensitive(name, patterns): return any(re.search(p, name, re.I) for p in patterns)

def validate(p):
    f=[]
    if p.get("inheritance_mode") not in {"allowlist","none"}: f.append("BLOCK inheritance_mode must be allowlist or none")
    keys=["parent_env_names","child_requested_env_names","child_allowed_env_names","brokered_sensitive_env_names","approved_readable_sensitive_env_names","sensitive_name_patterns"]
    for k in keys:
        v=p.get(k,[])
        if not isinstance(v,list) or not all(isinstance(x,str) for x in v): f.append(f"BLOCK {k} must be a list of strings")
    if f: return f
    parent=set(p.get("parent_env_names",[])); req=set(p.get("child_requested_env_names",[])); allowed=set(p.get("child_allowed_env_names",[])); broker=set(p.get("brokered_sensitive_env_names",[])); approved=set(p.get("approved_readable_sensitive_env_names",[]))
    patterns=DEFAULT_SENSITIVE+p.get("sensitive_name_patterns",[])
    if allowed-req: f.append("BLOCK unrequested allowed variables: "+", ".join(sorted(allowed-req)))
    if allowed-parent: f.append("BLOCK allowed names absent from parent inventory: "+", ".join(sorted(allowed-parent)))
    unsafe={x for x in allowed if is_sensitive(x,patterns)}-broker-approved
    if unsafe: f.append("BLOCK sensitive readable variables lack broker/approval: "+", ".join(sorted(unsafe)))
    if broker-req: f.append("BLOCK brokered credentials not requested: "+", ".join(sorted(broker-req)))
    if p.get("child_can_read_parent_process_environment") is True: f.append("BLOCK child can read parent process environment directly")
    return f

def main(argv):
    if len(argv)!=2: print(f"usage: {argv[0]} <policy.json>",file=sys.stderr); return 1
    try: findings=validate(load_json(argv[1]))
    except (OSError,ValueError) as e: print(f"ERROR: {e}",file=sys.stderr); return 1
    if findings:
        print("BLOCK"); [print(f"- {x}") for x in findings]; return 2
    print("PASS: delegated-agent environment satisfies least-privilege policy"); return 0

if __name__=="__main__": sys.exit(main(sys.argv))
