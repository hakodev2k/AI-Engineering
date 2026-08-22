#!/usr/bin/env python3
"""Detect repeated no-progress agent tool loops from JSONL events.
Exit codes: 0 continue, 2 invalid input/config, 3 recover/terminate in strict mode.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def canonical_signature(tool: str, args: Any) -> str:
    payload = json.dumps({"tool": tool, "args": args}, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def load_events(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read events: {exc}") from exc
    rows=[]
    for i,line in enumerate(lines,1):
        if not line.strip(): continue
        try: row=json.loads(line)
        except json.JSONDecodeError as exc: raise ValueError(f"line {i}: invalid JSON: {exc}") from exc
        if not isinstance(row,dict): raise ValueError(f"line {i}: event must be object")
        if not isinstance(row.get("step"),int) or row["step"] < 1: raise ValueError(f"line {i}: step must be positive int")
        if not isinstance(row.get("tool"),str) or not row["tool"]: raise ValueError(f"line {i}: tool required")
        if "args" not in row: raise ValueError(f"line {i}: args required")
        if row.get("status") not in {"ok","error"}: raise ValueError(f"line {i}: status must be ok|error")
        if not isinstance(row.get("progress"),bool): raise ValueError(f"line {i}: progress must be boolean")
        rows.append(row)
    if not rows: raise ValueError("no events")
    return rows


def analyze(events: list[dict[str,Any]], policy: dict[str,Any]) -> dict[str,Any]:
    repeat_limit=int(policy.get("repeat_signature_limit",3)); err_limit=int(policy.get("repeat_error_limit",2)); no_prog_limit=int(policy.get("max_no_progress_steps",4)); max_steps=int(policy.get("max_total_steps",20)); transient_limit=int(policy.get("transient_retry_limit",2)); trans=set(policy.get("transient_error_classes",[]))
    if min(repeat_limit,err_limit,no_prog_limit,max_steps,transient_limit) < 1: raise ValueError("policy limits must be positive")
    sig_counts={}; err_counts={}; no_progress=0
    decision="continue"; reason="progress_within_bounds"; evidence=[]
    for row in events:
        sig=canonical_signature(row["tool"],row["args"]); sig_counts[sig]=sig_counts.get(sig,0)+1
        no_progress=0 if row["progress"] else no_progress+1
        err=row.get("error_class") if row["status"]=="error" else None
        if err:
            if not isinstance(err,str): raise ValueError("error_class must be string")
            key=f"{sig}:{err}"; err_counts[key]=err_counts.get(key,0)+1
        evidence.append({"step":row["step"],"signature":sig[:12],"status":row["status"],"progress":row["progress"],"error_class":err})
        evidence=evidence[-5:]
        if row["step"] >= max_steps:
            decision="terminate"; reason="max_total_steps"; break
        if sig_counts[sig] >= repeat_limit and not row["progress"]:
            decision="terminate"; reason="repeated_equivalent_action"; break
        if err:
            count=err_counts[f"{sig}:{err}"]
            if err in trans and count > transient_limit:
                decision="recover"; reason="transient_retry_budget_exhausted"; break
            if err not in trans and count >= err_limit:
                decision="recover"; reason="repeated_non_transient_error"; break
        if no_progress >= no_prog_limit:
            decision="terminate"; reason="no_progress_budget_exhausted"; break
    return {"decision":decision,"reason":reason,"steps_seen":len(events),"no_progress_streak":no_progress,"evidence_window":evidence}


def main() -> int:
    p=argparse.ArgumentParser(); p.add_argument("events",type=Path); p.add_argument("--policy",type=Path,required=True); p.add_argument("--strict",action="store_true"); a=p.parse_args()
    try: report=analyze(load_events(a.events),load_json(a.policy))
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(report,indent=2,ensure_ascii=False))
    return 3 if a.strict and report["decision"] != "continue" else 0

if __name__=="__main__": raise SystemExit(main())
