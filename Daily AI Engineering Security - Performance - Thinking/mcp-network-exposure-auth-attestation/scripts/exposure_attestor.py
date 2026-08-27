#!/usr/bin/env python3
import argparse
import ipaddress
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot_read:{path}:{exc}"}))
        raise SystemExit(2)


def is_loopback(host):
    if host in {"localhost"}:
        return True
    try:
        return ipaddress.ip_address(host).is_loopback
    except ValueError:
        return False


def is_wildcard(host):
    return host in {"0.0.0.0", "::", "*"}


def evaluate(state, policy):
    listeners = state.get("listeners")
    capabilities = set(state.get("capabilities", []))
    if not isinstance(listeners, list) or not listeners:
        return {"ok": False, "decision": "block", "reasons": ["missing_effective_listeners"]}

    reasons = []
    evidence = []
    high_risk = set(policy.get("high_risk_capabilities", []))
    exfil = set(policy.get("exfiltration_capabilities", []))
    allowed_public_auth = set(policy.get("allowed_public_auth_modes", []))

    for idx, listener in enumerate(listeners):
        host = str(listener.get("host", ""))
        port = listener.get("port")
        tls = bool(listener.get("tls", False))
        auth = str(listener.get("auth_mode", "none")).lower()
        route_auth = bool(listener.get("auth_enforced", False))
        non_loopback = not is_loopback(host)
        wildcard = is_wildcard(host)
        evidence.append({"listener": idx, "host": host, "port": port, "tls": tls, "auth_mode": auth, "auth_enforced": route_auth})

        if not host or port is None:
            reasons.append(f"listener_{idx}:incomplete_effective_state")
            continue
        if non_loopback and policy.get("require_tls_for_non_loopback", True) and not tls:
            reasons.append(f"listener_{idx}:non_loopback_without_tls")
        if wildcard and policy.get("forbid_wildcard_without_auth", True) and (auth == "none" or not route_auth):
            reasons.append(f"listener_{idx}:wildcard_without_effective_auth")
        if non_loopback and (capabilities & high_risk) and policy.get("require_auth_for_high_risk_non_loopback", True):
            if auth not in allowed_public_auth or not route_auth:
                reasons.append(f"listener_{idx}:high_risk_non_loopback_requires_approved_auth")

    if {"credential_read", "outbound_network"}.issubset(capabilities) and policy.get("forbid_credential_plus_outbound_without_mtls", True):
        for idx, listener in enumerate(listeners):
            if not is_loopback(str(listener.get("host", ""))) and str(listener.get("auth_mode", "none")).lower() != "mtls":
                reasons.append(f"listener_{idx}:credential_outbound_requires_mtls")

    result = {
        "ok": not reasons,
        "decision": "allow" if not reasons else "block",
        "reasons": sorted(set(reasons)),
        "effective_capabilities": sorted(capabilities),
        "listener_evidence": evidence,
    }
    return result


def main():
    parser = argparse.ArgumentParser(description="Attest effective MCP network/auth posture")
    parser.add_argument("--state", required=True, help="Observed effective-state JSON")
    parser.add_argument("--policy", required=True, help="Policy JSON")
    args = parser.parse_args()
    result = evaluate(load_json(args.state), load_json(args.policy))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    sys.exit(main())
