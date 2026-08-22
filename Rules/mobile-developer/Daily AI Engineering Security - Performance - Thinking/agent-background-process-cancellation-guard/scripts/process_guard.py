#!/usr/bin/env python3
"""Deterministic ownership registry and completion gate for agent background processes.

This script intentionally does not send kill signals. It establishes ownership evidence,
lease state, stale detection, and a zero-live completion barrier. Destructive cancellation
belongs in an OS-specific adapter that consumes only identity-verified targets.
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import tempfile
import time
from datetime import datetime, timezone
from typing import Any

DEFAULT_POLICY = pathlib.Path("config/policy.json")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: pathlib.Path, default: Any) -> Any:
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def atomic_write(path: pathlib.Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, sort_keys=True)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def load_policy(path: pathlib.Path) -> dict[str, Any]:
    p = load_json(path, {})
    required = ["lease_seconds", "stale_lease_grace_seconds", "registry_path"]
    missing = [k for k in required if k not in p]
    if missing:
        raise SystemExit(f"policy missing fields: {', '.join(missing)}")
    return p


def registry_path(policy: dict[str, Any]) -> pathlib.Path:
    return pathlib.Path(policy["registry_path"])


def load_registry(path: pathlib.Path) -> dict[str, Any]:
    data = load_json(path, {"version": 1, "tasks": {}})
    if not isinstance(data, dict) or not isinstance(data.get("tasks"), dict):
        raise SystemExit("invalid registry schema")
    return data


def proc_start_identity(pid: int) -> str | None:
    """Return Linux /proc starttime identity when available.

    Field 22 in /proc/<pid>/stat is process start time in clock ticks since boot.
    On non-Linux hosts this returns None and the host adapter must supply identity.
    """
    stat = pathlib.Path(f"/proc/{pid}/stat")
    if not stat.exists():
        return None
    try:
        text = stat.read_text(encoding="utf-8")
        # comm may contain spaces inside parentheses; split after final ')'.
        tail = text[text.rfind(")") + 2 :].split()
        return tail[19]  # field 22 overall; tail starts at field 3
    except (OSError, IndexError):
        return None


def pid_alive(pid: int) -> bool:
    if pid <= 0:
        return False
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


def identity_status(record: dict[str, Any]) -> dict[str, Any]:
    pid = int(record["pid"])
    alive = pid_alive(pid)
    current = proc_start_identity(pid) if alive else None
    expected = str(record.get("start_identity", "")) or None
    if not alive:
        status = "gone"
        match = True
    elif expected is None or current is None:
        status = "unknown"
        match = False
    elif current == expected:
        status = "match"
        match = True
    else:
        status = "pid-reused-or-mismatch"
        match = False
    return {"pid": pid, "alive": alive, "expected_start": expected, "current_start": current, "identity": status, "match": match}


def get_task(reg: dict[str, Any], task_id: str) -> dict[str, Any]:
    try:
        return reg["tasks"][task_id]
    except KeyError:
        raise SystemExit(f"unknown task_id: {task_id}")


def cmd_register(args: argparse.Namespace, policy: dict[str, Any]) -> int:
    path = registry_path(policy)
    reg = load_registry(path)
    if args.task_id in reg["tasks"]:
        raise SystemExit("task_id already exists; use a new logical task id")
    detected = proc_start_identity(args.pid)
    supplied = args.start_identity or detected
    if not supplied:
        raise SystemExit("cannot establish process start identity; supply --start-identity from host adapter")
    if detected and supplied != detected:
        raise SystemExit("supplied start identity does not match current process")
    reg["tasks"][args.task_id] = {
        "task_id": args.task_id,
        "parent_id": args.parent_id,
        "pid": args.pid,
        "pgid": args.pgid,
        "start_identity": str(supplied),
        "launch_nonce": args.nonce,
        "state": "running",
        "created_at": now_iso(),
        "heartbeat_epoch": time.time(),
        "cancel_attempts": 0,
    }
    atomic_write(path, reg)
    print(json.dumps(reg["tasks"][args.task_id], sort_keys=True))
    return 0


def cmd_heartbeat(args: argparse.Namespace, policy: dict[str, Any]) -> int:
    path = registry_path(policy)
    reg = load_registry(path)
    task = get_task(reg, args.task_id)
    check = identity_status(task)
    if not check["match"] or not check["alive"]:
        print(json.dumps({"ok": False, "reason": "identity-not-live", "identity": check}, sort_keys=True))
        return 2
    task["heartbeat_epoch"] = time.time()
    task["updated_at"] = now_iso()
    atomic_write(path, reg)
    print(json.dumps({"ok": True, "task_id": args.task_id}, sort_keys=True))
    return 0


def cmd_inspect(args: argparse.Namespace, policy: dict[str, Any]) -> int:
    reg = load_registry(registry_path(policy))
    task = get_task(reg, args.task_id)
    check = identity_status(task)
    out = {"task": task, "identity": check}
    print(json.dumps(out, indent=2, sort_keys=True))
    return 0 if check["match"] else 2


def cmd_gate(args: argparse.Namespace, policy: dict[str, Any]) -> int:
    reg = load_registry(registry_path(policy))
    root = get_task(reg, args.task_id)
    ids = {args.task_id}
    changed = True
    while changed:
        changed = False
        for tid, task in reg["tasks"].items():
            if task.get("parent_id") in ids and tid not in ids:
                ids.add(tid)
                changed = True
    blockers = []
    for tid in sorted(ids):
        task = reg["tasks"][tid]
        check = identity_status(task)
        if check["alive"] and check["match"]:
            blockers.append({"task_id": tid, "pid": task["pid"], "state": task.get("state"), "identity": check["identity"]})
        elif check["alive"] and not check["match"]:
            blockers.append({"task_id": tid, "pid": task["pid"], "state": task.get("state"), "identity": check["identity"], "reason": "ambiguous ownership"})
    ok = not blockers
    print(json.dumps({"ok": ok, "root": root["task_id"], "blockers": blockers}, indent=2, sort_keys=True))
    return 0 if ok else 3


def cmd_stale(args: argparse.Namespace, policy: dict[str, Any]) -> int:
    reg = load_registry(registry_path(policy))
    threshold = float(policy["lease_seconds"]) + float(policy["stale_lease_grace_seconds"])
    now = time.time()
    rows = []
    for tid, task in sorted(reg["tasks"].items()):
        age = now - float(task.get("heartbeat_epoch", 0))
        if age > threshold and task.get("state") in {"running", "cancelling"}:
            rows.append({"task_id": tid, "age_seconds": round(age, 3), "identity": identity_status(task)})
    print(json.dumps({"stale": rows, "count": len(rows)}, indent=2, sort_keys=True))
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser()
    p.add_argument("--policy", type=pathlib.Path, default=DEFAULT_POLICY)
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("register")
    r.add_argument("--task-id", required=True)
    r.add_argument("--parent-id")
    r.add_argument("--pid", type=int, required=True)
    r.add_argument("--pgid", type=int)
    r.add_argument("--start-identity")
    r.add_argument("--nonce", required=True)
    h = sub.add_parser("heartbeat"); h.add_argument("--task-id", required=True)
    i = sub.add_parser("inspect"); i.add_argument("--task-id", required=True)
    g = sub.add_parser("gate"); g.add_argument("--task-id", required=True)
    sub.add_parser("stale")
    return p


def main() -> int:
    args = build_parser().parse_args()
    policy = load_policy(args.policy)
    return {
        "register": cmd_register,
        "heartbeat": cmd_heartbeat,
        "inspect": cmd_inspect,
        "gate": cmd_gate,
        "stale": cmd_stale,
    }[args.cmd](args, policy)


if __name__ == "__main__":
    raise SystemExit(main())
