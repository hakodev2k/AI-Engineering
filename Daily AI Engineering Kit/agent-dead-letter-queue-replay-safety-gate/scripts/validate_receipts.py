#!/usr/bin/env python3
"""Verify execution receipts against an approved DLQ replay plan.

Receipt format: JSON array or {"receipts": [...]}. Each receipt must contain
message_id, status, attempt, timestamp. Optional destination is preserved.
Exit codes: 0 verified, 2 mismatch/failure, 3 input error.
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

SUCCESS = {"accepted", "processed", "already-processed"}


def load(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def write(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    p = argparse.ArgumentParser(description="Validate DLQ replay receipts")
    p.add_argument("--plan", required=True)
    p.add_argument("--receipts", required=True)
    p.add_argument("--out", required=True)
    a = p.parse_args()
    try:
        plan = load(Path(a.plan))
        raw = load(Path(a.receipts))
        if not isinstance(plan, dict):
            raise ValueError("plan must be a JSON object")
        receipts = raw.get("receipts") if isinstance(raw, dict) else raw
        if not isinstance(receipts, list):
            raise ValueError("receipts must be an array or an object containing a receipts array")
        planned = plan.get("message_ids")
        if not isinstance(planned, list) or not planned:
            raise ValueError("plan.message_ids must be a non-empty array")
        retry_limit = plan.get("execution_retry_limit")
        if not isinstance(retry_limit, int) or retry_limit < 0:
            raise ValueError("plan.execution_retry_limit must be a non-negative integer")

        errors: list[str] = []
        groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for i, rec in enumerate(receipts):
            if not isinstance(rec, dict):
                errors.append(f"receipt[{i}] is not an object")
                continue
            missing = [k for k in ("message_id", "status", "attempt", "timestamp") if k not in rec]
            if missing:
                errors.append(f"receipt[{i}] missing fields: {', '.join(missing)}")
                continue
            mid = rec["message_id"]
            if not isinstance(mid, str) or not mid:
                errors.append(f"receipt[{i}] has invalid message_id")
                continue
            if mid not in planned:
                errors.append(f"unplanned message_id in receipts: {mid}")
            attempt = rec["attempt"]
            if not isinstance(attempt, int) or isinstance(attempt, bool) or attempt < 1:
                errors.append(f"receipt[{i}] has invalid attempt")
            groups[mid].append(rec)

        max_attempts = retry_limit + 1
        for mid in planned:
            rs = groups.get(mid, [])
            if not rs:
                errors.append(f"missing receipt for planned message_id: {mid}")
                continue
            attempts = [r.get("attempt") for r in rs if isinstance(r.get("attempt"), int)]
            if attempts and max(attempts) > max_attempts:
                errors.append(f"message {mid} exceeded allowed attempts: {max(attempts)} > {max_attempts}")
            if len(set(attempts)) != len(attempts):
                errors.append(f"message {mid} has duplicate attempt numbers")
            ordered = sorted(rs, key=lambda r: r.get("attempt", 0))
            final_status = ordered[-1].get("status")
            if final_status not in SUCCESS:
                errors.append(f"message {mid} final status is not successful: {final_status!r}")

        result = {
            "status": "verified" if not errors else "failed",
            "planned_count": len(planned),
            "receipt_count": len(receipts),
            "errors": errors,
        }
        write(Path(a.out), result)
        print(json.dumps(result, sort_keys=True))
        return 0 if not errors else 2
    except (OSError, ValueError, TypeError) as exc:
        print(f"validate_receipts: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
