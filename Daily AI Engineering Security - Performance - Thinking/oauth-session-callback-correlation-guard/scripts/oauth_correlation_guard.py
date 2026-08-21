#!/usr/bin/env python3
"""Verify that an OAuth callback is bound to the exact initiating transaction.

Registry JSON:
{"transactions":[{"state_hash":"...","session_id":"s1","issuer":"provider-a","redirect_uri":"http://127.0.0.1:1455/cb","expires_at":"2026-08-20T10:00:00Z","consumed":false}]}

Callback JSON contains raw `state` plus issuer/redirect/session existence metadata. The raw state is hashed in memory and never written by this script.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load(path: str) -> Any:
    try: return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc

def ts(v: str) -> datetime:
    try: d=datetime.fromisoformat(v.replace("Z", "+00:00"))
    except ValueError as exc: raise ValueError("invalid ISO-8601 timestamp") from exc
    if d.tzinfo is None: raise ValueError("timestamp must include timezone")
    return d.astimezone(timezone.utc)

def state_hash(v: str) -> str: return hashlib.sha256(v.encode()).hexdigest()

def verify(callback: dict[str, Any], registry: dict[str, Any]) -> tuple[int, dict[str, Any]]:
    required=("state","issuer","redirect_uri","now")
    if any(not callback.get(k) for k in required): return 1,{"decision":"reject","reason":"malformed_callback"}
    transactions=registry.get("transactions")
    if not isinstance(transactions,list): return 1,{"decision":"reject","reason":"malformed_registry"}
    h=state_hash(str(callback["state"]))
    matches=[x for x in transactions if isinstance(x,dict) and x.get("state_hash")==h]
    if len(matches)!=1: return 2,{"decision":"reject","reason":"unknown_or_duplicate_state"}
    txn=matches[0]
    if txn.get("consumed"): return 2,{"decision":"reject","reason":"replay"}
    try:
        if ts(str(callback["now"])) > ts(str(txn.get("expires_at",""))): return 2,{"decision":"reject","reason":"expired"}
    except ValueError: return 1,{"decision":"reject","reason":"invalid_time"}
    if txn.get("issuer") != callback.get("issuer"): return 2,{"decision":"reject","reason":"issuer_mismatch"}
    if txn.get("redirect_uri") != callback.get("redirect_uri"): return 2,{"decision":"reject","reason":"redirect_mismatch"}
    if callback.get("session_exists") is False: return 2,{"decision":"reject","reason":"session_detached"}
    sid=txn.get("session_id")
    if not sid: return 1,{"decision":"reject","reason":"missing_session_binding"}
    return 0,{"decision":"accept_and_bind","session_id":sid,"transaction_id":txn.get("transaction_id"),"reason":"exact_transaction_match"}

def main()->int:
    p=argparse.ArgumentParser(); sub=p.add_subparsers(dest="cmd",required=True)
    v=sub.add_parser("verify"); v.add_argument("--callback",required=True); v.add_argument("--registry",required=True)
    a=p.parse_args()
    try:
        cb=load(a.callback); reg=load(a.registry)
        if not isinstance(cb,dict) or not isinstance(reg,dict): raise ValueError("inputs must be objects")
        code,result=verify(cb,reg); print(json.dumps(result,sort_keys=True)); return code
    except ValueError as exc: print(f"error: {exc}",file=sys.stderr); return 1

if __name__=="__main__": raise SystemExit(main())