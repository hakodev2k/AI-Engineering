#!/usr/bin/env python3
"""Validate completion claims against a structured evidence ledger.

Input ledger JSON example:
{"claims":["tests_passed"],"evidence":[{"type":"test_executed","fresh":true},{"type":"test_passed","fresh":true},{"type":"evidence_fresh","fresh":true}]}
Exit 0 supported, 4 unsupported, 2 invalid.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load(path: Path) -> dict:
    try:
        obj=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj,dict): raise ValueError(f"{path} must contain object")
    return obj


def main() -> int:
    p=argparse.ArgumentParser(); p.add_argument("ledger",type=Path); p.add_argument("--policy",type=Path,required=True); a=p.parse_args()
    try:
        ledger,policy=load(a.ledger),load(a.policy)
        claims=ledger.get("claims",[]); evidence=ledger.get("evidence",[])
        if not isinstance(claims,list) or not all(isinstance(x,str) for x in claims): raise ValueError("claims must be string array")
        if not isinstance(evidence,list) or not all(isinstance(x,dict) for x in evidence): raise ValueError("evidence must be object array")
        present={e.get("type") for e in evidence if isinstance(e.get("type"),str) and e.get("fresh",True) is True and e.get("passed",True) is not False}
        reqs=policy.get("claim_requirements",{})
        unsupported={}
        for claim in claims:
            required=reqs.get(claim)
            if not isinstance(required,list):
                unsupported[claim]=["claim type has no policy"]
                continue
            missing=[r for r in required if r not in present]
            if missing: unsupported[claim]=missing
        status="supported" if not unsupported else "blocked"
        print(json.dumps({"status":status,"claims":claims,"available_evidence":sorted(x for x in present if x),"unsupported":unsupported},indent=2))
        return 0 if not unsupported else 4
    except (ValueError,TypeError) as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())
