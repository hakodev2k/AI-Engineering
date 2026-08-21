#!/usr/bin/env python3
"""Deterministic turn-state freshness validator.

Exit codes:
0 valid/success
2 invalid input/configuration
3 stale or missing ownership detected
4 I/O error
"""

from __future__ import annotations

import argparse
import json
import sys
import uuid
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple


def load_json(path: str) -> Dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, UnicodeError) as exc:
        raise IOError(str(exc)) from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def save_json(path: str, data: Dict[str, Any]) -> None:
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def owner_of(value: Any) -> str | None:
    if not isinstance(value, dict):
        return None
    owner = value.get("owner_turn_id")
    return owner if isinstance(owner, str) and owner else None


def iter_evidence(value: Any) -> Iterable[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def validate_state(state: Dict[str, Any], policy: Dict[str, Any]) -> Tuple[bool, List[Dict[str, Any]]]:
    violations: List[Dict[str, Any]] = []
    active_turn = state.get("active_turn_id") or state.get("turn_id")
    if not isinstance(active_turn, str) or not active_turn:
        violations.append({"code": "missing_active_turn_id", "field": "active_turn_id"})
        return False, violations

    for required in policy.get("required_identity_fields", []):
        if required == "turn_id":
            value = active_turn
        else:
            value = state.get(required)
        if not isinstance(value, str) or not value:
            violations.append({"code": "missing_identity", "field": required})

    require_owner = bool(policy.get("require_owner_turn_id", True))
    reject_foreign_terminal = bool(policy.get("reject_foreign_turn_terminal_state", True))

    for field in policy.get("turn_scoped_terminal_fields", []):
        if field not in state or state[field] is None:
            continue
        owner = owner_of(state[field])
        if require_owner and owner is None:
            violations.append({"code": "terminal_missing_owner", "field": field})
        elif reject_foreign_terminal and owner != active_turn:
            violations.append({
                "code": "stale_terminal_state",
                "field": field,
                "owner_turn_id": owner,
                "active_turn_id": active_turn,
            })

    if bool(policy.get("reject_foreign_turn_evidence_at_finalize", True)):
        for field in policy.get("turn_scoped_evidence_fields", []):
            if field not in state or state[field] is None:
                continue
            for index, item in enumerate(iter_evidence(state[field])):
                owner = owner_of(item)
                if require_owner and owner is None:
                    violations.append({
                        "code": "evidence_missing_owner",
                        "field": field,
                        "index": index,
                    })
                elif owner != active_turn:
                    violations.append({
                        "code": "foreign_turn_evidence",
                        "field": field,
                        "index": index,
                        "owner_turn_id": owner,
                        "active_turn_id": active_turn,
                    })

    return len(violations) == 0, violations


def init_turn(state: Dict[str, Any], policy: Dict[str, Any], turn_id: str | None) -> Dict[str, Any]:
    result = deepcopy(state)
    new_turn = turn_id or str(uuid.uuid4())
    if not new_turn.strip():
        raise ValueError("turn_id must not be empty")

    result["active_turn_id"] = new_turn
    result["turn_id"] = new_turn

    if bool(policy.get("invalidate_terminal_fields_on_new_turn", True)):
        for field in policy.get("turn_scoped_terminal_fields", []):
            result[field] = None

    result["turn_freshness"] = {
        "owner_turn_id": new_turn,
        "status": "initialized",
        "previous_revision": state.get("state_revision"),
    }
    return result


def stamp(value: Any, turn_id: str, revision: Any = None) -> Dict[str, Any]:
    if not turn_id:
        raise ValueError("turn_id is required")
    wrapped: Dict[str, Any] = {"owner_turn_id": turn_id, "value": value}
    if revision is not None:
        wrapped["produced_at_revision"] = revision
    return wrapped


def cmd_validate(args: argparse.Namespace) -> int:
    state = load_json(args.state)
    policy = load_json(args.policy)
    valid, violations = validate_state(state, policy)
    print(json.dumps({"valid": valid, "violations": violations}, indent=2, sort_keys=True))
    return 0 if valid else 3


def cmd_init(args: argparse.Namespace) -> int:
    state = load_json(args.state)
    policy = load_json(args.policy)
    result = init_turn(state, policy, args.turn_id)
    if args.output:
        save_json(args.output, result)
    else:
        print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def cmd_stamp(args: argparse.Namespace) -> int:
    try:
        value = json.loads(args.value)
    except json.JSONDecodeError as exc:
        raise ValueError(f"--value must be valid JSON: {exc}") from exc
    result = stamp(value, args.turn_id, args.revision)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Turn-state freshness contract helper")
    sub = parser.add_subparsers(dest="command", required=True)

    validate = sub.add_parser("validate-state", help="validate finalization state ownership")
    validate.add_argument("--state", required=True)
    validate.add_argument("--policy", required=True)
    validate.set_defaults(func=cmd_validate)

    init = sub.add_parser("init", help="initialize a new turn and invalidate terminal state")
    init.add_argument("--state", required=True)
    init.add_argument("--policy", required=True)
    init.add_argument("--turn-id")
    init.add_argument("--output")
    init.set_defaults(func=cmd_init)

    stamp_cmd = sub.add_parser("stamp", help="wrap evidence/terminal value with turn ownership")
    stamp_cmd.add_argument("--turn-id", required=True)
    stamp_cmd.add_argument("--value", required=True)
    stamp_cmd.add_argument("--revision")
    stamp_cmd.set_defaults(func=cmd_stamp)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        return int(args.func(args))
    except ValueError as exc:
        print(f"input error: {exc}", file=sys.stderr)
        return 2
    except IOError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
