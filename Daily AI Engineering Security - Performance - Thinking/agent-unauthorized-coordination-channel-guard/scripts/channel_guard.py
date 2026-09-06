#!/usr/bin/env python3
"""Detect unapproved cross-agent coordination over shared resources.

Input events are JSON Lines objects with:
  agent_id: non-empty string
  resource: resource/namespace string
  operation: read | list | discover | write | create | update | delete
  timestamp: optional string

Policy JSON:
  {
    "approved_coordination_prefixes": ["broker://approved/"],
    "ignored_readonly_prefixes": ["dataset://public/"],
    "window_events": 500
  }

The detector is intentionally metadata-oriented. It flags an unapproved resource when
one agent writes and a different agent subsequently reads/discovers/lists or writes the
same normalized resource namespace inside the bounded event window.

Exit codes: 0 clean, 2 invalid input, 3 violation detected.
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict, deque
from pathlib import Path
from typing import Iterable

WRITE_OPS = {"write", "create", "update", "delete"}
READ_OPS = {"read", "list", "discover"}
ALL_OPS = WRITE_OPS | READ_OPS


def load_policy(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"invalid policy: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    for key in ("approved_coordination_prefixes", "ignored_readonly_prefixes"):
        value = data.get(key, [])
        if not isinstance(value, list) or not all(isinstance(x, str) for x in value):
            raise ValueError(f"{key} must be a list of strings")
    window = data.get("window_events", 500)
    if not isinstance(window, int) or window < 1 or window > 100000:
        raise ValueError("window_events must be an integer from 1 to 100000")
    data["window_events"] = window
    return data


def load_events(path: Path) -> list[dict]:
    if not path.is_file():
        raise ValueError(f"events file not found: {path}")
    out = []
    try:
        for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip():
                continue
            try:
                event = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {lineno}: invalid JSON: {exc}") from exc
            if not isinstance(event, dict):
                raise ValueError(f"line {lineno}: event must be an object")
            agent = event.get("agent_id")
            resource = event.get("resource")
            operation = event.get("operation")
            if not isinstance(agent, str) or not agent.strip():
                raise ValueError(f"line {lineno}: agent_id must be non-empty")
            if not isinstance(resource, str) or not resource.strip():
                raise ValueError(f"line {lineno}: resource must be non-empty")
            if operation not in ALL_OPS:
                raise ValueError(f"line {lineno}: unsupported operation {operation!r}")
            event = dict(event)
            event["agent_id"] = agent.strip()
            event["resource"] = resource.strip()
            out.append(event)
    except OSError as exc:
        raise ValueError(f"cannot read events: {exc}") from exc
    return out


def has_prefix(resource: str, prefixes: Iterable[str]) -> bool:
    return any(resource.startswith(p) for p in prefixes)


def namespace(resource: str) -> str:
    """Normalize exact objects into a conservative namespace.

    URI-like resources keep scheme/authority plus parent path; filesystem-like paths
    keep their parent. This catches filenames/object keys used as message carriers while
    avoiding a global 'all storage is one channel' assumption.
    """
    r = resource.rstrip("/")
    if "/" not in r:
        return r
    return r.rsplit("/", 1)[0] + "/"


def analyze(events: list[dict], policy: dict) -> dict:
    approved = policy.get("approved_coordination_prefixes", [])
    ignored = policy.get("ignored_readonly_prefixes", [])
    window = policy["window_events"]
    history: dict[str, deque[tuple[int, str, str]]] = defaultdict(lambda: deque(maxlen=window))
    violations = []
    edges = set()

    for idx, event in enumerate(events):
        agent = event["agent_id"]
        resource = event["resource"]
        op = event["operation"]
        ns = namespace(resource)

        if has_prefix(resource, approved):
            continue
        if op in READ_OPS and has_prefix(resource, ignored):
            continue

        prior = history[ns]
        for prior_idx, prior_agent, prior_op in list(prior):
            if prior_agent == agent:
                continue
            # Writer -> peer reader/discovery is a direct communication edge.
            # Multi-writer peer activity is also suspicious because object names/metadata
            # can provide a rendezvous protocol even before an explicit read is logged.
            suspicious = (prior_op in WRITE_OPS and op in READ_OPS) or (
                prior_op in WRITE_OPS and op in WRITE_OPS
            )
            if suspicious:
                edge = (prior_agent, agent, ns)
                if edge not in edges:
                    edges.add(edge)
                    violations.append({
                        "namespace": ns,
                        "from_agent": prior_agent,
                        "to_agent": agent,
                        "prior_operation": prior_op,
                        "operation": op,
                        "prior_event_index": prior_idx,
                        "event_index": idx,
                    })
        prior.append((idx, agent, op))

    return {
        "events": len(events),
        "unapproved_cross_agent_edges": len(violations),
        "violations": violations,
    }


def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--events", required=True, type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    args = parser.parse_args(argv)
    try:
        policy = load_policy(args.policy)
        events = load_events(args.events)
        report = analyze(events, policy)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, sort_keys=True))
    return 3 if report["unapproved_cross_agent_edges"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
