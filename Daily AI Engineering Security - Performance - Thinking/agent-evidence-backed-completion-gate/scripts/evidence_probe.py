#!/usr/bin/env python3
"""Append observable evidence to a completion ledger using atomic writes."""
from __future__ import annotations

import argparse
import json
import os
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

VALID_TYPES = {"test", "command", "inspection", "artifact", "diff", "claim"}


def load(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("ledger must be a JSON object")
    return data


def atomic_write(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", dir=str(path.parent), text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def add(args: argparse.Namespace) -> int:
    path = Path(args.ledger)
    try:
        ledger = load(path)
        req = next((r for r in ledger.get("requirements", []) if r.get("id") == args.requirement), None)
        if not req:
            raise ValueError(f"unknown requirement id: {args.requirement}")
        if args.type not in VALID_TYPES:
            raise ValueError(f"invalid evidence type: {args.type}")
        if args.type in {"test", "command"} and args.exit_code is None:
            raise ValueError("--exit-code is required for test/command evidence")
        ev = {
            "type": args.type,
            "command": args.command,
            "exit_code": args.exit_code,
            "scope": args.scope,
            "result": args.result,
            "observed_at": datetime.now(timezone.utc).isoformat(),
            "fresh": True,
            "paths": args.paths or [],
            "artifact": args.artifact,
        }
        req.setdefault("evidence", []).append(ev)
        atomic_write(path, ledger)
        print(json.dumps({"added": True, "requirement": args.requirement, "type": args.type}, indent=2))
        return 0
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"added": False, "error": str(exc)}, indent=2))
        return 3


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Record observable task evidence")
    sub = parser.add_subparsers(dest="command_name", required=True)
    p = sub.add_parser("add")
    p.add_argument("--ledger", required=True)
    p.add_argument("--requirement", required=True)
    p.add_argument("--type", required=True, choices=sorted(VALID_TYPES))
    p.add_argument("--command")
    p.add_argument("--exit-code", type=int)
    p.add_argument("--scope")
    p.add_argument("--paths", nargs="*")
    p.add_argument("--result")
    p.add_argument("--artifact")
    p.set_defaults(func=add)
    return parser


if __name__ == "__main__":
    ns = build_parser().parse_args()
    raise SystemExit(ns.func(ns))
