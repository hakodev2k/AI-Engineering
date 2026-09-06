#!/usr/bin/env python3
"""Deterministic pre-action feasibility gate for GUI/desktop/browser agents.

The gate consumes observable structured state only. It does not request or
inspect hidden chain-of-thought.

Exit codes:
  0 = PROCEED
  1 = invalid input/runtime error
  2 = STOP
  3 = ESCALATE
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

DECISION_EXIT = {"PROCEED": 0, "STOP": 2, "ESCALATE": 3}
VALID_STATES = {"satisfied", "unsatisfied", "unknown"}
VALID_SEVERITIES = {"blocking", "advisory"}
VALID_CONFLICT_STATUS = {"open", "resolved"}


def emit_error(message: str) -> int:
    print(json.dumps({"decision": "ERROR", "error": message}, indent=2))
    return 1


def require_bool(obj: dict[str, Any], key: str) -> bool:
    value = obj.get(key)
    if not isinstance(value, bool):
        raise ValueError(f"{key} must be boolean")
    return value


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        return emit_error("usage: feasibility_gate.py <feasibility.json>")

    path = Path(argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return emit_error(f"input file not found: {path}")
    except (OSError, json.JSONDecodeError) as exc:
        return emit_error(f"cannot read valid JSON: {exc}")

    if not isinstance(data, dict):
        return emit_error("top-level JSON must be an object")

    try:
        goal = data["goal"]
        if not isinstance(goal, str) or not goal.strip():
            raise ValueError("goal must be a non-empty string")
        constraints = data["constraints"]
        conflicts = data["conflicts"]
        previous_open = data.get("previous_open_conflict_ids", [])
        action = data["proposed_action"]
        evidence_complete = require_bool(data, "evidence_complete")
        if not isinstance(constraints, list):
            raise ValueError("constraints must be a list")
        if not isinstance(conflicts, list):
            raise ValueError("conflicts must be a list")
        if not isinstance(previous_open, list):
            raise ValueError("previous_open_conflict_ids must be a list")
        if not isinstance(action, dict):
            raise ValueError("proposed_action must be an object")
        action_name = action.get("name")
        if not isinstance(action_name, str) or not action_name.strip():
            raise ValueError("proposed_action.name must be a non-empty string")
        consequential = require_bool(action, "consequential")
        irreversible = require_bool(action, "irreversible")
        is_deviation = require_bool(action, "is_deviation")
        deviation_allowed = require_bool(action, "deviation_allowed")
    except (KeyError, ValueError) as exc:
        return emit_error(str(exc))

    stop_reasons: list[dict[str, str]] = []
    escalate_reasons: list[dict[str, str]] = []
    advisory: list[dict[str, str]] = []
    current_conflicts: dict[str, dict[str, Any]] = {}

    for idx, c in enumerate(constraints):
        if not isinstance(c, dict):
            return emit_error(f"constraints[{idx}] must be an object")
        cid = c.get("id")
        state = c.get("state")
        required = c.get("required")
        evidence = c.get("evidence", "")
        if not isinstance(cid, str) or not cid:
            return emit_error(f"constraints[{idx}].id must be a non-empty string")
        if state not in VALID_STATES:
            return emit_error(f"constraints[{idx}].state must be one of {sorted(VALID_STATES)}")
        if not isinstance(required, bool):
            return emit_error(f"constraints[{idx}].required must be boolean")
        if not isinstance(evidence, str):
            return emit_error(f"constraints[{idx}].evidence must be a string")

        if required and state == "unsatisfied":
            stop_reasons.append({"code": "REQUIRED_CONSTRAINT_UNSATISFIED", "id": cid})
        elif required and state == "unknown":
            escalate_reasons.append({"code": "REQUIRED_CONSTRAINT_UNKNOWN", "id": cid})
        elif not required and state == "unsatisfied":
            advisory.append({"code": "OPTIONAL_CONSTRAINT_UNSATISFIED", "id": cid})

    for idx, conflict in enumerate(conflicts):
        if not isinstance(conflict, dict):
            return emit_error(f"conflicts[{idx}] must be an object")
        cid = conflict.get("id")
        severity = conflict.get("severity")
        status = conflict.get("status")
        evidence = conflict.get("evidence", "")
        if not isinstance(cid, str) or not cid:
            return emit_error(f"conflicts[{idx}].id must be a non-empty string")
        if cid in current_conflicts:
            return emit_error(f"duplicate conflict id: {cid}")
        if severity not in VALID_SEVERITIES:
            return emit_error(f"conflicts[{idx}].severity must be one of {sorted(VALID_SEVERITIES)}")
        if status not in VALID_CONFLICT_STATUS:
            return emit_error(f"conflicts[{idx}].status must be one of {sorted(VALID_CONFLICT_STATUS)}")
        if not isinstance(evidence, str):
            return emit_error(f"conflicts[{idx}].evidence must be a string")
        current_conflicts[cid] = conflict
        if status == "open" and severity == "blocking":
            stop_reasons.append({"code": "OPEN_BLOCKING_CONFLICT", "id": cid})
        elif status == "open":
            advisory.append({"code": "OPEN_ADVISORY_CONFLICT", "id": cid})

    # A previously open conflict cannot silently disappear. It must remain open
    # or be carried forward as an explicit resolved record with evidence.
    for raw_id in previous_open:
        cid = str(raw_id)
        record = current_conflicts.get(cid)
        if record is None:
            stop_reasons.append({"code": "CONFLICT_STATE_DROPPED", "id": cid})
        elif record.get("status") == "resolved" and not str(record.get("evidence", "")).strip():
            stop_reasons.append({"code": "CONFLICT_RESOLVED_WITHOUT_EVIDENCE", "id": cid})

    if is_deviation and not deviation_allowed:
        stop_reasons.append({"code": "UNAUTHORIZED_GOAL_DEVIATION", "id": action_name})

    if (consequential or irreversible) and not evidence_complete:
        escalate_reasons.append({"code": "INCOMPLETE_EVIDENCE_FOR_CONSEQUENTIAL_ACTION", "id": action_name})

    # STOP has precedence over ESCALATE because a known contradiction should
    # not be converted into an approval request that could accidentally bypass
    # the user's fixed constraints.
    if stop_reasons:
        decision = "STOP"
    elif escalate_reasons:
        decision = "ESCALATE"
    else:
        decision = "PROCEED"

    output = {
        "decision": decision,
        "goal": goal,
        "proposed_action": action_name,
        "evidence_complete": evidence_complete,
        "stop_reasons": stop_reasons,
        "escalate_reasons": escalate_reasons,
        "advisory": advisory,
        "metrics": {
            "required_constraints": sum(1 for c in constraints if isinstance(c, dict) and c.get("required") is True),
            "open_blocking_conflicts": sum(1 for c in conflicts if isinstance(c, dict) and c.get("status") == "open" and c.get("severity") == "blocking"),
            "previous_open_conflicts": len(previous_open),
        },
    }
    print(json.dumps(output, indent=2, sort_keys=True))
    return DECISION_EXIT[decision]


if __name__ == "__main__":
    sys.exit(main(sys.argv))
