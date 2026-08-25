#!/usr/bin/env python3
"""Deterministic guard for privileged control envelopes and untrusted agent data."""
from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

RESERVED_PATTERNS = {
    "SYSTEM_REMINDER": re.compile(r"<\s*/?\s*system-reminder\b", re.I),
    "TASK_NOTIFICATION": re.compile(r"<\s*/?\s*task-notification\b", re.I),
    "SYSTEM_ROLE_LABEL": re.compile(r"(?mi)^\s*system\s*:\s*"),
    "OUT_OF_BAND_USER": re.compile(r"\[\s*out-of-band\s+user\s+message\b", re.I),
}
TRUSTED_ORIGINS = {"runtime", "host", "policy-engine"}
MAX_CLOCK_SKEW_SECONDS = 300


def canonical_envelope(obj: dict[str, Any]) -> bytes:
    fields = {
        "channel": obj.get("channel"),
        "content": obj.get("content"),
        "issued_at": obj.get("issued_at"),
        "nonce": obj.get("nonce"),
        "origin": obj.get("origin"),
        "privileged": obj.get("privileged"),
        "source": obj.get("source"),
    }
    return json.dumps(fields, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def parse_time(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        text = value[:-1] + "+00:00" if value.endswith("Z") else value
        dt = datetime.fromisoformat(text)
        if dt.tzinfo is None:
            return None
        return dt.astimezone(timezone.utc)
    except ValueError:
        return None


def check_message(obj: dict[str, Any], hmac_key: bytes | None = None, now: datetime | None = None) -> dict[str, Any]:
    findings: list[str] = []
    content = obj.get("content")
    privileged = obj.get("privileged")
    origin = obj.get("origin")
    source = obj.get("source")
    channel = obj.get("channel")

    if not isinstance(content, str) or not isinstance(privileged, bool):
        return {"allow": False, "findings": ["INVALID_MESSAGE_SCHEMA"]}
    if not isinstance(source, str) or not source or not isinstance(channel, str) or not channel:
        return {"allow": False, "findings": ["MISSING_PROVENANCE_FIELDS"]}

    marker_hits = [code for code, rx in RESERVED_PATTERNS.items() if rx.search(content)]

    if not privileged:
        if marker_hits:
            findings.extend(f"UNTRUSTED_{code}" for code in marker_hits)
        return {"allow": not findings, "findings": findings, "marker_hits": marker_hits}

    if origin not in TRUSTED_ORIGINS:
        findings.append("UNTRUSTED_PRIVILEGED_ORIGIN")
    nonce = obj.get("nonce")
    if not isinstance(nonce, str) or len(nonce) < 16:
        findings.append("INVALID_NONCE")
    issued = parse_time(obj.get("issued_at"))
    if issued is None:
        findings.append("INVALID_ISSUED_AT")
    else:
        current = now or datetime.now(timezone.utc)
        if abs((current - issued).total_seconds()) > MAX_CLOCK_SKEW_SECONDS:
            findings.append("STALE_CONTROL_ENVELOPE")

    if hmac_key is not None:
        supplied = obj.get("mac")
        if not isinstance(supplied, str):
            findings.append("MISSING_MAC")
        else:
            expected = hmac.new(hmac_key, canonical_envelope(obj), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(supplied.lower(), expected):
                findings.append("INVALID_MAC")

    return {"allow": not findings, "findings": findings, "marker_hits": marker_hits}


def load_json(path: str) -> dict[str, Any]:
    data = sys.stdin.read() if path == "-" else Path(path).read_text(encoding="utf-8")
    obj = json.loads(data)
    if not isinstance(obj, dict):
        raise ValueError("top-level JSON value must be an object")
    return obj


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate agent control/data provenance before parent-context ingestion.")
    sub = parser.add_subparsers(dest="command", required=True)
    check = sub.add_parser("check")
    check.add_argument("--input", required=True, help="JSON file path or '-' for stdin")
    check.add_argument("--hmac-env", help="Environment variable containing the runtime HMAC key")
    args = parser.parse_args()

    try:
        obj = load_json(args.input)
        key = None
        if args.hmac_env:
            raw = os.environ.get(args.hmac_env)
            if not raw:
                raise ValueError(f"HMAC key environment variable {args.hmac_env!r} is unset")
            key = raw.encode("utf-8")
        result = check_message(obj, key)
        print(json.dumps(result, sort_keys=True))
        return 0 if result["allow"] else 2
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"allow": False, "error": str(exc)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
