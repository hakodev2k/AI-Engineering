#!/usr/bin/env python3
"""Deterministic provenance/action gate for MCP server instructions.

Input JSON:
{
  "server": "example",
  "instructions": "text",
  "previous_instruction_sha256": null,
  "requested_capabilities": ["write"],
  "approval": {"granted": false, "instruction_sha256": null, "capabilities": []}
}

Exit codes: 0 allow, 2 invalid, 4 approval required, 5 deny.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

ALLOW, INVALID, APPROVAL_REQUIRED, DENY = 0, 2, 4, 5


def load_object(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def decide(data: dict[str, Any], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    server = data.get("server")
    instructions = data.get("instructions")
    caps = data.get("requested_capabilities", [])
    approval = data.get("approval", {})
    if not isinstance(server, str) or not server.strip():
        raise ValueError("server must be a non-empty string")
    if not isinstance(instructions, str):
        raise ValueError("instructions must be a string")
    if not isinstance(caps, list) or not all(isinstance(x, str) and x for x in caps):
        raise ValueError("requested_capabilities must be non-empty strings")
    if not isinstance(approval, dict):
        raise ValueError("approval must be an object")

    trusted_servers = policy.get("trusted_servers", [])
    high_impact = policy.get("high_impact_capabilities", [])
    if not isinstance(trusted_servers, list) or not all(isinstance(x, str) for x in trusted_servers):
        raise ValueError("policy.trusted_servers must be strings")
    if not isinstance(high_impact, list) or not all(isinstance(x, str) for x in high_impact):
        raise ValueError("policy.high_impact_capabilities must be strings")

    raw = instructions.encode("utf-8")
    sha = hashlib.sha256(raw).hexdigest()
    findings: list[str] = []
    max_bytes = int(policy.get("max_instruction_bytes", 16384))
    if max_bytes <= 0:
        raise ValueError("max_instruction_bytes must be positive")
    if len(raw) > max_bytes:
        findings.append("instruction exceeds byte limit")
    if policy.get("deny_control_characters", True):
        if any(ord(ch) < 32 and ch not in "\n\r\t" for ch in instructions):
            findings.append("instruction contains forbidden control characters")

    trusted = server in trusted_servers
    previous = data.get("previous_instruction_sha256")
    if previous is not None and (not isinstance(previous, str) or len(previous) != 64):
        raise ValueError("previous_instruction_sha256 must be null or 64-char string")
    changed = previous is not None and previous != sha
    requested_high = sorted(set(caps).intersection(high_impact))

    base = {
        "server": server,
        "instruction_sha256": sha,
        "trusted": trusted,
        "changed": changed,
        "requested_capabilities": sorted(set(caps)),
        "high_impact": requested_high,
    }
    if findings:
        return {**base, "decision": "deny", "findings": findings}, DENY

    require_approval = bool(policy.get("require_approval_for_untrusted_high_impact", True))
    if not trusted and requested_high and require_approval:
        granted = approval.get("granted") is True
        approved_hash = approval.get("instruction_sha256")
        approved_caps = approval.get("capabilities", [])
        if not isinstance(approved_caps, list) or not all(isinstance(x, str) for x in approved_caps):
            raise ValueError("approval.capabilities must be strings")
        bound_hash = approved_hash == sha
        bound_caps = set(requested_high).issubset(set(approved_caps))
        invalidated = changed and bool(policy.get("invalidate_approval_on_instruction_change", True))
        if granted and bound_hash and bound_caps and not invalidated:
            return {**base, "decision": "allow", "findings": ["current content-bound approval valid"]}, ALLOW
        return {
            **base,
            "decision": "approval_required",
            "findings": ["untrusted MCP instructions influence high-impact capability"],
        }, APPROVAL_REQUIRED

    return {**base, "decision": "allow", "findings": []}, ALLOW


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        result, code = decide(load_object(args.input), load_object(args.policy))
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
