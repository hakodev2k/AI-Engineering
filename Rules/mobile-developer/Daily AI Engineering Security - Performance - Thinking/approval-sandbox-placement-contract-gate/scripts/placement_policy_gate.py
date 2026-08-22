#!/usr/bin/env python3
"""Validate approval, sandbox placement, broker trust, and confidentiality invariants.

Input JSON example:
{
  "command_id": "open-editor",
  "approval": "allow",
  "placement": "sandbox",
  "denied_read_active": true,
  "confidentiality_invariants": ["credentials-unreadable-to-agent"],
  "requested_capabilities": [],
  "broker": null,
  "human_approval": {"granted": false, "command_id": null}
}

Exit codes: 0 allowed, 2 invalid, 3 approval_required, 4 broker_required, 5 deny.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOW, INVALID, APPROVAL, BROKER, DENY = 0, 2, 3, 4, 5


def load_object(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def string_list(value: Any, name: str) -> list[str]:
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{name} must be an array of non-empty strings")
    return value


def evaluate(data: dict[str, Any], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    command_id = data.get("command_id")
    if not isinstance(command_id, str) or not command_id.strip():
        raise ValueError("command_id must be a non-empty string")

    approval = data.get("approval", policy.get("default_approval", "ask"))
    placement = data.get("placement", policy.get("default_placement", "sandbox"))
    allowed_approvals = set(string_list(policy.get("allowed_approval_values", []), "allowed_approval_values"))
    allowed_placements = set(string_list(policy.get("allowed_placement_values", []), "allowed_placement_values"))
    if approval not in allowed_approvals:
        raise ValueError(f"unsupported approval value: {approval}")
    if placement not in allowed_placements:
        raise ValueError(f"unsupported placement value: {placement}")

    denied_read_active = data.get("denied_read_active", False)
    if not isinstance(denied_read_active, bool):
        raise ValueError("denied_read_active must be boolean")
    invariants = string_list(data.get("confidentiality_invariants", []), "confidentiality_invariants")
    capabilities = string_list(data.get("requested_capabilities", []), "requested_capabilities")
    high_risk = set(string_list(policy.get("high_risk_capabilities", []), "high_risk_capabilities"))
    requested_high_risk = sorted(set(capabilities) & high_risk)

    human = data.get("human_approval", {})
    if not isinstance(human, dict):
        raise ValueError("human_approval must be an object")
    human_granted = human.get("granted") is True and human.get("command_id") == command_id

    base = {
        "command_id": command_id,
        "approval": approval,
        "requested_placement": placement,
        "denied_read_active": denied_read_active,
        "confidentiality_invariants": invariants,
        "requested_capabilities": capabilities,
        "high_risk_capabilities": requested_high_risk,
    }

    if approval == "deny" or placement == "deny":
        return {**base, "decision": "deny", "effective_placement": "none", "reason": "policy denies command or placement"}, DENY

    if placement == "sandbox":
        if approval == "ask" and not human_granted:
            return {**base, "decision": "approval_required", "effective_placement": "sandbox", "reason": "sandbox execution requires action-bound approval"}, APPROVAL
        return {**base, "decision": "allow_sandbox", "effective_placement": "sandbox", "reason": "approval satisfied; sandbox placement remains explicit"}, ALLOW

    if placement != "host-via-broker":
        raise ValueError("unhandled placement")

    broker_name = data.get("broker")
    trusted = policy.get("trusted_brokers", {})
    if not isinstance(trusted, dict):
        raise ValueError("trusted_brokers must be an object")
    if not isinstance(broker_name, str) or not broker_name:
        return {**base, "decision": "broker_required", "effective_placement": "none", "reason": "host placement requires an explicit trusted broker"}, BROKER
    broker_decl = trusted.get(broker_name)
    if not isinstance(broker_decl, dict):
        decision = "deny" if policy.get("fail_closed_on_unknown_broker", True) else "broker_required"
        code = DENY if decision == "deny" else BROKER
        return {**base, "decision": decision, "effective_placement": "none", "broker": broker_name, "reason": "broker is not trusted by local policy"}, code

    broker_caps = broker_decl.get("capabilities", [])
    if not isinstance(broker_caps, list) or not all(isinstance(x, str) for x in broker_caps):
        raise ValueError(f"trusted_brokers.{broker_name}.capabilities must be an array of strings")
    missing_caps = sorted(set(capabilities) - set(broker_caps))
    if missing_caps:
        return {**base, "decision": "deny", "effective_placement": "none", "broker": broker_name, "reason": "requested capabilities exceed broker declaration", "missing_capabilities": missing_caps}, DENY

    preserves = broker_decl.get("preserves_confidentiality", False)
    if invariants or denied_read_active:
        if policy.get("preserve_confidentiality_invariants", True) and preserves is not True:
            return {**base, "decision": "deny", "effective_placement": "none", "broker": broker_name, "reason": "broker does not declare preservation of confidentiality invariants"}, DENY

    need_human = approval == "ask" or (
        bool(requested_high_risk) and policy.get("require_human_approval_for_high_risk_broker_actions", True)
    )
    if need_human and not human_granted:
        return {**base, "decision": "approval_required", "effective_placement": "host-via-broker", "broker": broker_name, "reason": "action-bound human approval required for broker execution"}, APPROVAL

    return {
        **base,
        "decision": "allow_broker",
        "effective_placement": "host-via-broker",
        "broker": broker_name,
        "broker_capabilities": sorted(broker_caps),
        "confidentiality_preserved": preserves is True,
        "reason": "explicit placement, broker trust, capability scope, and approval requirements satisfied",
    }, ALLOW


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        result, code = evaluate(load_object(args.input), load_object(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, sort_keys=True))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
