#!/usr/bin/env python3
"""Evaluate MCP request lifecycle and bounded cancellation recovery.

Input JSON fields:
request_id, state, side_effecting, started_at, last_progress_at, now,
cancel_requested_at (optional), cancel_reason (optional), terminal_seen.

Exit codes: 0 healthy/terminal, 3 cancel or reconcile, 4 quarantine/block, 2 invalid.
"""
from __future__ import annotations
import argparse, json, sys, time
from pathlib import Path

OK, INVALID, RECONCILE, BLOCK = 0, 2, 3, 4


def load(path: Path) -> dict:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain an object")
    return obj


def number(obj: dict, key: str, required: bool = True):
    if key not in obj and not required:
        return None
    value = obj.get(key)
    if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{key} must be a non-negative number")
    return float(value)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    p.add_argument("--policy", type=Path, required=True)
    args = p.parse_args()
    try:
        d, c = load(args.input), load(args.policy)
        rid = d.get("request_id")
        state = d.get("state")
        if not isinstance(rid, str) or not rid:
            raise ValueError("request_id must be non-empty")
        if state not in {"pending", "cancel_requested", "completed", "cancelled", "failed", "unknown"}:
            raise ValueError("invalid state")
        side = d.get("side_effecting")
        terminal_seen = d.get("terminal_seen")
        if not isinstance(side, bool) or not isinstance(terminal_seen, bool):
            raise ValueError("side_effecting and terminal_seen must be boolean")
        started = number(d, "started_at")
        last_progress = number(d, "last_progress_at")
        now = number(d, "now") if "now" in d else time.time()
        if now < started or now < last_progress:
            raise ValueError("now cannot precede start/progress")
        idle = float(c.get("idle_timeout_seconds", 60))
        absolute = float(c.get("absolute_timeout_seconds", 600))
        grace = float(c.get("cancel_grace_seconds", 10))
        if idle <= 0 or absolute <= 0 or grace < 0:
            raise ValueError("timeouts must be positive and grace non-negative")

        decision, code, reasons = "continue", OK, []
        cancel_reason = d.get("cancel_reason")
        cancel_at = number(d, "cancel_requested_at", required=False)

        if terminal_seen or state in set(c.get("terminal_states", [])):
            decision, code = "terminal", OK
            reasons.append("terminal outcome observed")
        elif state == "unknown":
            if side and not c.get("retry_side_effecting_on_unknown", False):
                decision, code = "quarantine", BLOCK
                reasons.append("side-effecting request outcome unknown; automatic retry forbidden")
            else:
                decision, code = "reconcile", RECONCILE
                reasons.append("request outcome unknown")
        elif state == "cancel_requested":
            if cancel_at is None:
                raise ValueError("cancel_requested state requires cancel_requested_at")
            if now - cancel_at >= grace:
                if side and not c.get("retry_side_effecting_on_unknown", False):
                    decision, code = "quarantine", BLOCK
                    reasons.append("cancel grace expired without terminal response for side-effecting request")
                else:
                    decision, code = "reconcile", RECONCILE
                    reasons.append("cancel grace expired without terminal response")
            else:
                decision, code = "await_terminal", OK
                reasons.append("within cancellation grace period")
        else:
            absolute_expired = now - started >= absolute
            idle_expired = now - last_progress >= idle
            if absolute_expired or idle_expired:
                decision, code = "request_cancel", RECONCILE
                cancel_reason = "deadline_timeout" if absolute_expired else "idle_timeout"
                reasons.append("absolute deadline exceeded" if absolute_expired else "idle timeout exceeded")

        known = set(c.get("known_cancel_reasons", []))
        if cancel_reason is not None and cancel_reason not in known:
            reasons.append("unrecognized cancellation reason")

        result = {
            "request_id": rid,
            "decision": decision,
            "state": state,
            "side_effecting": side,
            "cancel_reason": cancel_reason,
            "age_seconds": round(now - started, 3),
            "idle_seconds": round(now - last_progress, 3),
            "reasons": reasons,
        }
        print(json.dumps(result, indent=2))
        return code
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
