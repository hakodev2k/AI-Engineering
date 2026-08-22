#!/usr/bin/env python3
"""Normalize incident evidence into a stable, timestamp-sorted timeline.

Input: JSON array of objects containing at least:
  timestamp, source, kind, message

Output: JSON object with normalized events and warnings.

Safe behavior:
- read-only input
- never invents timestamps
- never drops invalid events silently
- preserves original record under `raw`
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REQUIRED = ("timestamp", "source", "kind", "message")


def parse_timestamp(value: str) -> datetime:
    if not isinstance(value, str) or not value.strip():
        raise ValueError("timestamp must be a non-empty string")
    text = value.strip()
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    dt = datetime.fromisoformat(text)
    if dt.tzinfo is None or dt.utcoffset() is None:
        raise ValueError("timestamp must include a UTC offset or Z")
    return dt


def load_events(path: Path) -> list[dict[str, Any]]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise RuntimeError(f"input not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"invalid JSON in {path}: {exc}") from exc
    if not isinstance(data, list):
        raise RuntimeError("input must be a JSON array")
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalize incident evidence timeline")
    parser.add_argument("--input", required=True, help="raw events JSON array")
    parser.add_argument("--output", required=True, help="normalized timeline JSON")
    args = parser.parse_args()

    max_skew = int(os.getenv("INCIDENT_MAX_CLOCK_SKEW_SECONDS", "120"))
    events = load_events(Path(args.input))
    errors: list[str] = []
    normalized: list[dict[str, Any]] = []

    for index, item in enumerate(events):
        if not isinstance(item, dict):
            errors.append(f"event[{index}] must be an object")
            continue
        missing = [key for key in REQUIRED if key not in item]
        if missing:
            errors.append(f"event[{index}] missing: {', '.join(missing)}")
            continue
        try:
            dt = parse_timestamp(item["timestamp"])
        except (ValueError, TypeError) as exc:
            errors.append(f"event[{index}] invalid timestamp: {exc}")
            continue

        event_id = str(item.get("id") or f"evt-{index + 1:04d}")
        normalized.append(
            {
                "id": event_id,
                "timestamp": dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
                "source": str(item["source"]),
                "kind": str(item["kind"]),
                "message": str(item["message"]),
                "service": item.get("service"),
                "quality": item.get("quality", "direct"),
                "raw": item,
                "_sort": dt.timestamp(),
            }
        )

    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1

    normalized.sort(key=lambda e: (e["_sort"], e["id"]))

    warnings: list[str] = []
    for previous, current in zip(normalized, normalized[1:]):
        delta = current["_sort"] - previous["_sort"]
        if delta < -max_skew:
            warnings.append(
                f"clock-order warning between {previous['id']} and {current['id']}"
            )

    for event in normalized:
        event.pop("_sort", None)

    output = {
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source_file": str(Path(args.input)),
        "event_count": len(normalized),
        "warnings": warnings,
        "events": normalized,
    }

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(normalized)} events to {out_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(2)
