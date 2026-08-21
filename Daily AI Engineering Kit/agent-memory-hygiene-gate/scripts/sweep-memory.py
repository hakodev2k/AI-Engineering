#!/usr/bin/env python3
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def parse_dt(value: str) -> datetime:
    dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        raise ValueError("timezone required")
    return dt.astimezone(timezone.utc)


def main() -> int:
    p = argparse.ArgumentParser(description="Sweep durable agent memory for invalid, expired, or conflicting records.")
    p.add_argument("--policy", required=True)
    p.add_argument("--dir", required=True)
    args = p.parse_args()

    try:
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        root = Path(args.dir)
        files = sorted(root.glob("*.json"))
    except Exception as exc:
        print(f"operational-error: {exc}", file=sys.stderr)
        return 2

    now = datetime.now(timezone.utc)
    records = {}
    issues = []

    for path in files:
        try:
            record = json.loads(path.read_text(encoding="utf-8"))
            rid = record["id"]
            if rid in records:
                issues.append(f"duplicate-id:{rid}")
            records[rid] = record
            if record.get("kind") not in policy.get("allowed_kinds", []):
                issues.append(f"invalid-kind:{rid}")
            if parse_dt(record["expires_at"]) <= now:
                issues.append(f"expired:{rid}")
            if record.get("status") in {"conflicted", "revoked", "superseded"}:
                issues.append(f"inactive:{rid}:{record.get('status')}")
            forbidden = set(policy.get("forbidden_sensitive_categories", []))
            if forbidden & set(record.get("sensitive_categories") or []):
                issues.append(f"forbidden-sensitive:{rid}")
        except Exception as exc:
            issues.append(f"invalid-record:{path.name}:{exc}")

    for rid, record in records.items():
        for other in record.get("conflicts_with") or []:
            if other in records:
                issues.append(f"conflict:{rid}:{other}")

    active = sorted(
        rid for rid, r in records.items()
        if r.get("status") == "active"
        and parse_dt(r["expires_at"]) > now
        and not (set(policy.get("forbidden_sensitive_categories", [])) & set(r.get("sensitive_categories") or []))
        and not r.get("conflicts_with")
    )

    print(json.dumps({"active": active, "issues": sorted(set(issues))}, indent=2))
    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
