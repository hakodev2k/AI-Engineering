#!/usr/bin/env python3
"""Deterministic per-turn/sliding-window tool-call burst gate.
JSONL fields: timestamp (ISO-8601 or unix seconds), tool, class(progress|retry|poll|fanout), estimated_input_tokens, approved_fanout(bool).
Exit: 0 allow, 2 invalid input/config, 3 defer/block in --strict mode.
"""
from __future__ import annotations
import argparse, json, sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError("policy must be a JSON object")
    return obj


def ts(value: Any) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc).timestamp()
        except ValueError as exc:
            raise ValueError(f"invalid timestamp: {value}") from exc
    raise ValueError("timestamp must be ISO string or unix number")


def load_events(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read events: {exc}") from exc
    rows=[]
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try: row=json.loads(line)
        except json.JSONDecodeError as exc: raise ValueError(f"line {n}: invalid JSON") from exc
        if not isinstance(row,dict): raise ValueError(f"line {n}: object required")
        if not isinstance(row.get("tool"),str) or not row["tool"]: raise ValueError(f"line {n}: tool required")
        if row.get("class") not in {"progress","retry","poll","fanout"}: raise ValueError(f"line {n}: invalid class")
        tokens=row.get("estimated_input_tokens",0)
        if not isinstance(tokens,int) or tokens < 0: raise ValueError(f"line {n}: invalid estimated_input_tokens")
        row["_ts"]=ts(row.get("timestamp")); rows.append(row)
    if not rows: raise ValueError("no events")
    return sorted(rows,key=lambda x:x["_ts"])


def positive(policy: dict[str,Any], key: str) -> int:
    v=policy.get(key)
    if not isinstance(v,int) or v < 1: raise ValueError(f"{key} must be positive integer")
    return v


def analyze(events:list[dict[str,Any]], p:dict[str,Any])->dict[str,Any]:
    window=positive(p,"window_seconds"); maxw=positive(p,"max_calls_per_window"); maxpoll=positive(p,"max_poll_calls_per_window"); maxtok=positive(p,"max_estimated_input_tokens_per_window"); maxturn=positive(p,"max_calls_per_turn"); bonus=int(p.get("approved_fanout_bonus",0)); cooldown=positive(p,"recovery_cooldown_seconds")
    if bonus < 0: raise ValueError("approved_fanout_bonus must be non-negative")
    latest=events[-1]["_ts"]; recent=[e for e in events if e["_ts"] >= latest-window]
    approved=sum(1 for e in recent if e["class"]=="fanout" and e.get("approved_fanout") is True)
    window_limit=maxw+(bonus if approved else 0)
    polls=sum(1 for e in recent if e["class"] in {"poll","retry"})
    tokens=sum(e.get("estimated_input_tokens",0) for e in recent)
    decision="allow"; reason="within_budget"
    if len(events)>maxturn: decision,reason="block","max_calls_per_turn"
    elif polls>maxpoll: decision,reason="defer","poll_retry_window_exceeded"
    elif tokens>maxtok: decision,reason="defer","token_window_exceeded"
    elif len(recent)>window_limit: decision,reason="defer","call_window_exceeded"
    return {"decision":decision,"reason":reason,"calls_this_turn":len(events),"calls_in_window":len(recent),"poll_retry_in_window":polls,"estimated_tokens_in_window":tokens,"window_call_limit":window_limit,"cooldown_seconds":cooldown if decision=="defer" else 0}


def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument("events",type=Path); ap.add_argument("--policy",required=True,type=Path); ap.add_argument("--strict",action="store_true"); a=ap.parse_args()
    try: result=analyze(load_events(a.events),load_json(a.policy))
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2))
    return 3 if a.strict and result["decision"] != "allow" else 0

if __name__=="__main__": raise SystemExit(main())
