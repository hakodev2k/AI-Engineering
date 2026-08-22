#!/usr/bin/env python3
"""Deterministic lifecycle join checker for multi-agent orchestration.

Exit codes:
  0: validation/check passed
  2: structural/input error
  3: stale active required task detected
  4: join blocked by unresolved/failed/unverified required descendant
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ACTIVE = {"planned", "dispatched", "running"}
TERMINAL = {"succeeded", "failed", "cancelled", "timed_out", "resource_exhausted", "orphaned"}
ALLOWED = ACTIVE | TERMINAL


def load_json(path: str) -> dict[str, Any]:
    p = Path(path)
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {p}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {p}: {exc}")
    if not isinstance(data, dict):
        raise ValueError(f"top-level JSON must be an object: {p}")
    return data


def parse_time(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        v = value.replace("Z", "+00:00")
        dt = datetime.fromisoformat(v)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except ValueError:
        return None


def tasks_by_id(ledger: dict[str, Any]) -> dict[str, dict[str, Any]]:
    tasks = ledger.get("tasks")
    if not isinstance(tasks, list):
        raise ValueError("ledger.tasks must be an array")
    result: dict[str, dict[str, Any]] = {}
    for i, task in enumerate(tasks):
        if not isinstance(task, dict):
            raise ValueError(f"tasks[{i}] must be an object")
        tid = task.get("task_id")
        if not isinstance(tid, str) or not tid.strip():
            raise ValueError(f"tasks[{i}].task_id must be a non-empty string")
        if tid in result:
            raise ValueError(f"duplicate task_id: {tid}")
        result[tid] = task
    return result


def validate(ledger: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    try:
        tasks = tasks_by_id(ledger)
    except ValueError as exc:
        return [str(exc)]
    for tid, task in tasks.items():
        state = task.get("state")
        if state not in ALLOWED:
            errors.append(f"{tid}: invalid state {state!r}")
        parent = task.get("parent_id")
        if parent is not None and parent not in tasks:
            errors.append(f"{tid}: parent_id {parent!r} not found")
        required = task.get("required")
        if not isinstance(required, bool):
            errors.append(f"{tid}: required must be boolean")
        expected = task.get("expected_outputs", [])
        if required is True and (not isinstance(expected, list) or not expected):
            errors.append(f"{tid}: required task needs non-empty expected_outputs")
        attempts = task.get("attempts", [])
        if not isinstance(attempts, list):
            errors.append(f"{tid}: attempts must be an array")
        if state in TERMINAL and not task.get("terminal_reason"):
            errors.append(f"{tid}: terminal state requires terminal_reason")
        if state == "succeeded" and not task.get("handoff"):
            errors.append(f"{tid}: succeeded task requires handoff path")
    # Cycle detection on parent links.
    for tid in tasks:
        seen: set[str] = set()
        cur: str | None = tid
        while cur is not None:
            if cur in seen:
                errors.append(f"parent cycle detected involving {cur}")
                break
            seen.add(cur)
            parent = tasks[cur].get("parent_id") if cur in tasks else None
            cur = parent if isinstance(parent, str) else None
    return sorted(set(errors))


def descendant_ids(tasks: dict[str, dict[str, Any]], parent_id: str) -> set[str]:
    if parent_id not in tasks:
        raise ValueError(f"parent task not found: {parent_id}")
    descendants: set[str] = set()
    changed = True
    while changed:
        changed = False
        for tid, task in tasks.items():
            parent = task.get("parent_id")
            if parent == parent_id or parent in descendants:
                if tid not in descendants:
                    descendants.add(tid)
                    changed = True
    return descendants


def load_verification(task: dict[str, Any], ledger_path: str) -> tuple[bool, str]:
    vref = task.get("verification")
    if not isinstance(vref, str) or not vref:
        return False, "missing verification reference"
    base = Path(ledger_path).resolve().parent
    vp = Path(vref)
    if not vp.is_absolute():
        vp = (base / vp).resolve()
    try:
        data = json.loads(vp.read_text(encoding="utf-8"))
    except Exception as exc:
        return False, f"cannot read verification {vref}: {exc}"
    if data.get("task_id") != task.get("task_id"):
        return False, "verification task_id mismatch"
    if data.get("verdict") != "pass":
        return False, f"verification verdict is {data.get('verdict')!r}"
    verifier = data.get("verifier_id")
    implementer = task.get("owner")
    if verifier and implementer and verifier == implementer:
        return False, "verifier must differ from implementing owner"
    checks = data.get("checks")
    if not isinstance(checks, list) or not checks:
        return False, "verification needs non-empty checks"
    return True, "verified"


def task_blockers(task: dict[str, Any], ledger_path: str) -> list[str]:
    tid = task["task_id"]
    state = task.get("state")
    blockers: list[str] = []
    if state in ACTIVE:
        blockers.append(f"{tid}: required descendant still {state}")
    elif state != "succeeded":
        blockers.append(f"{tid}: required descendant terminal state {state}")
    else:
        handoff = task.get("handoff")
        if not handoff:
            blockers.append(f"{tid}: missing handoff")
        ok, why = load_verification(task, ledger_path)
        if not ok:
            blockers.append(f"{tid}: {why}")
    return blockers


def cmd_validate(args: argparse.Namespace) -> int:
    try:
        ledger = load_json(args.ledger)
        errors = validate(ledger)
    except ValueError as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 2
    if errors:
        print("INVALID")
        for error in errors:
            print(f"- {error}")
        return 2
    print("VALID")
    return 0


def cmd_check(args: argparse.Namespace) -> int:
    try:
        ledger = load_json(args.ledger)
        errors = validate(ledger)
        if errors:
            for e in errors:
                print(f"STRUCTURE: {e}")
            return 2
        tasks = tasks_by_id(ledger)
        descendants = descendant_ids(tasks, args.parent_id)
    except ValueError as exc:
        print(f"STRUCTURE: {exc}", file=sys.stderr)
        return 2
    blockers: list[str] = []
    required = [tasks[tid] for tid in sorted(descendants) if tasks[tid].get("required") is True]
    for task in required:
        blockers.extend(task_blockers(task, args.ledger))
    if blockers:
        print("BLOCKED")
        for blocker in blockers:
            print(f"- {blocker}")
        return 4
    print(f"PASS required_descendants={len(required)}")
    return 0


def cmd_check_task(args: argparse.Namespace) -> int:
    try:
        ledger = load_json(args.ledger)
        errors = validate(ledger)
        if errors:
            for e in errors:
                print(f"STRUCTURE: {e}")
            return 2
        tasks = tasks_by_id(ledger)
        task = tasks.get(args.task_id)
        if task is None:
            raise ValueError(f"task not found: {args.task_id}")
    except ValueError as exc:
        print(f"STRUCTURE: {exc}", file=sys.stderr)
        return 2
    if task.get("required") is True:
        blockers = task_blockers(task, args.ledger)
        if blockers:
            for b in blockers:
                print(f"BLOCKED: {b}")
            return 4
    print(f"OK task={args.task_id} state={task.get('state')}")
    return 0


def cmd_stale(args: argparse.Namespace) -> int:
    try:
        ledger = load_json(args.ledger)
        policy = load_json(args.policy)
        errors = validate(ledger)
        if errors:
            for e in errors:
                print(f"STRUCTURE: {e}")
            return 2
        tasks = tasks_by_id(ledger)
        threshold = int(policy.get("stale_timeout_seconds", 300))
    except (ValueError, TypeError) as exc:
        print(f"STRUCTURE: {exc}", file=sys.stderr)
        return 2
    now = datetime.now(timezone.utc)
    stale: list[tuple[str, int]] = []
    for tid, task in tasks.items():
        if task.get("required") is not True or task.get("state") not in {"dispatched", "running"}:
            continue
        heartbeat = parse_time(task.get("last_heartbeat_at") or task.get("dispatched_at"))
        if heartbeat is None:
            stale.append((tid, threshold + 1))
            continue
        age = int((now - heartbeat).total_seconds())
        if age > threshold:
            stale.append((tid, age))
    if stale:
        print("STALE")
        for tid, age in stale:
            print(f"- {tid}: age_seconds={age}")
        return 3
    print("FRESH")
    return 0


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Validate and enforce subagent lifecycle joins")
    sub = p.add_subparsers(dest="command", required=True)

    v = sub.add_parser("validate-ledger")
    v.add_argument("--ledger", required=True)
    v.set_defaults(func=cmd_validate)

    c = sub.add_parser("check")
    c.add_argument("--ledger", required=True)
    c.add_argument("--parent-id", required=True)
    c.add_argument("--policy", required=False)
    c.set_defaults(func=cmd_check)

    t = sub.add_parser("check-task")
    t.add_argument("--ledger", required=True)
    t.add_argument("--task-id", required=True)
    t.set_defaults(func=cmd_check_task)

    s = sub.add_parser("stale")
    s.add_argument("--ledger", required=True)
    s.add_argument("--policy", required=True)
    s.set_defaults(func=cmd_stale)
    return p


def main() -> int:
    args = parser().parse_args()
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())
