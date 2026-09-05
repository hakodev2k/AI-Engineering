#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from pathlib import Path
from typing import Any

VALID_STATUS={"started","committed","failed","unknown","returned_cached"}
VALID_RISK={"low","medium","high","critical"}
REQUIRED={"event_id","timestamp","tool","operation","idempotency_key","request_fingerprint","status","side_effecting","risk"}

def load_json(path:Path)->Any:
    try:return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as e: raise ValueError(f"missing file: {path}") from e
    except json.JSONDecodeError as e: raise ValueError(f"invalid JSON {path}: {e}") from e

def load_trace(path:Path):
    try: lines=path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError as e: raise ValueError(f"missing trace: {path}") from e
    events=[]; ids=set()
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try:e=json.loads(line)
        except json.JSONDecodeError as ex: raise ValueError(f"line {n}: invalid JSON: {ex}") from ex
        if not isinstance(e,dict) or not REQUIRED.issubset(e): raise ValueError(f"line {n}: missing required fields")
        if e["event_id"] in ids: raise ValueError(f"line {n}: duplicate event_id")
        ids.add(e["event_id"])
        if e["status"] not in VALID_STATUS or e["risk"] not in VALID_RISK: raise ValueError(f"line {n}: invalid status/risk")
        if not isinstance(e["side_effecting"],bool): raise ValueError(f"line {n}: side_effecting must be boolean")
        for k in ("event_id","tool","operation","idempotency_key","request_fingerprint"):
            if not isinstance(e[k],str) or not e[k]: raise ValueError(f"line {n}: {k} must be non-empty string")
        events.append(e)
    return events

def analyze(events,policy):
    groups=defaultdict(list)
    for e in events: groups[e["idempotency_key"]].append(e)
    findings=[]
    approvals=set(policy.get("approval_required_risk_levels",["high","critical"]))
    block_unknown=bool(policy.get("block_on_unknown_high_risk",True))
    for key,es in sorted(groups.items()):
        fps={e["request_fingerprint"] for e in es}; tools={(e["tool"],e["operation"]) for e in es}
        if len(fps)>1:
            findings.append({"severity":"blocking","kind":"key_reused_for_different_request","idempotency_key":key,"detail":f"{len(fps)} request fingerprints share one key"})
        if len(tools)>1:
            findings.append({"severity":"blocking","kind":"key_reused_for_different_operation","idempotency_key":key,"detail":f"{len(tools)} tool/operation pairs share one key"})
        side=[e for e in es if e["side_effecting"]]
        committed=[e for e in side if e["status"]=="committed"]
        if len(committed)>1:
            findings.append({"severity":"blocking","kind":"duplicate_committed_side_effect","idempotency_key":key,"detail":f"{len(committed)} committed side-effect events"})
        unknown=[e for e in side if e["status"]=="unknown"]
        cached=[e for e in es if e["status"]=="returned_cached"]
        later_activity=False
        if unknown:
            unknown_positions=[es.index(u) for u in unknown]
            later_activity=any(any(x["status"] in {"started","committed"} and j>p for j,x in enumerate(es)) for p in unknown_positions)
        high=any(e["risk"] in approvals for e in side)
        if unknown and later_activity and not cached and block_unknown and high:
            findings.append({"severity":"blocking","kind":"unsafe_replay_after_unknown","idempotency_key":key,"detail":"high/critical side effect retried after unknown outcome without cached durable resolution"})
        elif unknown and not cached:
            findings.append({"severity":"warning","kind":"unresolved_unknown_outcome","idempotency_key":key,"detail":"unknown outcome remains unresolved"})
        if side and not any(e["status"] in {"committed","failed","returned_cached"} for e in es):
            findings.append({"severity":"warning","kind":"no_terminal_evidence","idempotency_key":key,"detail":"side-effecting call has no terminal evidence"})
    blocking=sum(f["severity"]=="blocking" for f in findings); warnings=sum(f["severity"]=="warning" for f in findings)
    return {"status":"fail" if blocking else "pass","summary":{"blocking":blocking,"warnings":warnings,"keys":len(groups)},"findings":findings}

def main():
    p=argparse.ArgumentParser(description="Detect unsafe duplicate/replayed AI agent tool side effects")
    p.add_argument("--trace",required=True,type=Path);p.add_argument("--policy",required=True,type=Path);p.add_argument("--output",required=True,type=Path);a=p.parse_args()
    try: report=analyze(load_trace(a.trace),load_json(a.policy))
    except ValueError as e: print(f"validation error: {e}",file=sys.stderr);return 2
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(report,indent=2,sort_keys=True)+"\n",encoding="utf-8")
    if report["status"]=="fail": print(f"idempotency gate failed: {report['summary']['blocking']} blocking finding(s)",file=sys.stderr);return 1
    print(f"idempotency gate passed: {report['summary']}");return 0
if __name__=="__main__": raise SystemExit(main())
