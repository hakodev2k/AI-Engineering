#!/usr/bin/env python3
"""Analyze repository scan events and enforce scan-amplification budgets.

Input JSONL event fields:
  timestamp (ISO-8601 or unix seconds), repo, worktree, scope, reason,
  scanner, elapsed_ms, concurrent_scans, paths (optional list), files (optional int).

Exit codes:
  0 = pass
  2 = policy violation
  3 = invalid input/policy
  4 = I/O error
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict, deque
from datetime import datetime
from pathlib import Path
from typing import Any


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read JSON {path}: {exc}") from exc


def parse_time(value: Any) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    if not isinstance(value, str) or not value.strip():
        raise ValueError("timestamp must be ISO-8601 string or unix seconds")
    text = value.replace("Z", "+00:00")
    return datetime.fromisoformat(text).timestamp()


def load_events(path: str) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    try:
        with Path(path).open("r", encoding="utf-8") as fh:
            for line_no, raw in enumerate(fh, 1):
                raw = raw.strip()
                if not raw:
                    continue
                try:
                    item = json.loads(raw)
                except json.JSONDecodeError as exc:
                    raise ValueError(f"line {line_no}: invalid JSON: {exc}") from exc
                if not isinstance(item, dict):
                    raise ValueError(f"line {line_no}: event must be an object")
                events.append(item)
    except OSError as exc:
        raise RuntimeError(f"cannot read events {path}: {exc}") from exc
    return events


def required_str(event: dict[str, Any], key: str) -> str:
    value = event.get(key)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"event requires non-empty {key}")
    return value.strip()


def scan_key(event: dict[str, Any]) -> tuple[str, str, str, str, str]:
    return (
        required_str(event, "repo"),
        required_str(event, "worktree"),
        required_str(event, "scope"),
        required_str(event, "reason"),
        required_str(event, "scanner"),
    )


def evaluate(events: list[dict[str, Any]], policy: dict[str, Any]) -> tuple[list[str], dict[str, Any]]:
    violations: list[str] = []
    duplicate_window = int(policy.get("duplicate_window_seconds", 30))
    max_equiv = int(policy.get("max_equivalent_scans_per_window", 1))
    max_per_minute = int(policy.get("max_scans_per_minute", 12))
    max_concurrent = int(policy.get("max_concurrent_scans", 2))
    block_elapsed = int(policy.get("block_scan_elapsed_ms", 15000))
    warn_elapsed = int(policy.get("warn_scan_elapsed_ms", 2000))
    require_full_reason = bool(policy.get("require_reason_for_full_repo_scan", True))
    full_markers = set(policy.get("full_repo_scope_markers", []))
    allowed_reasons = set(policy.get("allowed_reasons", []))
    denied_fragments = list(policy.get("denied_path_fragments", []))

    by_key: dict[tuple[str, str, str, str, str], deque[float]] = defaultdict(deque)
    per_repo: dict[str, deque[float]] = defaultdict(deque)
    warnings: list[str] = []
    duplicate_count = 0
    total_elapsed = 0
    max_seen_concurrent = 0

    normalized: list[tuple[float, dict[str, Any]]] = []
    for idx, event in enumerate(events):
        try:
            ts = parse_time(event.get("timestamp"))
            key = scan_key(event)
            elapsed = int(event.get("elapsed_ms", 0))
            concurrent = int(event.get("concurrent_scans", 1))
        except (ValueError, TypeError) as exc:
            violations.append(f"event {idx}: {exc}")
            continue
        if elapsed < 0 or concurrent < 0:
            violations.append(f"event {idx}: elapsed_ms/concurrent_scans must be non-negative")
            continue
        normalized.append((ts, event))

    normalized.sort(key=lambda x: x[0])

    for ts, event in normalized:
        key = scan_key(event)
        repo, _, scope, reason, _ = key
        elapsed = int(event.get("elapsed_ms", 0))
        concurrent = int(event.get("concurrent_scans", 1))
        total_elapsed += elapsed
        max_seen_concurrent = max(max_seen_concurrent, concurrent)

        q = by_key[key]
        while q and ts - q[0] > duplicate_window:
            q.popleft()
        q.append(ts)
        if len(q) > max_equiv:
            duplicate_count += 1
            violations.append(
                f"duplicate-equivalent scan exceeds {max_equiv}/{duplicate_window}s: "
                f"repo={repo} scope={scope} reason={reason}"
            )

        rq = per_repo[repo]
        while rq and ts - rq[0] > 60:
            rq.popleft()
        rq.append(ts)
        if len(rq) > max_per_minute:
            violations.append(f"scan rate exceeds {max_per_minute}/minute for repo={repo}")

        if concurrent > max_concurrent:
            violations.append(f"concurrent scans {concurrent} exceed {max_concurrent} for repo={repo}")

        if elapsed >= block_elapsed:
            violations.append(f"scan elapsed {elapsed}ms exceeds block threshold {block_elapsed}ms for repo={repo}")
        elif elapsed >= warn_elapsed:
            warnings.append(f"slow scan {elapsed}ms for repo={repo} scope={scope}")

        if require_full_reason and scope in full_markers and reason not in allowed_reasons:
            violations.append(f"full-repository scan has unapproved reason={reason!r} for repo={repo}")

        paths = event.get("paths", [])
        if paths is not None:
            if not isinstance(paths, list) or not all(isinstance(p, str) for p in paths):
                violations.append(f"paths must be a list of strings for repo={repo}")
            else:
                for path in paths:
                    normalized_path = path.replace("\\", "/")
                    for fragment in denied_fragments:
                        if fragment.replace("\\", "/") in normalized_path:
                            violations.append(f"scan entered denied path fragment {fragment!r}: {path}")

    metrics = {
        "events": len(normalized),
        "duplicate_equivalent_events": duplicate_count,
        "duplicate_ratio": (duplicate_count / len(normalized)) if normalized else 0.0,
        "total_scan_elapsed_ms": total_elapsed,
        "average_scan_elapsed_ms": (total_elapsed / len(normalized)) if normalized else 0.0,
        "max_concurrent_scans": max_seen_concurrent,
        "warnings": warnings,
    }
    return violations, metrics


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--events", required=True, help="JSONL scan events")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--report")
    args = parser.parse_args()
    try:
        policy = load_json(args.policy)
        events = load_events(args.events)
        if not isinstance(policy, dict):
            raise ValueError("policy must be a JSON object")
        violations, metrics = evaluate(events, policy)
        result = {"status": "blocked" if violations else "pass", "violations": violations, "metrics": metrics}
        text = json.dumps(result, indent=2, ensure_ascii=False)
        if args.report:
            Path(args.report).write_text(text + "\n", encoding="utf-8")
        print(text)
        return 2 if violations else 0
    except ValueError as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        return 3
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
