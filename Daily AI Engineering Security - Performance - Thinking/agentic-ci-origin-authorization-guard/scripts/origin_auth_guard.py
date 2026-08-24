#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

PRIVILEGED = {"repo_write","secret_read","oidc","deploy","publish","production_write"}

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        print(json.dumps({"decision":"error","reason":f"invalid_json:{e}"}))
        raise SystemExit(3)

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--event",required=True); p.add_argument("--policy",required=True)
    a=p.parse_args(); event=load(a.event); policy=load(a.policy)
    required=["origin_actor","origin_association","source_event","relay_actor","capability","repository","ref"]
    missing=[k for k in required if not isinstance(event.get(k),str) or not event.get(k).strip()]
    if missing:
        print(json.dumps({"decision":"error","reason":"missing_fields","fields":missing}))
        return 3
    canonical=json.dumps({k:event[k] for k in required},sort_keys=True,separators=(",",":"))
    evidence_hash=hashlib.sha256(canonical.encode()).hexdigest()
    cap=event["capability"]
    trusted=set(policy.get("trusted_origin_associations",["OWNER","MEMBER","COLLABORATOR"]))
    allowed_repos=set(policy.get("repositories",[]))
    if cap not in PRIVILEGED:
        decision="allow"; reason="non_privileged_capability"
    elif allowed_repos and event["repository"] not in allowed_repos:
        decision="deny"; reason="repository_not_allowed"
    elif event["origin_association"] not in trusted:
        decision="require_approval"; reason="untrusted_origin"
    else:
        decision="allow"; reason="trusted_origin"
    print(json.dumps({"decision":decision,"reason":reason,"origin_actor":event["origin_actor"],"relay_actor":event["relay_actor"],"capability":cap,"evidence_hash":evidence_hash},sort_keys=True))
    return 0 if decision=="allow" else 2

if __name__=="__main__": sys.exit(main())
