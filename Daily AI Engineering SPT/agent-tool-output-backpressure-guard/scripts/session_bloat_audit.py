#!/usr/bin/env python3
"""Audit JSONL/session files for oversized records and duplicated tool payloads.

Exit codes:
  0: within policy
  2: one or more budget violations
  3: invalid arguments/policy
  4: I/O failure
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any


def load_policy(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load policy: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be object")
    return data


def extract_strings(value: Any, path: str = "$") -> list[tuple[str, str]]:
    found: list[tuple[str, str]] = []
    if isinstance(value, str):
        found.append((path, value))
    elif isinstance(value, dict):
        for key, child in value.items():
            found.extend(extract_strings(child, f"{path}.{key}"))
    elif isinstance(value, list):
        for i, child in enumerate(value):
            found.extend(extract_strings(child, f"{path}[{i}]"))
    return found


def audit(path: Path, policy: dict[str, Any]) -> dict[str, Any]:
    max_record = int(policy.get("max_inline_session_record_bytes", 262144))
    duplicates = Counter()
    duplicate_bytes = Counter()
    oversized: list[dict[str, Any]] = []
    invalid_lines: list[int] = []
    total_bytes = 0
    tool_like_bytes = 0

    with path.open("rb") as handle:
        for line_no, raw in enumerate(handle, start=1):
            total_bytes += len(raw)
            if len(raw) > max_record:
                oversized.append({"line": line_no, "bytes": len(raw)})
            try:
                obj = json.loads(raw)
            except json.JSONDecodeError:
                invalid_lines.append(line_no)
                continue
            for json_path, text in extract_strings(obj):
                # Target common output-bearing names while remaining provider-neutral.
                lower = json_path.lower()
                if any(token in lower for token in ("tool_result", "output", "stdout", "stderr", "content")):
                    payload = text.encode("utf-8", errors="replace")
                    if len(payload) < 1024:
                        continue
                    digest = hashlib.sha256(payload).hexdigest()
                    duplicates[digest] += 1
                    duplicate_bytes[digest] = len(payload)
                    tool_like_bytes += len(payload)

    repeated = [
        {"sha256": digest, "occurrences": count, "bytes_each": duplicate_bytes[digest],
         "duplicate_overhead_bytes": (count - 1) * duplicate_bytes[digest]}
        for digest, count in duplicates.items() if count > 1
    ]
    repeated.sort(key=lambda x: x["duplicate_overhead_bytes"], reverse=True)
    return {
        "file": str(path),
        "total_bytes": total_bytes,
        "tool_like_string_bytes": tool_like_bytes,
        "oversized_records": oversized,
        "invalid_json_lines": invalid_lines,
        "repeated_payloads": repeated[:50],
        "estimated_duplicate_overhead_bytes": sum(x["duplicate_overhead_bytes"] for x in repeated),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--policy", required=True)
    parser.add_argument("--session", required=True)
    parser.add_argument("--report")
    args = parser.parse_args()
    try:
        policy = load_policy(args.policy)
        path = Path(args.session)
        if not path.is_file():
            raise ValueError("session must be a file")
        report = audit(path, policy)
        violation = bool(report["oversized_records"] or report["invalid_json_lines"] or report["repeated_payloads"])
        rendered = json.dumps(report, indent=2, ensure_ascii=False) + "\n"
        if args.report:
            Path(args.report).write_text(rendered, encoding="utf-8")
        else:
            sys.stdout.write(rendered)
        return 2 if violation else 0
    except ValueError as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        return 3
    except OSError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
