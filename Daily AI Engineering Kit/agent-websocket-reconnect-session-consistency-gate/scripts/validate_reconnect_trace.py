#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write(path, data):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def validate(trace, policy):
    errors = []
    events = trace.get("events")
    if not isinstance(events, list):
        return ["events must be an array"]

    connected = False
    ever_connected = False
    reconnects = 0
    last_backoff = None
    active_subscriptions = set()
    expected_resubscribe = set()
    last_sequence = {}
    initial_session = trace.get("initial_session_id")

    for i, event in enumerate(events):
        if not isinstance(event, dict) or "type" not in event:
            errors.append(f"event[{i}] missing type")
            continue
        kind = event["type"]
        if kind == "connected":
            if connected:
                errors.append(f"event[{i}] connected while already connected")
            connected = True
            ever_connected = True
            sid = event.get("session_id")
            if policy.get("require_stable_session_id") and initial_session is not None and sid != initial_session:
                errors.append(f"event[{i}] session_id changed")
        elif kind == "disconnected":
            if not connected:
                errors.append(f"event[{i}] disconnected while not connected")
            connected = False
            expected_resubscribe = set(active_subscriptions)
            active_subscriptions.clear()
        elif kind == "reconnect_attempt":
            if connected:
                errors.append(f"event[{i}] reconnect attempt while connected")
            reconnects += 1
            attempt = event.get("attempt")
            backoff = event.get("backoff_ms")
            if not isinstance(attempt, int) or attempt < 1:
                errors.append(f"event[{i}] invalid reconnect attempt")
            if not isinstance(backoff, int):
                errors.append(f"event[{i}] missing backoff_ms")
            else:
                if backoff < policy.get("min_backoff_ms", 0) or backoff > policy.get("max_backoff_ms", 2**31-1):
                    errors.append(f"event[{i}] backoff outside policy")
                if policy.get("require_non_decreasing_backoff") and last_backoff is not None and backoff < last_backoff:
                    errors.append(f"event[{i}] backoff decreased")
                last_backoff = backoff
        elif kind == "subscribed":
            sub = event.get("subscription")
            if not connected:
                errors.append(f"event[{i}] subscription while disconnected")
            if not sub:
                errors.append(f"event[{i}] missing subscription")
            elif sub in active_subscriptions and not policy.get("allow_duplicate_subscriptions", False):
                errors.append(f"event[{i}] duplicate subscription: {sub}")
            else:
                active_subscriptions.add(sub)
                expected_resubscribe.discard(sub)
        elif kind == "unsubscribed":
            sub = event.get("subscription")
            active_subscriptions.discard(sub)
            expected_resubscribe.discard(sub)
        elif kind == "message":
            sub = event.get("subscription")
            seq = event.get("sequence")
            if not connected:
                errors.append(f"event[{i}] message while disconnected")
            if sub and isinstance(seq, int):
                prev = last_sequence.get(sub)
                if prev is not None:
                    if seq < prev and not policy.get("allow_sequence_rewind", False):
                        errors.append(f"event[{i}] sequence rewound for {sub}: {prev}->{seq}")
                    gap = seq - prev - 1
                    if gap > policy.get("max_sequence_gap", 0):
                        errors.append(f"event[{i}] sequence gap for {sub}: {gap}")
                last_sequence[sub] = seq

    if reconnects > policy.get("max_reconnect_attempts", 0):
        errors.append("reconnect attempt limit exceeded")
    if policy.get("require_resubscribe_after_reconnect") and ever_connected and expected_resubscribe:
        errors.append("subscriptions not restored: " + ", ".join(sorted(expected_resubscribe)))
    return errors


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--trace", required=True)
    p.add_argument("--policy", required=True)
    p.add_argument("--out", required=True)
    a = p.parse_args()
    try:
        trace, policy = load(a.trace), load(a.policy)
        errors = validate(trace, policy)
        result = {"status": "verified" if not errors else "failed", "errors": errors}
        write(a.out, result)
        return 0 if not errors else 2
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(f"validate_reconnect_trace: {e}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    sys.exit(main())
