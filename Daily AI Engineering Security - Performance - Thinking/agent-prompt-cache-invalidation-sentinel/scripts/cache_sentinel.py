#!/usr/bin/env python3
"""Detect repeated prompt-cache invalidation from JSONL usage events.

Input is JSONL. The parser accepts both flat normalized records and common nested
`message.usage` / `usage` layouts. It never reads prompt or tool content.

Exit codes:
  0: analysis completed, no blocking incident (or fail_on_incident=false)
  2: one or more incidents and fail_on_incident=true
  3: invalid arguments/config/input
  4: unexpected I/O/runtime error
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import deque
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Iterable

DEFAULT_POLICY = {
    "warm_cache_min_read_tokens": 50000,
    "warm_cache_min_read_ratio": 0.70,
    "collapse_max_read_ratio": 0.25,
    "large_rewrite_min_tokens": 50000,
    "rewrite_vs_previous_read_ratio": 0.50,
    "incident_window_requests": 5,
    "incident_min_collapses": 2,
    "max_incidents_per_session": 20,
    "fail_on_incident": False,
}


@dataclass
class Event:
    index: int
    request_id: str
    timestamp: str
    version: str
    model: str
    cache_read: int
    cache_creation: int
    uncached_input: int
    miss_reason: str

    @property
    def total_input(self) -> int:
        return self.cache_read + self.cache_creation + self.uncached_input

    @property
    def read_ratio(self) -> float:
        return self.cache_read / max(self.total_input, 1)


@dataclass
class Collapse:
    index: int
    request_id: str
    timestamp: str
    previous_read_tokens: int
    cache_read_tokens: int
    cache_creation_tokens: int
    read_ratio: float
    miss_reason: str
    version: str
    model: str


def deep_get(obj: dict[str, Any], paths: Iterable[tuple[str, ...]], default: Any = None) -> Any:
    for path in paths:
        cur: Any = obj
        ok = True
        for key in path:
            if not isinstance(cur, dict) or key not in cur:
                ok = False
                break
            cur = cur[key]
        if ok and cur is not None:
            return cur
    return default


def as_int(value: Any) -> int:
    if value is None:
        return 0
    if isinstance(value, bool):
        return int(value)
    try:
        return max(int(value), 0)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"expected integer token counter, got {value!r}") from exc


def normalize(raw: dict[str, Any], index: int) -> Event:
    read = as_int(deep_get(raw, [
        ("cache_read_input_tokens",), ("usage", "cache_read_input_tokens"),
        ("message", "usage", "cache_read_input_tokens"),
        ("cached_input_tokens",), ("usage", "cached_input_tokens"),
    ], 0))
    creation = as_int(deep_get(raw, [
        ("cache_creation_input_tokens",), ("usage", "cache_creation_input_tokens"),
        ("message", "usage", "cache_creation_input_tokens"),
        ("cache_write_input_tokens",), ("usage", "cache_write_input_tokens"),
    ], 0))
    input_tokens = as_int(deep_get(raw, [
        ("input_tokens",), ("usage", "input_tokens"),
        ("message", "usage", "input_tokens"),
    ], 0))
    # Providers differ on whether input_tokens excludes cached/write counters. Treat it
    # as uncached only when it is not an obvious inclusive total.
    uncached = max(input_tokens - read - creation, 0) if input_tokens >= read + creation else input_tokens
    return Event(
        index=index,
        request_id=str(deep_get(raw, [("request_id",), ("requestId",), ("message", "requestId")], f"row-{index}")),
        timestamp=str(deep_get(raw, [("timestamp",), ("created_at",), ("message", "timestamp")], "")),
        version=str(deep_get(raw, [("version",), ("client_version",), ("message", "version")], "")),
        model=str(deep_get(raw, [("model",), ("message", "model")], "")),
        cache_read=read,
        cache_creation=creation,
        uncached_input=uncached,
        miss_reason=str(deep_get(raw, [
            ("miss_reason",), ("diagnostics", "cache_miss_reason", "type"),
            ("message", "diagnostics", "cache_miss_reason", "type"),
        ], "")),
    )


def load_policy(path: Path | None) -> dict[str, Any]:
    policy = dict(DEFAULT_POLICY)
    if path:
        user = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(user, dict):
            raise ValueError("policy must be a JSON object")
        unknown = set(user) - set(policy)
        if unknown:
            raise ValueError(f"unknown policy keys: {sorted(unknown)}")
        policy.update(user)
    for key in ["warm_cache_min_read_tokens", "large_rewrite_min_tokens", "incident_window_requests", "incident_min_collapses", "max_incidents_per_session"]:
        if int(policy[key]) < 1:
            raise ValueError(f"{key} must be >= 1")
    for key in ["warm_cache_min_read_ratio", "collapse_max_read_ratio", "rewrite_vs_previous_read_ratio"]:
        value = float(policy[key])
        if not 0 <= value <= 1:
            raise ValueError(f"{key} must be between 0 and 1")
    return policy


def read_events(path: Path) -> list[Event]:
    events: list[Event] = []
    seen: set[str] = set()
    with path.open("r", encoding="utf-8") as fh:
        for line_no, line in enumerate(fh, 1):
            if not line.strip():
                continue
            raw = json.loads(line)
            if not isinstance(raw, dict):
                raise ValueError(f"line {line_no}: expected JSON object")
            event = normalize(raw, line_no)
            # Transcript formats can repeat content blocks for one request. Deduplicate
            # only when an explicit request ID is present.
            if not event.request_id.startswith("row-") and event.request_id in seen:
                continue
            seen.add(event.request_id)
            events.append(event)
    if not events:
        raise ValueError("no usage events found")
    return events


def analyze(events: list[Event], policy: dict[str, Any]) -> dict[str, Any]:
    collapses: list[Collapse] = []
    warm_prev: Event | None = None
    rolling: deque[int] = deque(maxlen=int(policy["incident_window_requests"]))
    incidents: list[dict[str, Any]] = []
    incident_anchor = -10**9

    for event in events:
        warm = event.cache_read >= int(policy["warm_cache_min_read_tokens"]) and event.read_ratio >= float(policy["warm_cache_min_read_ratio"])
        collapsed = False
        if warm_prev is not None:
            rewrite_threshold = max(
                int(policy["large_rewrite_min_tokens"]),
                int(warm_prev.cache_read * float(policy["rewrite_vs_previous_read_ratio"])),
            )
            collapsed = event.read_ratio <= float(policy["collapse_max_read_ratio"]) and event.cache_creation >= rewrite_threshold
            if collapsed:
                collapses.append(Collapse(
                    index=event.index,
                    request_id=event.request_id,
                    timestamp=event.timestamp,
                    previous_read_tokens=warm_prev.cache_read,
                    cache_read_tokens=event.cache_read,
                    cache_creation_tokens=event.cache_creation,
                    read_ratio=round(event.read_ratio, 6),
                    miss_reason=event.miss_reason,
                    version=event.version,
                    model=event.model,
                ))
        rolling.append(1 if collapsed else 0)
        if sum(rolling) >= int(policy["incident_min_collapses"]):
            if event.index - incident_anchor >= int(policy["incident_window_requests"]):
                incidents.append({
                    "ending_index": event.index,
                    "timestamp": event.timestamp,
                    "collapse_count_in_window": sum(rolling),
                    "window_requests": len(rolling),
                })
                incident_anchor = event.index
                if len(incidents) >= int(policy["max_incidents_per_session"]):
                    break
        if warm:
            warm_prev = event

    total_read = sum(e.cache_read for e in events)
    total_creation = sum(e.cache_creation for e in events)
    total_uncached = sum(e.uncached_input for e in events)
    estimated_rewrite = sum(c.cache_creation_tokens for c in collapses)
    return {
        "status": "incident" if incidents else "ok",
        "events_analyzed": len(events),
        "metrics": {
            "cache_read_tokens": total_read,
            "cache_creation_tokens": total_creation,
            "uncached_input_tokens": total_uncached,
            "cache_read_ratio": round(total_read / max(total_read + total_creation + total_uncached, 1), 6),
            "collapse_events": len(collapses),
            "estimated_rewrite_tokens": estimated_rewrite,
            "incident_count": len(incidents),
        },
        "collapses": [asdict(c) for c in collapses],
        "incidents": incidents,
        "notes": [
            "estimated_rewrite_tokens is diagnostic, not a billing claim",
            "token counters alone do not prove root cause; correlate with version, hooks, TTL, resume/update events",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="JSONL usage events")
    parser.add_argument("--policy", type=Path, help="policy JSON")
    parser.add_argument("--output", type=Path, help="write JSON report instead of stdout")
    args = parser.parse_args()
    try:
        policy = load_policy(args.policy)
        report = analyze(read_events(args.input), policy)
        payload = json.dumps(report, indent=2, ensure_ascii=False) + "\n"
        if args.output:
            args.output.write_text(payload, encoding="utf-8")
        else:
            sys.stdout.write(payload)
        if report["status"] == "incident" and bool(policy["fail_on_incident"]):
            return 2
        return 0
    except (ValueError, json.JSONDecodeError) as exc:
        print(f"input error: {exc}", file=sys.stderr)
        return 3
    except OSError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4
    except Exception as exc:  # defensive CLI boundary
        print(f"unexpected error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
