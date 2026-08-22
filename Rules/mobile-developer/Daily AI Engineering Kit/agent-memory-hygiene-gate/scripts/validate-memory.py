#!/usr/bin/env python3
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REQUIRED = {
    "id", "kind", "claim", "scope", "source", "observed_at", "confidence",
    "expires_at", "sensitive_categories", "status", "conflicts_with"
}


def parse_dt(value: str) -> datetime:
    v = value.replace("Z", "+00:00")
    dt = datetime.fromisoformat(v)
    if dt.tzinfo is None:
        raise ValueError("timestamp must include timezone")
    return dt.astimezone(timezone.utc)


def main() -> int:
    p = argparse.ArgumentParser(description="Validate an agent memory record against repository policy.")
    p.add_argument("--policy", required=True)
    p.add_argument("--record", required=True)
    args = p.parse_args()

    try:
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        record = json.loads(Path(args.record).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"operational-error: {exc}", file=sys.stderr)
        return 2

    errors = []
    missing = sorted(REQUIRED - set(record))
    if missing:
        errors.append("missing fields: " + ", ".join(missing))

    kind = record.get("kind")
    if kind not in policy.get("allowed_kinds", []):
        errors.append(f"kind not allowed: {kind}")

    confidence = record.get("confidence")
    if not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
        errors.append("confidence must be between 0 and 1")
    elif confidence < policy.get("minimum_confidence", 0):
        errors.append("confidence below policy minimum")

    sensitive = set(record.get("sensitive_categories") or [])
    forbidden = set(policy.get("forbidden_sensitive_categories", []))
    hits = sorted(sensitive & forbidden)
    if hits:
        errors.append("forbidden sensitive categories: " + ", ".join(hits))

    if record.get("status") not in {"active", "superseded", "conflicted", "revoked"}:
        errors.append("invalid status")

    try:
        observed = parse_dt(record.get("observed_at", ""))
        expires = parse_dt(record.get("expires_at", ""))
        if expires <= observed:
            errors.append("expires_at must be after observed_at")
        max_days = policy.get("maximum_ttl_days", 180)
        if (expires - observed).total_seconds() > max_days * 86400:
            errors.append(f"TTL exceeds maximum {max_days} days")
        if expires <= datetime.now(timezone.utc):
            errors.append("record is already expired")
    except Exception as exc:
        errors.append(f"invalid timestamp: {exc}")

    for field in ("id", "claim", "scope", "source"):
        if not isinstance(record.get(field), str) or not record.get(field, "").strip():
            errors.append(f"{field} must be a non-empty string")

    if not isinstance(record.get("conflicts_with"), list):
        errors.append("conflicts_with must be an array")

    if errors:
        for err in errors:
            print(f"policy-violation: {err}", file=sys.stderr)
        return 1

    print(f"valid-memory: {record['id']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
