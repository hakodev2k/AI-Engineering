#!/usr/bin/env python3
"""Bound, persist, and reference large AI-agent tool output.

Reads bytes from stdin and applies deterministic per-tool/session budgets.
The script never executes the tool itself. It is intended to sit between a tool
runner and session persistence layer.

Exit codes:
  0: output accepted (possibly persisted/referenced)
  2: policy limit reached; output clipped or blocked
  3: invalid policy/arguments
  4: I/O failure
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
from collections import deque
from pathlib import Path
from typing import Any, BinaryIO


def load_json(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def require_positive_int(policy: dict[str, Any], key: str) -> int:
    value = policy.get(key)
    if not isinstance(value, int) or value <= 0:
        raise ValueError(f"policy.{key} must be a positive integer")
    return value


def validate_policy(policy: dict[str, Any]) -> None:
    keys = [
        "per_tool_soft_bytes", "per_tool_hard_bytes", "session_soft_bytes",
        "session_hard_bytes", "head_preview_bytes", "tail_preview_bytes",
        "rate_window_seconds", "rate_soft_bytes_per_second",
        "rate_hard_bytes_per_second", "max_inline_session_record_bytes"
    ]
    for key in keys:
        require_positive_int(policy, key)
    if policy["per_tool_soft_bytes"] > policy["per_tool_hard_bytes"]:
        raise ValueError("per_tool_soft_bytes cannot exceed hard limit")
    if policy["session_soft_bytes"] > policy["session_hard_bytes"]:
        raise ValueError("session_soft_bytes cannot exceed hard limit")
    if policy["rate_soft_bytes_per_second"] > policy["rate_hard_bytes_per_second"]:
        raise ValueError("rate soft limit cannot exceed hard limit")


def load_session_counter(path: Path) -> int:
    if not path.exists():
        return 0
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        value = data.get("captured_bytes", 0)
        if not isinstance(value, int) or value < 0:
            raise ValueError("invalid captured_bytes")
        return value
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        raise RuntimeError(f"cannot read session counter {path}: {exc}") from exc


def save_session_counter(path: Path, captured_bytes: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps({"captured_bytes": captured_bytes}, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, path)


def persist_artifact(directory: Path, digest: str, data: bytes) -> Path:
    directory.mkdir(parents=True, exist_ok=True)
    target = directory / f"{digest}.bin"
    if target.exists():
        # Content-addressed name makes an existing object reusable.
        return target
    tmp = directory / f".{digest}.{os.getpid()}.tmp"
    tmp.write_bytes(data)
    os.replace(tmp, target)
    return target


def emit_json(obj: dict[str, Any]) -> None:
    sys.stdout.write(json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "\n")


def capture(stream: BinaryIO, policy: dict[str, Any], session_used: int) -> tuple[bytes, dict[str, Any], int, bool]:
    tool_hard = policy["per_tool_hard_bytes"]
    session_hard = policy["session_hard_bytes"]
    head_n = policy["head_preview_bytes"]
    tail_n = policy["tail_preview_bytes"]
    window_seconds = policy["rate_window_seconds"]
    rate_hard = policy["rate_hard_bytes_per_second"]

    full = bytearray()
    head = bytearray()
    tail: deque[int] = deque(maxlen=tail_n)
    hasher = hashlib.sha256()
    rate_events: deque[tuple[float, int]] = deque()
    total = 0
    reason: str | None = None

    while True:
        chunk = stream.read(65536)
        if not chunk:
            break
        now = time.monotonic()
        total += len(chunk)
        hasher.update(chunk)
        if len(head) < head_n:
            remaining = head_n - len(head)
            head.extend(chunk[:remaining])
        tail.extend(chunk)
        rate_events.append((now, len(chunk)))
        cutoff = now - window_seconds
        while rate_events and rate_events[0][0] < cutoff:
            rate_events.popleft()
        window_bytes = sum(size for _, size in rate_events)
        instantaneous = window_bytes / max(window_seconds, 1)

        can_store = min(tool_hard, max(0, session_hard - session_used))
        if len(full) < can_store:
            full.extend(chunk[: max(0, can_store - len(full))])

        if instantaneous > rate_hard:
            reason = "RATE_HARD_LIMIT"
            break
        if total >= tool_hard:
            reason = "PER_TOOL_HARD_LIMIT"
            break
        if session_used + total >= session_hard:
            reason = "SESSION_HARD_LIMIT"
            break

    clipped = reason is not None
    metadata = {
        "observed_bytes": total,
        "stored_bytes": len(full),
        "sha256_observed_prefix": hasher.hexdigest(),
        "clipped": clipped,
        "reason": reason,
        "head_preview_utf8": bytes(head).decode("utf-8", errors="replace"),
        "tail_preview_utf8": bytes(tail).decode("utf-8", errors="replace"),
    }
    return bytes(full), metadata, session_used + len(full), clipped


def command_capture(args: argparse.Namespace) -> int:
    try:
        policy = load_json(args.policy)
        validate_policy(policy)
        counter_path = Path(args.session_counter)
        session_used = load_session_counter(counter_path)
        data, meta, new_session_used, clipped = capture(sys.stdin.buffer, policy, session_used)

        soft = len(data) > policy["per_tool_soft_bytes"] or len(data) > policy["max_inline_session_record_bytes"]
        must_reference = bool(policy.get("replace_session_payload_with_reference", True)) and soft
        artifact_path: Path | None = None
        digest = hashlib.sha256(data).hexdigest()

        if (must_reference or clipped) and bool(policy.get("persist_oversized_output", True)) and data:
            artifact_path = persist_artifact(Path(policy.get("artifact_directory", ".agent-output-artifacts")), digest, data)

        save_session_counter(counter_path, new_session_used)
        result: dict[str, Any] = {
            "version": 1,
            "tool_id": args.tool_id,
            "session_id": args.session_id,
            "captured_bytes": len(data),
            "session_captured_bytes": new_session_used,
            "sha256": digest,
            "clipped": clipped,
            "reason": meta["reason"],
            "head_preview_utf8": meta["head_preview_utf8"],
            "tail_preview_utf8": meta["tail_preview_utf8"],
            "full_output_inline": not must_reference and not clipped,
        }
        if artifact_path:
            result["artifact"] = {"path": str(artifact_path), "sha256": digest, "bytes": len(data)}
        if result["full_output_inline"]:
            result["content_utf8"] = data.decode("utf-8", errors="replace")
        else:
            result["content_utf8"] = None
            result["retrieval_required_for_full_output"] = True
        emit_json(result)
        return 2 if clipped else 0
    except ValueError as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        return 3
    except (OSError, RuntimeError) as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    cap = sub.add_parser("capture")
    cap.add_argument("--policy", required=True)
    cap.add_argument("--session-counter", required=True)
    cap.add_argument("--session-id", required=True)
    cap.add_argument("--tool-id", required=True)
    cap.set_defaults(func=command_capture)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())
