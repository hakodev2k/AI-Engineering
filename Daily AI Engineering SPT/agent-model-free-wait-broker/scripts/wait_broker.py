#!/usr/bin/env python3
import argparse, json, sys, time
from pathlib import Path

TERMINAL = {"completed", "failed", "cancelled"}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def validate_target(target_id, policy, state):
    if policy.get("require_target_id", True) and not target_id:
        raise ValueError("target_id is required")
    reject = {str(x).lower() for x in policy.get("reject_targets", [])}
    if str(target_id).lower() in reject:
        raise ValueError(f"invalid wait target: {target_id!r}")
    if not isinstance(state, dict):
        raise ValueError("state must be a JSON object")
    if "status" not in state:
        raise ValueError("state.status is required")


def fingerprint(state):
    stable = {k: state.get(k) for k in ("status", "progress", "version", "updated_at")}
    return json.dumps(stable, sort_keys=True, separators=(",", ":"))


def material_progress(prev, cur, threshold):
    try:
        a = float(prev.get("progress", 0) or 0)
        b = float(cur.get("progress", 0) or 0)
        return b - a >= threshold
    except (TypeError, ValueError):
        return False


def emit_event(path, event):
    if path:
        with open(path, "a", encoding="utf-8") as f:
            f.write(json.dumps(event, sort_keys=True) + "\n")
    print(json.dumps(event, sort_keys=True))


def cmd_validate(args):
    policy = load_json(args.policy)
    state = load_json(args.state_file)
    validate_target(args.target_id, policy, state)
    print(json.dumps({"ok": True, "target_id": args.target_id, "status": state["status"]}))
    return 0


def cmd_wait(args):
    policy = load_json(args.policy)
    state_path = Path(args.state_file)
    state = load_json(state_path)
    validate_target(args.target_id, policy, state)
    start = time.monotonic()
    prev = state
    prev_fp = fingerprint(prev)
    if prev.get("status") in TERMINAL:
        emit_event(args.events_out, {"target_id": args.target_id, "wake_reason": prev["status"], "elapsed_seconds": 0.0, "state": prev})
        return 0

    interval = float(policy.get("initial_poll_seconds", 5))
    max_interval = float(policy.get("max_poll_seconds", 60))
    multiplier = float(policy.get("backoff_multiplier", 1.8))
    max_wait = float(policy.get("max_wait_seconds", 3600))
    max_unchanged = int(policy.get("max_unchanged_polls", 120))
    threshold = float(policy.get("material_progress_delta", 0.05))
    unchanged = 0
    polls = 0

    while True:
        elapsed = time.monotonic() - start
        if elapsed >= max_wait:
            emit_event(args.events_out, {"target_id": args.target_id, "wake_reason": "deadline", "elapsed_seconds": elapsed, "polls": polls})
            return 0
        time.sleep(min(interval, max(0.0, max_wait - elapsed)))
        polls += 1
        try:
            cur = load_json(state_path)
        except Exception as e:
            if polls >= 3:
                emit_event(args.events_out, {"target_id": args.target_id, "wake_reason": "broker_error", "error": str(e), "polls": polls})
                return 3
            continue
        validate_target(args.target_id, policy, cur)
        cur_fp = fingerprint(cur)
        elapsed = time.monotonic() - start
        if cur.get("status") in TERMINAL:
            emit_event(args.events_out, {"target_id": args.target_id, "wake_reason": cur["status"], "elapsed_seconds": elapsed, "polls": polls, "state": cur})
            return 0
        if material_progress(prev, cur, threshold):
            emit_event(args.events_out, {"target_id": args.target_id, "wake_reason": "material_progress", "elapsed_seconds": elapsed, "polls": polls, "state": cur})
            return 0
        if cur_fp == prev_fp:
            unchanged += 1
            if unchanged >= max_unchanged:
                emit_event(args.events_out, {"target_id": args.target_id, "wake_reason": "deadline", "elapsed_seconds": elapsed, "polls": polls, "reason": "max_unchanged_polls"})
                return 0
            interval = min(max_interval, interval * multiplier)
        else:
            prev, prev_fp, unchanged, interval = cur, cur_fp, 0, float(policy.get("initial_poll_seconds", 5))


def main():
    p = argparse.ArgumentParser(description="Deterministic model-free wait broker")
    sub = p.add_subparsers(dest="cmd", required=True)
    for name in ("validate", "wait"):
        s = sub.add_parser(name)
        s.add_argument("--target-id", required=True)
        s.add_argument("--state-file", required=True)
        s.add_argument("--policy", required=True)
        if name == "wait":
            s.add_argument("--events-out")
    args = p.parse_args()
    try:
        return cmd_validate(args) if args.cmd == "validate" else cmd_wait(args)
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
