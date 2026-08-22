#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED_TOP = {"task", "decision_questions", "items"}
REQUIRED_ITEM = {"id", "source", "purpose", "tier", "status", "summary", "freshness", "reread_condition", "estimated_units"}
ALLOWED_TIERS = {"critical", "supporting", "reference", "discardable"}
ALLOWED_STATUS = {"active", "compressed", "stale", "discarded"}


def fail(message: str) -> int:
    print(f"ERROR: {message}", file=sys.stderr)
    return 1


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate-context-ledger.py <context-ledger.json>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    if not path.exists():
        return fail(f"file not found: {path}")

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return fail(f"invalid JSON: {exc}")

    missing = REQUIRED_TOP - set(data)
    if missing:
        return fail(f"missing top-level fields: {sorted(missing)}")
    if not isinstance(data["decision_questions"], list):
        return fail("decision_questions must be an array")
    if not isinstance(data["items"], list):
        return fail("items must be an array")

    seen_ids = set()
    for index, item in enumerate(data["items"]):
        if not isinstance(item, dict):
            return fail(f"item {index} must be an object")
        missing_item = REQUIRED_ITEM - set(item)
        if missing_item:
            return fail(f"item {index} missing fields: {sorted(missing_item)}")
        if item["id"] in seen_ids:
            return fail(f"duplicate item id: {item['id']}")
        seen_ids.add(item["id"])
        if item["tier"] not in ALLOWED_TIERS:
            return fail(f"invalid tier for {item['id']}: {item['tier']}")
        if item["status"] not in ALLOWED_STATUS:
            return fail(f"invalid status for {item['id']}: {item['status']}")
        if not isinstance(item["estimated_units"], int) or item["estimated_units"] < 0:
            return fail(f"estimated_units must be a non-negative integer for {item['id']}")
        if item["status"] == "active" and not str(item["purpose"]).strip():
            return fail(f"active item {item['id']} must have a purpose")
        if item["tier"] == "critical" and item["status"] == "discarded":
            return fail(f"critical item {item['id']} cannot be discarded")
        if item["status"] in {"compressed", "stale"} and not str(item["reread_condition"]).strip():
            return fail(f"{item['status']} item {item['id']} requires a reread_condition")

    print(f"OK: ledger valid ({len(data['items'])} items, {len(data['decision_questions'])} decision questions)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
