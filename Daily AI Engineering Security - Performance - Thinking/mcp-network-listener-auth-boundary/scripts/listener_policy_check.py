#!/usr/bin/env python3
"""Deterministic startup policy checker for MCP network listener exposure."""

from __future__ import annotations

import argparse
import ipaddress
import json
import sys
from pathlib import Path


class PolicyError(ValueError):
    pass


def parse_bool(value: str) -> bool:
    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    raise argparse.ArgumentTypeError(f"invalid boolean: {value}")


def load_policy(path: str) -> dict:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise PolicyError(f"cannot load policy: {exc}") from exc
    required = ["require_inbound_auth_for_non_loopback", "fail_startup_on_policy_violation"]
    missing = [key for key in required if key not in data]
    if missing:
        raise PolicyError(f"missing policy keys: {', '.join(missing)}")
    return data


def is_loopback_host(host: str) -> bool:
    value = host.strip().strip("[]").lower()
    if value == "localhost":
        return True
    try:
        return ipaddress.ip_address(value).is_loopback
    except ValueError:
        return False


def evaluate(
    *,
    bind_host: str,
    transport: str,
    inbound_auth: bool,
    downstream_credential: bool,
    same_credential: bool,
    browser_reachable: bool,
    host_validation: bool,
    origin_validation: bool,
    dns_rebinding_protection: bool,
    policy: dict,
) -> dict:
    loopback = is_loopback_host(bind_host)
    reasons: list[str] = []

    if not loopback and policy.get("require_inbound_auth_for_non_loopback", True) and not inbound_auth:
        reasons.append("non_loopback_requires_inbound_auth")

    if (
        inbound_auth
        and downstream_credential
        and same_credential
        and policy.get("require_distinct_inbound_and_downstream_credentials", True)
    ):
        reasons.append("inbound_downstream_credential_role_confusion")

    network_transport = transport.lower() in {"http", "sse", "streamable-http", "streamable_http"}
    if network_transport and not loopback and policy.get("require_host_validation_for_http", True) and not host_validation:
        reasons.append("host_validation_required")

    if browser_reachable:
        if policy.get("require_origin_validation_when_browser_reachable", True) and not origin_validation:
            reasons.append("origin_validation_required")
        if policy.get("require_dns_rebinding_protection_when_browser_reachable", True) and not dns_rebinding_protection:
            reasons.append("dns_rebinding_protection_required")

    return {
        "allowed": not reasons,
        "bind_host": bind_host,
        "loopback": loopback,
        "transport": transport,
        "inbound_auth": inbound_auth,
        "downstream_credential": downstream_credential,
        "reasons": reasons,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate MCP listener exposure against security policy")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--bind-host", required=True)
    parser.add_argument("--transport", default="http")
    parser.add_argument("--inbound-auth", type=parse_bool, default=False)
    parser.add_argument("--downstream-credential", type=parse_bool, default=False)
    parser.add_argument("--same-credential", type=parse_bool, default=False)
    parser.add_argument("--browser-reachable", type=parse_bool, default=False)
    parser.add_argument("--host-validation", type=parse_bool, default=False)
    parser.add_argument("--origin-validation", type=parse_bool, default=False)
    parser.add_argument("--dns-rebinding-protection", type=parse_bool, default=False)
    args = parser.parse_args()

    try:
        policy = load_policy(args.policy)
        result = evaluate(
            bind_host=args.bind_host,
            transport=args.transport,
            inbound_auth=args.inbound_auth,
            downstream_credential=args.downstream_credential,
            same_credential=args.same_credential,
            browser_reachable=args.browser_reachable,
            host_validation=args.host_validation,
            origin_validation=args.origin_validation,
            dns_rebinding_protection=args.dns_rebinding_protection,
            policy=policy,
        )
    except PolicyError as exc:
        print(json.dumps({"allowed": False, "reason": "policy_error", "detail": str(exc)}))
        return 2

    print(json.dumps(result, sort_keys=True))
    return 0 if result["allowed"] else 1


if __name__ == "__main__":
    sys.exit(main())
