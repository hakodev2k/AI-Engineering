#!/usr/bin/env python3
"""Durable SQLite admission ledger for background agent runs.

Commands:
  init
  admit --run-id ID --idempotency-key KEY --input-hash HASH [--side-effect-free]
  checkpoint --run-id ID --checkpoint-id ID
  complete --run-id ID
  fail --run-id ID --reason TEXT
  reconcile [--lost-after-seconds N]
  get --run-id ID
  list

The ledger intentionally stores hashes/identifiers, not prompt bodies or secrets.
Exit codes: 0 success; 2 state/validation conflict or lost run detected; 3 storage error.
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SCHEMA = """
CREATE TABLE IF NOT EXISTS admissions (
  run_id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  input_hash TEXT NOT NULL,
  side_effect_free INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK(status IN ('accepted','checkpointed','completed','failed','lost')),
  accepted_at TEXT NOT NULL,
  first_checkpoint_at TEXT,
  checkpoint_id TEXT,
  terminal_at TEXT,
  failure_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_admissions_status_time ON admissions(status, accepted_at);
"""


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def connect(path: Path) -> sqlite3.Connection:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA synchronous=FULL")
        conn.executescript(SCHEMA)
        conn.commit()
        return conn
    except (OSError, sqlite3.Error) as exc:
        print(json.dumps({"status": "error", "message": str(exc)}), file=sys.stderr)
        raise SystemExit(3)


def emit(row: sqlite3.Row | dict[str, Any]) -> None:
    print(json.dumps(dict(row), sort_keys=True))


def require_run(conn: sqlite3.Connection, run_id: str) -> sqlite3.Row:
    row = conn.execute("SELECT * FROM admissions WHERE run_id=?", (run_id,)).fetchone()
    if row is None:
        print(json.dumps({"status": "error", "message": "unknown run_id", "run_id": run_id}), file=sys.stderr)
        raise SystemExit(2)
    return row


def cmd_admit(conn: sqlite3.Connection, args: argparse.Namespace) -> int:
    if not args.run_id.strip() or not args.idempotency_key.strip() or not args.input_hash.strip():
        print(json.dumps({"status": "error", "message": "run-id, idempotency-key and input-hash are required"}), file=sys.stderr)
        return 2
    try:
        conn.execute("BEGIN IMMEDIATE")
        existing = conn.execute(
            "SELECT * FROM admissions WHERE run_id=? OR idempotency_key=?",
            (args.run_id, args.idempotency_key),
        ).fetchone()
        if existing is not None:
            same = (
                existing["run_id"] == args.run_id
                and existing["idempotency_key"] == args.idempotency_key
                and existing["input_hash"] == args.input_hash
            )
            conn.rollback()
            if same:
                emit(existing)
                return 0
            print(json.dumps({"status": "error", "message": "run/idempotency conflict"}), file=sys.stderr)
            return 2
        conn.execute(
            "INSERT INTO admissions(run_id,idempotency_key,input_hash,side_effect_free,status,accepted_at) VALUES(?,?,?,?,?,?)",
            (args.run_id, args.idempotency_key, args.input_hash, 1 if args.side_effect_free else 0, "accepted", now()),
        )
        conn.commit()
        emit(require_run(conn, args.run_id))
        return 0
    except sqlite3.Error as exc:
        conn.rollback()
        print(json.dumps({"status": "error", "message": str(exc)}), file=sys.stderr)
        return 3


def transition(conn: sqlite3.Connection, run_id: str, target: str, *, checkpoint_id: str | None = None, reason: str | None = None) -> int:
    row = require_run(conn, run_id)
    current = row["status"]
    allowed = {
        "checkpointed": {"accepted", "checkpointed"},
        "completed": {"accepted", "checkpointed"},
        "failed": {"accepted", "checkpointed"},
    }
    if target not in allowed or current not in allowed[target]:
        print(json.dumps({"status": "error", "message": f"invalid transition {current}->{target}"}), file=sys.stderr)
        return 2
    t = now()
    if target == "checkpointed":
        conn.execute(
            "UPDATE admissions SET status='checkpointed', first_checkpoint_at=COALESCE(first_checkpoint_at,?), checkpoint_id=COALESCE(checkpoint_id,?) WHERE run_id=?",
            (t, checkpoint_id, run_id),
        )
    elif target == "completed":
        conn.execute("UPDATE admissions SET status='completed', terminal_at=? WHERE run_id=?", (t, run_id))
    else:
        conn.execute("UPDATE admissions SET status='failed', terminal_at=?, failure_reason=? WHERE run_id=?", (t, reason, run_id))
    conn.commit()
    emit(require_run(conn, run_id))
    return 0


def cmd_reconcile(conn: sqlite3.Connection, lost_after: int) -> int:
    if lost_after < 1:
        print(json.dumps({"status": "error", "message": "lost-after-seconds must be >= 1"}), file=sys.stderr)
        return 2
    rows = conn.execute("SELECT * FROM admissions WHERE status='accepted'").fetchall()
    current = datetime.now(timezone.utc)
    lost: list[str] = []
    for row in rows:
        accepted = datetime.fromisoformat(row["accepted_at"].replace("Z", "+00:00"))
        age = (current - accepted).total_seconds()
        if age >= lost_after:
            conn.execute(
                "UPDATE admissions SET status='lost', terminal_at=?, failure_reason=? WHERE run_id=? AND status='accepted'",
                (now(), f"no first checkpoint within {lost_after}s", row["run_id"]),
            )
            lost.append(row["run_id"])
    conn.commit()
    print(json.dumps({"status": "ok", "lost_count": len(lost), "lost_run_ids": lost}, sort_keys=True))
    return 2 if lost else 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", type=Path, required=True)
    subs = parser.add_subparsers(dest="command", required=True)
    subs.add_parser("init")
    admit = subs.add_parser("admit")
    admit.add_argument("--run-id", required=True)
    admit.add_argument("--idempotency-key", required=True)
    admit.add_argument("--input-hash", required=True)
    admit.add_argument("--side-effect-free", action="store_true")
    checkpoint = subs.add_parser("checkpoint")
    checkpoint.add_argument("--run-id", required=True)
    checkpoint.add_argument("--checkpoint-id", required=True)
    complete = subs.add_parser("complete")
    complete.add_argument("--run-id", required=True)
    fail = subs.add_parser("fail")
    fail.add_argument("--run-id", required=True)
    fail.add_argument("--reason", required=True)
    reconcile = subs.add_parser("reconcile")
    reconcile.add_argument("--lost-after-seconds", type=int, default=120)
    get = subs.add_parser("get")
    get.add_argument("--run-id", required=True)
    subs.add_parser("list")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    conn = connect(args.db)
    try:
        if args.command == "init":
            print(json.dumps({"status": "ok", "db": str(args.db)}))
            return 0
        if args.command == "admit":
            return cmd_admit(conn, args)
        if args.command == "checkpoint":
            return transition(conn, args.run_id, "checkpointed", checkpoint_id=args.checkpoint_id)
        if args.command == "complete":
            return transition(conn, args.run_id, "completed")
        if args.command == "fail":
            return transition(conn, args.run_id, "failed", reason=args.reason)
        if args.command == "reconcile":
            return cmd_reconcile(conn, args.lost_after_seconds)
        if args.command == "get":
            emit(require_run(conn, args.run_id))
            return 0
        if args.command == "list":
            for row in conn.execute("SELECT * FROM admissions ORDER BY accepted_at"):
                emit(row)
            return 0
        return 3
    finally:
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
