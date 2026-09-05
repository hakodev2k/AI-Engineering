#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys
from datetime import date
from pathlib import Path

REQ = ("test_id","owner","reason","evidence_url","created","expires","status")

def load(path: Path):
    try: return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as e: raise ValueError(f"missing file: {path}") from e
    except json.JSONDecodeError as e: raise ValueError(f"invalid json in {path}: {e}") from e

def d(s: str) -> date:
    try: return date.fromisoformat(s)
    except Exception as e: raise ValueError(f"invalid ISO date: {s}") from e

def validate(reg, policy, today: date):
    errors=[]
    if not isinstance(reg,dict) or not isinstance(reg.get("quarantines"),list): return ["registry.quarantines must be an array"]
    seen=set(); active=0
    for i,q in enumerate(reg["quarantines"]):
        p=f"quarantines[{i}]"
        if not isinstance(q,dict): errors.append(f"{p} must be object"); continue
        for k in REQ:
            if not q.get(k): errors.append(f"{p}.{k} is required")
        tid=q.get("test_id")
        if tid in seen: errors.append(f"duplicate test_id: {tid}")
        seen.add(tid)
        if q.get("status") not in ("active","resolved"): errors.append(f"{p}.status invalid"); continue
        try: created,expires=d(q.get("created","")),d(q.get("expires",""))
        except ValueError as e: errors.append(f"{p}: {e}"); continue
        if expires < created: errors.append(f"{p}.expires precedes created")
        if (expires-created).days > int(policy.get("max_quarantine_days",14)): errors.append(f"{p} exceeds max_quarantine_days")
        if q["status"]=="active":
            active+=1
            if expires < today: errors.append(f"{p} expired on {expires.isoformat()}")
            if policy.get("require_owner",True) and not q.get("owner"): errors.append(f"{p}.owner required")
            if policy.get("require_evidence_url",True) and not q.get("evidence_url"): errors.append(f"{p}.evidence_url required")
    if active > int(policy.get("max_active_quarantines",20)): errors.append(f"active quarantine count {active} exceeds limit")
    return errors

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--registry",required=True,type=Path); ap.add_argument("--policy",required=True,type=Path); ap.add_argument("--today")
    a=ap.parse_args()
    try:
        today=d(a.today) if a.today else date.today()
        errors=validate(load(a.registry),load(a.policy),today)
    except ValueError as e:
        print(e,file=sys.stderr); return 2
    if errors:
        print("quarantine gate failed:",file=sys.stderr)
        for e in errors: print(f"- {e}",file=sys.stderr)
        return 1
    print("quarantine gate passed"); return 0
if __name__=="__main__": raise SystemExit(main())
