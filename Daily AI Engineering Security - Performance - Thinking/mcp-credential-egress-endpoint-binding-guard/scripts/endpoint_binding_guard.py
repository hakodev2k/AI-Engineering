#!/usr/bin/env python3
import argparse, ipaddress, json, re
from pathlib import Path
from urllib.parse import urlparse


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot_read:{path}:{exc}")


def is_ip_literal(host):
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False


def evaluate(event, policy):
    required = ["tool", "credential_class", "destination"]
    missing = [k for k in required if not event.get(k)]
    if missing:
        return {"ok": False, "decision": "block", "reasons": ["missing:" + k for k in missing]}

    parsed = urlparse(event["destination"] if "://" in event["destination"] else "https://" + event["destination"])
    host = (parsed.hostname or "").lower().rstrip(".")
    scheme = parsed.scheme.lower()
    port = parsed.port or (443 if scheme == "https" else 80)
    reasons = []

    if scheme not in policy.get("allowed_schemes", ["https"]):
        reasons.append("scheme_not_allowed")
    if port not in policy.get("default_allowed_ports", [443]):
        reasons.append("port_not_allowed")
    if policy.get("deny_url_userinfo", True) and (parsed.username or parsed.password):
        reasons.append("userinfo_forbidden")
    if not host:
        reasons.append("missing_host")
    elif policy.get("deny_ip_literals", True) and is_ip_literal(host):
        reasons.append("ip_literal_forbidden")

    binding = policy.get("credential_bindings", {}).get(event["credential_class"])
    if not binding:
        reasons.append("unknown_credential_class")
    else:
        if event["tool"] not in binding.get("allowed_tools", []):
            reasons.append("tool_not_bound_to_credential")
        pattern = binding.get("allowed_host_regex")
        if not pattern or not re.fullmatch(pattern, host):
            reasons.append("destination_not_bound_to_credential")

    if reasons:
        return {
            "ok": False,
            "decision": "block",
            "host": host,
            "port": port,
            "reasons": sorted(set(reasons)),
            "requires_human_approval": bool(policy.get("require_human_approval_for_exception", True)),
        }
    return {"ok": True, "decision": "allow", "host": host, "port": port, "credential_class": event["credential_class"], "tool": event["tool"]}


def main():
    p = argparse.ArgumentParser(description="Bind credential-bearing agent tool calls to approved destinations.")
    p.add_argument("--event", required=True)
    p.add_argument("--policy", required=True)
    args = p.parse_args()
    try:
        result = evaluate(load(args.event), load(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
