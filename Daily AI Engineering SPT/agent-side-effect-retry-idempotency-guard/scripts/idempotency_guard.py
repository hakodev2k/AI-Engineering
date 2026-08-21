#!/usr/bin/env python3
"""Deterministic logical-operation guard for retrying agent tool calls.

This script does not execute tools. It decides whether a logical operation may be
started/retried/replayed based on a durable JSON ledger.

Exit codes: 0 allowed/replay; 2 safety block; 3 invalid/conflict; 4 I/O error.
"""
from __future__ import annotations
import argparse, hashlib, json, os, sys, tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

VALID_CLASSES={"read_only","idempotent_write","non_idempotent_write"}
VALID_STATES={"reserved","in_progress","completed","known_failed","outcome_unknown","cancelled"}

def now_iso(): return datetime.now(timezone.utc).isoformat()
def load_json(path):
    try: return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise RuntimeError(f"cannot read JSON {path}: {exc}") from exc

def atomic_write(path,data):
    target=Path(path); target.parent.mkdir(parents=True,exist_ok=True)
    payload=json.dumps(data,indent=2,sort_keys=True,ensure_ascii=False)+"\n"
    fd,tmp=tempfile.mkstemp(prefix=target.name+".",dir=str(target.parent))
    try:
        with os.fdopen(fd,"w",encoding="utf-8") as f:
            f.write(payload); f.flush(); os.fsync(f.fileno())
        os.replace(tmp,target)
    except Exception:
        try: os.unlink(tmp)
        except OSError: pass
        raise

