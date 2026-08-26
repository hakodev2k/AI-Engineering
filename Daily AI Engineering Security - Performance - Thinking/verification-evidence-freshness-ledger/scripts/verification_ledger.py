#!/usr/bin/env python3
"""Evaluate whether verification evidence is fresh for an exact revision."""
import argparse
import datetime as dt
import hashlib
import json
import sys
from pathlib import Path

VALID_STATUS = {"passed", "failed", "blocked"}


def parse_time(value):
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"
    parsed = dt.datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        raise ValueError("timestamp must include timezone")
    return parsed.astimezone(dt.timezone.utc)


def validate_record(record):
    required = ("evidence_id", "revision", "command", "status", "timestamp")
    missing = [key for key in required if key not in record]
    if missing:
        raise ValueError("missing fields: " + ",".join(missing))
    if not all(isinstance(record[key], str) and record[key] for key in required):
        raise ValueError("required fields must be non-empty strings")
    if record["status"] not in VALID_STATUS:
        raise ValueError("invalid status")
    parse_time(record["timestamp"])


def load_records(path):
    rows = []
    for number, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            record = json.loads(line)
            validate_record(record)
            rows.append(record)
        except Exception as exc:
            raise ValueError(f"line {number}: {exc}") from exc
    return rows


def evidence_key(record):
    raw = "\0".join([
        record["revision"], record["command"], record["status"], record["evidence_id"]
    ])
    return hashlib.sha256(raw.encode()).hexdigest()[:20]


def evaluate(records, current_revision, max_age_seconds, now):
    if max_age_seconds < 0:
        raise ValueError("max_age_seconds must be non-negative")
    current = [record for record in records if record["revision"] == current_revision]
    if not current:
        return {"ok": False, "decision": "block", "reason": "no_evidence_for_current_revision"}
    ranked = sorted(current, key=lambda record: parse_time(record["timestamp"]), reverse=True)
    latest = ranked[0]
    age = (now.astimezone(dt.timezone.utc) - parse_time(latest["timestamp"])).total_seconds()
    if age < 0:
        return {"ok": False, "decision": "block", "reason": "evidence_timestamp_in_future", "evidence_id": latest["evidence_id"]}
    if latest["status"] != "passed":
        return {"ok": False, "decision": "block", "reason": "latest_evidence_not_passing", "status": latest["status"], "evidence_id": latest["evidence_id"]}
    if age > max_age_seconds:
        return {"ok": False, "decision": "block", "reason": "passing_evidence_stale", "age_seconds": int(age), "evidence_id": latest["evidence_id"]}
    return {
        "ok": True,
        "decision": "allow_completion",
        "reason": "fresh_passing_evidence",
        "age_seconds": int(age),
        "evidence_id": latest["evidence_id"],
        "evidence_key": evidence_key(latest),
        "revision": current_revision,
        "command": latest["command"],
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--records", required=True)
    parser.add_argument("--revision", required=True)
    parser.add_argument("--max-age-seconds", type=int, default=3600)
    parser.add_argument("--now", help="ISO-8601 timestamp; defaults to current UTC time")
    args = parser.parse_args()
    try:
        records = load_records(args.records)
        now = parse_time(args.now) if args.now else dt.datetime.now(dt.timezone.utc)
        result = evaluate(records, args.revision, args.max_age_seconds, now)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result["ok"] else 3
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
