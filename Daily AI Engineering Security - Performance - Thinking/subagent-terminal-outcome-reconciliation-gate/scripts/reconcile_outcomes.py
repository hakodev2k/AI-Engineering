#!/usr/bin/env python3
"""Reconcile parent and child lifecycle evidence into a terminal outcome.

Input JSON example:
{
  "parent_status": "success",
  "children": [
    {"id":"research","required":true,"status":"completed","started":true,
     "terminal_receipt":true,"acceptance_passed":true,"commit_state":"none"}
  ],
  "reconcile_attempt": 0
}

Exit codes: 0 verified_success, 10 partial, 20 reconcile, 30 failed/blocked, 2 invalid.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

VERIFIED = 0
PARTIAL = 10
RECONCILE = 20
FAILED = 30
INVALID = 2


def load_object(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def nonempty_string(value, name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{name} must be a non-empty string")
    return value.strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()

    try:
        run = load_object(args.input)
        policy = load_object(args.policy)
        parent_status = nonempty_string(run.get("parent_status"), "parent_status")
        children = run.get("children")
        if not isinstance(children, list):
            raise ValueError("children must be an array")
        attempt = run.get("reconcile_attempt", 0)
        if not isinstance(attempt, int) or isinstance(attempt, bool) or attempt < 0:
            raise ValueError("reconcile_attempt must be a non-negative integer")

        success_states = set(policy.get("success_states", []))
        failure_states = set(policy.get("failure_states", []))
        interrupted_states = set(policy.get("interrupted_states", []))
        running_states = set(policy.get("running_states", []))
        max_attempts = int(policy.get("max_reconcile_attempts", 2))
        require_start = bool(policy.get("require_start_evidence_for_required_child", True))
        require_terminal = bool(policy.get("require_terminal_receipt_for_required_child", True))
        require_acceptance = bool(policy.get("require_acceptance_evidence_for_success", True))

        required = []
        normalized = []
        seen = set()
        for index, child in enumerate(children):
            if not isinstance(child, dict):
                raise ValueError(f"children[{index}] must be an object")
            cid = nonempty_string(child.get("id"), f"children[{index}].id")
            if cid in seen:
                raise ValueError(f"duplicate child id: {cid}")
            seen.add(cid)
            is_required = child.get("required", True)
            if not isinstance(is_required, bool):
                raise ValueError(f"children[{index}].required must be boolean")
            status = nonempty_string(child.get("status"), f"children[{index}].status")
            started = child.get("started", False)
            terminal_receipt = child.get("terminal_receipt", False)
            acceptance = child.get("acceptance_passed")
            commit_state = child.get("commit_state", "none")
            if not isinstance(started, bool) or not isinstance(terminal_receipt, bool):
                raise ValueError(f"children[{index}] started/terminal_receipt must be boolean")
            if acceptance is not None and not isinstance(acceptance, bool):
                raise ValueError(f"children[{index}].acceptance_passed must be boolean or null")
            if commit_state not in {"none", "committed", "unknown"}:
                raise ValueError(f"children[{index}].commit_state is invalid")
            item = {
                "id": cid, "required": is_required, "status": status,
                "started": started, "terminal_receipt": terminal_receipt,
                "acceptance_passed": acceptance, "commit_state": commit_state
            }
            normalized.append(item)
            if is_required:
                required.append(item)

        if not required:
            raise ValueError("at least one required child is needed for delegated terminal reconciliation")

        reasons = []
        failures = []
        partials = []
        unresolved = []
        satisfied = []

        for child in required:
            cid, status = child["id"], child["status"]
            if require_start and not child["started"]:
                unresolved.append(cid)
                reasons.append(f"required child {cid} has no start evidence")
                continue
            if status in running_states:
                unresolved.append(cid)
                reasons.append(f"required child {cid} is still {status}")
                continue
            if status in failure_states:
                failures.append(cid)
                reasons.append(f"required child {cid} ended in failure state {status}")
                continue
            if status in interrupted_states:
                if child["commit_state"] == "unknown":
                    unresolved.append(cid)
                    reasons.append(f"interrupted child {cid} has unknown commit state")
                    continue
                if child["acceptance_passed"] is True and (not require_terminal or child["terminal_receipt"]):
                    satisfied.append(cid)
                    reasons.append(f"interrupted child {cid} has preserved accepted work")
                else:
                    partials.append(cid)
                    reasons.append(f"interrupted child {cid} has incomplete acceptance evidence")
                continue
            if status not in success_states:
                unresolved.append(cid)
                reasons.append(f"required child {cid} has unrecognized/nonterminal status {status}")
                continue
            if require_terminal and not child["terminal_receipt"]:
                unresolved.append(cid)
                reasons.append(f"required child {cid} lacks terminal receipt")
                continue
            if require_acceptance and child["acceptance_passed"] is not True:
                partials.append(cid)
                reasons.append(f"required child {cid} lacks passing acceptance evidence")
                continue
            satisfied.append(cid)

        if failures:
            decision, code = "failed", FAILED
        elif unresolved:
            if attempt >= max_attempts:
                decision, code = "blocked", FAILED
                reasons.append("reconciliation attempt budget exhausted")
            else:
                decision, code = "reconcile", RECONCILE
        elif partials:
            decision, code = "partial", PARTIAL
        else:
            decision, code = "verified_success", VERIFIED
            if parent_status not in success_states:
                reasons.append(f"objective evidence overrides parent status {parent_status}")

        result = {
            "decision": decision,
            "parent_status": parent_status,
            "required_children": len(required),
            "satisfied_children": satisfied,
            "failed_children": failures,
            "partial_children": partials,
            "unresolved_children": unresolved,
            "reconcile_attempt": attempt,
            "reasons": reasons,
            "verification_status": "evidence_backed" if decision in {"verified_success", "failed"} else "needs_followup"
        }
        print(json.dumps(result, indent=2))
        return code
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
