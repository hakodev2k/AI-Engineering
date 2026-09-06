#!/usr/bin/env python3
"""Validate a delegated-agent event against canonical parent/worker lineage."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_EVENT = {"run_id", "parent_task_id", "worker_task_id", "destination_task_id", "event_type"}


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def validate(registry: dict[str, Any], event: dict[str, Any]) -> dict[str, Any]:
    missing = sorted(REQUIRED_EVENT - set(event))
    if missing:
        return {"accepted": False, "reason": "missing_event_fields", "missing": missing}

    run_id = str(event["run_id"])
    parent_id = str(event["parent_task_id"])
    worker_id = str(event["worker_task_id"])
    destination_id = str(event["destination_task_id"])

    if str(registry.get("run_id", "")) != run_id:
        return {"accepted": False, "reason": "run_id_mismatch"}

    workers = registry.get("workers")
    if not isinstance(workers, dict):
        return {"accepted": False, "reason": "invalid_registry_workers"}

    worker = workers.get(worker_id)
    if not isinstance(worker, dict):
        return {"accepted": False, "reason": "unknown_worker"}

    canonical_parent = str(worker.get("parent_task_id", ""))
    if canonical_parent != parent_id:
        return {
            "accepted": False,
            "reason": "parent_lineage_mismatch",
            "expected_parent_task_id": canonical_parent,
        }

    allowed = worker.get("allowed_destinations", [canonical_parent])
    if not isinstance(allowed, list) or not all(isinstance(x, str) for x in allowed):
        return {"accepted": False, "reason": "invalid_allowed_destinations"}

    if destination_id not in allowed:
        return {
            "accepted": False,
            "reason": "destination_not_allowed",
            "allowed_destinations": allowed,
        }

    if destination_id != canonical_parent and not bool(worker.get("cross_task_routing_explicit", False)):
        return {"accepted": False, "reason": "cross_task_route_not_explicit"}

    event_seq = event.get("sequence")
    last_seq = worker.get("last_sequence")
    if event_seq is not None:
        if not isinstance(event_seq, int) or event_seq < 0:
            return {"accepted": False, "reason": "invalid_sequence"}
        if isinstance(last_seq, int) and event_seq <= last_seq:
            return {"accepted": False, "reason": "stale_or_replayed_sequence", "last_sequence": last_seq}

    event_type = str(event["event_type"])
    if event_type in {"completed", "failed", "cancelled"}:
        canonical_status = str(worker.get("status", ""))
        if canonical_status and canonical_status != event_type:
            return {
                "accepted": False,
                "reason": "terminal_state_mismatch",
                "canonical_status": canonical_status,
            }

    return {
        "accepted": True,
        "reason": "lineage_verified",
        "lineage": {
            "run_id": run_id,
            "parent_task_id": parent_id,
            "worker_task_id": worker_id,
            "destination_task_id": destination_id,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", required=True, help="Canonical lineage registry JSON")
    parser.add_argument("--event", required=True, help="Candidate event JSON")
    args = parser.parse_args()

    try:
        registry = load_json(args.registry)
        event = load_json(args.event)
        if not isinstance(registry, dict) or not isinstance(event, dict):
            raise ValueError("registry and event must both be JSON objects")
    except ValueError as exc:
        print(json.dumps({"accepted": False, "reason": "invalid_input", "error": str(exc)}))
        return 3

    verdict = validate(registry, event)
    print(json.dumps(verdict, sort_keys=True))
    return 0 if verdict.get("accepted") else 2


if __name__ == "__main__":
    sys.exit(main())
