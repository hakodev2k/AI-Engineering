#!/usr/bin/env python3
"""Evaluate a host-supplied side-effect probe result without performing external writes.

Input JSON example:
{
  "operation_key": "op_...",
  "checks": [
    {"name": "resource_exists", "status": "present", "evidence": "issue://123"},
    {"name": "payload_matches", "status": "present", "evidence": "sha256:..."}
  ]
}

Exit codes: 0 resolved, 2 unresolved/conflicting, 3 invalid input, 4 I/O.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

VALID={"present","absent","unknown"}

def main():
    p=argparse.ArgumentParser(); p.add_argument("--probe",required=True); p.add_argument("--require",action="append",default=[]); a=p.parse_args()
    try: data=json.loads(Path(a.probe).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc:
        print(json.dumps({"error":str(exc)}),file=sys.stderr); return 4
    checks=data.get("checks") if isinstance(data,dict) else None
    if not isinstance(checks,list) or not checks:
        print(json.dumps({"error":"checks must be a non-empty array"}),file=sys.stderr); return 3
    by_name={}
    for c in checks:
        if not isinstance(c,dict) or not isinstance(c.get("name"),str) or c.get("status") not in VALID:
            print(json.dumps({"error":"invalid check entry"}),file=sys.stderr); return 3
        if c["name"] in by_name:
            print(json.dumps({"error":f"duplicate check: {c['name']}"}),file=sys.stderr); return 3
        by_name[c["name"]]=c
    missing=[x for x in a.require if x not in by_name]
    if missing:
        print(json.dumps({"decision":"unknown","reason":"required_checks_missing","missing":missing},indent=2)); return 2
    statuses=[c["status"] for c in by_name.values() if not a.require or c["name"] in a.require]
    if "unknown" in statuses or ("present" in statuses and "absent" in statuses):
        print(json.dumps({"decision":"unknown","reason":"probe_inconclusive","statuses":statuses},indent=2)); return 2
    decision="effect_present" if statuses and all(s=="present" for s in statuses) else "effect_absent"
    evidence=[c.get("evidence") for c in by_name.values() if c.get("evidence")]
    print(json.dumps({"decision":decision,"operation_key":data.get("operation_key"),"evidence":evidence},indent=2)); return 0

if __name__=="__main__": raise SystemExit(main())
