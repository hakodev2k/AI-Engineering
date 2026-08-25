#!/usr/bin/env python3
"""Deterministically attest authoritative agent-input provenance.

Exit codes:
  0 allow
  2 downgrade (only possible for read risk)
  3 block due to provenance mismatch
  4 invalid input/ledger
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

REQUIRED = {"event_id", "session_id", "role", "source", "content_sha256", "persisted"}
AUTHORITATIVE_ROLES = {"user", "system", "developer", "approval", "denial", "interrupt", "control"}
HUMAN_SOURCES = {"human", "human_ui", "human_api"}
RISK_VALUES = {"read", "write", "privileged", "irreversible"}
MAX_ANCESTRY = 16


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_ledger(path: Path) -> dict[str, dict[str, Any]]:
    events: dict[str, dict[str, Any]] = {}
    with path.open("r", encoding="utf-8") as handle:
        for lineno, raw in enumerate(handle, 1):
            raw = raw.strip()
            if not raw:
                continue
            try:
                event = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"invalid JSON at line {lineno}: {exc}") from exc
            if not isinstance(event, dict):
                raise ValueError(f"line {lineno}: event must be an object")
            missing = REQUIRED - event.keys()
            if missing:
                raise ValueError(f"line {lineno}: missing fields {sorted(missing)}")
            event_id = str(event["event_id"])
            if not event_id:
                raise ValueError(f"line {lineno}: empty event_id")
            if event_id in events:
                raise ValueError(f"duplicate event_id: {event_id}")
            digest = str(event["content_sha256"]).lower()
            if len(digest) != 64 or any(ch not in "0123456789abcdef" for ch in digest):
                raise ValueError(f"line {lineno}: invalid content_sha256")
            events[event_id] = event
    return events


def attest(events: dict[str, dict[str, Any]], event_id: str, risk: str,
           content: bytes | None) -> dict[str, Any]:
    if risk not in RISK_VALUES:
        raise ValueError(f"invalid risk: {risk}")
    event = events.get(event_id)
    mismatches: list[str] = []
    ancestry: list[str] = []
    if event is None:
        return {"verdict": "block", "event_id": event_id, "mismatches": ["EVENT_MISSING"], "ancestry": []}

    if not bool(event.get("persisted")):
        mismatches.append("NOT_PERSISTED")
    role = str(event.get("role", "")).lower()
    source = str(event.get("source", "")).lower()

    if content is not None and sha256_bytes(content) != str(event["content_sha256"]).lower():
        mismatches.append("CONTENT_HASH_MISMATCH")

    if role == "user":
        if source not in HUMAN_SOURCES:
            mismatches.append("USER_ROLE_NON_HUMAN_SOURCE")
        if event.get("human_submission") is not True:
            mismatches.append("HUMAN_SUBMISSION_MISSING")
        if not event.get("submitted_at"):
            mismatches.append("HUMAN_SUBMISSION_TIMESTAMP_MISSING")

    current = event
    seen: set[str] = set()
    for _ in range(MAX_ANCESTRY):
        current_id = str(current["event_id"])
        if current_id in seen:
            mismatches.append("ANCESTRY_CYCLE")
            break
        seen.add(current_id)
        ancestry.append(current_id)
        parent = current.get("parent_event_id")
        if not parent:
            break
        parent = str(parent)
        if parent not in events:
            mismatches.append("PARENT_EVENT_MISSING")
            break
        parent_event = events[parent]
        if str(parent_event.get("session_id")) != str(event.get("session_id")):
            mismatches.append("CROSS_SESSION_ANCESTRY")
        current = parent_event
    else:
        mismatches.append("ANCESTRY_DEPTH_EXCEEDED")

    if mismatches:
        if risk == "read" and not any(code in mismatches for code in ("CONTENT_HASH_MISMATCH", "ANCESTRY_CYCLE")):
            verdict = "downgrade"
        else:
            verdict = "block"
    else:
        verdict = "allow"

    return {
        "verdict": verdict,
        "event_id": event_id,
        "role": role,
        "source": source,
        "risk": risk,
        "authoritative": role in AUTHORITATIVE_ROLES,
        "mismatches": sorted(set(mismatches)),
        "ancestry": ancestry,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ledger", type=Path, required=True)
    parser.add_argument("--event-id", required=True)
    parser.add_argument("--risk", choices=sorted(RISK_VALUES), default="privileged")
    parser.add_argument("--content-file", type=Path)
    args = parser.parse_args()

    try:
        events = load_ledger(args.ledger)
        content = args.content_file.read_bytes() if args.content_file else None
        result = attest(events, args.event_id, args.risk, content)
    except (OSError, ValueError) as exc:
        print(json.dumps({"verdict": "error", "error": str(exc)}, sort_keys=True))
        return 4

    print(json.dumps(result, sort_keys=True))
    return {"allow": 0, "downgrade": 2, "block": 3}[result["verdict"]]


if __name__ == "__main__":
    sys.exit(main())
