#!/usr/bin/env python3
"""Deterministic helpers for agent tool idempotency.

Stdlib only. This is a reference guard for local validation and SQLite-backed
reservation semantics. Production systems may replace SQLite with a shared DB
while preserving the state machine.

Exit codes: 0 success, 2 invalid input/policy, 3 conflict/blocked, 4 storage error.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import sys
import time
from pathlib import Path
from typing import Any


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def operation_key(tenant: str, workflow: str, tool: str, scope: str, args: dict[str, Any]) -> str:
    if not all(isinstance(x, str) and x.strip() for x in (tenant, workflow, tool, scope)):
        raise ValueError("tenant, workflow, tool and business scope are required")
    payload = {"v": 1, "tenant": tenant, "workflow": workflow, "tool": tool, "business_scope": scope, "args": args}
    return hashlib.sha256(canonical(payload).encode("utf-8")).hexdigest()


def connect(path: str) -> sqlite3.Connection:
    try:
        db = sqlite3.connect(path, timeout=5, isolation_level=None)
        db.execute("PRAGMA journal_mode=WAL")
        db.execute("""CREATE TABLE IF NOT EXISTS operations(
          operation_key TEXT PRIMARY KEY,
          state TEXT NOT NULL,
          owner TEXT,
          lease_until REAL,
          result_json TEXT,
          result_sha256 TEXT,
          provider_request_id TEXT,
          updated_at REAL NOT NULL
        )""")
        return db
    except sqlite3.Error as exc:
        raise OSError(str(exc)) from exc


def reserve(db: sqlite3.Connection, key: str, owner: str, lease_seconds: int) -> dict[str, Any]:
    now = time.time()
    lease_until = now + lease_seconds
    try:
        db.execute("BEGIN IMMEDIATE")
        row = db.execute("SELECT state,owner,lease_until,result_json,result_sha256,provider_request_id FROM operations WHERE operation_key=?", (key,)).fetchone()
        if row is None:
            db.execute("INSERT INTO operations(operation_key,state,owner,lease_until,updated_at) VALUES(?,?,?,?,?)", (key,"in_progress",owner,lease_until,now))
            db.execute("COMMIT")
            return {"status":"owner","operation_key":key}
        state, current_owner, current_lease, result_json, result_sha, provider_id = row
        if state == "completed":
            db.execute("COMMIT")
            return {"status":"completed","operation_key":key,"result":json.loads(result_json) if result_json else None,"result_sha256":result_sha,"provider_request_id":provider_id}
        if state == "unknown":
            db.execute("COMMIT")
            return {"status":"unknown","operation_key":key}
        if current_lease and current_lease > now and current_owner != owner:
            db.execute("COMMIT")
            return {"status":"in_progress","operation_key":key,"owner":current_owner,"lease_until":current_lease}
        db.execute("UPDATE operations SET owner=?,lease_until=?,updated_at=? WHERE operation_key=?", (owner,lease_until,now,key))
        db.execute("COMMIT")
        return {"status":"owner","operation_key":key,"recovered_lease":True}
    except sqlite3.Error:
        try: db.execute("ROLLBACK")
        except sqlite3.Error: pass
        raise


def complete(db: sqlite3.Connection, key: str, owner: str, result: Any, provider_request_id: str | None) -> None:
    body = canonical(result)
    digest = hashlib.sha256(body.encode("utf-8")).hexdigest()
    cur = db.execute("UPDATE operations SET state='completed',result_json=?,result_sha256=?,provider_request_id=?,lease_until=NULL,updated_at=? WHERE operation_key=? AND owner=? AND state='in_progress'", (body,digest,provider_request_id,time.time(),key,owner))
    if cur.rowcount != 1:
        raise RuntimeError("completion rejected: caller does not own active reservation")


def mark_unknown(db: sqlite3.Connection, key: str, owner: str) -> None:
    cur = db.execute("UPDATE operations SET state='unknown',lease_until=NULL,updated_at=? WHERE operation_key=? AND owner=? AND state='in_progress'", (time.time(),key,owner))
    if cur.rowcount != 1:
        raise RuntimeError("unknown transition rejected")


def validate_registry(path: str) -> list[str]:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    tools = data.get("tools") if isinstance(data, dict) else None
    if not isinstance(tools, list): return ["registry.tools must be an array"]
    errors=[]; names=set()
    for i,t in enumerate(tools):
        if not isinstance(t,dict): errors.append(f"tools[{i}] must be object"); continue
        name=t.get("name"); effect=t.get("effect")
        if not name or name in names: errors.append(f"invalid/duplicate name at tools[{i}]")
        names.add(name)
        if effect not in {"read","idempotent-write","non-idempotent-write"}: errors.append(f"{name}: invalid effect")
        if effect != "read" and not t.get("businessIdentityFields"): errors.append(f"{name}: write requires businessIdentityFields")
    return errors


def main() -> int:
    p=argparse.ArgumentParser(); sub=p.add_subparsers(dest="cmd",required=True)
    k=sub.add_parser("key"); k.add_argument("--tenant",required=True); k.add_argument("--workflow",required=True); k.add_argument("--tool",required=True); k.add_argument("--scope",required=True); k.add_argument("--args-json",required=True)
    r=sub.add_parser("reserve"); r.add_argument("--db",required=True); r.add_argument("--key",required=True); r.add_argument("--owner",required=True); r.add_argument("--lease-seconds",type=int,default=120)
    c=sub.add_parser("complete"); c.add_argument("--db",required=True); c.add_argument("--key",required=True); c.add_argument("--owner",required=True); c.add_argument("--result-json",required=True); c.add_argument("--provider-request-id")
    u=sub.add_parser("unknown"); u.add_argument("--db",required=True); u.add_argument("--key",required=True); u.add_argument("--owner",required=True)
    v=sub.add_parser("validate-registry"); v.add_argument("--registry",required=True)
    args=p.parse_args()
    try:
        if args.cmd=="key": print(operation_key(args.tenant,args.workflow,args.tool,args.scope,json.loads(args.args_json))); return 0
        if args.cmd=="validate-registry":
            e=validate_registry(args.registry); print(json.dumps({"valid":not e,"errors":e},indent=2)); return 0 if not e else 2
        db=connect(args.db)
        if args.cmd=="reserve": print(json.dumps(reserve(db,args.key,args.owner,args.lease_seconds),indent=2)); return 0
        if args.cmd=="complete": complete(db,args.key,args.owner,json.loads(args.result_json),args.provider_request_id); print('{"status":"completed"}'); return 0
        if args.cmd=="unknown": mark_unknown(db,args.key,args.owner); print('{"status":"unknown"}'); return 0
    except (ValueError,json.JSONDecodeError) as exc: print(json.dumps({"error":str(exc)}),file=sys.stderr); return 2
    except RuntimeError as exc: print(json.dumps({"error":str(exc)}),file=sys.stderr); return 3
    except (OSError,sqlite3.Error) as exc: print(json.dumps({"error":str(exc)}),file=sys.stderr); return 4
    return 2

if __name__ == "__main__": raise SystemExit(main())
