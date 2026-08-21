#!/usr/bin/env python3
"""Bound polling for long-running agent commands.

Input JSON fields:
process_id, status, terminal_event_seen, progress_event_seen, poll_count,
no_progress_polls, last_wait_seconds, estimated_input_tokens_per_poll,
accumulated_wait_tokens, deliverable_complete.

Exit 0: allowed deterministic action, 2: invalid state/config, 3: strict budget block.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def number(data: dict, key: str, default: float = 0) -> float:
    value = data.get(key, default)
    if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{key} must be a non-negative number")
    return float(value)


def boolean(data: dict, key: str) -> bool:
    value = data.get(key, False)
    if not isinstance(value, bool):
        raise ValueError(f"{key} must be boolean")
    return value


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        state, policy = load(args.input), load(args.policy)
        process_id = state.get("process_id")
        status = state.get("status")
        if not isinstance(process_id, str) or not process_id.strip():
            raise ValueError("process_id must be non-empty string")
        if not isinstance(status, str) or not status.strip():
            raise ValueError("status must be non-empty string")
        terminal = boolean(state, "terminal_event_seen") or status in {"completed", "failed", "cancelled", "exited"}
        progress = boolean(state, "progress_event_seen")
        deliverable_complete = boolean(state, "deliverable_complete")
        polls = int(number(state, "poll_count"))
        no_progress = int(number(state, "no_progress_polls"))
        last_wait = number(state, "last_wait_seconds")
        per_poll_tokens = number(state, "estimated_input_tokens_per_poll")
        accumulated = number(state, "accumulated_wait_tokens")

        if terminal:
            result = {"decision": "collect_result", "process_id": process_id, "next_wait_seconds": 0, "reasons": ["terminal state observed"]}
            print(json.dumps(result, indent=2)); return 0

        max_polls = int(policy.get("max_poll_count", 12))
        if deliverable_complete:
            max_polls = min(max_polls, int(policy.get("post_deliverable_max_polls", 2)))
        max_no_progress = int(policy.get("max_no_progress_polls", 5))
        max_tokens = float(policy.get("max_estimated_wait_tokens", 500000))
        projected = accumulated + per_poll_tokens
        reasons = []
        blocked = False
        if polls >= max_polls:
            blocked = True; reasons.append("poll count budget exhausted")
        if no_progress >= max_no_progress:
            blocked = True; reasons.append("no-progress budget exhausted")
        if projected > max_tokens:
            blocked = True; reasons.append("estimated wait-token budget exhausted")
        if blocked:
            result = {
                "decision": "reconcile_or_escalate",
                "process_id": process_id,
                "next_wait_seconds": 0,
                "projected_wait_tokens": projected,
                "reasons": reasons,
            }
            print(json.dumps(result, indent=2))
            return 3 if args.strict else 0

        base = float(policy.get("initial_wait_seconds", 10))
        multiplier = float(policy.get("backoff_multiplier", 2.0))
        cap = float(policy.get("max_wait_seconds", 120))
        if base <= 0 or multiplier < 1 or cap < base:
            raise ValueError("invalid wait backoff policy")
        if progress:
            next_wait = base
            decision = "resume_model"
            reasons.append("meaningful progress observed")
        else:
            next_wait = min(cap, base if last_wait <= 0 else max(base, last_wait * multiplier))
            decision = "wait_runtime"
            reasons.append("no terminal event; deterministic backoff allowed")
        result = {
            "decision": decision,
            "process_id": process_id,
            "next_wait_seconds": round(next_wait, 3),
            "poll_count": polls,
            "no_progress_polls": no_progress,
            "projected_wait_tokens": projected,
            "reasons": reasons,
        }
        print(json.dumps(result, indent=2))
        return 0
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
