#!/usr/bin/env python3
"""Deterministically reconcile subagent lifecycle evidence.

Input JSON must contain either one object or {"children": [...]}.
The script never contacts a service or mutates agent state.

Exit codes:
  0: all records reconciled without blocking conflict
  2: blocking lifecycle conflict detected
  3: invalid input or policy
  4: I/O error
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class Policy:
    terminal: set[str]
    active: set[str]
    precedence: list[str]
    max_stale_seconds: int
    require_new_execution: bool
    fail_closed: bool


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def load_policy(path: Path) -> Policy:
    raw = load_json(path)
    try:
        return Policy(
            terminal=set(raw["terminal_states"]),
            active=set(raw["active_states"]),
            precedence=list(raw["evidence_precedence"]),
            max_stale_seconds=int(raw["max_stale_active_seconds"]),
            require_new_execution=bool(raw["require_new_execution_id_for_terminal_to_active"]),
            fail_closed=bool(raw["fail_closed_on_conflict_without_authoritative_evidence"]),
        )
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError(f"invalid policy: {exc}") from exc


def norm(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip().lower().replace("-", "_").replace(" ", "_")
    return text or None


def parse_time(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        text = str(value).replace("Z", "+00:00")
        dt = datetime.fromisoformat(text)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except ValueError:
        return None


def reconcile(record: dict[str, Any], policy: Policy, now: datetime) -> dict[str, Any]:
    child_id = str(record.get("child_id") or record.get("id") or "unknown")
    execution_id = str(record.get("execution_id") or "")
    previous_execution_id = str(record.get("previous_execution_id") or execution_id)
    evidence_raw = record.get("evidence") or {}
    if not isinstance(evidence_raw, dict):
        raise ValueError(f"{child_id}: evidence must be an object")

    evidence = {key: norm(evidence_raw.get(key)) for key in policy.precedence}
    present = [(key, state) for key, state in evidence.items() if state]
    selected_source = None
    selected_state = None
    for source in policy.precedence:
        state = evidence.get(source)
        if state:
            selected_source, selected_state = source, state
            break

    terminal_evidence = [(k, v) for k, v in present if v in policy.terminal]
    active_evidence = [(k, v) for k, v in present if v in policy.active]
    conflicts: list[str] = []

    if terminal_evidence and active_evidence:
        conflicts.append("terminal_and_active_evidence_disagree")

    previous_state = norm(record.get("previous_reconciled_state"))
    if previous_state in policy.terminal and selected_state in policy.active:
        same_execution = not execution_id or execution_id == previous_execution_id
        if policy.require_new_execution and same_execution:
            conflicts.append("terminal_to_active_resurrection_without_new_execution")

    stale_seconds = None
    observed_at = parse_time(record.get("observed_at"))
    if selected_state in policy.active and observed_at:
        stale_seconds = max(0, int((now - observed_at).total_seconds()))
        if stale_seconds > policy.max_stale_seconds:
            conflicts.append("active_state_exceeds_staleness_budget")

    authoritative = selected_source in {
        "terminal_event", "task_complete_event", "authoritative_registry"
    }
    blocking = bool(conflicts and (policy.fail_closed or not authoritative))

    if selected_state in policy.terminal:
        decision = "consume_result_or_finalize_child"
    elif blocking:
        decision = "reconcile_before_orchestration"
    elif selected_state in policy.active:
        decision = "bounded_wait"
    elif selected_state:
        decision = "review_unknown_state"
    else:
        decision = "query_authoritative_registry"

    return {
        "child_id": child_id,
        "execution_id": execution_id or None,
        "reconciled_state": selected_state or "unknown",
        "selected_source": selected_source,
        "authoritative": authoritative,
        "conflicts": conflicts,
        "blocking": blocking,
        "stale_seconds": stale_seconds,
        "decision": decision,
        "evidence_present": [{"source": k, "state": v} for k, v in present],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        policy = load_policy(args.policy)
        raw = load_json(args.input)
        children = raw.get("children") if isinstance(raw, dict) and "children" in raw else [raw]
        if not isinstance(children, list) or not all(isinstance(x, dict) for x in children):
            raise ValueError("input must be an object or {children:[objects]}")
        now = datetime.now(timezone.utc)
        results = [reconcile(item, policy, now) for item in children]
        payload = {
            "generated_at": now.isoformat(),
            "children": results,
            "blocking_conflicts": sum(1 for x in results if x["blocking"]),
        }
        text = json.dumps(payload, indent=2, sort_keys=True) + "\n"
        if args.output:
            args.output.write_text(text, encoding="utf-8")
        else:
            sys.stdout.write(text)
        return 2 if payload["blocking_conflicts"] else 0
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 3
    except OSError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
