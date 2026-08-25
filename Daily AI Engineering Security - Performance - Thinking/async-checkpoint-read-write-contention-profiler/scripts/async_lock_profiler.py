#!/usr/bin/env python3
"""Profile async saver lock holds and writer waits from JSONL trace events.

Required event fields: ts_ms, event, op_id.
Events: lock_acquire, lock_release, yield, writer_wait_start, writer_wait_end.
Exit codes: 0 pass, 2 threshold/trace violation, 1 malformed input/runtime error.
No third-party dependencies.
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

VALID_EVENTS = {"lock_acquire", "lock_release", "yield", "writer_wait_start", "writer_wait_end"}


def percentile(values, p):
    if not values:
        return 0.0
    values = sorted(float(v) for v in values)
    if len(values) == 1:
        return values[0]
    k = (len(values) - 1) * (p / 100.0)
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return values[int(k)]
    return values[f] + (values[c] - values[f]) * (k - f)


def analyze(events):
    events = sorted(events, key=lambda e: (float(e["ts_ms"]), e.get("_line", 0)))
    held = {}
    yield_counts = {}
    lock_holds = []
    writer_waits = {}
    writer_wait_values = []
    errors = []

    for e in events:
        event = e["event"]
        op = e["op_id"]
        ts = float(e["ts_ms"])
        if event not in VALID_EVENTS:
            errors.append(f"unknown_event:{event}")
            continue
        if event == "lock_acquire":
            if op in held:
                errors.append(f"duplicate_lock_acquire:{op}")
            else:
                held[op] = ts
                yield_counts[op] = 0
        elif event == "yield":
            if op in held:
                yield_counts[op] = yield_counts.get(op, 0) + 1
        elif event == "lock_release":
            if op not in held:
                errors.append(f"lock_release_without_acquire:{op}")
            else:
                lock_holds.append({
                    "op_id": op,
                    "hold_ms": ts - held.pop(op),
                    "yields_while_locked": yield_counts.pop(op, 0),
                })
        elif event == "writer_wait_start":
            if op in writer_waits:
                errors.append(f"duplicate_writer_wait_start:{op}")
            else:
                writer_waits[op] = ts
        elif event == "writer_wait_end":
            if op not in writer_waits:
                errors.append(f"writer_wait_end_without_start:{op}")
            else:
                writer_wait_values.append(ts - writer_waits.pop(op))

    for op in held:
        errors.append(f"unclosed_lock:{op}")
    for op in writer_waits:
        errors.append(f"unclosed_writer_wait:{op}")

    holds = [x["hold_ms"] for x in lock_holds]
    yields = [x["yields_while_locked"] for x in lock_holds]
    return {
        "event_count": len(events),
        "lock_hold_count": len(holds),
        "writer_wait_count": len(writer_wait_values),
        "max_lock_hold_ms": max(holds, default=0.0),
        "p95_lock_hold_ms": percentile(holds, 95),
        "max_writer_wait_ms": max(writer_wait_values, default=0.0),
        "p95_writer_wait_ms": percentile(writer_wait_values, 95),
        "max_yields_while_locked": max(yields, default=0),
        "locks_with_yield": sum(1 for x in yields if x > 0),
        "errors": errors,
    }


def load_jsonl(path):
    text = sys.stdin.read() if path == "-" else Path(path).read_text(encoding="utf-8")
    events = []
    for i, line in enumerate(text.splitlines(), 1):
        if not line.strip():
            continue
        obj = json.loads(line)
        if not isinstance(obj, dict):
            raise ValueError(f"line {i}: object required")
        for key in ("ts_ms", "event", "op_id"):
            if key not in obj:
                raise ValueError(f"line {i}: missing {key}")
        float(obj["ts_ms"])
        obj["_line"] = i
        events.append(obj)
    if not events:
        raise ValueError("no events")
    return events


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="JSONL file or - for stdin")
    parser.add_argument("--max-writer-wait-ms", type=float, default=None)
    parser.add_argument("--max-lock-hold-ms", type=float, default=None)
    parser.add_argument("--max-yields-while-locked", type=int, default=None)
    args = parser.parse_args()
    try:
        result = analyze(load_jsonl(args.input))
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 1

    violations = []
    if result["errors"]:
        violations.append("invalid_trace")
    if args.max_writer_wait_ms is not None and result["max_writer_wait_ms"] > args.max_writer_wait_ms:
        violations.append("writer_wait_budget")
    if args.max_lock_hold_ms is not None and result["max_lock_hold_ms"] > args.max_lock_hold_ms:
        violations.append("lock_hold_budget")
    if args.max_yields_while_locked is not None and result["max_yields_while_locked"] > args.max_yields_while_locked:
        violations.append("yield_while_locked_budget")

    result["violations"] = violations
    result["status"] = "fail" if violations else "pass"
    print(json.dumps(result, sort_keys=True))
    return 2 if violations else 0


if __name__ == "__main__":
    raise SystemExit(main())
