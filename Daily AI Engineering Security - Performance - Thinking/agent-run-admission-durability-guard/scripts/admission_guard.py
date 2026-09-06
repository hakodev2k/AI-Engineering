#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

TERMINAL = {None, "completed", "failed", "cancelled"}
REQUIRED = {
    "run_id", "idempotency_key", "admission_persisted",
    "acceptance_acknowledged", "execution_started",
    "terminal_state", "recovery_enqueued", "recovery_attempts",
}

def validate(records):
    errors = []
    if not isinstance(records, list):
        return ["ledger_must_be_array"]
    seen_runs = {}
    seen_keys = {}
    for i, r in enumerate(records):
        prefix = f"record[{i}]"
        if not isinstance(r, dict):
            errors.append(f"{prefix}:must_be_object")
            continue
        missing = sorted(REQUIRED - set(r))
        if missing:
            errors.append(f"{prefix}:missing:{','.join(missing)}")
            continue
        run_id = r["run_id"]
        key = r["idempotency_key"]
        if not isinstance(run_id, str) or not run_id.strip():
            errors.append(f"{prefix}:invalid_run_id")
        if not isinstance(key, str) or not key.strip():
            errors.append(f"{prefix}:invalid_idempotency_key")
        for field in ("admission_persisted", "acceptance_acknowledged", "execution_started", "recovery_enqueued"):
            if not isinstance(r[field], bool):
                errors.append(f"{prefix}:{field}_must_be_bool")
        if r["terminal_state"] not in TERMINAL:
            errors.append(f"{prefix}:invalid_terminal_state")
        attempts = r["recovery_attempts"]
        if not isinstance(attempts, int) or isinstance(attempts, bool) or attempts < 0:
            errors.append(f"{prefix}:invalid_recovery_attempts")
        elif attempts > 2:
            errors.append(f"{prefix}:recovery_attempts_exceeded")
        if isinstance(run_id, str) and run_id.strip():
            if run_id in seen_runs:
                errors.append(f"{prefix}:duplicate_run_id:{run_id}")
            else:
                seen_runs[run_id] = i
        if isinstance(key, str) and key.strip():
            if key in seen_keys:
                errors.append(f"{prefix}:duplicate_idempotency_key:{key}")
            else:
                seen_keys[key] = i
        persisted = r["admission_persisted"] is True
        ack = r["acceptance_acknowledged"] is True
        started = r["execution_started"] is True
        recovery = r["recovery_enqueued"] is True
        terminal = r["terminal_state"]
        if ack and not persisted:
            errors.append(f"{prefix}:ack_before_durable_admission")
        if started and not persisted:
            errors.append(f"{prefix}:execution_without_admission")
        if terminal is not None and not persisted:
            errors.append(f"{prefix}:terminal_without_admission")
        if ack and terminal is None and not started and not recovery:
            errors.append(f"{prefix}:accepted_run_unreconciled")
    return errors

def main():
    ap = argparse.ArgumentParser(description="Validate durable agent-run admission ledger invariants")
    ap.add_argument("ledger", type=Path)
    args = ap.parse_args()
    try:
        records = json.loads(args.ledger.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    errors = validate(records)
    if errors:
        print("BLOCK")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"PASS: {len(records)} run record(s) satisfy durable admission and reconciliation invariants")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
