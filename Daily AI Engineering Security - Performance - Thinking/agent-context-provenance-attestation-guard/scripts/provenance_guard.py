#!/usr/bin/env python3
"""Validate authority-preserving provenance metadata for model-visible context events."""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

SHA256_RE = re.compile(r"^[0-9a-fA-F]{64}$")
VALID_ROLES = {"user", "assistant", "system", "tool"}
VALID_SOURCES = {"user_ingress", "assistant", "system", "harness", "tool", "subagent", "hook", "memory", "retrieval", "unknown"}
REQUIRED = {"event_id", "role", "source", "source_id", "transcript_recorded", "content_sha256"}


def validate_event(event: dict, line: int) -> list[dict]:
    violations: list[dict] = []
    eid = str(event.get("event_id", f"line:{line}"))
    missing = sorted(REQUIRED - event.keys())
    if missing:
        violations.append({"event_id": eid, "code": "missing_fields", "detail": missing})
        return violations
    if not str(event["event_id"]).strip() or not str(event["source_id"]).strip():
        violations.append({"event_id": eid, "code": "empty_identity_field"})
    if event["role"] not in VALID_ROLES:
        violations.append({"event_id": eid, "code": "invalid_role", "detail": event["role"]})
    if event["source"] not in VALID_SOURCES:
        violations.append({"event_id": eid, "code": "invalid_source", "detail": event["source"]})
    if not isinstance(event["transcript_recorded"], bool):
        violations.append({"event_id": eid, "code": "transcript_recorded_not_boolean"})
    if not isinstance(event["content_sha256"], str) or not SHA256_RE.fullmatch(event["content_sha256"]):
        violations.append({"event_id": eid, "code": "invalid_content_sha256"})

    if event["role"] == "user":
        if event["source"] != "user_ingress":
            violations.append({"event_id": eid, "code": "user_role_source_mismatch", "detail": event["source"]})
        if event.get("authenticated_user") is not True:
            violations.append({"event_id": eid, "code": "unauthenticated_user_authority"})
        if not str(event.get("ingress_event_id", "")).strip():
            violations.append({"event_id": eid, "code": "missing_ingress_binding"})
        if event.get("transcript_recorded") is not True:
            violations.append({"event_id": eid, "code": "user_event_not_durably_recorded"})

    if event["source"] in {"harness", "system"} and event["role"] == "user":
        violations.append({"event_id": eid, "code": "synthetic_event_impersonates_user"})
    if event["source"] == "unknown":
        violations.append({"event_id": eid, "code": "unknown_origin"})
    return violations


def validate_file(path: Path) -> dict:
    violations: list[dict] = []
    count = 0
    ids: set[str] = set()
    with path.open("r", encoding="utf-8") as handle:
        for line_no, raw in enumerate(handle, 1):
            if not raw.strip():
                continue
            try:
                event = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {line_no}: invalid JSON: {exc}") from exc
            if not isinstance(event, dict):
                raise ValueError(f"line {line_no}: event must be a JSON object")
            count += 1
            eid = str(event.get("event_id", ""))
            if eid and eid in ids:
                violations.append({"event_id": eid, "code": "duplicate_event_id"})
            ids.add(eid)
            violations.extend(validate_event(event, line_no))
    if count == 0:
        raise ValueError("no events found")
    return {"events": count, "violations": violations, "verified": not violations}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Normalized context events as JSONL")
    parser.add_argument("--json", dest="json_output", type=Path, help="Write report JSON")
    args = parser.parse_args()
    try:
        if not args.input.is_file():
            raise ValueError(f"input file not found: {args.input}")
        report = validate_file(args.input)
        rendered = json.dumps(report, indent=2, sort_keys=True)
        if args.json_output:
            args.json_output.parent.mkdir(parents=True, exist_ok=True)
            args.json_output.write_text(rendered + "\n", encoding="utf-8")
        print(rendered)
        return 0 if report["verified"] else 2
    except (OSError, ValueError) as exc:
        print(f"provenance_guard: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
