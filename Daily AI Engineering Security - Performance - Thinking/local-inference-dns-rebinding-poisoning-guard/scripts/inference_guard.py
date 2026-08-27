#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"read_error:{exc}"}))
        raise SystemExit(2)


def template_hash(template):
    if not isinstance(template, str):
        raise ValueError("template must be a string")
    return hashlib.sha256(template.encode("utf-8")).hexdigest()


def evaluate(state, policy):
    reasons = []
    bind = state.get("bind_address")
    authenticated = bool(state.get("authenticated", False))
    management_exposed = bool(state.get("management_endpoints_exposed", False))
    declared = state.get("declared_network_scope")
    effective = state.get("effective_network_scope")
    allowed = set(policy.get("allowed_bind_addresses", ["127.0.0.1", "::1"]))

    if bind not in allowed:
        if not (policy.get("allow_non_loopback_with_auth", False) and authenticated):
            reasons.append("non_loopback_listener_not_allowed")
    if management_exposed and policy.get("management_endpoints_require_auth", True) and not authenticated:
        reasons.append("unauthenticated_management_endpoints")
    if policy.get("fail_on_policy_mismatch", True) and declared != effective:
        reasons.append("declared_effective_network_policy_mismatch")

    expected = state.get("expected_template_sha256")
    current_template = state.get("current_template")
    current_hash = template_hash(current_template) if isinstance(current_template, str) else None
    if policy.get("require_template_fingerprint", True):
        if not expected:
            reasons.append("missing_template_baseline")
        elif current_hash != expected:
            reasons.append("template_fingerprint_drift")

    decision = "pass" if not reasons else "block"
    return {
        "ok": not reasons,
        "decision": decision,
        "bind_address": bind,
        "authenticated": authenticated,
        "current_template_sha256": current_hash,
        "reasons": sorted(set(reasons)),
    }


def main():
    parser = argparse.ArgumentParser(description="Local inference listener and model-integrity guard")
    parser.add_argument("--state", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load(args.state), load(args.policy))
    except ValueError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
