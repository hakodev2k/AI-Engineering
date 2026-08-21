#!/usr/bin/env python3
"""Deterministic reference gate for resource-scoped provider quota admission.

This tool never performs provider requests. It evaluates JSON state/request fixtures so
runtime implementations can be tested without consuming quota or credentials.
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

VALID_STATES = {"open", "closed", "cooldown", "half_open"}


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def parse_time(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"invalid ISO time: {value}") from exc
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def resource_key(obj: dict[str, Any]) -> str | None:
    key = obj.get("resource_key")
    if key is None:
        return None
    if not isinstance(key, str) or not key.strip():
        raise ValueError("resource_key must be a non-empty string when present")
    return key


def decide(state_doc: dict[str, Any], request: dict[str, Any], now: datetime | None = None) -> dict[str, Any]:
    now = now or datetime.now(timezone.utc)
    kind = request.get("kind", "provider")
    if kind in {"local", "mcp"}:
        return {"decision": "allow", "reason": "non_provider_work"}

    key = resource_key(request)
    if key is None:
        return {"decision": "allow", "reason": "resource_scope_unknown_unshared"}

    resources = state_doc.get("resources", {})
    if not isinstance(resources, dict):
        raise ValueError("state.resources must be an object")
    entry = resources.get(key)
    if entry is None:
        return {"decision": "allow", "reason": "resource_not_tripped", "resource_key": key}
    if not isinstance(entry, dict):
        raise ValueError(f"state for {key} must be an object")

    status = entry.get("status", "open")
    if status not in VALID_STATES:
        raise ValueError(f"invalid status for {key}: {status}")
    generation = entry.get("generation", 0)
    if not isinstance(generation, int) or generation < 0:
        raise ValueError("generation must be a non-negative integer")

    if status == "open":
        return {"decision": "allow", "reason": "resource_open", "resource_key": key, "generation": generation}

    reset_at = parse_time(entry.get("reset_at"))
    if status in {"closed", "cooldown"}:
        if reset_at is None or now < reset_at:
            return {
                "decision": "deny",
                "reason": "resource_unavailable",
                "resource_key": key,
                "generation": generation,
                "reset_at": entry.get("reset_at"),
            }
        if entry.get("probe_claimed", False):
            return {
                "decision": "deny",
                "reason": "half_open_probe_already_claimed",
                "resource_key": key,
                "generation": generation,
            }
        return {
            "decision": "probe",
            "reason": "cooldown_elapsed",
            "resource_key": key,
            "generation": generation,
        }

    # half_open is represented explicitly when a runtime has already claimed a probe.
    return {
        "decision": "deny",
        "reason": "half_open_probe_in_flight",
        "resource_key": key,
        "generation": generation,
    }


def verify(path: str) -> int:
    fixture = load_json(path)
    cases = fixture.get("cases") if isinstance(fixture, dict) else None
    if not isinstance(cases, list) or not cases:
        raise ValueError("fixture must contain a non-empty cases array")
    failures: list[str] = []
    for i, case in enumerate(cases, start=1):
        if not isinstance(case, dict):
            failures.append(f"case {i}: not an object")
            continue
        try:
            now = parse_time(case.get("now")) or datetime.now(timezone.utc)
            actual = decide(case.get("state", {}), case.get("request", {}), now)
            expected = case.get("expected")
            if actual.get("decision") != expected:
                failures.append(f"case {i} {case.get('name','')}: expected {expected}, got {actual.get('decision')}")
        except Exception as exc:  # fixture verifier should report all cases
            failures.append(f"case {i} {case.get('name','')}: {exc}")
    if failures:
        for failure in failures:
            print(failure, file=sys.stderr)
        return 1
    print(f"verified {len(cases)} admission cases")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_dec = sub.add_parser("decision")
    p_dec.add_argument("--state", required=True)
    p_dec.add_argument("--request", required=True)
    p_dec.add_argument("--now")
    p_ver = sub.add_parser("verify")
    p_ver.add_argument("fixture")
    args = parser.parse_args()
    try:
        if args.cmd == "decision":
            state = load_json(args.state)
            request = load_json(args.request)
            if not isinstance(state, dict) or not isinstance(request, dict):
                raise ValueError("state and request must be JSON objects")
            result = decide(state, request, parse_time(args.now) if args.now else None)
            print(json.dumps(result, indent=2, sort_keys=True))
            return 0 if result["decision"] in {"allow", "probe"} else 3
        return verify(args.fixture)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
