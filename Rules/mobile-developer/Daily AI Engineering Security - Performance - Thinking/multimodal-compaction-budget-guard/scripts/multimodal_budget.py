#!/usr/bin/env python3
"""Analyze multimodal JSON history for image/context budget pressure.

The image-token value is explicitly an estimate. Measured fields (image bytes/count,
duplicate bytes and text characters) remain separate in output.
Exit: 0 PASS, 1 invalid input, 2 budget failure.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Iterator


def strings(value: Any) -> Iterator[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from strings(item)


def image_payload(value: str) -> bytes | None:
    if not value.startswith("data:image/") or "," not in value:
        return None
    header, payload = value.split(",", 1)
    try:
        if ";base64" in header:
            return base64.b64decode(payload, validate=False)
        return payload.encode("utf-8", errors="replace")
    except (ValueError, base64.binascii.Error):
        return payload.encode("utf-8", errors="replace")


def analyze(history: Any, image_token_estimate: int) -> dict[str, int]:
    payload_sizes: list[tuple[str, int]] = []
    text_chars = 0
    for value in strings(history):
        payload = image_payload(value)
        if payload is None:
            text_chars += len(value)
            continue
        digest = hashlib.sha256(payload).hexdigest()
        payload_sizes.append((digest, len(payload)))

    counts = Counter(d for d, _ in payload_sizes)
    first_size: dict[str, int] = {}
    for digest, size in payload_sizes:
        first_size.setdefault(digest, size)
    inline_bytes = sum(size for _, size in payload_sizes)
    unique_bytes = sum(first_size.values())
    duplicate_bytes = sum((count - 1) * first_size[digest] for digest, count in counts.items() if count > 1)
    estimated_text_tokens = (text_chars + 3) // 4
    estimated_image_tokens = len(payload_sizes) * image_token_estimate
    return {
        "text_characters": text_chars,
        "estimated_text_tokens": estimated_text_tokens,
        "image_count": len(payload_sizes),
        "unique_image_count": len(counts),
        "inline_image_bytes": inline_bytes,
        "unique_image_bytes": unique_bytes,
        "duplicate_image_bytes": duplicate_bytes,
        "estimated_image_tokens": estimated_image_tokens,
        "estimated_total_tokens": estimated_text_tokens + estimated_image_tokens,
    }


def decision(metrics: dict[str, int], context_window: int, trigger: int, required_headroom: int, max_images: int, max_inline_bytes: int) -> tuple[str, list[str], int]:
    failures: list[str] = []
    if metrics["image_count"] > max_images:
        failures.append("image_count")
    if metrics["inline_image_bytes"] > max_inline_bytes:
        failures.append("inline_image_bytes")
    estimated_total = metrics["estimated_total_tokens"]
    headroom = trigger - estimated_total
    if estimated_total > context_window:
        failures.append("context_window")
    if headroom < required_headroom:
        failures.append("required_headroom")
    return ("PASS" if not failures else "BLOCK", failures, headroom)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--context-window", type=int, required=True)
    p.add_argument("--trigger", type=int, required=True)
    p.add_argument("--required-headroom", type=int, required=True)
    p.add_argument("--max-images", type=int, required=True)
    p.add_argument("--max-inline-bytes", type=int, required=True)
    p.add_argument("--image-token-estimate", type=int, default=1024)
    args = p.parse_args()
    try:
        if min(args.context_window, args.trigger, args.required_headroom, args.max_images, args.max_inline_bytes, args.image_token_estimate) < 0:
            raise ValueError("budgets must be non-negative")
        if args.trigger > args.context_window:
            raise ValueError("trigger cannot exceed context window")
        history = json.loads(Path(args.input).read_text(encoding="utf-8"))
        metrics = analyze(history, args.image_token_estimate)
        status, failures, headroom = decision(metrics, args.context_window, args.trigger, args.required_headroom, args.max_images, args.max_inline_bytes)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"decision": "INVALID", "error": str(exc)}))
        return 1
    report = {"decision": status, "failures": failures, "projected_headroom_tokens": headroom, "image_token_cost_is_estimate": True, **metrics}
    print(json.dumps(report, ensure_ascii=False))
    return 0 if status == "PASS" else 2


if __name__ == "__main__":
    sys.exit(main())
