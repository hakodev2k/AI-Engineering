#!/usr/bin/env python3
"""Deterministic metadata guard for single-writer OAuth refresh orchestration.

This script intentionally never reads, writes, accepts, or logs raw OAuth tokens.
It protects non-secret credential metadata and refresh ownership. Integrations must
keep token material in their normal secret store/broker.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import time
from pathlib import Path
from typing import Any

SECRET_KEYS = {
    "access_token", "accessToken", "refresh_token", "refreshToken",
    "client_secret", "clientSecret", "authorization", "token"
}
REQUIRED_FIELDS = {"generation", "expires_at", "scopes", "updated_at"}


def fail(message: str, code: int = 2) -> None:
    print(json.dumps({"ok": False, "error": message}), file=sys.stderr)
    raise SystemExit(code)


def read_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"state file not found: {path}")
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"invalid state file: {exc}")
    if not isinstance(data, dict):
        fail("state must be a JSON object")
    return data


def reject_secret_fields(data: dict[str, Any]) -> None:
    found = sorted(k for k in data if k in SECRET_KEYS or "secret" in k.lower())
    if found:
        fail("metadata contains forbidden secret-like fields: " + ", ".join(found))


def validate_state(data: dict[str, Any]) -> None:
    reject_secret_fields(data)
    missing = sorted(REQUIRED_FIELDS - set(data))
    if missing:
        fail("metadata missing fields: " + ", ".join(missing))
    if not isinstance(data["generation"], int) or data["generation"] < 0:
        fail("generation must be a non-negative integer")
    if not isinstance(data["expires_at"], (int, float)) or data["expires_at"] <= 0:
        fail("expires_at must be a positive epoch timestamp")
    if not isinstance(data["scopes"], list) or not all(isinstance(x, str) for x in data["scopes"]):
        fail("scopes must be a string array")
    if not isinstance(data["updated_at"], (int, float)) or data["updated_at"] <= 0:
        fail("updated_at must be a positive epoch timestamp")


def safe_name(value: str) -> str:
    if not value or any(ch not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_." for ch in value):
        fail("credential/owner id contains unsupported characters")
    return value


def lease_dir(root: Path, credential: str) -> Path:
    return root / "leases" / safe_name(credential)


def acquire(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    path = lease_dir(root, args.credential)
    path.parent.mkdir(parents=True, exist_ok=True)
    now = time.time()
    owner = safe_name(args.owner)

    try:
        path.mkdir()
    except FileExistsError:
        meta_path = path / "lease.json"
        try:
            current = json.loads(meta_path.read_text(encoding="utf-8"))
            acquired_at = float(current.get("acquired_at", 0))
            ttl = int(current.get("ttl_seconds", args.ttl))
        except Exception:
            fail("lease exists but metadata is unreadable; manual reconciliation required", 3)
        if now - acquired_at <= ttl:
            print(json.dumps({"ok": False, "status": "busy", "owner": current.get("owner", "unknown")}))
            raise SystemExit(4)
        # Reclaim only an expired lease. Rename first so only one contender can win reclamation.
        stale = path.with_name(path.name + f".stale-{os.getpid()}-{int(now * 1000)}")
        try:
            path.rename(stale)
        except OSError:
            print(json.dumps({"ok": False, "status": "busy", "owner": current.get("owner", "unknown")}))
            raise SystemExit(4)
        shutil.rmtree(stale, ignore_errors=True)
        try:
            path.mkdir()
        except FileExistsError:
            print(json.dumps({"ok": False, "status": "busy"}))
            raise SystemExit(4)

    meta = {"owner": owner, "acquired_at": now, "ttl_seconds": args.ttl}
    tmp = path / f"lease.json.tmp-{os.getpid()}"
    tmp.write_text(json.dumps(meta, sort_keys=True), encoding="utf-8")
    os.replace(tmp, path / "lease.json")
    print(json.dumps({"ok": True, "status": "acquired", "credential": args.credential, "owner": owner}))


def release(args: argparse.Namespace) -> None:
    path = lease_dir(Path(args.root).resolve(), args.credential)
    meta_path = path / "lease.json"
    if not meta_path.exists():
        print(json.dumps({"ok": True, "status": "already_released"}))
        return
    try:
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
    except Exception:
        fail("lease metadata unreadable; refusing unsafe release", 3)
    if meta.get("owner") != args.owner:
        fail("lease owner mismatch; refusing release", 5)
    shutil.rmtree(path)
    print(json.dumps({"ok": True, "status": "released", "credential": args.credential}))


def inspect(args: argparse.Namespace) -> None:
    data = read_json(Path(args.state))
    validate_state(data)
    print(json.dumps({
        "ok": True,
        "generation": data["generation"],
        "expires_at": data["expires_at"],
        "scope_count": len(data["scopes"]),
        "updated_at": data["updated_at"]
    }, sort_keys=True))


def check_generation(args: argparse.Namespace) -> None:
    data = read_json(Path(args.state))
    validate_state(data)
    if data["generation"] != args.expected:
        print(json.dumps({"ok": False, "status": "generation_conflict", "current": data["generation"], "expected": args.expected}))
        raise SystemExit(6)
    print(json.dumps({"ok": True, "status": "generation_matches", "generation": args.expected}))


def commit_metadata(args: argparse.Namespace) -> None:
    state_path = Path(args.state)
    current = read_json(state_path)
    validate_state(current)
    if current["generation"] != args.expected:
        fail(f"generation conflict: current={current['generation']} expected={args.expected}", 6)

    new_data = read_json(Path(args.new_metadata))
    validate_state(new_data)
    if new_data["generation"] != args.expected + 1:
        fail("new metadata generation must equal expected + 1")
    if set(new_data["scopes"]) - set(current["scopes"]):
        fail("scope expansion rejected")

    state_path.parent.mkdir(parents=True, exist_ok=True)
    tmp = state_path.with_name(state_path.name + f".tmp-{os.getpid()}")
    tmp.write_text(json.dumps(new_data, sort_keys=True, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, state_path)
    print(json.dumps({"ok": True, "status": "committed", "generation": new_data["generation"]}))


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="command", required=True)

    a = sub.add_parser("acquire")
    a.add_argument("--root", required=True)
    a.add_argument("--credential", required=True)
    a.add_argument("--owner", required=True)
    a.add_argument("--ttl", type=int, default=30)
    a.set_defaults(func=acquire)

    r = sub.add_parser("release")
    r.add_argument("--root", required=True)
    r.add_argument("--credential", required=True)
    r.add_argument("--owner", required=True)
    r.set_defaults(func=release)

    i = sub.add_parser("inspect")
    i.add_argument("--state", required=True)
    i.set_defaults(func=inspect)

    c = sub.add_parser("check-generation")
    c.add_argument("--state", required=True)
    c.add_argument("--expected", type=int, required=True)
    c.set_defaults(func=check_generation)

    m = sub.add_parser("commit-metadata")
    m.add_argument("--state", required=True)
    m.add_argument("--new-metadata", required=True)
    m.add_argument("--expected", type=int, required=True)
    m.set_defaults(func=commit_metadata)

    return p


def main() -> None:
    args = build_parser().parse_args()
    if getattr(args, "ttl", 1) <= 0:
        fail("ttl must be positive")
    args.func(args)


if __name__ == "__main__":
    main()
