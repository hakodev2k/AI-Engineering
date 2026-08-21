#!/usr/bin/env python3
"""Audit an agent runtime ownership registry against an observed process snapshot.

This tool is deliberately non-destructive: it never sends signals. `plan` emits
only process identities that a host lifecycle manager may consider for cleanup.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def index_processes(items: Any) -> dict[int, dict[str, Any]]:
    if not isinstance(items, list):
        raise ValueError("process snapshot must be a JSON array")
    out: dict[int, dict[str, Any]] = {}
    for item in items:
        if not isinstance(item, dict):
            raise ValueError("each process entry must be an object")
        pid = item.get("pid")
        started = item.get("start_time")
        if not isinstance(pid, int) or pid <= 0 or not isinstance(started, str) or not started:
            raise ValueError("process entries require positive integer pid and non-empty start_time")
        out[pid] = item
    return out


def validate_registry(data: Any) -> list[dict[str, Any]]:
    if not isinstance(data, list):
        raise ValueError("registry must be a JSON array")
    required = {"owner", "runtime_key", "pid", "start_time", "shared", "owner_terminal"}
    for entry in data:
        if not isinstance(entry, dict) or not required.issubset(entry):
            raise ValueError(f"registry entry missing fields: {sorted(required)}")
        if not isinstance(entry["pid"], int) or entry["pid"] <= 0:
            raise ValueError("registry pid must be a positive integer")
        if not isinstance(entry["start_time"], str) or not entry["start_time"]:
            raise ValueError("registry start_time must be a non-empty string")
        if not isinstance(entry["shared"], bool) or not isinstance(entry["owner_terminal"], bool):
            raise ValueError("shared and owner_terminal must be booleans")
    return data


def reconcile(registry: list[dict[str, Any]], processes: dict[int, dict[str, Any]], owner: str | None) -> dict[str, Any]:
    rows = [r for r in registry if owner is None or r["owner"] == owner]
    classifications: list[dict[str, Any]] = []
    live_by_key: dict[str, int] = {}
    terminal_survivors = 0
    identity_mismatches = 0
    cleanup_plan: list[dict[str, Any]] = []

    for row in rows:
        observed = processes.get(row["pid"])
        status = "missing"
        if observed is not None:
            if observed["start_time"] != row["start_time"]:
                status = "pid_reused"
                identity_mismatches += 1
            else:
                status = "live"
                live_by_key[row["runtime_key"]] = live_by_key.get(row["runtime_key"], 0) + 1
                if row["owner_terminal"] and not row["shared"]:
                    terminal_survivors += 1
                    cleanup_plan.append({
                        "owner": row["owner"],
                        "runtime_key": row["runtime_key"],
                        "pid": row["pid"],
                        "start_time": row["start_time"],
                        "reason": "terminal_owner_survivor",
                    })
        classifications.append({
            "owner": row["owner"], "runtime_key": row["runtime_key"],
            "pid": row["pid"], "status": status, "shared": row["shared"],
            "owner_terminal": row["owner_terminal"],
        })

    duplicates = {key: count for key, count in live_by_key.items() if count > 1}
    blocked = terminal_survivors > 0 or identity_mismatches > 0
    return {
        "blocked": blocked,
        "terminal_owner_survivors": terminal_survivors,
        "identity_mismatches": identity_mismatches,
        "duplicate_runtime_keys": duplicates,
        "cleanup_plan": cleanup_plan,
        "classifications": classifications,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["audit", "plan"])
    parser.add_argument("--registry", required=True)
    parser.add_argument("--processes", required=True)
    parser.add_argument("--owner")
    parser.add_argument("--require-terminal-clean", action="store_true")
    args = parser.parse_args()
    try:
        registry = validate_registry(load_json(args.registry))
        processes = index_processes(load_json(args.processes))
        result = reconcile(registry, processes, args.owner)
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2

    if args.mode == "plan":
        print(json.dumps({"cleanup_plan": result["cleanup_plan"], "identity_mismatches": result["identity_mismatches"]}, indent=2))
        return 3 if result["identity_mismatches"] else 0

    print(json.dumps(result, indent=2))
    if result["identity_mismatches"]:
        return 3
    if args.require_terminal_clean and result["terminal_owner_survivors"]:
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
