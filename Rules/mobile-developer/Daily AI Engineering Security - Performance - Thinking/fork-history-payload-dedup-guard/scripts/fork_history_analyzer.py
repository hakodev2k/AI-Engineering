#!/usr/bin/env python3
"""Read-only analyzer for inherited fork-history amplification.

It does not rewrite rollout data. It estimates an effective projection as the latest
compacted record plus all following records when compaction is present; otherwise the
full parsed history is projected. Large string duplicates are counted by SHA-256 only.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any, Iterator


def walk_strings(value: Any) -> Iterator[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for v in value.values():
            yield from walk_strings(v)
    elif isinstance(value, list):
        for v in value:
            yield from walk_strings(v)


def is_compacted(value: Any) -> bool:
    if not isinstance(value, dict):
        return False
    candidates = [value.get("type"), value.get("kind")]
    payload = value.get("payload")
    item = value.get("item")
    if isinstance(payload, dict): candidates += [payload.get("type"), payload.get("kind")]
    if isinstance(item, dict): candidates += [item.get("type"), item.get("kind")]
    return any(isinstance(x, str) and x.lower() == "compacted" for x in candidates)


def analyze(path: Path, large_string_bytes: int = 262144) -> dict[str, Any]:
    total_bytes = parsed_bytes = compacted_bytes = 0
    records = compacted_records = invalid_records = 0
    latest_compaction_index = -1
    sizes: list[int] = []
    large_seen: dict[str, int] = {}
    duplicate_large_bytes = 0

    with path.open("rb") as f:
        for raw in f:
            records += 1
            size = len(raw)
            total_bytes += size
            sizes.append(size)
            try:
                obj = json.loads(raw)
            except (json.JSONDecodeError, UnicodeDecodeError):
                invalid_records += 1
                continue
            parsed_bytes += size
            if is_compacted(obj):
                compacted_records += 1
                compacted_bytes += size
                latest_compaction_index = records - 1
            for s in walk_strings(obj):
                b = s.encode("utf-8", errors="ignore")
                if len(b) < large_string_bytes:
                    continue
                digest = hashlib.sha256(b).hexdigest()
                if digest in large_seen:
                    duplicate_large_bytes += len(b)
                    large_seen[digest] += 1
                else:
                    large_seen[digest] = 1

    if invalid_records:
        projected_bytes = None
        superseded_compaction_bytes = None
    elif latest_compaction_index >= 0:
        projected_bytes = sum(sizes[latest_compaction_index:])
        superseded_compaction_bytes = max(0, compacted_bytes - sizes[latest_compaction_index])
    else:
        projected_bytes = total_bytes
        superseded_compaction_bytes = 0

    return {
        "file": str(path),
        "records": records,
        "invalid_records": invalid_records,
        "total_bytes": total_bytes,
        "parsed_bytes": parsed_bytes,
        "compacted_records": compacted_records,
        "compacted_bytes": compacted_bytes,
        "latest_compaction_record_index": latest_compaction_index,
        "superseded_compaction_bytes_estimate": superseded_compaction_bytes,
        "duplicate_large_string_bytes": duplicate_large_bytes,
        "unique_large_string_hashes": len(large_seen),
        "projected_effective_bytes": projected_bytes,
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("rollout")
    p.add_argument("--max-inherited-bytes", type=int, default=64 * 1024 * 1024)
    p.add_argument("--large-string-bytes", type=int, default=256 * 1024)
    args = p.parse_args()
    if args.max_inherited_bytes <= 0 or args.large_string_bytes <= 0:
        print(json.dumps({"status": "error", "error": "budgets must be positive"}))
        return 2
    path = Path(args.rollout)
    if not path.is_file():
        print(json.dumps({"status": "error", "error": "rollout file not found"}))
        return 2
    try:
        result = analyze(path, args.large_string_bytes)
    except OSError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 2
    projected = result["projected_effective_bytes"]
    if result["invalid_records"]:
        status = "block"
        reason = "history contains invalid/unparseable records"
    elif projected is None or projected > args.max_inherited_bytes:
        status = "block"
        reason = "projected inherited history exceeds configured budget"
    else:
        status = "pass"
        reason = "projected inherited history is within configured byte budget"
    result.update({"status": status, "reason": reason, "max_inherited_bytes": args.max_inherited_bytes})
    print(json.dumps(result, indent=2))
    return 0 if status == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
