#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

RECOVERABLE = {"stream_stall", "transport_error", "provider_error", "watchdog_timeout"}
CAUSE_EVENT = {"stream_error":"stream_stall", "transport_error":"transport_error", "provider_error":"provider_error", "watchdog_timeout":"watchdog_timeout", "user_cancel":"user_cancelled"}

class TraceError(Exception): pass

def load_trace(path):
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise TraceError(f"cannot read JSON: {e}")
    if not isinstance(data,dict) or not isinstance(data.get("events"),list): raise TraceError("root must contain events array")
    if not data.get("run_id") or not data.get("turn_id"): raise TraceError("run_id and turn_id are required")
    return data

def validate(data,max_retries=2,expected_cause=None):
    violations=[]; events=data["events"]
    seq=[]
    for i,e in enumerate(events):
        if not isinstance(e,dict) or not isinstance(e.get("seq"),int) or not e.get("event"):
            violations.append(f"event[{i}] missing integer seq/event"); continue
        seq.append(e["seq"])
    if seq and any(b<=a for a,b in zip(seq,seq[1:])): violations.append("sequence numbers are not strictly increasing")
    finals=[e for e in events if e.get("event")=="terminal_final"]
    if len(finals)!=1: violations.append(f"expected exactly one terminal_final, got {len(finals)}")
    classifications=[e for e in events if e.get("event")=="terminal_classified"]
    if len(classifications)!=1: violations.append(f"expected exactly one terminal_classified, got {len(classifications)}")
    explicit_user=any(e.get("event")=="user_cancel" and e.get("actor")=="user" for e in events)
    causal=[]
    for e in events:
        if e.get("event") in CAUSE_EVENT: causal.append((e["seq"],CAUSE_EVENT[e["event"]],e.get("actor")))
    cause=causal[0][1] if causal else "unknown_failure"
    if expected_cause and cause!=expected_cause: violations.append(f"expected cause {expected_cause}, observed {cause}")
    if classifications:
        c=classifications[0]; cc=c.get("cause"); actor=c.get("actor")
        if not cc: violations.append("terminal_classified missing cause")
        if cause in RECOVERABLE and cc=="user_cancelled" and not explicit_user: violations.append("machine failure misclassified as user_cancelled")
        if cc=="user_cancelled" and actor!="user": violations.append("user_cancelled classification requires actor=user")
        if not causal and cc!="unknown_failure": violations.append("classification guessed despite missing causal event")
    retries=sum(1 for e in events if e.get("event")=="retry_start")
    if retries>max_retries: violations.append(f"retry budget exceeded: {retries}>{max_retries}")
    hook_starts=[e for e in events if e.get("event")=="recovery_hook_start"]
    hook_ends=[e for e in events if e.get("event")=="recovery_hook_end"]
    recovery_required=bool(data.get("recovery_required",True))
    if explicit_user and (hook_starts or retries): violations.append("automated recovery occurred after explicit user cancellation")
    if cause in RECOVERABLE and recovery_required and not explicit_user:
        if not hook_starts: violations.append("recoverable failure missing recovery_hook_start")
        if len(hook_ends)<len(hook_starts): violations.append("recovery hook started without completion evidence")
    failed_hook=any(e.get("event")=="recovery_hook_end" and e.get("result")=="failure" for e in events)
    successful_recovery=any((e.get("event")=="recovery_hook_end" and e.get("result") in {"success","continued"}) or e.get("event")=="retry_start" for e in events)
    if finals and finals[0].get("result")=="success" and failed_hook and not successful_recovery: violations.append("final success follows failed recovery without later recovery evidence")
    return violations,{"cause":cause,"explicit_user_cancel":explicit_user,"retries":retries,"final_events":len(finals),"hook_starts":len(hook_starts),"hook_ends":len(hook_ends)}

def main():
    p=argparse.ArgumentParser(description="Validate normalized model-stream terminal/recovery traces")
    p.add_argument("trace"); p.add_argument("--max-retries",type=int,default=2); p.add_argument("--expected-cause")
    a=p.parse_args()
    if a.max_retries<0: print("max-retries must be >=0",file=sys.stderr); return 3
    try: data=load_trace(a.trace)
    except TraceError as e: print(str(e),file=sys.stderr); return 3
    v,s=validate(data,a.max_retries,a.expected_cause)
    print(json.dumps({"status":"fail" if v else "pass","summary":s,"violations":v},indent=2))
    return 2 if v else 0

if __name__=="__main__": sys.exit(main())