def canonical(value): return json.dumps(value,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
def fingerprint(server,tool,arguments,intent_id):
    return hashlib.sha256(canonical({"server":server,"tool":tool,"arguments":arguments,"intent_id":intent_id})).hexdigest()
def op_key(server,tool,arguments,intent_id): return "op_"+fingerprint(server,tool,arguments,intent_id)[:32]
def load_ledger(path):
    p=Path(path)
    if not p.exists(): return {"version":"1.0","operations":{}}
    ledger=load_json(path)
    if not isinstance(ledger,dict) or not isinstance(ledger.get("operations"),dict): raise RuntimeError("invalid ledger")
    return ledger
def emit(obj): print(json.dumps(obj,indent=2,sort_keys=True,ensure_ascii=False))

def reserve(a):
    arguments=load_json(a.arguments_file); fp=fingerprint(a.server,a.tool,arguments,a.intent_id); key=a.operation_key or op_key(a.server,a.tool,arguments,a.intent_id)
    ledger=load_ledger(a.ledger); rec=ledger["operations"].get(key)
    if rec:
        if rec.get("fingerprint")!=fp: emit({"decision":"reject_conflict","reason":"key_reused_with_different_fingerprint","operation_key":key}); return 3
        state=rec.get("state")
        if state=="completed": emit({"decision":"replay","operation_key":key,"result_reference":rec.get("result_reference")}); return 0
        emit({"decision":"block","operation_key":key,"reason":"ambiguous_or_active_prior_operation","state":state}); return 2
    ts=now_iso(); ledger["operations"][key]={"operation_key":key,"fingerprint":fp,"classification":a.classification,"state":"reserved","attempts":0,"created_at":ts,"updated_at":ts,"result_reference":None,"failure_reason":None,"downstream_idempotency":bool(a.downstream_idempotency),"probe_status":"not_run","human_approval":None}
    atomic_write(a.ledger,ledger); emit({"decision":"reserved","operation_key":key,"fingerprint":fp}); return 0

def transition(a):
    ledger=load_ledger(a.ledger); rec=ledger["operations"].get(a.operation_key)
    if not rec: raise ValueError("operation key not found")
    rec["state"]=a.state; rec["updated_at"]=now_iso()
    if a.state=="in_progress": rec["attempts"]=int(rec.get("attempts",0))+1
    if a.result_reference is not None: rec["result_reference"]=a.result_reference
    if a.failure_reason is not None: rec["failure_reason"]=a.failure_reason
    if a.probe_status is not None: rec["probe_status"]=a.probe_status
    if a.human_approval is not None: rec["human_approval"]=a.human_approval
    atomic_write(a.ledger,ledger); emit({"decision":"updated","operation_key":a.operation_key,"state":a.state,"attempts":rec["attempts"]}); return 0

def retry_decision(a):
    ledger=load_ledger(a.ledger); policy=load_json(a.policy); rec=ledger["operations"].get(a.operation_key)
    if not rec: raise ValueError("operation key not found")
    attempts=int(rec.get("attempts",0)); max_attempts=int(policy.get("max_attempts",1)); state=rec.get("state"); cls=rec.get("classification")
    if attempts>=max_attempts: emit({"decision":"block","reason":"retry_budget_exhausted"}); return 2
    if state=="completed": emit({"decision":"replay","reason":"already_completed","result_reference":rec.get("result_reference")}); return 0
    if state in {"reserved","in_progress","cancelled"}: emit({"decision":"block","reason":"operation_not_retryable_in_current_state","state":state}); return 2
    if state=="known_failed": emit({"decision":"retry","reason":"known_failure","next_attempt":attempts+1}); return 0
    if state!="outcome_unknown": emit({"decision":"block","reason":"unsupported_state","state":state}); return 2
    if cls=="read_only": emit({"decision":"retry","reason":"read_only_unknown","next_attempt":attempts+1}); return 0
    if cls=="idempotent_write" and rec.get("downstream_idempotency"): emit({"decision":"retry","reason":"downstream_idempotency_contract","next_attempt":attempts+1}); return 0
    if rec.get("probe_status")=="effect_present": emit({"decision":"replay_or_reconcile","reason":"effect_already_present","result_reference":rec.get("result_reference")}); return 0
    if rec.get("probe_status")=="effect_absent": emit({"decision":"retry","reason":"probe_confirms_absent","next_attempt":attempts+1}); return 0
    if rec.get("human_approval") and policy.get("human_approval_required_for_forced_retry",True): emit({"decision":"retry","reason":"explicit_human_override","next_attempt":attempts+1}); return 0
    emit({"decision":"block","reason":"ambiguous_non_idempotent_outcome_requires_probe_or_approval"}); return 2

def inspect(a):
    ledger=load_ledger(a.ledger); emit(ledger["operations"].get(a.operation_key) if a.operation_key else ledger); return 0

def parser():
    p=argparse.ArgumentParser(); s=p.add_subparsers(dest="command",required=True)
    r=s.add_parser("reserve"); r.add_argument("--ledger",required=True); r.add_argument("--server",required=True); r.add_argument("--tool",required=True); r.add_argument("--arguments-file",required=True); r.add_argument("--intent-id",required=True); r.add_argument("--classification",required=True,choices=sorted(VALID_CLASSES)); r.add_argument("--operation-key"); r.add_argument("--downstream-idempotency",action="store_true"); r.set_defaults(func=reserve)
    t=s.add_parser("transition"); t.add_argument("--ledger",required=True); t.add_argument("--operation-key",required=True); t.add_argument("--state",required=True,choices=sorted(VALID_STATES)); t.add_argument("--result-reference"); t.add_argument("--failure-reason"); t.add_argument("--probe-status",choices=["not_run","effect_present","effect_absent","unknown"]); t.add_argument("--human-approval"); t.set_defaults(func=transition)
    d=s.add_parser("retry-decision"); d.add_argument("--ledger",required=True); d.add_argument("--operation-key",required=True); d.add_argument("--policy",required=True); d.set_defaults(func=retry_decision)
    i=s.add_parser("inspect"); i.add_argument("--ledger",required=True); i.add_argument("--operation-key"); i.set_defaults(func=inspect); return p

def main():
    try: return int(parser().parse_args().func(parser().parse_args()))
    except ValueError as exc: print(json.dumps({"error":str(exc),"type":"invalid_input"}),file=sys.stderr); return 3
    except RuntimeError as exc: print(json.dumps({"error":str(exc),"type":"io_or_json"}),file=sys.stderr); return 4

if __name__=="__main__": raise SystemExit(main())
