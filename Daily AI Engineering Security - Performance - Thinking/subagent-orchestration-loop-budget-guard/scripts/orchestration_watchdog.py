#!/usr/bin/env python3
"""Bound subagent wait/status loops using lifecycle evidence and token budgets.

Input JSON:
{
  "child_id": "a1",
  "intended_operation": "wait_agent",
  "selected_tool": "collaboration.wait_agent",
  "status": "running",
  "terminal_event_seen": false,
  "progress_event_seen": false,
  "no_progress_cycles": 2,
  "orchestration_turns": 3,
  "estimated_orchestration_tokens": 12000,
  "last_wait_seconds": 20
}
Exit: 0 continue/wait, 3 reconcile, 4 stop/block, 2 invalid.
"""
from __future__ import annotations
import argparse, json, math, sys
from pathlib import Path


def load(path: Path):
    try: value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict): raise ValueError(f"{path} must contain an object")
    return value


def num(d,k,default=0):
    v=d.get(k,default)
    if not isinstance(v,(int,float)) or isinstance(v,bool) or v<0: raise ValueError(f"{k} must be non-negative number")
    return v


def main():
    p=argparse.ArgumentParser(); p.add_argument("input",type=Path); p.add_argument("--config",type=Path,required=True)
    a=p.parse_args()
    try:
        d,c=load(a.input),load(a.config)
        child=d.get("child_id"); intended=d.get("intended_operation"); selected=d.get("selected_tool"); status=d.get("status")
        if not all(isinstance(x,str) and x for x in (child,intended,selected,status)): raise ValueError("child_id/intended_operation/selected_tool/status must be non-empty strings")
        for k in ("terminal_event_seen","progress_event_seen"):
            if not isinstance(d.get(k,False),bool): raise ValueError(f"{k} must be boolean")
        cycles=int(num(d,"no_progress_cycles")); turns=int(num(d,"orchestration_turns")); tokens=num(d,"estimated_orchestration_tokens"); last=num(d,"last_wait_seconds",0)
        terminal=set(c.get("terminal_states",[])); auth=set(c.get("authoritative_status_tools",[])); wrong=set(c.get("wrong_wait_tools",[]))
        findings=[]; decision="wait"; code=0
        if selected in wrong or (intended in {"wait_agent","list_agents"} and selected not in auth):
            findings.append("selected tool does not match authoritative subagent-status tool family"); decision="reconcile"; code=3
        if d.get("terminal_event_seen") or status in terminal:
            decision="collect_result"; code=0; findings.append("terminal child state observed")
        elif cycles >= int(c.get("max_no_progress_cycles",4)):
            decision="reconcile"; code=3; findings.append("no-progress cycle budget reached")
        if turns >= int(c.get("max_orchestration_turns_per_child",8)) or tokens >= float(c.get("max_estimated_orchestration_tokens",50000)):
            decision="stop"; code=4; findings.append("orchestration budget exhausted")
        base=float(c.get("initial_wait_seconds",10)); mult=float(c.get("backoff_multiplier",2)); cap=float(c.get("max_wait_seconds",120))
        next_wait=min(cap, max(base, last*mult if last else base))
        if d.get("progress_event_seen"): next_wait=base
        result={"decision":decision,"child_id":child,"next_wait_seconds":round(next_wait,2),"no_progress_cycles":cycles,"orchestration_turns":turns,"estimated_orchestration_tokens":tokens,"findings":findings}
    except (ValueError,TypeError,OverflowError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2)); return code

if __name__=="__main__": raise SystemExit(main())
