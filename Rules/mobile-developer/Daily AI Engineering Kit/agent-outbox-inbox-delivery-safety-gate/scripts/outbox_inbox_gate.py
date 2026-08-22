#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_structured(path: Path):
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        return json.loads(text)
    try:
        import yaml  # type: ignore
    except ImportError as exc:
        raise RuntimeError("PyYAML is required for YAML policy files: pip install pyyaml") from exc
    return yaml.safe_load(text)


def require_bool(obj, key, errors, label):
    value = obj.get(key)
    if not isinstance(value, bool):
        errors.append(f"{label}.{key} must be boolean")
        return False
    return value


def validate(snapshot, policy):
    errors = []
    evidence = []

    outbox = snapshot.get("outbox", {})
    inbox = snapshot.get("inbox", {})
    effects = snapshot.get("effects", {})

    required_sections = {"outbox": outbox, "inbox": inbox, "effects": effects}
    for name, section in required_sections.items():
        if not isinstance(section, dict):
            errors.append(f"{name} must be an object")

    if errors:
        return {"status": "block", "errors": errors, "evidence": evidence}

    transactional_enqueue = require_bool(outbox, "transactionalEnqueue", errors, "outbox")
    stable_event_id = require_bool(outbox, "stableEventId", errors, "outbox")
    bounded_retries = require_bool(outbox, "boundedRetries", errors, "outbox")
    mark_after_ack = require_bool(outbox, "markDeliveredAfterAck", errors, "outbox")
    crash_recoverable = require_bool(outbox, "crashRecoverable", errors, "outbox")

    atomic_dedupe = require_bool(inbox, "atomicDedupe", errors, "inbox")
    durable_identity = require_bool(inbox, "durableIdentity", errors, "inbox")
    ack_after_commit = require_bool(inbox, "ackAfterCommit", errors, "inbox")
    bounded_consumer_retries = require_bool(inbox, "boundedRetries", errors, "inbox")

    side_effect_count = effects.get("sideEffectCountAfterDuplicateDelivery")
    if not isinstance(side_effect_count, int) or side_effect_count < 0:
        errors.append("effects.sideEffectCountAfterDuplicateDelivery must be a non-negative integer")
        side_effect_count = -1

    external_idempotency = effects.get("externalSideEffectsIdempotentOrReconciled")
    if not isinstance(external_idempotency, bool):
        errors.append("effects.externalSideEffectsIdempotentOrReconciled must be boolean")
        external_idempotency = False

    max_attempts = policy.get("outbox", {}).get("max_attempts", 5)
    observed_attempts = outbox.get("maxObservedAttempts")
    if not isinstance(observed_attempts, int) or observed_attempts < 1:
        errors.append("outbox.maxObservedAttempts must be a positive integer")
    elif observed_attempts > max_attempts:
        errors.append(f"outbox.maxObservedAttempts={observed_attempts} exceeds policy max_attempts={max_attempts}")

    checks = {
        "transactional enqueue": transactional_enqueue,
        "stable event id": stable_event_id,
        "bounded producer retries": bounded_retries,
        "mark delivered after acknowledgement": mark_after_ack,
        "dispatcher crash recovery": crash_recoverable,
        "atomic inbox dedupe": atomic_dedupe,
        "durable inbox identity": durable_identity,
        "acknowledge after commit": ack_after_commit,
        "bounded consumer retries": bounded_consumer_retries,
        "single business effect after duplicate delivery": side_effect_count == 1,
        "external side effects idempotent or reconciled": external_idempotency,
    }

    for name, passed in checks.items():
        evidence.append(f"{'PASS' if passed else 'FAIL'}: {name}")
        if not passed:
            errors.append(f"failed check: {name}")

    approval_required = snapshot.get("approvalRequired", False)
    approval_present = snapshot.get("approvalPresent", False)
    if approval_required and not approval_present:
        errors.append("dangerous operation requires explicit human approval")
        status = "needs-approval"
    else:
        status = "pass" if not errors else "block"

    return {
        "status": status,
        "eventId": str(snapshot.get("eventId", "unknown")),
        "idempotencyKey": str(snapshot.get("idempotencyKey", "unknown")),
        "evidence": evidence,
        "verification": {
            "transactionalEnqueue": transactional_enqueue,
            "dedupeObserved": atomic_dedupe and durable_identity,
            "sideEffectCount": max(side_effect_count, 0),
        },
        "errors": errors,
    }


def main():
    parser = argparse.ArgumentParser(description="Validate outbox/inbox delivery safety evidence")
    parser.add_argument("--input", required=True, help="Delivery evidence snapshot JSON")
    parser.add_argument("--policy", required=True, help="Policy YAML or JSON")
    parser.add_argument("--output", required=False, help="Write result JSON to this path")
    args = parser.parse_args()

    try:
        snapshot = load_structured(Path(args.input))
        policy = load_structured(Path(args.policy))
        if not isinstance(snapshot, dict) or not isinstance(policy, dict):
            raise ValueError("input and policy roots must be objects")
        result = validate(snapshot, policy)
    except (OSError, ValueError, json.JSONDecodeError, RuntimeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    encoded = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        try:
            Path(args.output).write_text(encoded + "\n", encoding="utf-8")
        except OSError as exc:
            print(f"ERROR: unable to write output: {exc}", file=sys.stderr)
            return 2
    print(encoded)
    return 0 if result["status"] == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main())
