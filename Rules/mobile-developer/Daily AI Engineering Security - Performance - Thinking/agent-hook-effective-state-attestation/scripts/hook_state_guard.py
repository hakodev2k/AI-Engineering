#!/usr/bin/env python3
"""Deterministically reconcile expected AI-agent hooks with a runtime snapshot.

Input formats are intentionally host-neutral JSON so adapters can normalize
Claude Code, Codex, or another agent runtime into the same shape.

Exit codes:
  0 = attestation passes
  2 = policy mismatch
  3 = invalid input
  4 = unexpected runtime error
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class HookIdentity:
    event: str
    matcher: str
    command_hash: str


def die(message: str, code: int) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(code)


def load_json(path: Path) -> Any:
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        die(f"input not found: {path}", 3)
    except json.JSONDecodeError as exc:
        die(f"invalid JSON in {path}: {exc}", 3)
    except OSError as exc:
        die(f"cannot read {path}: {exc}", 4)


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(str(value).strip().split())


def command_hash(command: str) -> str:
    normalized = normalize_text(command)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def identity(item: dict[str, Any]) -> HookIdentity:
    event = normalize_text(item.get("event"))
    matcher = normalize_text(item.get("matcher"))
    command = normalize_text(item.get("command"))
    if not event or not command:
        raise ValueError("every hook requires non-empty event and command")
    return HookIdentity(event=event, matcher=matcher, command_hash=command_hash(command))


def public_hook(item: dict[str, Any]) -> dict[str, Any]:
    """Return a redacted hook description; never echo the command itself."""
    ident = identity(item)
    return {
        "event": ident.event,
        "matcher": ident.matcher,
        "command_sha256": ident.command_hash,
        "source": normalize_text(item.get("source")),
    }


def validate_policy(policy: dict[str, Any]) -> list[dict[str, Any]]:
    hooks = policy.get("hooks")
    if not isinstance(hooks, list):
        raise ValueError("policy.hooks must be an array")
    seen_ids: set[str] = set()
    for item in hooks:
        if not isinstance(item, dict):
            raise ValueError("each policy hook must be an object")
        hook_id = normalize_text(item.get("id"))
        if not hook_id or hook_id in seen_ids:
            raise ValueError("policy hook ids must be non-empty and unique")
        seen_ids.add(hook_id)
        state = item.get("state")
        if state not in {"required", "optional", "forbidden"}:
            raise ValueError(f"hook {hook_id}: state must be required|optional|forbidden")
        if not isinstance(item.get("critical"), bool):
            raise ValueError(f"hook {hook_id}: critical must be boolean")
        identity(item)
    return hooks


def validate_runtime(snapshot: dict[str, Any]) -> list[dict[str, Any]]:
    hooks = snapshot.get("hooks")
    if not isinstance(hooks, list):
        raise ValueError("runtime snapshot must contain hooks array")
    for item in hooks:
        if not isinstance(item, dict):
            raise ValueError("each runtime hook must be an object")
        identity(item)
    return hooks


def reconcile(policy: dict[str, Any], snapshot: dict[str, Any]) -> dict[str, Any]:
    expected = validate_policy(policy)
    actual = validate_runtime(snapshot)

    actual_by_identity: dict[HookIdentity, list[dict[str, Any]]] = {}
    for item in actual:
        actual_by_identity.setdefault(identity(item), []).append(item)

    expected_identities = {identity(item): item for item in expected if item["state"] != "forbidden"}
    forbidden_identities = {identity(item): item for item in expected if item["state"] == "forbidden"}

    missing: list[dict[str, Any]] = []
    forbidden_active: list[dict[str, Any]] = []
    matched: list[dict[str, Any]] = []

    for item in expected:
        ident = identity(item)
        present = ident in actual_by_identity
        if item["state"] == "required" and not present:
            missing.append({"id": item["id"], "critical": item["critical"], **public_hook(item)})
        elif item["state"] == "forbidden" and present:
            forbidden_active.append({"id": item["id"], "critical": item["critical"], **public_hook(item)})
        elif present and item["state"] in {"required", "optional"}:
            matched.append({"id": item["id"], "state": item["state"], **public_hook(item)})

    unknown: list[dict[str, Any]] = []
    known = set(expected_identities) | set(forbidden_identities)
    for item in actual:
        if identity(item) not in known:
            unknown.append(public_hook(item))

    allow_unknown = bool(policy.get("allow_unknown_noncritical_hooks", False))
    critical_missing = [x for x in missing if x["critical"]]
    critical_forbidden = [x for x in forbidden_active if x["critical"]]
    blocking_unknown = unknown if not allow_unknown else []
    passed = not critical_missing and not critical_forbidden and not blocking_unknown

    return {
        "schema_version": 1,
        "status": "verified" if passed else "blocked",
        "implemented": True,
        "measured": True,
        "verified": passed,
        "counts": {
            "policy_hooks": len(expected),
            "runtime_hooks": len(actual),
            "matched": len(matched),
            "missing": len(missing),
            "forbidden_active": len(forbidden_active),
            "unknown": len(unknown),
        },
        "matched": matched,
        "missing": missing,
        "forbidden_active": forbidden_active,
        "unknown": unknown,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Attest effective agent hook state")
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--runtime", required=True, type=Path)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()

    try:
        policy = load_json(args.policy)
        snapshot = load_json(args.runtime)
        if not isinstance(policy, dict) or not isinstance(snapshot, dict):
            die("policy and runtime JSON roots must be objects", 3)
        result = reconcile(policy, snapshot)
    except ValueError as exc:
        die(f"validation error: {exc}", 3)
    except SystemExit:
        raise
    except Exception as exc:  # defensive boundary for automation runners
        die(f"unexpected guard failure: {type(exc).__name__}: {exc}", 4)

    rendered = json.dumps(result, indent=2, sort_keys=True)
    if args.report:
        try:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(rendered + "\n", encoding="utf-8")
        except OSError as exc:
            die(f"cannot write report: {exc}", 4)
    print(rendered)
    return 0 if result["verified"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
