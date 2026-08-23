#!/usr/bin/env python3
"""Profile JSONL browser observations and flag duplicate/over-budget events."""
import argparse
import hashlib
import json
import sys


def parser():
    p = argparse.ArgumentParser()
    p.add_argument("--event-byte-budget", type=int, default=50000)
    p.add_argument("--task-byte-budget", type=int, default=250000)
    p.add_argument("--bytes-per-token", type=float, default=4.0)
    return p


def main():
    args = parser().parse_args()
    if args.event_byte_budget <= 0 or args.task_byte_budget <= 0 or args.bytes_per_token <= 0:
        print("budgets and bytes-per-token must be positive", file=sys.stderr)
        return 4

    seen = {}
    rows = []
    total = admitted = duplicates = over = 0
    for lineno, line in enumerate(sys.stdin, 1):
        if not line.strip():
            continue
        try:
            e = json.loads(line)
        except Exception:
            print(f"invalid JSON on line {lineno}", file=sys.stderr)
            return 4
        if not isinstance(e, dict) or not e.get("type"):
            print(f"invalid event on line {lineno}", file=sys.stderr)
            return 4
        content = e.get("content")
        if content is not None and not isinstance(content, str):
            print(f"content must be string on line {lineno}", file=sys.stderr)
            return 4
        size = e.get("bytes")
        if size is None:
            size = len((content or "").encode("utf-8"))
        if not isinstance(size, int) or size < 0:
            print(f"invalid bytes on line {lineno}", file=sys.stderr)
            return 4
        key_material = (content if content is not None else f"{e.get('page','')}|{e['type']}|{size}").encode("utf-8")
        fp = hashlib.sha256(key_material).hexdigest()[:16]
        duplicate = fp in seen
        required_full = bool(e.get("required_full", False))
        event_over = size > args.event_byte_budget
        decision = "admit"
        reason = "within_budget"
        if duplicate and not required_full:
            decision, reason = "reuse", "duplicate"
        elif event_over and not required_full:
            decision, reason = "target_or_delta", "event_budget_exceeded"
        elif admitted + size > args.task_byte_budget and not required_full:
            decision, reason = "target_or_delta", "task_budget_exceeded"
        elif required_full and (event_over or admitted + size > args.task_byte_budget):
            decision, reason = "admit", "required_full_budget_escalation"

        total += size
        duplicates += int(duplicate)
        over += int(event_over)
        if decision == "admit":
            admitted += size
        seen.setdefault(fp, lineno)
        rows.append({
            "line": lineno, "type": e["type"], "page": e.get("page"), "bytes": size,
            "estimated_tokens": round(size / args.bytes_per_token), "fingerprint": fp,
            "duplicate": duplicate, "required_full": required_full, "decision": decision, "reason": reason,
        })

    report = {
        "events": rows,
        "summary": {
            "event_count": len(rows), "raw_bytes": total, "admitted_bytes": admitted,
            "raw_estimated_tokens": round(total / args.bytes_per_token),
            "admitted_estimated_tokens": round(admitted / args.bytes_per_token),
            "duplicate_events": duplicates, "over_event_budget": over,
            "estimated_byte_savings": total - admitted,
        },
    }
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
