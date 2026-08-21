#!/usr/bin/env python3
"""Profile replay pressure in event-sourced/JSONL agent sessions.

The profiler is read-only. It measures event classes, exact canonical duplicates,
metadata budget pressure, and estimated token cost. It never deletes records.

Exit codes: 0 within blocking thresholds, 2 invalid input/config, 3 budget/block threshold exceeded.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

VOLATILE_KEYS = {"timestamp", "created_at", "updated_at", "id", "uuid", "request_id", "event_id"}


def load_policy(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("policy must contain a JSON object")
    return value


def str_set(policy: dict[str, Any], name: str) -> set[str]:
    value = policy.get(name, [])
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{name} must be a list of non-empty strings")
    return set(value)


def event_type(record: dict[str, Any]) -> str:
    base = record.get("type")
    subtype = record.get("subtype")
    if isinstance(subtype, str) and subtype:
        if base in (None, "attachment", "event", "metadata"):
            return subtype
    attachment = record.get("attachment")
    if isinstance(attachment, dict):
        at = attachment.get("type")
        if isinstance(at, str) and at:
            return at
    return base if isinstance(base, str) and base else "unknown"


def canonicalize(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: canonicalize(v) for k, v in sorted(value.items()) if k not in VOLATILE_KEYS}
    if isinstance(value, list):
        return [canonicalize(v) for v in value]
    return value


def fingerprint(record: dict[str, Any]) -> str:
    canonical = json.dumps(canonicalize(record), ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("session", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--json-out", type=Path)
    args = ap.parse_args()
    try:
        policy = load_policy(args.policy)
        protected = str_set(policy, "protected_types")
        superseding = str_set(policy, "superseding_types")
        ephemeral = str_set(policy, "ephemeral_types")
        budget = int(policy.get("metadata_budget_bytes", 200000))
        warn_ratio = float(policy.get("warn_duplicate_ratio", 0.15))
        block_ratio = float(policy.get("block_duplicate_ratio", 0.30))
        max_groups = int(policy.get("max_duplicate_groups", 100))
        chars_per_token = float(policy.get("token_estimate_chars_per_token", 4.0))
        if budget < 0 or not 0 <= warn_ratio <= 1 or not 0 <= block_ratio <= 1 or warn_ratio > block_ratio:
            raise ValueError("invalid budget/duplicate-ratio thresholds")
        if max_groups < 1 or chars_per_token <= 0:
            raise ValueError("max_duplicate_groups and token estimate must be positive")
        try:
            raw_lines = args.session.read_text(encoding="utf-8").splitlines()
        except OSError as exc:
            raise ValueError(f"cannot read session {args.session}: {exc}") from exc

        total_bytes = 0
        total_chars = 0
        type_bytes: Counter[str] = Counter()
        type_records: Counter[str] = Counter()
        unknown_types: set[str] = set()
        groups: dict[tuple[str, str], list[tuple[int, int]]] = defaultdict(list)

        for lineno, raw in enumerate(raw_lines, 1):
            if not raw.strip():
                continue
            try:
                record = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"invalid JSON at line {lineno}: {exc.msg}") from exc
            if not isinstance(record, dict):
                raise ValueError(f"line {lineno} must contain a JSON object")
            typ = event_type(record)
            size = len((raw + "\n").encode("utf-8"))
            chars = len(raw) + 1
            total_bytes += size
            total_chars += chars
            type_bytes[typ] += size
            type_records[typ] += 1
            if typ not in protected | superseding | ephemeral:
                unknown_types.add(typ)
            groups[(typ, fingerprint(record))].append((lineno, size))

        metadata_bytes = sum(v for t, v in type_bytes.items() if t not in protected)
        all_duplicate_bytes = 0
        candidate_duplicate_bytes = 0
        duplicate_groups: list[dict[str, Any]] = []
        for (typ, fp), members in groups.items():
            if len(members) < 2:
                continue
            redundant = sum(size for _, size in members[1:])
            all_duplicate_bytes += redundant
            candidate = redundant if typ in (ephemeral | superseding) else 0
            candidate_duplicate_bytes += candidate
            duplicate_groups.append({
                "type": typ,
                "fingerprint": fp,
                "count": len(members),
                "lines": [line for line, _ in members[:20]],
                "redundant_bytes": redundant,
                "candidate_redundant_bytes": candidate,
                "protected": typ in protected,
            })
        duplicate_groups.sort(key=lambda x: x["candidate_redundant_bytes"], reverse=True)
        duplicate_groups = duplicate_groups[:max_groups]
        candidate_ratio = (candidate_duplicate_bytes / total_bytes) if total_bytes else 0.0
        estimated_tokens = total_chars / chars_per_token
        metadata_budget_exceeded = metadata_bytes > budget
        duplicate_block = candidate_ratio >= block_ratio if total_bytes else False
        duplicate_warning = candidate_ratio >= warn_ratio if total_bytes else False
        blocking = metadata_budget_exceeded or duplicate_block

        report = {
            "records": sum(type_records.values()),
            "total_bytes": total_bytes,
            "metadata_bytes": metadata_bytes,
            "metadata_budget_bytes": budget,
            "metadata_budget_exceeded": metadata_budget_exceeded,
            "estimated_tokens": round(estimated_tokens, 2),
            "all_exact_duplicate_bytes": all_duplicate_bytes,
            "candidate_duplicate_bytes": candidate_duplicate_bytes,
            "candidate_duplicate_ratio": round(candidate_ratio, 6),
            "duplicate_warning": duplicate_warning,
            "duplicate_block": duplicate_block,
            "unknown_types": sorted(unknown_types),
            "by_type": {
                typ: {"records": type_records[typ], "bytes": type_bytes[typ], "classification": (
                    "protected" if typ in protected else "superseding" if typ in superseding else "ephemeral" if typ in ephemeral else "unknown-protected-by-default"
                )}
                for typ in sorted(type_records)
            },
            "duplicate_groups": duplicate_groups,
            "decision": "block" if blocking else "pass",
        }
        rendered = json.dumps(report, indent=2, ensure_ascii=False)
        if args.json_out:
            args.json_out.write_text(rendered + "\n", encoding="utf-8")
        print(rendered)
        return 3 if blocking else 0
    except (ValueError, TypeError, OSError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
