#!/usr/bin/env python3
"""Verify transactional context compaction manifests.
Exit 0 commit, 2 invalid, 3 rollback in --strict mode.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any

def load(path: Path) -> dict[str, Any]:
    try:
        x=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e:
        raise ValueError(f"cannot read {path}: {e}") from e
    if not isinstance(x,dict): raise ValueError(f"{path} must be object")
    return x

def ids(x: Any, name: str) -> set[str]:
    if not isinstance(x,list) or not all(isinstance(i,(str,int)) for i in x): raise ValueError(f"{name} must be list of string/int ids")
    return {str(i) for i in x}

def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument("before",type=Path); ap.add_argument("after",type=Path); ap.add_argument("--policy",type=Path,required=True); ap.add_argument("--strict",action="store_true"); a=ap.parse_args()
    try:
        b,c,p=load(a.before),load(a.after),load(a.policy)
        before_ids=ids(b.get("admitted_message_ids"),"before.admitted_message_ids")
        after_ids=ids(c.get("represented_message_ids"),"after.represented_message_ids") | ids(c.get("tail_message_ids",[]),"after.tail_message_ids")
        missing=sorted(before_ids-after_ids)
        bt=int(b.get("token_count")); at=int(c.get("token_count"));
        if bt<=0 or at<0: raise ValueError("token_count values invalid")
        reclaimed=(bt-at)/bt
        minimum=float(p.get("min_reclaimed_ratio",0.20))
        protected=set(map(str,b.get("protected_state_hashes",[]))); retained=set(map(str,c.get("protected_state_hashes",[])))
        lost=sorted(protected-retained)
        findings=[]
        if missing: findings.append({"missing_message_ids":missing})
        if lost: findings.append({"lost_protected_state_hashes":lost})
        if reclaimed < minimum: findings.append({"insufficient_reclamation":{"actual":reclaimed,"required":minimum}})
        if c.get("summary_reference_only") is not True: findings.append("summary_not_reference_only")
        if c.get("active_turn_source") == "compaction_summary": findings.append("compaction_summary_became_active_turn")
        if c.get("persistence_readback_match") is not True: findings.append("persistence_readback_mismatch")
        if int(c.get("stale_goal_resurrection_count",0)) != 0: findings.append("stale_goal_resurrection")
        attempts=int(c.get("attempt",1)); max_attempts=int(p.get("max_attempts",2))
        if attempts>max_attempts: findings.append("compaction_retry_budget_exceeded")
        decision="commit" if not findings else "rollback"
        out={"decision":decision,"coverage":(len(before_ids)-len(missing))/max(len(before_ids),1),"reclaimed_ratio":round(reclaimed,6),"findings":findings}
        print(json.dumps(out,indent=2,ensure_ascii=False)); return 3 if a.strict and findings else 0
    except (ValueError,TypeError,KeyError) as e:
        print(json.dumps({"decision":"invalid","error":str(e)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())
