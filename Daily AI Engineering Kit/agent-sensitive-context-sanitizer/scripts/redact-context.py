#!/usr/bin/env python3
"""Create a sanitized copy of a candidate context artifact using scan-report offsets."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


REDACT_DISPOSITIONS = {"redact", "approval-required"}


def fail(message: str, code: int = 2) -> None:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(code)


def load_report(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"report not found: {path}")
    except json.JSONDecodeError as exc:
        fail(f"invalid report JSON: {exc}")
    if not isinstance(data, dict):
        fail("report must be a JSON object")
    return data


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def merge_spans(spans: list[tuple[int, int]]) -> list[tuple[int, int]]:
    if not spans:
        return []
    spans = sorted(spans)
    merged = [spans[0]]
    for start, end in spans[1:]:
        last_start, last_end = merged[-1]
        if start <= last_end:
            merged[-1] = (last_start, max(last_end, end))
        else:
            merged.append((start, end))
    return merged


def main() -> int:
    parser = argparse.ArgumentParser(description="Redact sensitive spans from a UTF-8 text artifact.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    report_path = Path(args.report).resolve()
    output_path = Path(args.output).resolve()

    if input_path == output_path:
        fail("refusing to overwrite the source candidate; choose a separate --output path")
    if not input_path.exists():
        fail(f"input not found: {input_path}")

    raw = input_path.read_bytes()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        fail("input must be UTF-8 text")

    report = load_report(report_path)
    expected_hash = report.get("input_sha256")
    if not isinstance(expected_hash, str) or sha256_bytes(raw) != expected_hash:
        fail("candidate hash does not match the sanitization report; rescan before redacting")

    findings = report.get("findings")
    if not isinstance(findings, list):
        fail("report findings must be an array")

    if any(isinstance(item, dict) and item.get("disposition") == "deny" for item in findings):
        fail("report contains deny findings; current candidate is not releasable. Create a new minimized candidate and rescan.", 20)

    spans: list[tuple[int, int]] = []
    for item in findings:
        if not isinstance(item, dict):
            fail("each finding must be an object")
        disposition = item.get("disposition")
        if disposition not in {"allow", "redact", "approval-required", "deny"}:
            fail(f"invalid finding disposition: {disposition}")
        if disposition not in REDACT_DISPOSITIONS:
            continue
        start = item.get("start")
        end = item.get("end")
        if not isinstance(start, int) or not isinstance(end, int):
            fail("redaction finding is missing integer start/end offsets")
        if start < 0 or end <= start or end > len(text):
            fail(f"invalid redaction span: {start}:{end}")
        spans.append((start, end))

    merged = merge_spans(spans)
    sanitized = text
    for start, end in reversed(merged):
        sanitized = sanitized[:start] + "[REDACTED:SENSITIVE]" + sanitized[end:]

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(sanitized, encoding="utf-8")
    print(f"redacted_spans={len(merged)} output={output_path} sha256={sha256_bytes(sanitized.encode('utf-8'))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
