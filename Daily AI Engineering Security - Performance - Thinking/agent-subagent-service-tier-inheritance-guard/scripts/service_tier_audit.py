#!/usr/bin/env python3
"""Audit parent/child service-tier inheritance and token deltas from JSONL telemetry.

The parser is intentionally provider-tolerant: it recursively inspects JSON objects for
thread identifiers, parent identifiers, service-tier markers, approval metadata, and
usage counters. It never modifies input files and never contacts a provider.

Exit codes:
  0: policy passes
  2: one or more policy violations
  3: invalid arguments/config/input
  4: unexpected I/O or parsing failure
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Iterable

TOKEN_KEYS = {
    "input_tokens",
    "cached_input_tokens",
    "output_tokens",
    "reasoning_output_tokens",
    "total_tokens",
    "total_token_usage",
}
THREAD_KEYS = ("thread_id", "threadId", "agent_thread_id")
PARENT_KEYS = ("parent_thread_id", "parentThreadId", "parent_id")
TIER_KEYS = ("service_tier", "serviceTier")
APPROVAL_KEYS = ("tier_approval", "service_tier_approval", "approval")


@dataclass
class ThreadState:
    thread_id: str
    parent_thread_id: str | None = None
    observed_tier: str | None = None
    expected_tier: str | None = None
    approval: dict[str, Any] | None = None
    input_tokens: int = 0
    cached_input_tokens: int = 0
    output_tokens: int = 0
    total_tokens: int = 0
    source_files: set[str] | None = None

    def __post_init__(self) -> None:
        if self.source_files is None:
            self.source_files = set()


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read config {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def iter_jsonl(paths: Iterable[Path]) -> Iterable[tuple[Path, int, dict[str, Any]]]:
    for path in paths:
        try:
            with path.open("r", encoding="utf-8") as handle:
                for lineno, raw in enumerate(handle, 1):
                    if not raw.strip():
                        continue
                    try:
                        value = json.loads(raw)
                    except json.JSONDecodeError as exc:
                        raise ValueError(f"{path}:{lineno}: invalid JSON: {exc.msg}") from exc
                    if isinstance(value, dict):
                        yield path, lineno, value
        except OSError as exc:
            raise ValueError(f"cannot read {path}: {exc}") from exc


def walk(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def first_scalar(obj: dict[str, Any], keys: Iterable[str]) -> str | None:
    for key in keys:
        value = obj.get(key)
        if isinstance(value, (str, int)) and str(value):
            return str(value)
    return None


def extract_context(record: dict[str, Any]) -> tuple[str | None, str | None, str | None, dict[str, Any] | None]:
    thread_id = parent_id = tier = None
    approval = None
    for obj in walk(record):
        thread_id = thread_id or first_scalar(obj, THREAD_KEYS)
        parent_id = parent_id or first_scalar(obj, PARENT_KEYS)
        tier = tier or first_scalar(obj, TIER_KEYS)
        if approval is None:
            for key in APPROVAL_KEYS:
                value = obj.get(key)
                if isinstance(value, dict):
                    approval = value
                    break
    return thread_id, parent_id, tier.lower() if tier else None, approval


def find_usage_snapshots(record: dict[str, Any]) -> list[dict[str, int]]:
    snapshots: list[dict[str, int]] = []
    for obj in walk(record):
        found: dict[str, int] = {}
        for key, value in obj.items():
            if key in TOKEN_KEYS and isinstance(value, int) and value >= 0:
                found[key] = value
        # Avoid treating a lone scalar buried in unrelated metadata as a snapshot.
        if len(found) >= 2 or "total_tokens" in found or "total_token_usage" in found:
            snapshots.append(found)
    return snapshots


def normalize_snapshot(snapshot: dict[str, int]) -> dict[str, int]:
    input_tokens = snapshot.get("input_tokens", 0)
    cached = snapshot.get("cached_input_tokens", 0)
    output = snapshot.get("output_tokens", 0)
    total_raw = snapshot.get("total_tokens", snapshot.get("total_token_usage", 0))
    if isinstance(total_raw, dict):
        total_raw = 0
    total = int(total_raw) if isinstance(total_raw, int) else 0
    if total == 0 and (input_tokens or output):
        total = input_tokens + output
    return {
        "input_tokens": input_tokens,
        "cached_input_tokens": cached,
        "output_tokens": output,
        "total_tokens": total,
    }


def discover_files(inputs: list[str]) -> list[Path]:
    files: list[Path] = []
    for raw in inputs:
        path = Path(raw).expanduser()
        if path.is_dir():
            files.extend(sorted(p for p in path.rglob("*.jsonl") if p.is_file()))
        elif path.is_file():
            files.append(path)
        else:
            raise ValueError(f"input does not exist: {path}")
    unique = list(dict.fromkeys(files))
    if not unique:
        raise ValueError("no JSONL input files found")
    return unique


def approval_valid(approval: dict[str, Any] | None, policy: dict[str, Any]) -> bool:
    if not approval:
        return False
    cfg = policy.get("approval", {})
    if cfg.get("require_reason", True) and not str(approval.get("reason", "")).strip():
        return False
    if cfg.get("require_actor", True) and not str(approval.get("actor", "")).strip():
        return False
    return bool(approval.get("approved", True))


def rank(tier: str | None, policy: dict[str, Any]) -> int | None:
    if tier is None:
        return None
    value = policy.get("tier_rank", {}).get(tier)
    return int(value) if isinstance(value, (int, float)) else None


def audit(files: list[Path], policy: dict[str, Any]) -> dict[str, Any]:
    threads: dict[str, ThreadState] = {}
    last_snapshot: dict[str, dict[str, int]] = defaultdict(lambda: {
        "input_tokens": 0, "cached_input_tokens": 0, "output_tokens": 0, "total_tokens": 0
    })
    default_tier = str(policy.get("default_expected_tier", "default")).lower()

    for path, _lineno, record in iter_jsonl(files):
        thread_id, parent_id, tier, approval = extract_context(record)
        if not thread_id:
            # Some rollout formats only identify a thread in their header. A file-local
            # identifier avoids merging unrelated anonymous telemetry.
            thread_id = f"file:{path.resolve()}"
        state = threads.setdefault(thread_id, ThreadState(thread_id=thread_id))
        state.source_files.add(str(path))
        if parent_id:
            state.parent_thread_id = parent_id
        if tier:
            state.observed_tier = tier
        if approval:
            state.approval = approval

        for raw_snapshot in find_usage_snapshots(record):
            snap = normalize_snapshot(raw_snapshot)
            previous = last_snapshot[thread_id]
            # Cumulative counters can repeat or reset. Count only positive deltas; on a
            # reset, treat the new value as a fresh epoch instead of creating negatives.
            deltas: dict[str, int] = {}
            for key, current in snap.items():
                before = previous.get(key, 0)
                deltas[key] = current - before if current >= before else current
                previous[key] = current
            state.input_tokens += max(0, deltas["input_tokens"])
            state.cached_input_tokens += max(0, deltas["cached_input_tokens"])
            state.output_tokens += max(0, deltas["output_tokens"])
            state.total_tokens += max(0, deltas["total_tokens"])

    # Resolve expected tier from parent; roots use configured default.
    for state in threads.values():
        if state.parent_thread_id and state.parent_thread_id in threads:
            parent = threads[state.parent_thread_id]
            state.expected_tier = parent.observed_tier or parent.expected_tier or default_tier
        else:
            state.expected_tier = default_tier

    violations: list[dict[str, Any]] = []
    unknown_action = policy.get("unknown_tier_action", "fail")
    max_desc = int(policy.get("max_descendants", 32))
    max_depth = int(policy.get("max_lineage_depth", 2))

    children: dict[str, list[str]] = defaultdict(list)
    for state in threads.values():
        if state.parent_thread_id:
            children[state.parent_thread_id].append(state.thread_id)

    def depth(tid: str) -> int:
        seen: set[str] = set()
        d = 0
        cur = threads.get(tid)
        while cur and cur.parent_thread_id and cur.parent_thread_id not in seen:
            seen.add(cur.parent_thread_id)
            d += 1
            cur = threads.get(cur.parent_thread_id)
        return d

    descendants = sum(1 for s in threads.values() if s.parent_thread_id)
    if descendants > max_desc:
        violations.append({"type": "descendant_budget", "observed": descendants, "allowed": max_desc})

    for state in threads.values():
        d = depth(state.thread_id)
        if d > max_depth:
            violations.append({"type": "lineage_depth", "thread_id": state.thread_id, "observed": d, "allowed": max_depth})

        if state.observed_tier is None:
            if unknown_action == "fail" and state.parent_thread_id:
                violations.append({"type": "unknown_child_tier", "thread_id": state.thread_id, "expected": state.expected_tier})
            continue

        observed_rank = rank(state.observed_tier, policy)
        expected_rank = rank(state.expected_tier, policy)
        if observed_rank is None:
            violations.append({"type": "unmapped_tier", "thread_id": state.thread_id, "tier": state.observed_tier})
        elif expected_rank is not None and observed_rank > expected_rank:
            approved = approval_valid(state.approval, policy)
            if not approved:
                violations.append({
                    "type": "unapproved_tier_escalation",
                    "thread_id": state.thread_id,
                    "parent_thread_id": state.parent_thread_id,
                    "expected": state.expected_tier,
                    "observed": state.observed_tier,
                })

    multipliers = policy.get("tier_credit_multiplier", {})
    rows: list[dict[str, Any]] = []
    for state in threads.values():
        tier = state.observed_tier or "unknown"
        multiplier = multipliers.get(tier)
        rows.append({
            "thread_id": state.thread_id,
            "parent_thread_id": state.parent_thread_id,
            "expected_tier": state.expected_tier,
            "observed_tier": state.observed_tier,
            "configured_credit_multiplier": multiplier,
            "input_tokens": state.input_tokens,
            "cached_input_tokens": state.cached_input_tokens,
            "output_tokens": state.output_tokens,
            "total_tokens": state.total_tokens,
            "approval_present": state.approval is not None,
            "source_files": sorted(state.source_files),
        })

    return {
        "schema_version": 1,
        "files_scanned": len(files),
        "threads_observed": len(threads),
        "descendants_observed": descendants,
        "violations": violations,
        "pass": not violations,
        "threads": sorted(rows, key=lambda r: r["thread_id"]),
        "note": "Configured multipliers are policy estimates, not authoritative provider billing.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inputs", nargs="+", help="JSONL file(s) or directories")
    parser.add_argument("--policy", required=True, help="policy JSON path")
    parser.add_argument("--report", help="write report JSON to this path; stdout otherwise")
    args = parser.parse_args()

    try:
        policy = load_json(Path(args.policy))
        files = discover_files(args.inputs)
        result = audit(files, policy)
        rendered = json.dumps(result, indent=2, sort_keys=True)
        if args.report:
            Path(args.report).write_text(rendered + "\n", encoding="utf-8")
        else:
            print(rendered)
        return 0 if result["pass"] else 2
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 3
    except OSError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
