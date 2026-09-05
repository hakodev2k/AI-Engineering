#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any, Dict, List

ALLOWED_SOURCES={"http","queue","scheduler","background"}

def load(path:Path)->Any:
    try: return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as e: raise ValueError(f"input not found: {path}") from e
    except json.JSONDecodeError as e: raise ValueError(f"invalid JSON in {path}: {e}") from e

def validate(s:Any)->Dict[str,Any]:
    if not isinstance(s,dict): raise ValueError("snapshot must be an object")
    required=["service","stop_accepting_new_work","readiness_removed_before_drain","cancellation_propagated","drain_timeout_seconds","max_handler_seconds","termination_grace_period_seconds","force_termination_after_timeout","work_sources","checkpoint_or_ack_safe"]
    missing=[k for k in required if k not in s]
    if missing: raise ValueError("missing fields: "+", ".join(missing))
    if not isinstance(s["service"],str) or not s["service"].strip(): raise ValueError("service must be a non-empty string")
    for k in ["stop_accepting_new_work","readiness_removed_before_drain","cancellation_propagated","force_termination_after_timeout","checkpoint_or_ack_safe"]:
        if not isinstance(s[k],bool): raise ValueError(f"{k} must be boolean")
    for k in ["drain_timeout_seconds","max_handler_seconds","termination_grace_period_seconds"]:
        if not isinstance(s[k],(int,float)) or isinstance(s[k],bool) or s[k]<0: raise ValueError(f"{k} must be a non-negative number")
    if not isinstance(s["work_sources"],list) or not s["work_sources"]: raise ValueError("work_sources must be a non-empty array")
    unknown=set(s["work_sources"])-ALLOWED_SOURCES
    if unknown: raise ValueError("unknown work_sources: "+", ".join(sorted(unknown)))
    return s

def finding(severity:str,kind:str,detail:str)->Dict[str,str]: return {"severity":severity,"kind":kind,"detail":detail}

def evaluate(s:Dict[str,Any],p:Dict[str,Any])->Dict[str,Any]:
    out:List[Dict[str,str]]=[]
    drain_margin=float(p.get("minimum_drain_margin_seconds",5))
    term_margin=float(p.get("minimum_termination_margin_seconds",5))
    if p.get("require_stop_accepting_new_work",True) and not s["stop_accepting_new_work"]:
        out.append(finding("blocking","accepts_new_work_during_shutdown","shutdown must stop admission before drain"))
    if p.get("require_readiness_removed_before_drain",True) and not s["readiness_removed_before_drain"]:
        out.append(finding("blocking","readiness_ordering_unsafe","readiness must be removed before drain begins"))
    if p.get("require_cancellation_propagation",True) and not s["cancellation_propagated"]:
        out.append(finding("blocking","cancellation_not_propagated","shutdown cancellation must reach blocking/long-running operations"))
    required_drain=float(s["max_handler_seconds"])+drain_margin
    if float(s["drain_timeout_seconds"])<required_drain:
        out.append(finding("blocking","drain_timeout_too_short",f"drain timeout {s['drain_timeout_seconds']}s is below handler budget plus margin {required_drain:g}s"))
    required_term=float(s["drain_timeout_seconds"])+term_margin
    if float(s["termination_grace_period_seconds"])<required_term:
        out.append(finding("blocking","termination_grace_too_short",f"termination grace {s['termination_grace_period_seconds']}s is below drain timeout plus margin {required_term:g}s"))
    non_http=any(x in {"queue","scheduler","background"} for x in s["work_sources"])
    if non_http and p.get("require_safe_checkpoint_or_ack_for_non_http_work",True) and not s["checkpoint_or_ack_safe"]:
        out.append(finding("blocking","unsafe_checkpoint_or_ack","non-HTTP work requires safe checkpoint/ack semantics before shutdown can be verified"))
    if p.get("require_bounded_force_termination",True) and not s["force_termination_after_timeout"]:
        out.append(finding("warning","force_termination_unbounded","define bounded termination after the drain window to avoid indefinite shutdown"))
    if s["max_handler_seconds"]==0:
        out.append(finding("warning","handler_budget_zero","confirm zero means truly synchronous/instant work rather than missing duration evidence"))
    blocking=sum(x["severity"]=="blocking" for x in out); warnings=sum(x["severity"]=="warning" for x in out)
    return {"status":"fail" if blocking else "pass","summary":{"blocking":blocking,"warnings":warnings,"total":len(out)},"findings":out}

def main()->int:
    ap=argparse.ArgumentParser(description="Validate graceful shutdown drain invariants")
    ap.add_argument("--snapshot",required=True,type=Path); ap.add_argument("--policy",required=True,type=Path); ap.add_argument("--output",required=True,type=Path)
    a=ap.parse_args()
    try: report=evaluate(validate(load(a.snapshot)),load(a.policy))
    except ValueError as e: print(f"validation error: {e}",file=sys.stderr); return 2
    a.output.parent.mkdir(parents=True,exist_ok=True); a.output.write_text(json.dumps(report,indent=2,sort_keys=True)+"\n",encoding="utf-8")
    if report["status"]=="fail": print(f"shutdown drain gate failed: {report['summary']['blocking']} blocking finding(s)",file=sys.stderr); return 1
    print(f"shutdown drain gate passed: {report['summary']}"); return 0
if __name__=="__main__": raise SystemExit(main())
