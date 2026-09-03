#!/usr/bin/env python3
"""Fail-closed MCP listener exposure policy checker."""
from __future__ import annotations
import argparse, ipaddress, json, sys
from pathlib import Path

REQUIRED = {
    "transport", "bind_host", "auth_enabled", "authorization_enabled",
    "origin_validation_enabled", "behind_authenticated_proxy",
    "backend_directly_reachable", "server_side_credentials", "write_capable_tools"
}

def is_loopback(host: str) -> bool:
    h = host.strip().lower()
    if h == "localhost": return True
    try: return ipaddress.ip_address(h).is_loopback
    except ValueError: return False

def evaluate(p: dict) -> list[str]:
    missing = sorted(REQUIRED - p.keys())
    if missing: return ["missing required keys: " + ", ".join(missing)]
    remote = not is_loopback(str(p["bind_host"]))
    violations: list[str] = []
    if remote:
        protected_by_proxy = bool(p["behind_authenticated_proxy"]) and not bool(p["backend_directly_reachable"])
        if not bool(p["auth_enabled"]) and not protected_by_proxy:
            violations.append("remote listener lacks enforced caller authentication")
        if not bool(p["authorization_enabled"]):
            violations.append("remote listener lacks explicit authorization")
        if p["transport"] in {"sse", "streamable-http", "http"} and not bool(p["origin_validation_enabled"]):
            if not bool(p.get("allow_remote_without_origin_validation", False)):
                violations.append("browser-reachable transport lacks Origin validation")
        if bool(p["backend_directly_reachable"]) and bool(p["behind_authenticated_proxy"]):
            violations.append("backend is directly reachable around authenticated proxy")
        if bool(p["server_side_credentials"]) and bool(p["write_capable_tools"]) and not (bool(p["auth_enabled"]) or protected_by_proxy):
            violations.append("privileged server credentials reachable through unauthenticated write-capable tools")
    return violations

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("policy", type=Path)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    try:
        data = json.loads(args.policy.read_text(encoding="utf-8"))
        if not isinstance(data, dict): raise ValueError("policy root must be an object")
        violations = evaluate(data)
    except (OSError, json.JSONDecodeError, ValueError) as e:
        print(f"ERROR: {e}", file=sys.stderr); return 2
    result = {"status": "FAIL" if violations else "PASS", "violations": violations}
    print(json.dumps(result, indent=2) if args.json else result["status"] + ("\n- " + "\n- ".join(violations) if violations else ""))
    return 1 if violations else 0

if __name__ == "__main__": raise SystemExit(main())
