#!/usr/bin/env python3
"""Validate an operational checkpoint before an AI agent resumes after context compaction.

Exit codes:
  0 pass
  2 checkpoint violates continuity policy
  3 invalid input/policy
  4 I/O error
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any


def load(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def get_path(obj: Any, dotted: str) -> Any:
    cur = obj
    for part in dotted.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


def present(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    return True


def scan_forbidden_keys(obj: Any, fragments: list[str], path: str = "$") -> list[str]:
    hits: list[str] = []
    if isinstance(obj, dict):
        for key, value in obj.items():
            k = str(key).lower()
            if any(fragment.lower() in k for fragment in fragments):
                hits.append(f"{path}.{key}")
            hits.extend(scan_forbidden_keys(value, fragments, f"{path}.{key}"))
    elif isinstance(obj, list):
        for i, value in enumerate(obj):
            hits.extend(scan_forbidden_keys(value, fragments, f"{path}[{i}]"))
    return hits


def validate(checkpoint: dict[str, Any], policy: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for field in policy.get("required_fields", []):
        if not present(get_path(checkpoint, field)):
            errors.append(f"missing required field: {field}")

    raw = json.dumps(checkpoint, ensure_ascii=False).encode("utf-8")
    max_bytes = int(policy.get("max_checkpoint_bytes", 65536))
    if len(raw) > max_bytes:
        errors.append(f"checkpoint is {len(raw)} bytes; limit is {max_bytes}")

    if policy.get("require_next_action", True):
        action = get_path(checkpoint, "state.next_action")
        if not isinstance(action, str) or not action.strip():
            errors.append("state.next_action must be a non-empty string")

    if policy.get("require_evidence_for_facts", True):
        facts = get_path(checkpoint, "evidence.facts") or []
        if not isinstance(facts, list):
            errors.append("evidence.facts must be a list")
        else:
            for i, fact in enumerate(facts):
                if not isinstance(fact, dict) or not fact.get("statement") or not fact.get("evidence"):
                    errors.append(f"evidence.facts[{i}] needs statement and evidence")

    resources = get_path(checkpoint, "execution.active_resources") or []
    cfg = policy.get("resource_requirements", {})
    allowed = set(cfg.get("allowed_status", []))
    if not isinstance(resources, list):
        errors.append("execution.active_resources must be a list")
    else:
        for i, resource in enumerate(resources):
            if not isinstance(resource, dict):
                errors.append(f"execution.active_resources[{i}] must be object")
                continue
            if cfg.get("require_id", True) and not resource.get("id"):
                errors.append(f"execution.active_resources[{i}] missing id")
            if cfg.get("require_status", True) and not resource.get("status"):
                errors.append(f"execution.active_resources[{i}] missing status")
            elif allowed and resource.get("status") not in allowed:
                errors.append(f"execution.active_resources[{i}] invalid status")

    if policy.get("forbid_secret_values", True):
        for hit in scan_forbidden_keys(checkpoint, policy.get("forbidden_key_fragments", [])):
            errors.append(f"secret-like key forbidden in checkpoint: {hit}")
    return errors


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("checkpoint")
    ap.add_argument("--policy", default=str(Path(__file__).resolve().parents[1] / "config" / "policy.json"))
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    try:
        checkpoint = load(args.checkpoint)
        policy = load(args.policy)
        if not isinstance(checkpoint, dict) or not isinstance(policy, dict):
            raise ValueError("checkpoint and policy must be JSON objects")
        errors = validate(checkpoint, policy)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 3
    result = {"status": "pass" if not errors else "fail", "errors": errors}
    if args.json:
        print(json.dumps(result, indent=2))
    elif errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
    else:
        print("PASS: checkpoint satisfies continuity contract")
    return 0 if not errors else 2


if __name__ == "__main__":
    raise SystemExit(main())
