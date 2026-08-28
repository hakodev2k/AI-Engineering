#!/usr/bin/env python3
import argparse, ipaddress, json, sys
from pathlib import Path
from urllib.parse import urlparse


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot read {path}: {exc}"}))
        raise SystemExit(2)


def is_public_bind(host):
    if host in {"0.0.0.0", "::"}: return True
    try:
        ip = ipaddress.ip_address(host)
        return not (ip.is_loopback or ip.is_private)
    except ValueError:
        return False


def normalize_origin(origin):
    if not origin: return None
    p = urlparse(origin)
    if not p.scheme or not p.hostname: return "INVALID"
    port = f":{p.port}" if p.port else ""
    return f"{p.scheme.lower()}://{p.hostname.lower()}{port}"


def evaluate(event, policy):
    reasons=[]
    bind=event.get("bind_host", policy.get("bind_host", "127.0.0.1"))
    if policy.get("deny_public_bind", True) and is_public_bind(bind):
        reasons.append("public_bind_forbidden")
    allowed_hosts={h.lower() for h in policy.get("allowed_hosts", [])}
    host=str(event.get("host", "")).split(":",1)[0].lower()
    if not host or host not in allowed_hosts:
        reasons.append("host_not_allowed")
    origin=normalize_origin(event.get("origin"))
    allowed_origins={normalize_origin(o) for o in policy.get("allowed_origins", [])}
    if policy.get("deny_wildcard_origin", True) and "*" in policy.get("allowed_origins", []):
        reasons.append("wildcard_origin_forbidden")
    if origin == "INVALID":
        reasons.append("invalid_origin")
    elif origin is not None and origin not in allowed_origins:
        reasons.append("origin_not_allowed")
    tools=set(event.get("requested_tools", []))
    consequential=set(policy.get("consequential_tools", []))
    if tools & consequential and policy.get("require_request_auth", True) and not event.get("authenticated", False):
        reasons.append("consequential_tool_requires_auth")
    return {"ok": not reasons, "decision": "allow" if not reasons else "block", "reasons": sorted(set(reasons))}


def main():
    ap=argparse.ArgumentParser(description="Validate MCP HTTP ingress against DNS-rebinding policy")
    ap.add_argument("--event", required=True)
    ap.add_argument("--policy", required=True)
    args=ap.parse_args()
    result=evaluate(load_json(args.event), load_json(args.policy))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())
