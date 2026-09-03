#!/usr/bin/env python3
"""Offline SSE framing boundary probe.

Reads bytes from a local fixture in chunks, simulates accumulation of an
incomplete SSE event, and aborts deterministically before the configured cap is
exceeded. This does not contact a network service.
"""
from __future__ import annotations

import argparse
import json
import pathlib
import sys
from dataclasses import dataclass

DELIMITER = b"\n\n"

@dataclass
class ProbeResult:
    status: str
    buffered_bytes: int
    stream_bytes: int
    events: int
    limit: int

    def as_dict(self) -> dict:
        return {
            "status": self.status,
            "buffered_bytes": self.buffered_bytes,
            "stream_bytes": self.stream_bytes,
            "events": self.events,
            "limit": self.limit,
        }


def load_policy(path: pathlib.Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"invalid policy: {exc}") from exc
    required = ["max_incomplete_frame_bytes", "max_stream_bytes"]
    for key in required:
        if key not in data or not isinstance(data[key], int) or data[key] <= 0:
            raise ValueError(f"policy field {key!r} must be a positive integer")
    if data["max_stream_bytes"] < data["max_incomplete_frame_bytes"]:
        raise ValueError("max_stream_bytes must be >= max_incomplete_frame_bytes")
    return data


def probe_bytes(payload: bytes, *, frame_limit: int, stream_limit: int, chunk_size: int = 4096) -> ProbeResult:
    if frame_limit <= 0 or stream_limit <= 0 or chunk_size <= 0:
        raise ValueError("limits and chunk_size must be positive")
    buffer = bytearray()
    total = 0
    events = 0
    for offset in range(0, len(payload), chunk_size):
        chunk = payload[offset:offset + chunk_size]
        if total + len(chunk) > stream_limit:
            return ProbeResult("stream_limit_exceeded", len(buffer), total, events, frame_limit)
        total += len(chunk)
        buffer.extend(chunk)
        while True:
            pos = buffer.find(DELIMITER)
            if pos < 0:
                break
            del buffer[:pos + len(DELIMITER)]
            events += 1
        if len(buffer) > frame_limit:
            return ProbeResult("limit_exceeded", frame_limit, total, events, frame_limit)
    return ProbeResult("ok", len(buffer), total, events, frame_limit)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--policy", required=True, type=pathlib.Path)
    parser.add_argument("--fixture", required=True, type=pathlib.Path)
    parser.add_argument("--chunk-size", type=int, default=4096)
    args = parser.parse_args(argv)
    try:
        policy = load_policy(args.policy)
        payload = args.fixture.read_bytes()
        result = probe_bytes(
            payload,
            frame_limit=policy["max_incomplete_frame_bytes"],
            stream_limit=policy["max_stream_bytes"],
            chunk_size=args.chunk_size,
        )
    except (OSError, ValueError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 2
    print(json.dumps(result.as_dict(), sort_keys=True))
    return 0 if result.status in {"ok", "limit_exceeded", "stream_limit_exceeded"} else 1


if __name__ == "__main__":
    sys.exit(main())
