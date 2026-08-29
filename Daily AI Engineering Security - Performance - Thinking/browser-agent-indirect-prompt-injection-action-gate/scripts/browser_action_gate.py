#!/usr/bin/env python3
"""Deterministic authorization gate for browser-agent actions.

Exit codes: 0 = allow, 1 = invalid input/config, 2 = deny/approval required.
The report intentionally excludes payload bodies and credentials.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from urllib.parse import urlparse
from typing import Any

DEFAULT_POLICY = {
    "allowed_domains": [],
    "sensitive_destinations": [],
    "high_risk_actions": ["send", "submit", "upload", "download", "delete", "purchase", "transfer", "read_sensitive"],
    "side_effecting_actions": ["click", "fill", "send", "submit", "upload", "delete", "purchase", "transfer", "clipboard_write"],
    "deny_untrusted_side_effects": True,
    "require_approval_for_high_risk": True,
    "deny_sensitive_data_to_unapproved_destination": True,
    "deny_local_file_access_from_untrusted_source": True,
    "fail_closed_on_unknown_action": True
}
KNOWN_ACTIONS = {
    "navigate", "click", "fill", "send", "submit", "upload", "download", "delete",
    "purchase", "transfer", "read", "read_sensitive", "clipboard_write", "local_file_read"
}
TRUSTED_SOURCES = {"trusted-user", "system-policy"}


def domain_of(value: str | None) -> str | None:
    if not value:
        return None
    parsed = urlparse(value if "://" in value else "https://" + value)
    return parsed.hostname.lower() if parsed.hostname else None


def load_object(path: Path, label: str) -> dict[str, Any]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError(f"{label} must be a JSON object")
    return raw


def load_policy(path: Path | None) -> dict[str, Any]:
    policy = dict(DEFAULT_POLICY)
    if path:
        policy.update(load_object(path, "policy"))
    for key in ("allowed_domains", "sensitive_destinations", "high_risk_actions", "side_effecting_actions"):
        if not isinstance(policy.get(key), list):
            raise ValueError(f"{key} must be a list")
    return policy


def approval_matches(action: dict[str, Any], destination: str | None) -> bool:
    if not bool(action.get("human_approved", False)):
        return False
    if action.get("approval_action") != action.get("action"):
        return False
    approved_destination = domain_of(action.get("approval_destination"))
    if destination is not None and approved_destination != destination:
        return False
    return True


def evaluate(action: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    name = action.get("action")
    if not isinstance(name, str) or not name:
        raise ValueError("action.action must be a non-empty string")
    source = action.get("source_trust", "unknown")
    if source not in {"trusted-user", "system-policy", "untrusted-content", "unknown"}:
        raise ValueError("source_trust is invalid")
    destination = domain_of(action.get("destination"))
    approved = approval_matches(action, destination)
    sensitive = bool(action.get("sensitive_data", False))
    allowed_domains = {str(x).lower() for x in policy["allowed_domains"]}
    sensitive_destinations = {str(x).lower() for x in policy["sensitive_destinations"]}
    high_risk = set(map(str, policy["high_risk_actions"]))
    side_effecting = set(map(str, policy["side_effecting_actions"]))
    reasons: list[str] = []
    decision = "allow"

    def deny(reason: str) -> None:
        nonlocal decision
        reasons.append(reason)
        decision = "deny"

    def require_approval(reason: str) -> None:
        nonlocal decision
        reasons.append(reason)
        if decision != "deny":
            decision = "require_approval"

    if name not in KNOWN_ACTIONS and policy.get("fail_closed_on_unknown_action", True):
        deny("unknown_action")

    if bool(action.get("human_approved", False)) and not approved:
        deny("approval_not_bound_to_action_destination")

    if name == "navigate" and destination and allowed_domains and destination not in allowed_domains and not approved:
        require_approval("navigation_destination_not_allowlisted")

    if policy.get("deny_untrusted_side_effects", True) and source not in TRUSTED_SOURCES and name in side_effecting and not approved:
        require_approval("untrusted_source_side_effect")

    if name in high_risk and policy.get("require_approval_for_high_risk", True) and not approved:
        require_approval("high_risk_requires_human_approval")

    if sensitive and policy.get("deny_sensitive_data_to_unapproved_destination", True):
        if destination is None or destination not in sensitive_destinations:
            deny("sensitive_data_destination_not_approved")

    if name == "local_file_read" and policy.get("deny_local_file_access_from_untrusted_source", True) and source not in TRUSTED_SOURCES and not approved:
        require_approval("untrusted_source_local_file_access")

    return {
        "decision": decision,
        "reason_codes": reasons,
        "action": name,
        "source_trust": source,
        "destination_domain": destination,
        "sensitive_data": sensitive,
        "approval_valid": approved,
        "auth_context": bool(action.get("auth_context", False))
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("action", type=Path)
    p.add_argument("--policy", type=Path)
    args = p.parse_args()
    try:
        action = load_object(args.action, "action")
        policy = load_policy(args.policy)
        report = evaluate(action, policy)
        print(json.dumps(report, indent=2, sort_keys=True))
        return 0 if report["decision"] == "allow" else 2
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"browser_action_gate: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
