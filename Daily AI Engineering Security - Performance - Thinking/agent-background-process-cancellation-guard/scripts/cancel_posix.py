#!/usr/bin/env python3
"""POSIX cancellation adapter for process_guard registry.

Safe defaults:
- dry-run unless --execute is supplied;
- refuses identity mismatch, missing /proc start identity, invalid process group,
  or any process group equal to this adapter's own group;
- SIGKILL escalation requires both policy allow_force_kill=true and --allow-force.
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import signal
import sys
import time


def load(path: pathlib.Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def start_identity(pid: int) -> str | None:
    p = pathlib.Path(f"/proc/{pid}/stat")
    if not p.exists():
        return None
    text = p.read_text(encoding="utf-8")
    tail = text[text.rfind(")") + 2 :].split()
    return tail[19] if len(tail) > 19 else None


def alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


def verify(task: dict) -> tuple[bool, str]:
    pid = int(task["pid"])
    if not alive(pid):
        return True, "already-gone"
    current = start_identity(pid)
    expected = str(task.get("start_identity", "")) or None
    if not current or not expected or current != expected:
        return False, "process-start-identity-mismatch-or-unavailable"
    pgid = task.get("pgid")
    if pgid is None:
        return False, "missing-process-group"
    pgid = int(pgid)
    try:
        current_pgid = os.getpgid(pid)
    except ProcessLookupError:
        return True, "already-gone"
    if current_pgid != pgid:
        return False, "registered-process-group-mismatch"
    if pgid <= 1 or pgid == os.getpgrp():
        return False, "unsafe-process-group"
    return True, "verified"


def group_alive(pgid: int) -> bool:
    try:
        os.killpg(pgid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--policy", type=pathlib.Path, default=pathlib.Path("config/policy.json"))
    ap.add_argument("--task-id", required=True)
    ap.add_argument("--execute", action="store_true")
    ap.add_argument("--allow-force", action="store_true")
    args = ap.parse_args()

    if os.name != "posix" or not pathlib.Path("/proc").exists():
        print(json.dumps({"ok": False, "reason": "this reference adapter requires POSIX with /proc"}))
        return 4

    policy = load(args.policy)
    reg = load(pathlib.Path(policy["registry_path"]))
    task = reg.get("tasks", {}).get(args.task_id)
    if not task:
        print(json.dumps({"ok": False, "reason": "unknown-task"}))
        return 2

    ok, reason = verify(task)
    pgid = task.get("pgid")
    result = {"task_id": args.task_id, "verified": ok, "reason": reason, "pgid": pgid, "execute": args.execute}
    if not ok:
        print(json.dumps(result, sort_keys=True))
        return 3
    if reason == "already-gone":
        result["ok"] = True
        print(json.dumps(result, sort_keys=True))
        return 0
    if not args.execute:
        result.update({"ok": True, "action": "dry-run", "would_signal": "SIGTERM"})
        print(json.dumps(result, sort_keys=True))
        return 0

    # Re-verify immediately before destructive action.
    ok, reason = verify(task)
    if not ok or reason != "verified":
        print(json.dumps({**result, "ok": False, "reason": "pre-signal-recheck-failed"}, sort_keys=True))
        return 3

    pgid = int(pgid)
    os.killpg(pgid, signal.SIGTERM)
    deadline = time.monotonic() + float(policy.get("graceful_cancel_seconds", 10))
    while time.monotonic() < deadline and group_alive(pgid):
        time.sleep(0.1)
    if not group_alive(pgid):
        print(json.dumps({**result, "ok": True, "action": "SIGTERM", "remaining": 0}, sort_keys=True))
        return 0

    can_force = bool(policy.get("allow_force_kill", False)) and args.allow_force
    if not can_force:
        print(json.dumps({**result, "ok": False, "action": "SIGTERM", "reason": "survivors-remain-force-disabled"}, sort_keys=True))
        return 5

    # Re-verify task leader identity before escalation. If leader disappeared while
    # descendants remain, this reference adapter stops rather than guessing ownership.
    ok, reason = verify(task)
    if not ok or reason != "verified":
        print(json.dumps({**result, "ok": False, "reason": "force-recheck-failed"}, sort_keys=True))
        return 6
    os.killpg(pgid, signal.SIGKILL)
    deadline = time.monotonic() + float(policy.get("force_cancel_seconds", 5))
    while time.monotonic() < deadline and group_alive(pgid):
        time.sleep(0.1)
    remaining = int(group_alive(pgid))
    print(json.dumps({**result, "ok": remaining == 0, "action": "SIGKILL", "remaining": remaining}, sort_keys=True))
    return 0 if remaining == 0 else 7


if __name__ == "__main__":
    raise SystemExit(main())
