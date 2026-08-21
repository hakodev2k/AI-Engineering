#!/usr/bin/env python3
"""Validate approval-request liveness from JSONL runtime events.

Input events (one JSON object per line):
  {"ts":"2026-08-21T09:00:00+07:00","type":"requested","request_id":"r1","agent_id":"a1","parent_agent_id":null}
  {"ts":"...","type":"surfaced","request_id":"r1"}
  {"ts":"...","type":"approved","request_id":"r1"}

Supported types: requested, surfaced, acknowledged, approved, denied, expired,
cancelled. The script never approves actions; it only reports liveness defects.

Exit codes:
  0 no blocking violations
  2 policy/liveness violation
  3 invalid input/config
  4 I/O error
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

TERMINAL = {"approved", "denied", "expired", "cancelled"}
VALID = {"requested", "surfaced", "acknowledged", *TERMINAL}


def parse_ts(value: str) -> datetime:
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"invalid timestamp: {value}") from exc
    if dt.tzinfo is None:
        raise ValueError(f"timestamp must include timezone: {value}")
    return dt


@dataclass
class Request:
    request_id: str
    agent_id: str | None = None
    parent_agent_id: str | None = None
    requested_at: datetime | None = None
    surfaced_at: datetime | None = None
    acknowledged_at: datetime | None = None
    terminal_at: datetime | None = None
    terminal_state: str | None = None
    violations: list[str] = field(default_factory=list)


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(str(exc)) from exc


def read_events(path: Path) -> list[dict[str, Any]]:
    events = []
    try:
        for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip():
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {number}: invalid JSON: {exc}") from exc
            if not isinstance(obj, dict):
                raise ValueError(f"line {number}: event must be object")
            events.append(obj)
    except OSError as exc:
        raise RuntimeError(str(exc)) from exc
    return events


def analyze(events: list[dict[str, Any]], policy: dict[str, Any], now: datetime) -> dict[str, Any]:
    requests: dict[str, Request] = {}
    global_violations: list[dict[str, str]] = []

    for index, event in enumerate(events, 1):
        typ = event.get("type")
        request_id = event.get("request_id")
        if typ not in VALID or not isinstance(request_id, str) or not request_id:
            raise ValueError(f"event {index}: invalid type/request_id")
        ts = parse_ts(str(event.get("ts", "")))

        if typ == "requested":
            if request_id in requests:
                global_violations.append({"request_id": request_id, "code": "DUPLICATE_REQUEST"})
                continue
            req = Request(
                request_id=request_id,
                agent_id=event.get("agent_id"),
                parent_agent_id=event.get("parent_agent_id"),
                requested_at=ts,
            )
            if policy.get("require_parent_route_for_subagents", True) and req.parent_agent_id and not event.get("approval_route"):
                req.violations.append("MISSING_PARENT_ROUTE")
            requests[request_id] = req
            continue

        req = requests.get(request_id)
        if req is None:
            global_violations.append({"request_id": request_id, "code": "ORPHAN_EVENT"})
            continue

        if req.terminal_state:
            global_violations.append({"request_id": request_id, "code": "EVENT_AFTER_TERMINAL"})
            continue

        if typ == "surfaced":
            req.surfaced_at = req.surfaced_at or ts
        elif typ == "acknowledged":
            req.acknowledged_at = req.acknowledged_at or ts
        elif typ in TERMINAL:
            req.terminal_state = typ
            req.terminal_at = ts

    surface_limit = float(policy.get("surface_timeout_seconds", 15))
    decision_limit = float(policy.get("decision_timeout_seconds", 300))
    grace = float(policy.get("grace_seconds", 10))

    output = []
    for req in requests.values():
        assert req.requested_at is not None
        surface_end = req.surfaced_at or req.terminal_at or now
        surface_latency = max(0.0, (surface_end - req.requested_at).total_seconds())
        if req.surfaced_at is None and surface_latency > surface_limit:
            req.violations.append("SURFACE_TIMEOUT")

        decision_end = req.terminal_at or now
        decision_latency = max(0.0, (decision_end - req.requested_at).total_seconds())
        if req.terminal_state is None and decision_latency > decision_limit + grace:
            req.violations.append("DECISION_TIMEOUT")

        if req.terminal_state == "approved" and policy.get("allow_implicit_approval") is False:
            if req.surfaced_at is None and req.acknowledged_at is None:
                req.violations.append("UNSURFACED_APPROVAL")

        output.append({
            "request_id": req.request_id,
            "agent_id": req.agent_id,
            "parent_agent_id": req.parent_agent_id,
            "state": req.terminal_state or ("surfaced" if req.surfaced_at else "requested"),
            "surface_latency_seconds": round(surface_latency, 3),
            "decision_latency_seconds": round(decision_latency, 3),
            "violations": sorted(set(req.violations)),
        })

    blocking = sum(bool(item["violations"]) for item in output) + len(global_violations)
    return {
        "status": "fail" if blocking else "pass",
        "request_count": len(requests),
        "blocking_violation_count": blocking,
        "requests": output,
        "global_violations": global_violations,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("events", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--now", help="ISO-8601 time; defaults to current time")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    try:
        policy = load_json(args.policy)
        if not isinstance(policy, dict):
            raise ValueError("policy must be a JSON object")
        events = read_events(args.events)
        now = parse_ts(args.now) if args.now else datetime.now().astimezone()
        report = analyze(events, policy, now)
        text = json.dumps(report, indent=2, sort_keys=True)
        if args.output:
            args.output.write_text(text + "\n", encoding="utf-8")
        else:
            print(text)
        return 0 if report["status"] == "pass" else 2
    except ValueError as exc:
        print(f"input error: {exc}", file=sys.stderr)
        return 3
    except RuntimeError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4
    except OSError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
