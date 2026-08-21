#!/usr/bin/env python3
"""Deterministic pre-egress authorization gate.

Request JSON example:
{
  "destination": "https://example.internal/api",
  "protocol": "https",
  "action": "read",
  "denial_count": 0,
  "approval": {
    "granted": false,
    "host": null,
    "action": null,
    "policy_version": null,
    "expires_at": null
  }
}

Exit codes: 0 allow, 2 invalid, 4 approval required, 5 deny, 6 freeze.
"""
from __future__ import annotations

import argparse
import ipaddress
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ALLOW, INVALID, APPROVAL, DENY, FREEZE = 0, 2, 4, 5, 6


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def normalized_target(value: str, protocol: str | None) -> tuple[str, str]:
    if not isinstance(value, str) or not value.strip():
        raise ValueError("destination must be a non-empty string")
    parsed = urlparse(value if "://" in value else f"{protocol or 'https'}://{value}")
    host = (parsed.hostname or "").rstrip(".").lower()
    scheme = (parsed.scheme or protocol or "").lower()
    if not host or not scheme:
        raise ValueError("destination must resolve to host and protocol")
    return host, scheme


def is_private_or_special(host: str) -> bool:
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        return host in {"localhost"} or host.endswith(".localhost")
    return not ip.is_global


def host_matches(host: str, rule_host: str) -> bool:
    rule = rule_host.strip().lower().rstrip(".")
    if rule.startswith("*."):
        suffix = rule[2:]
        return host.endswith("." + suffix) and host != suffix
    return host == rule


def parse_time(value: str | None) -> datetime | None:
    if value is None:
        return None
    if not isinstance(value, str):
        raise ValueError("time value must be ISO-8601 string or null")
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"invalid ISO-8601 timestamp: {value}") from exc
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("request", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        request, policy = load(args.request), load(args.policy)
        host, protocol = normalized_target(request.get("destination"), request.get("protocol"))
        action = request.get("action")
        if not isinstance(action, str) or not action:
            raise ValueError("action must be a non-empty string")
        denial_count = request.get("denial_count", 0)
        if not isinstance(denial_count, int) or isinstance(denial_count, bool) or denial_count < 0:
            raise ValueError("denial_count must be a non-negative integer")
        freeze_after = int(policy.get("freeze_after_denials", 3))
        version = str(policy.get("policy_version", ""))
        high_impact = action in set(policy.get("high_impact_actions", []))

        if denial_count >= freeze_after:
            result = {"decision":"freeze","host":host,"protocol":protocol,"action":action,"reason":"denial threshold already reached","policy_version":version}
            print(json.dumps(result, indent=2)); return FREEZE

        if policy.get("blocked_private_networks", True) and is_private_or_special(host):
            result = {"decision":"deny","host":host,"protocol":protocol,"action":action,"reason":"private or special destination blocked","policy_version":version}
            print(json.dumps(result, indent=2)); return DENY

        matched = None
        for rule in policy.get("allowed", []):
            if not isinstance(rule, dict):
                continue
            if not host_matches(host, str(rule.get("host", ""))):
                continue
            if protocol not in set(rule.get("protocols", [])) or action not in set(rule.get("actions", [])):
                continue
            expires = parse_time(rule.get("expires_at"))
            if expires and datetime.now(timezone.utc) >= expires:
                continue
            matched = rule
            break

        if matched:
            result = {"decision":"allow","host":host,"protocol":protocol,"action":action,"reason":"matched allow rule","policy_version":version}
            print(json.dumps(result, indent=2)); return ALLOW

        approval = request.get("approval") or {}
        if not isinstance(approval, dict):
            raise ValueError("approval must be an object")
        granted = approval.get("granted") is True
        approval_expiry = parse_time(approval.get("expires_at"))
        approval_valid = (
            granted
            and approval.get("host") == host
            and approval.get("action") == action
            and approval.get("policy_version") == version
            and approval_expiry is not None
            and datetime.now(timezone.utc) < approval_expiry
        )
        if approval_valid:
            result = {"decision":"allow","host":host,"protocol":protocol,"action":action,"reason":"valid action-bound approval","policy_version":version}
            print(json.dumps(result, indent=2)); return ALLOW

        if high_impact:
            result = {"decision":"approval_required","host":host,"protocol":protocol,"action":action,"reason":"unknown high-impact destination/action","policy_version":version}
            print(json.dumps(result, indent=2)); return APPROVAL

        default = policy.get("default_action", "deny")
        decision = "approval_required" if default == "approval_required" else "deny"
        code = APPROVAL if decision == "approval_required" else DENY
        result = {"decision":decision,"host":host,"protocol":protocol,"action":action,"reason":"no matching authorization rule","policy_version":version}
        print(json.dumps(result, indent=2)); return code
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
