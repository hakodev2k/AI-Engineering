#!/usr/bin/env python3
"""Fail-closed policy gate for outbound events that may create shared agent state.

Input: JSONL events on stdin or --input FILE. Each event requires:
  timestamp, agent_id, run_id, operation, destination, shared_mutable
Optional: purpose, human_approved.

Exit codes: 0 all events allowed; 2 policy violation; 3 invalid input/config.
"""
from __future__ import annotations

import argparse
import fnmatch
import json
import sys
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


def fail(msg: str, code: int = 3) -> None:
    print(json.dumps({"status": "error", "message": msg}), file=sys.stderr)
    raise SystemExit(code)


def parse_time(value: str) -> float:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
    except Exception as exc:
        raise ValueError(f"invalid timestamp {value!r}: {exc}") from exc


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"cannot read config {path}: {exc}")
    if not isinstance(data, dict):
        fail("config must be a JSON object")
    return data


def iter_events(stream: Iterable[str]) -> Iterable[dict[str, Any]]:
    for line_no, line in enumerate(stream, 1):
        if not line.strip():
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError as exc:
            fail(f"line {line_no}: invalid JSON: {exc}")
        if not isinstance(event, dict):
            fail(f"line {line_no}: event must be an object")
        required = ["timestamp", "agent_id", "run_id", "operation", "destination", "shared_mutable"]
        missing = [key for key in required if key not in event]
        if missing:
            fail(f"line {line_no}: missing fields: {', '.join(missing)}")
        yield event


def matching_channel(policy: dict[str, Any], destination: str) -> dict[str, Any] | None:
    for item in policy.get("approved_channels", []):
        pattern = item.get("pattern")
        if isinstance(pattern, str) and fnmatch.fnmatch(destination, pattern):
            return item
    return None


def evaluate(policy: dict[str, Any], events: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    violations: list[dict[str, Any]] = []
    allowed: list[dict[str, Any]] = []
    window = int(policy.get("window_seconds", 300))
    max_writes = int(policy.get("max_shared_writes_per_agent_per_window", 20))
    max_agents = int(policy.get("max_distinct_agents_per_channel_per_window", 5))
    per_agent: dict[tuple[str, str], deque[float]] = defaultdict(deque)
    per_channel: dict[str, deque[tuple[float, str]]] = defaultdict(deque)

    events = sorted(events, key=lambda e: parse_time(str(e["timestamp"])))
    for event in events:
        t = parse_time(str(event["timestamp"]))
        destination = str(event["destination"])
        operation = str(event["operation"]).lower()
        agent_id = str(event["agent_id"])
        shared_mutable = bool(event["shared_mutable"])
        is_write = operation in {"write", "post", "put", "patch", "delete", "create", "upload"}
        channel = matching_channel(policy, destination)
        reasons: list[str] = []

        if shared_mutable and is_write:
            if channel is None and policy.get("require_declared_shared_write", True):
                if not (policy.get("require_human_approval_for_new_shared_channel", True) and bool(event.get("human_approved"))):
                    reasons.append("undeclared shared mutable destination")
            elif channel is not None and channel.get("mode") == "read-only":
                reasons.append("write attempted against read-only channel")
            if not str(event.get("purpose", "")).strip():
                reasons.append("shared write lacks declared purpose")

            key = (agent_id, destination)
            q = per_agent[key]
            while q and q[0] < t - window:
                q.popleft()
            q.append(t)
            if len(q) > max_writes:
                reasons.append(f"per-agent shared-write limit exceeded: {len(q)}>{max_writes}")

            cq = per_channel[destination]
            while cq and cq[0][0] < t - window:
                cq.popleft()
            cq.append((t, agent_id))
            distinct = len({aid for _, aid in cq})
            if distinct > max_agents:
                reasons.append(f"cross-agent convergence limit exceeded: {distinct}>{max_agents}")

        if reasons:
            violations.append({"event": event, "reasons": reasons})
        else:
            allowed.append(event)
    return allowed, violations


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--input", type=Path)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()

    policy = load_json(args.config)
    if args.input:
        try:
            stream = args.input.open("r", encoding="utf-8")
        except OSError as exc:
            fail(f"cannot read input {args.input}: {exc}")
    else:
        stream = sys.stdin
    try:
        events = list(iter_events(stream))
    finally:
        if args.input and stream is not sys.stdin:
            stream.close()
    allowed, violations = evaluate(policy, events)
    report = {
        "status": "blocked" if violations else "allowed",
        "events": len(events),
        "allowed": len(allowed),
        "violations": violations,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    text = json.dumps(report, indent=2, sort_keys=True)
    if args.report:
        args.report.write_text(text + "\n", encoding="utf-8")
    print(text)
    return 2 if violations else 0


if __name__ == "__main__":
    raise SystemExit(main())
