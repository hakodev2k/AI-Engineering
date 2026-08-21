#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_json(path: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"ERROR: file not found: {path}", file=sys.stderr)
        sys.exit(2)
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON in {path}: {exc}", file=sys.stderr)
        sys.exit(2)


def main():
    parser = argparse.ArgumentParser(description="Calculate approximate active context budget usage from a context ledger.")
    parser.add_argument("--ledger", required=True)
    parser.add_argument("--config", required=True)
    args = parser.parse_args()

    ledger = load_json(args.ledger)
    config = load_json(args.config)

    total_budget = int(config.get("total_budget_units", 0))
    reserved = int(config.get("reserved_budget_units", 0))
    warning_ratio = float(config.get("warning_ratio", 0.8))
    max_active_items = int(config.get("max_active_items", 0))

    if total_budget <= 0:
        print("ERROR: total_budget_units must be greater than zero", file=sys.stderr)
        return 2
    if reserved < 0 or reserved >= total_budget:
        print("ERROR: reserved_budget_units must be >= 0 and < total_budget_units", file=sys.stderr)
        return 2

    items = ledger.get("items", [])
    active = [item for item in items if item.get("status") == "active"]
    estimated = 0
    for item in active:
        value = item.get("estimated_units", 0)
        if not isinstance(value, int) or value < 0:
            print(f"ERROR: invalid estimated_units for item {item.get('id', '<unknown>')}", file=sys.stderr)
            return 2
        estimated += value

    usable = total_budget - reserved
    ratio = estimated / usable if usable else 1.0

    result = {
        "total_budget_units": total_budget,
        "reserved_budget_units": reserved,
        "usable_budget_units": usable,
        "active_items": len(active),
        "estimated_active_units": estimated,
        "usage_ratio": round(ratio, 4),
        "warning_ratio": warning_ratio,
        "within_budget": estimated <= usable,
        "within_item_limit": (max_active_items <= 0 or len(active) <= max_active_items),
    }
    print(json.dumps(result, indent=2))

    if max_active_items > 0 and len(active) > max_active_items:
        print("ERROR: active context item limit exceeded", file=sys.stderr)
        return 1
    if estimated > usable:
        print("ERROR: active context budget exceeded", file=sys.stderr)
        return 1
    if ratio >= warning_ratio:
        print("WARNING: context usage reached warning threshold", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
