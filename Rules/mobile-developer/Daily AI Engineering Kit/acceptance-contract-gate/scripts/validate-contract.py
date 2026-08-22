#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED_TOP_LEVEL = {
    "task",
    "scope",
    "non_goals",
    "obligations",
    "assumptions",
    "ambiguities",
    "approvals",
}

REQUIRED_OBLIGATION_FIELDS = {"id", "description", "required", "status", "verification"}
ALLOWED_STATUSES = {"draft", "accepted", "implemented", "verified", "blocked"}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else "acceptance-contract.json")
    if not path.exists():
        fail(f"contract not found: {path}")

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON: {exc}")

    if not isinstance(data, dict):
        fail("contract root must be an object")

    missing = sorted(REQUIRED_TOP_LEVEL - set(data))
    if missing:
        fail(f"missing top-level fields: {', '.join(missing)}")

    if not isinstance(data["obligations"], list) or not data["obligations"]:
        fail("obligations must be a non-empty array")

    seen = set()
    for index, item in enumerate(data["obligations"]):
        if not isinstance(item, dict):
            fail(f"obligations[{index}] must be an object")
        missing_fields = REQUIRED_OBLIGATION_FIELDS - set(item)
        if missing_fields:
            fail(f"obligation {index} missing: {', '.join(sorted(missing_fields))}")
        oid = item["id"]
        if not isinstance(oid, str) or not oid.strip():
            fail(f"obligation {index} has invalid id")
        if oid in seen:
            fail(f"duplicate obligation id: {oid}")
        seen.add(oid)
        if item["status"] not in ALLOWED_STATUSES:
            fail(f"{oid} has invalid status: {item['status']}")
        if not isinstance(item["verification"], list) or not item["verification"]:
            fail(f"{oid} must define at least one verification method")

    for field in ("non_goals", "assumptions", "ambiguities", "approvals"):
        if not isinstance(data[field], list):
            fail(f"{field} must be an array")

    print(f"OK: {path} is structurally valid with {len(data['obligations'])} obligations")


if __name__ == "__main__":
    main()
