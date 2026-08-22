#!/usr/bin/env python3
"""Dependency-free validator for the required security subset of the memory envelope."""
import argparse, datetime as dt, json, pathlib, sys

REQUIRED = {
    "memory_id", "tenant_id", "source_type", "source_id", "created_at",
    "authority", "validation_status", "lineage_id", "content"
}
SOURCE_TYPES = {"user", "tool", "retrieval", "operator", "system", "derived-summary", "import"}
AUTHORITIES = {"untrusted-observation", "user-assertion", "verified-fact", "confirmed-preference", "operator-policy"}
STATUSES = {"quarantined", "unverified", "validated", "confirmed"}


def valid_datetime(value: str) -> bool:
    try:
        dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except Exception:
        return False


def validate(record: dict) -> list[str]:
    errors = []
    if not isinstance(record, dict):
        return ["record must be a JSON object"]
    missing = sorted(REQUIRED - set(record))
    if missing:
        errors.append("missing required fields: " + ", ".join(missing))
    for field in ("memory_id", "tenant_id", "source_id", "lineage_id", "content"):
        if field in record and (not isinstance(record[field], str) or not record[field].strip()):
            errors.append(f"{field} must be a non-empty string")
    if record.get("source_type") not in SOURCE_TYPES:
        errors.append("invalid source_type")
    if record.get("authority") not in AUTHORITIES:
        errors.append("invalid authority")
    if record.get("validation_status") not in STATUSES:
        errors.append("invalid validation_status")
    if "created_at" in record and (not isinstance(record["created_at"], str) or not valid_datetime(record["created_at"])):
        errors.append("created_at must be ISO-8601")
    parents = record.get("parent_memory_ids", [])
    if not isinstance(parents, list) or any(not isinstance(x, str) or not x for x in parents) or len(parents) != len(set(parents)):
        errors.append("parent_memory_ids must be a unique string array")
    authority = record.get("authority")
    status = record.get("validation_status")
    if authority in {"confirmed-preference", "operator-policy"}:
        if status != "confirmed" or not isinstance(record.get("confirmed_by"), str) or not record.get("confirmed_by", "").strip():
            errors.append("confirmed-preference/operator-policy requires validation_status=confirmed and confirmed_by")
    if record.get("source_type") in {"user", "tool", "retrieval"} and authority == "operator-policy":
        errors.append("untrusted source_type cannot directly create operator-policy")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("record")
    parser.add_argument("--expected-tenant")
    args = parser.parse_args()
    try:
        record = json.loads(pathlib.Path(args.record).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"status": "error", "errors": [str(exc)]}), file=sys.stderr)
        return 2
    errors = validate(record)
    if args.expected_tenant and record.get("tenant_id") != args.expected_tenant:
        errors.append("tenant_id does not match expected tenant")
    print(json.dumps({"status": "pass" if not errors else "blocked", "errors": errors}, indent=2))
    return 0 if not errors else 3


if __name__ == "__main__":
    raise SystemExit(main())
