#!/usr/bin/env python3
"""Audit MCP Tasks polling traces for cadence, cancellation, terminal and budget invariants."""
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from pathlib import Path

TERMINAL = {"completed", "failed", "cancelled"}
EVENTS = {"task.created", "task.poll", "task.cancel_requested", "task.terminal"}

def audit(path: Path, max_polls: int, max_elapsed_ms: int, slack_ms: int) -> tuple[bool, list[str], dict]:
    if max_polls < 1 or max_elapsed_ms < 1 or slack_ms < 0:
        raise ValueError("limits must be positive and slack_ms non-negative")
    try: lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc: raise ValueError(f"cannot read trace: {exc}") from exc
    if not lines: raise ValueError("trace is empty")
    tasks = defaultdict(list)
    for lineno, raw in enumerate(lines, 1):
        if not raw.strip(): continue
        try: rec = json.loads(raw)
        except json.JSONDecodeError as exc: raise ValueError(f"line {lineno}: invalid JSON: {exc.msg}") from exc
        tid, event, ts = rec.get("task_id"), rec.get("event"), rec.get("timestamp_ms")
        if not isinstance(tid, str) or not tid or event not in EVENTS or not isinstance(ts, (int, float)):
            raise ValueError(f"line {lineno}: invalid task_id/event/timestamp_ms")
        tasks[tid].append(rec)
    problems, metrics = [], {"tasks": len(tasks), "polls": 0, "post_cancel_polls": 0, "post_terminal_polls": 0, "interval_violations": 0}
    for tid, events in tasks.items():
        events.sort(key=lambda x: x["timestamp_ms"])
        if events[0]["event"] != "task.created": problems.append(f"{tid}: first event is not task.created")
        created = events[0]["timestamp_ms"]; cancelled = False; terminal = False; last_poll = None; interval = 0; polls = 0
        for rec in events:
            event, ts = rec["event"], rec["timestamp_ms"]
            if ts - created > max_elapsed_ms:
                problems.append(f"{tid}: elapsed polling budget exceeded at {ts-created}ms")
            if "poll_interval_ms" in rec:
                value = rec["poll_interval_ms"]
                if not isinstance(value, (int, float)) or value < 0: raise ValueError(f"{tid}: invalid poll_interval_ms")
                interval = value
            if event == "task.cancel_requested": cancelled = True
            elif event == "task.terminal":
                status = rec.get("status")
                if status not in TERMINAL: problems.append(f"{tid}: invalid terminal status {status!r}")
                terminal = True
            elif event == "task.poll":
                polls += 1; metrics["polls"] += 1
                if cancelled:
                    metrics["post_cancel_polls"] += 1; problems.append(f"{tid}: poll after cancellation")
                if terminal:
                    metrics["post_terminal_polls"] += 1; problems.append(f"{tid}: poll after terminal state")
                if last_poll is not None and ts - last_poll + slack_ms < interval:
                    metrics["interval_violations"] += 1; problems.append(f"{tid}: poll interval {ts-last_poll}ms below required {interval}ms")
                last_poll = ts
                if polls > max_polls: problems.append(f"{tid}: poll count {polls} exceeds max {max_polls}")
    return not problems, problems, metrics

def main(argv=None) -> int:
    p = argparse.ArgumentParser(); p.add_argument("trace", type=Path); p.add_argument("--max-polls", type=int, default=100); p.add_argument("--max-elapsed-ms", type=int, default=900000); p.add_argument("--slack-ms", type=int, default=5)
    a = p.parse_args(argv)
    try: ok, problems, metrics = audit(a.trace, a.max_polls, a.max_elapsed_ms, a.slack_ms)
    except ValueError as exc: print(f"input-error: {exc}", file=sys.stderr); return 1
    print(json.dumps(metrics, sort_keys=True))
    for problem in problems: print(f"BLOCK: {problem}")
    return 0 if ok else 2
if __name__ == "__main__": raise SystemExit(main())
