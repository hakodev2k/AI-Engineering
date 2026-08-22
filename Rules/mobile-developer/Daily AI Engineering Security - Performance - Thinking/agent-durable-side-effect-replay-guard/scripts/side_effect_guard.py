#!/usr/bin/env python3
"""Durable idempotency ledger for agent side effects.

Exit codes:
  0 success / safe reuse
  2 policy or state prevents execution
  3 invalid input
  4 storage/runtime error

This tool does not execute the external side effect. It only decides whether the
caller may execute, records completion, and exposes reconciliation state.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sqlite3
import sys
import time
from pathlib import Path
from typing import Any

SCHEMA = """
CREATE TABLE IF NOT EXISTS effects (
  op_key TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  effect_type TEXT NOT NULL,
  semantic_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('in_progress','completed','uncertain')),
  owner TEXT NOT NULL,
  claimed_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  result_ref TEXT,
  note TEXT
);
"""


def canonical_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def make_key(workflow_id: str, effect_type: str, semantic_hash: str) -> str:
    return hashlib.sha256(f"{workflow_id}\0{effect_type}\0{semantic_hash}".encode()).hexdigest()


def connect(path: str) -> sqlite3.Connection:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(str(p), timeout=10, isolation_level=None)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA busy_timeout=10000")
    db.execute(SCHEMA)
    return db


def load_semantic(args: argparse.Namespace) -> Any:
    if args.semantic_json is not None:
        try:
            return json.loads(args.semantic_json)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid --semantic-json: {exc}") from exc
    if args.semantic_file is not None:
        with open(args.semantic_file, "r", encoding="utf-8") as f:
            return json.load(f)
    raise ValueError("one of --semantic-json or --semantic-file is required")


def print_json(obj: dict[str, Any]) -> None:
    print(json.dumps(obj, sort_keys=True, separators=(",", ":")))


def claim(args: argparse.Namespace) -> int:
    semantic = load_semantic(args)
    shash = canonical_hash(semantic)
    key = make_key(args.workflow_id, args.effect_type, shash)
    now = int(time.time())
    db = connect(args.db)
    try:
        db.execute("BEGIN IMMEDIATE")
        row = db.execute("SELECT state, owner, claimed_at, result_ref FROM effects WHERE op_key=?", (key,)).fetchone()
        if row is None:
            db.execute(
                "INSERT INTO effects(op_key,workflow_id,effect_type,semantic_hash,state,owner,claimed_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",
                (key, args.workflow_id, args.effect_type, shash, "in_progress", args.owner, now, now),
            )
            db.execute("COMMIT")
            print_json({"decision":"execute","op_key":key,"semantic_hash":shash,"state":"in_progress"})
            return 0

        state, owner, claimed_at, result_ref = row
        age = now - int(claimed_at)
        if state == "completed":
            db.execute("COMMIT")
            print_json({"decision":"reuse","op_key":key,"state":state,"result_ref":result_ref})
            return 0
        if state == "in_progress" and age <= args.ttl:
            db.execute("COMMIT")
            print_json({"decision":"wait","op_key":key,"state":state,"owner":owner,"age_seconds":age})
            return 2
        if state == "in_progress" and age > args.ttl:
            db.execute("UPDATE effects SET state='uncertain', updated_at=? WHERE op_key=?", (now, key))
            db.execute("COMMIT")
            print_json({"decision":"reconcile","op_key":key,"state":"uncertain","age_seconds":age})
            return 2
        db.execute("COMMIT")
        print_json({"decision":"reconcile","op_key":key,"state":"uncertain"})
        return 2
    except Exception:
        try:
            db.execute("ROLLBACK")
        except Exception:
            pass
        raise
    finally:
        db.close()


def complete(args: argparse.Namespace) -> int:
    now = int(time.time())
    db = connect(args.db)
    try:
        db.execute("BEGIN IMMEDIATE")
        row = db.execute("SELECT state, owner FROM effects WHERE op_key=?", (args.op_key,)).fetchone()
        if row is None:
            db.execute("ROLLBACK")
            print_json({"error":"unknown_op_key","op_key":args.op_key})
            return 2
        state, owner = row
        if state == "completed":
            db.execute("COMMIT")
            print_json({"decision":"already_completed","op_key":args.op_key})
            return 0
        if state != "in_progress" or owner != args.owner:
            db.execute("ROLLBACK")
            print_json({"error":"not_active_owner","op_key":args.op_key,"state":state})
            return 2
        db.execute(
            "UPDATE effects SET state='completed', result_ref=?, note=?, updated_at=? WHERE op_key=?",
            (args.result_ref, args.note, now, args.op_key),
        )
        db.execute("COMMIT")
        print_json({"decision":"completed","op_key":args.op_key,"result_ref":args.result_ref})
        return 0
    finally:
        db.close()


def resolve(args: argparse.Namespace) -> int:
    if args.resolution not in {"completed", "retry"}:
        raise ValueError("resolution must be completed or retry")
    now = int(time.time())
    db = connect(args.db)
    try:
        db.execute("BEGIN IMMEDIATE")
        row = db.execute("SELECT state FROM effects WHERE op_key=?", (args.op_key,)).fetchone()
        if row is None or row[0] != "uncertain":
            db.execute("ROLLBACK")
            print_json({"error":"not_uncertain","op_key":args.op_key})
            return 2
        if args.resolution == "completed":
            db.execute("UPDATE effects SET state='completed', result_ref=?, note=?, updated_at=? WHERE op_key=?", (args.result_ref, args.note, now, args.op_key))
            decision = "reconciled_completed"
        else:
            db.execute("DELETE FROM effects WHERE op_key=?", (args.op_key,))
            decision = "retry_released"
        db.execute("COMMIT")
        print_json({"decision":decision,"op_key":args.op_key})
        return 0
    finally:
        db.close()


def status(args: argparse.Namespace) -> int:
    db = connect(args.db)
    try:
        row = db.execute("SELECT op_key,workflow_id,effect_type,semantic_hash,state,owner,claimed_at,updated_at,result_ref,note FROM effects WHERE op_key=?", (args.op_key,)).fetchone()
        if row is None:
            print_json({"state":"missing","op_key":args.op_key})
            return 2
        names = ["op_key","workflow_id","effect_type","semantic_hash","state","owner","claimed_at","updated_at","result_ref","note"]
        print_json(dict(zip(names, row)))
        return 0
    finally:
        db.close()


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser()
    p.add_argument("--db", default=os.environ.get("SIDE_EFFECT_LEDGER", ".agent-state/side-effect-ledger.sqlite3"))
    sub = p.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("claim")
    c.add_argument("--workflow-id", required=True)
    c.add_argument("--effect-type", required=True)
    c.add_argument("--owner", required=True)
    c.add_argument("--semantic-json")
    c.add_argument("--semantic-file")
    c.add_argument("--ttl", type=int, default=300)
    c.set_defaults(func=claim)

    x = sub.add_parser("complete")
    x.add_argument("--op-key", required=True)
    x.add_argument("--owner", required=True)
    x.add_argument("--result-ref", default="")
    x.add_argument("--note", default="")
    x.set_defaults(func=complete)

    r = sub.add_parser("resolve")
    r.add_argument("--op-key", required=True)
    r.add_argument("--resolution", choices=["completed", "retry"], required=True)
    r.add_argument("--result-ref", default="")
    r.add_argument("--note", default="")
    r.set_defaults(func=resolve)

    s = sub.add_parser("status")
    s.add_argument("--op-key", required=True)
    s.set_defaults(func=status)
    return p


def main() -> int:
    try:
        args = parser().parse_args()
        return int(args.func(args))
    except ValueError as exc:
        print_json({"error":"invalid_input","message":str(exc)})
        return 3
    except (sqlite3.Error, OSError) as exc:
        print_json({"error":"runtime_error","message":str(exc)})
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
