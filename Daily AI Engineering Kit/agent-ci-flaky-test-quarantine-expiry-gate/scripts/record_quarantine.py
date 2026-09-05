#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys
from datetime import date
from pathlib import Path

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--registry",required=True,type=Path); ap.add_argument("--test-id",required=True); ap.add_argument("--owner",required=True); ap.add_argument("--reason",required=True); ap.add_argument("--evidence-url",required=True); ap.add_argument("--expires",required=True)
    a=ap.parse_args()
    try: expires=date.fromisoformat(a.expires)
    except ValueError: print("--expires must be YYYY-MM-DD",file=sys.stderr); return 2
    created=date.today()
    if expires < created: print("expiry cannot be in the past",file=sys.stderr); return 2
    try: reg=json.loads(a.registry.read_text(encoding="utf-8")) if a.registry.exists() else {"quarantines":[]}
    except json.JSONDecodeError as e: print(f"invalid registry: {e}",file=sys.stderr); return 2
    qs=reg.setdefault("quarantines",[])
    if any(q.get("test_id")==a.test_id and q.get("status")=="active" for q in qs): print("active quarantine already exists",file=sys.stderr); return 1
    qs.append({"test_id":a.test_id,"owner":a.owner,"reason":a.reason,"evidence_url":a.evidence_url,"created":created.isoformat(),"expires":expires.isoformat(),"status":"active"})
    a.registry.parent.mkdir(parents=True,exist_ok=True); a.registry.write_text(json.dumps(reg,indent=2)+"\n",encoding="utf-8")
    print(f"recorded quarantine for {a.test_id}"); return 0
if __name__=="__main__": raise SystemExit(main())
