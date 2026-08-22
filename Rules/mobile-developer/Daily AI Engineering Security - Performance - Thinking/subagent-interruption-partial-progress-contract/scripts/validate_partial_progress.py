#!/usr/bin/env python3
"""Validate an interrupted-subagent partial-progress envelope.

Exit codes: 0=valid, 2=invalid input/config, 4=unsafe/incomplete recovery state.
"""
from __future__ import annotations
import argparse, json, sys
from datetime import datetime
from pathlib import Path


def load(path: Path) -> dict:
    try: obj=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj,dict): raise ValueError(f"{path} must contain an object")
    return obj


def parse_time(v, name):
    if not isinstance(v,str) or not v: raise ValueError(f"{name} must be non-empty ISO-8601 string")
    try: return datetime.fromisoformat(v.replace("Z","+00:00"))
    except ValueError as exc: raise ValueError(f"{name} is not valid ISO-8601") from exc


def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument("envelope",type=Path); ap.add_argument("--policy",type=Path,required=True)
    a=ap.parse_args()
    try:
        e,p=load(a.envelope),load(a.policy)
        required=p.get("required_fields",[])
        if not isinstance(required,list) or not all(isinstance(x,str) for x in required): raise ValueError("required_fields must be strings")
        missing=[k for k in required if k not in e]
        findings=[]
        if missing: findings.append({"kind":"missing_fields","fields":missing})
        child=e.get("child_id")
        cause=e.get("cause")
        if child is not None and (not isinstance(child,str) or not child.strip()): findings.append({"kind":"invalid_child_id"})
        allowed=set(p.get("allowed_causes",[]))
        if cause is not None and cause not in allowed: findings.append({"kind":"invalid_cause","value":cause})
        if "started_at" in e and "ended_at" in e:
            start,end=parse_time(e["started_at"],"started_at"),parse_time(e["ended_at"],"ended_at")
            if end < start: findings.append({"kind":"invalid_time_order"})
        tc=e.get("tool_call_count")
        if tc is not None and (not isinstance(tc,int) or isinstance(tc,bool) or tc<0): findings.append({"kind":"invalid_tool_call_count"})
        effects=e.get("known_side_effects")
        if effects is not None and (not isinstance(effects,list) or not all(isinstance(x,dict) for x in effects)): findings.append({"kind":"invalid_side_effects"})
        human=e.get("human_initiated")
        if human is not None and not isinstance(human,bool): findings.append({"kind":"invalid_human_initiated"})
        if cause=="user_cancelled" and p.get("require_human_initiated_for_user_cancelled",True) and human is not True:
            findings.append({"kind":"unproven_user_cancellation"})
        effect_count=len(effects) if isinstance(effects,list) else 0
        recommendation=e.get("recovery_recommendation")
        if effect_count and p.get("require_verify_first_when_side_effects_exist",True) and recommendation not in {"verify_first","escalate"}:
            findings.append({"kind":"unsafe_retry_recommendation","detail":"side effects require verify_first or escalate"})
        if tc and (not isinstance(e.get("last_action"),str) or not e.get("last_action").strip()): findings.append({"kind":"missing_last_action_after_tool_activity"})
        blocked=bool(findings)
        result={"decision":"block" if blocked else "allow","finding_count":len(findings),"findings":findings,"side_effect_count":effect_count}
        print(json.dumps(result,indent=2)); return 4 if blocked else 0
    except (ValueError,TypeError,OSError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())
