#!/usr/bin/env python3
"""Audit normalized MCP process snapshots for duplicate/orphan lifecycle violations."""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path


def load_json(path: Path):
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def validate_policy(policy: dict) -> None:
    required = ["max_active_per_identity", "orphan_grace_seconds", "max_orphans", "max_duplicate_identities"]
    for key in required:
        if key not in policy or not isinstance(policy[key], int) or policy[key] < 0:
            raise ValueError(f"policy.{key} must be a non-negative integer")
    if policy["max_active_per_identity"] < 1:
        raise ValueError("policy.max_active_per_identity must be >= 1")


def is_mcp_process(proc: dict, policy: dict) -> bool:
    command = str(proc.get("command", "")).lower()
    if any(x.lower() in command for x in policy.get("ignore_command_substrings", [])):
        return False
    return bool(proc.get("is_mcp")) or any(m.lower() in command for m in policy.get("mcp_command_markers", ["mcp"]))


def identity(proc: dict) -> str:
    explicit = proc.get("identity")
    if explicit:
        return str(explicit)
    server = str(proc.get("server_identity", "unknown-server"))
    scope = str(proc.get("scope_key", "global"))
    host = str(proc.get("host_instance", "default-host"))
    return f"{host}|{scope}|{server}"


def audit(snapshot: dict, policy: dict) -> dict:
    processes = snapshot.get("processes")
    if not isinstance(processes, list):
        raise ValueError("snapshot.processes must be a list")
    live_owners = {str(x) for x in snapshot.get("live_owner_ids", [])}
    groups = defaultdict(list)
    findings = []
    mcp_count = 0
    orphan_count = 0
    oldest_orphan_age = 0

    for proc in processes:
        if not isinstance(proc, dict):
            raise ValueError("every snapshot.processes item must be an object")
        if "pid" not in proc or not isinstance(proc["pid"], int) or proc["pid"] <= 0:
            raise ValueError("every process requires positive integer pid")
        if not is_mcp_process(proc, policy):
            continue
        mcp_count += 1
        groups[identity(proc)].append(proc)
        owner = proc.get("owner_id")
        age = int(proc.get("age_seconds", 0))
        owner_missing = owner is None or str(owner) not in live_owners
        if owner_missing and age > policy["orphan_grace_seconds"]:
            orphan_count += 1
            oldest_orphan_age = max(oldest_orphan_age, age)
            findings.append({"type": "orphan", "pid": proc["pid"], "identity": identity(proc), "age_seconds": age, "owner_id": owner})
        elif policy.get("require_owner_for_mcp", False) and owner is None:
            findings.append({"type": "owner_missing", "pid": proc["pid"], "identity": identity(proc), "age_seconds": age})

    duplicate_identities = 0
    max_generations = 0
    for key, members in groups.items():
        active = [p for p in members if str(p.get("state", "running")).lower() not in {"exited", "terminated", "dead"}]
        max_generations = max(max_generations, len(active))
        if len(active) > policy["max_active_per_identity"]:
            duplicate_identities += 1
            findings.append({"type": "duplicate_identity", "identity": key, "active_pids": sorted(p["pid"] for p in active), "active_count": len(active)})

    violations = []
    if orphan_count > policy["max_orphans"]:
        violations.append(f"orphan_count={orphan_count} exceeds {policy['max_orphans']}")
    if duplicate_identities > policy["max_duplicate_identities"]:
        violations.append(f"duplicate_identities={duplicate_identities} exceeds {policy['max_duplicate_identities']}")
    if policy.get("require_owner_for_mcp", False) and any(f["type"] == "owner_missing" for f in findings):
        violations.append("one or more MCP processes have no owner_id")

    return {
        "status": "fail" if violations else "pass",
        "metrics": {
            "mcp_process_count": mcp_count,
            "logical_identity_count": len(groups),
            "duplicate_identity_count": duplicate_identities,
            "max_active_generations": max_generations,
            "orphan_count": orphan_count,
            "oldest_orphan_age_seconds": oldest_orphan_age,
        },
        "violations": violations,
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--snapshot", required=True, type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        snapshot = load_json(args.snapshot)
        policy = load_json(args.policy)
        validate_policy(policy)
        report = audit(snapshot, policy)
    except ValueError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 3
    rendered = json.dumps(report, indent=2, sort_keys=True)
    if args.output:
        try:
            args.output.write_text(rendered + "\n", encoding="utf-8")
        except OSError as exc:
            print(json.dumps({"status": "error", "error": f"cannot write output: {exc}"}), file=sys.stderr)
            return 3
    print(rendered)
    return 0 if report["status"] == "pass" else 2


if __name__ == "__main__":
    raise SystemExit(main())
