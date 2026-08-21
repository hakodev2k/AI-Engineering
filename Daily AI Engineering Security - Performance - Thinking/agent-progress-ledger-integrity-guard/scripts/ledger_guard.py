#!/usr/bin/env python3
"""Validate and reconcile an append-only AI-agent progress ledger.

Exit codes:
  0 = valid / completion gate passed
  2 = policy violation or incomplete work
  3 = invalid input/policy
  4 = I/O error
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read JSON {path}: {exc}") from exc


def canonical_tasks(tasks: list[dict[str, Any]]) -> bytes:
    return json.dumps(tasks, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def baseline_hash(tasks: list[dict[str, Any]]) -> str:
    return hashlib.sha256(canonical_tasks(tasks)).hexdigest()


def validate(ledger: dict[str, Any], policy: dict[str, Any]) -> tuple[list[str], dict[str, str]]:
    errors: list[str] = []
    baseline = ledger.get("baseline")
    events = ledger.get("events")
    if not isinstance(baseline, dict) or not isinstance(events, list):
        return ["ledger requires baseline object and events array"], {}

    tasks = baseline.get("tasks")
    stored_hash = baseline.get("sha256")
    if not isinstance(tasks, list) or not isinstance(stored_hash, str):
        return ["baseline requires tasks array and sha256"], {}

    ids: set[str] = set()
    task_map: dict[str, dict[str, Any]] = {}
    for task in tasks:
        if not isinstance(task, dict) or not isinstance(task.get("id"), str):
            errors.append("every baseline task requires string id")
            continue
        tid = task["id"]
        if tid in ids:
            errors.append(f"duplicate baseline task id: {tid}")
        ids.add(tid)
        task_map[tid] = task

    if policy.get("require_baseline_hash_match", True):
        actual = baseline_hash(tasks)
        if stored_hash != actual:
            errors.append(f"baseline hash mismatch: stored={stored_hash} actual={actual}")

    allowed = policy.get("allowed_transitions", {})
    states: dict[str, str] = {tid: "pending" for tid in ids}
    expected_seq = 1
    for event in events:
        if not isinstance(event, dict):
            errors.append(f"event {expected_seq} is not an object")
            expected_seq += 1
            continue
        seq = event.get("seq")
        tid = event.get("task_id")
        old = event.get("from")
        new = event.get("to")
        if seq != expected_seq:
            errors.append(f"event sequence mismatch: expected {expected_seq}, got {seq}")
        expected_seq += 1
        if tid not in ids:
            errors.append(f"event references unknown task: {tid}")
            continue
        current = states[tid]
        if old != current:
            errors.append(f"{tid}: event from={old!r} does not match current={current!r}")
            continue
        allowed_targets = allowed.get(current, [])
        if new not in allowed_targets:
            errors.append(f"{tid}: illegal transition {current} -> {new}")
            continue
        if new == "completed" and policy.get("require_evidence_for_completed", True):
            evidence = event.get("evidence")
            if not isinstance(evidence, list) or not any(str(x).strip() for x in evidence):
                errors.append(f"{tid}: completion requires non-empty evidence references")
                continue
        if new == "cancelled" and task_map[tid].get("mandatory", False) and policy.get("require_human_approval_for_mandatory_cancel", True):
            if not str(event.get("approval", "")).strip():
                errors.append(f"{tid}: mandatory cancellation requires approval reference")
                continue
        states[tid] = new

    return errors, states


def gate(ledger: dict[str, Any], policy: dict[str, Any]) -> tuple[list[str], dict[str, str]]:
    errors, states = validate(ledger, policy)
    if errors:
        return errors, states
    task_map = {t["id"]: t for t in ledger["baseline"]["tasks"]}
    blocking: list[str] = []
    for tid, state in states.items():
        if task_map[tid].get("mandatory", False) and state not in set(policy.get("terminal_states", ["completed", "cancelled"])):
            blocking.append(f"{tid}: mandatory task remains {state}")
    if ledger.get("risk") == "high" and policy.get("high_risk_requires_independent_verifier", True):
        verifier = str(ledger.get("verifier", "")).strip()
        if not verifier:
            blocking.append("high-risk run requires independent verifier")
    return blocking, states


def cmd_hash(args: argparse.Namespace) -> int:
    data = load_json(args.tasks)
    tasks = data.get("tasks") if isinstance(data, dict) else data
    if not isinstance(tasks, list):
        print("input must be task array or {tasks:[...]}", file=sys.stderr)
        return 3
    print(baseline_hash(tasks))
    return 0


def cmd_validate(args: argparse.Namespace, do_gate: bool) -> int:
    ledger = load_json(args.ledger)
    policy = load_json(args.policy)
    if not isinstance(ledger, dict) or not isinstance(policy, dict):
        print("ledger and policy must be JSON objects", file=sys.stderr)
        return 3
    problems, states = gate(ledger, policy) if do_gate else validate(ledger, policy)
    report = {"ok": not problems, "problems": problems, "states": states}
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0 if not problems else 2


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    hp = sub.add_parser("hash", help="compute canonical baseline SHA-256")
    hp.add_argument("--tasks", required=True)
    for name in ("validate", "gate"):
        p = sub.add_parser(name)
        p.add_argument("--ledger", required=True)
        p.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        if args.command == "hash":
            return cmd_hash(args)
        return cmd_validate(args, args.command == "gate")
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
