#!/usr/bin/env python3
"""Validate approval-state transitions. Read-only; does not execute approvals.
Exit: 0 allowed, 2 policy violation, 3 invalid input/environment.
"""
from __future__ import annotations
import argparse, json, sys, time
from pathlib import Path

TERMINAL = {"allow", "deny", "cancelled"}
NONTERMINAL = {"pending", "observed", "deferred", "claimed"}
ALL = TERMINAL | NONTERMINAL


def load(path: str) -> dict:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("JSON root must be object")
    return data


def fail(reason: str, code: int = 2) -> int:
    print(json.dumps({"status": "blocked", "reason": reason}, sort_keys=True))
    return code


def validate(state: dict, tr: dict) -> tuple[bool, str]:
    cur = state.get("status", "pending")
    nxt = tr.get("status")
    if cur not in ALL or nxt not in ALL:
        return False, "unknown status"
    if cur in TERMINAL:
        return False, "request already terminal"
    request_id = state.get("request_id")
    if not request_id or tr.get("request_id") != request_id:
        return False, "request_id mismatch"
    risk = state.get("risk", "unknown")
    reviewer = state.get("effective_reviewer")
    owner = tr.get("owner")
    now = int(tr.get("now_epoch", time.time()))

    if nxt == "claimed":
        if owner != "external":
            return False, "claim owner must be external"
        if reviewer not in ("external", None, "unknown"):
            return False, "external claim conflicts with effective reviewer"
        expiry = tr.get("lease_expires_epoch")
        if not isinstance(expiry, int) or expiry <= now:
            return False, "claim requires future lease expiry"
        if expiry - now > int(state.get("max_external_lease_seconds", 300)):
            return False, "claim lease exceeds policy"
        if reviewer in (None, "unknown") and risk in {"high", "critical"}:
            return False, "unknown reviewer cannot be externally claimed for high risk"

    if nxt in {"allow", "deny"}:
        if not owner:
            return False, "terminal decision requires owner"
        configured = state.get("decision_owner") or reviewer
        if configured not in (None, "unknown") and owner != configured:
            return False, "terminal owner does not match configured reviewer"
        if risk == "critical" and owner not in {"user", "security"}:
            return False, "critical action requires human/security owner"

    if nxt == "cancelled" and not tr.get("reason"):
        return False, "cancellation requires reason"

    return True, "transition allowed"


def main() -> int:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    v = sub.add_parser("validate")
    v.add_argument("--state", required=True)
    v.add_argument("--transition", required=True)
    args = p.parse_args()
    try:
        state, tr = load(args.state), load(args.transition)
        ok, reason = validate(state, tr)
        if not ok:
            return fail(reason)
        print(json.dumps({"status": "allowed", "reason": reason}, sort_keys=True))
        return 0
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        return fail(str(exc), 3)

if __name__ == "__main__":
    sys.exit(main())
