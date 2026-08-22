#!/usr/bin/env python3
"""Deterministic cross-surface capability approval gate.
Exit codes: 0 allow, 2 invalid, 4 approval_required, 5 deny.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any

ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5


def load(path: Path) -> dict[str, Any]:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return obj


def arg_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def decide(request: dict[str, Any], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    for field in ("surface", "capability", "target", "actor", "impact"):
        if not isinstance(request.get(field), str) or not request[field]:
            raise ValueError(f"{field} is required")
    if request["impact"] not in {"low", "medium", "high"}:
        raise ValueError("impact must be low|medium|high")
    capability = request["capability"]
    args_hash = arg_hash(request.get("args", {}))
    require_provenance = bool(policy.get("require_delegation_provenance", True))
    if request.get("delegated") is True and require_provenance and not request.get("delegation_provenance"):
        return ({"decision": "deny", "reason": "missing_delegation_provenance", "argument_sha256": args_hash}, DENY)

    require = set(policy.get("require_approval_for", []))
    allow = set(policy.get("allow_without_approval", []))
    if capability in allow and request["impact"] == "low":
        return ({"decision": "allow", "reason": "explicit_safe_capability", "argument_sha256": args_hash}, ALLOW)

    unknown = capability not in require and capability not in allow
    if unknown and request["impact"] == "high" and policy.get("default_unknown_high_impact", "deny") == "deny":
        return ({"decision": "deny", "reason": "unknown_high_impact_capability", "argument_sha256": args_hash}, DENY)

    if capability in require or request["impact"] == "high":
        approval = request.get("approval")
        if not isinstance(approval, dict):
            return ({"decision": "approval_required", "reason": "missing_approval", "argument_sha256": args_hash}, APPROVAL)
        bound = (
            approval.get("granted") is True
            and approval.get("actor") == request["actor"]
            and approval.get("capability") == capability
            and approval.get("target") == request["target"]
            and approval.get("argument_sha256") == args_hash
        )
        if not bound:
            return ({"decision": "approval_required", "reason": "approval_scope_mismatch", "argument_sha256": args_hash}, APPROVAL)
        return ({"decision": "allow", "reason": "bound_approval", "argument_sha256": args_hash}, ALLOW)

    if request["impact"] == "medium":
        return ({"decision": "deny", "reason": "medium_impact_not_explicitly_classified", "argument_sha256": args_hash}, DENY)
    return ({"decision": "allow", "reason": "low_impact", "argument_sha256": args_hash}, ALLOW)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("request", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    try:
        output, code = decide(load(args.request), load(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(output, indent=2, ensure_ascii=False))
    return code if args.strict else (ALLOW if code == ALLOW else code)


if __name__ == "__main__":
    raise SystemExit(main())
