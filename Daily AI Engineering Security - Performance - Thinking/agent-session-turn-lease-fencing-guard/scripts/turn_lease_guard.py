#!/usr/bin/env python3
"""Validate single-writer lease/fencing invariants in JSONL agent session events."""
import argparse
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def load_events(path):
    try:
        lines = Path(path).read_text(encoding="utf-8").splitlines()
    except Exception as exc:
        raise ValueError(f"cannot read events {path}: {exc}") from exc
    events = []
    for number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSONL line {number}: {exc}") from exc
        if not isinstance(item, dict):
            raise ValueError(f"line {number} must be a JSON object")
        item["_line"] = number
        events.append(item)
    return events


def validate(policy, events):
    active = {}          # session -> {actor, epoch}
    highest_epoch = {}   # session -> highest granted epoch
    operations = {}      # (session, operation_id) -> first line
    violations = []

    def violation(event, code, detail):
        violations.append({
            "line": event.get("_line"),
            "session_id": event.get("session_id"),
            "code": code,
            "detail": detail,
        })

    for event in events:
        session = event.get("session_id")
        kind = event.get("type")
        if not isinstance(session, str) or not session:
            violation(event, "invalid_session", "session_id is required")
            continue
        if kind == "lease_grant":
            actor, epoch = event.get("actor_id"), event.get("epoch")
            if not isinstance(actor, str) or not isinstance(epoch, int) or epoch < 1:
                violation(event, "invalid_grant", "actor_id and positive integer epoch required")
                continue
            if session in active:
                violation(event, "overlapping_lease", f"active lease already held by {active[session]['actor_id']}")
            prior = highest_epoch.get(session, 0)
            if policy.get("require_monotonic_epoch", True) and epoch <= prior:
                violation(event, "epoch_not_monotonic", f"epoch {epoch} <= prior {prior}")
            highest_epoch[session] = max(prior, epoch)
            active[session] = {"actor_id": actor, "epoch": epoch}
        elif kind == "lease_revoke":
            lease = active.get(session)
            if lease is None:
                violation(event, "revoke_without_lease", "no active lease")
                continue
            epoch = event.get("epoch")
            if epoch != lease["epoch"]:
                violation(event, "revoke_epoch_mismatch", f"expected {lease['epoch']}, got {epoch}")
                continue
            active.pop(session, None)
        elif kind == "mutation":
            if not policy.get("require_lease_for_mutation", True):
                continue
            lease = active.get(session)
            if lease is None:
                violation(event, "mutation_without_lease", "no active mutation lease")
                continue
            epoch, actor = event.get("epoch"), event.get("actor_id")
            if policy.get("block_stale_epoch", True) and epoch != lease["epoch"]:
                violation(event, "stale_epoch", f"current {lease['epoch']}, got {epoch}")
            if actor != lease["actor_id"]:
                violation(event, "wrong_actor", f"current {lease['actor_id']}, got {actor}")
            op = event.get("operation_id")
            if policy.get("require_unique_operation_id", True):
                if not isinstance(op, str) or not op:
                    violation(event, "missing_operation_id", "mutation requires operation_id")
                else:
                    key = (session, op)
                    if key in operations:
                        violation(event, "duplicate_operation_id", f"first seen line {operations[key]}")
                    else:
                        operations[key] = event.get("_line")
        elif kind == "read":
            if not policy.get("allow_read_only_without_lease", True) and session not in active:
                violation(event, "read_without_lease", "policy requires lease")
        else:
            violation(event, "unknown_event_type", f"unsupported type {kind!r}")

    return {
        "status": "ok" if not violations else "violation",
        "events_checked": len(events),
        "violations": violations,
        "active_leases_at_end": active,
        "highest_epoch": highest_epoch,
    }


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    check = sub.add_parser("check")
    check.add_argument("--policy", required=True)
    check.add_argument("--events", required=True)
    args = parser.parse_args()
    try:
        policy = load_json(args.policy)
        events = load_events(args.events)
        result = validate(policy, events)
    except ValueError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}, sort_keys=True))
        return 3
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["status"] == "ok" else 2


if __name__ == "__main__":
    sys.exit(main())
