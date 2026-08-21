#!/usr/bin/env python3
import argparse
import ipaddress
import json
import socket
import sys
from pathlib import Path
from urllib.parse import urlsplit


def load_policy(path: str) -> dict:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data.get("allowed_schemes"), list):
        raise ValueError("policy.allowed_schemes must be a list")
    return data


def classify_ip(text: str) -> dict:
    ip = ipaddress.ip_address(text)
    return {
        "ip": str(ip),
        "is_global": ip.is_global,
        "is_private": ip.is_private,
        "is_loopback": ip.is_loopback,
        "is_link_local": ip.is_link_local,
        "is_multicast": ip.is_multicast,
        "is_reserved": ip.is_reserved,
        "is_unspecified": ip.is_unspecified,
    }


def resolved_addresses(host: str, resolve_json: str | None) -> list[str]:
    if resolve_json:
        mapping = json.loads(Path(resolve_json).read_text(encoding="utf-8"))
        values = mapping.get(host, [])
        if not isinstance(values, list):
            raise ValueError(f"synthetic DNS value for {host} must be a list")
        if not values:
            raise socket.gaierror(f"no synthetic DNS answers for {host}")
        return sorted(set(str(v) for v in values))
    try:
        return [str(ipaddress.ip_address(host))]
    except ValueError:
        infos = socket.getaddrinfo(host, None, type=socket.SOCK_STREAM)
        return sorted(set(item[4][0] for item in infos))


def decide(url: str, policy: dict, kind: str, resolve_json: str | None = None) -> dict:
    base = {"url": url, "kind": kind, "decision": "DENY_PARSE", "reason": "parse_error"}
    try:
        parsed = urlsplit(url)
        if not parsed.scheme or not parsed.hostname:
            return base | {"reason": "missing_scheme_or_host"}
        if policy.get("reject_embedded_credentials", True) and (parsed.username is not None or parsed.password is not None):
            return base | {"decision": "DENY_POLICY", "reason": "embedded_credentials"}

        scheme = parsed.scheme.lower()
        if kind == "browser":
            allowed = set(policy.get("browser_allowed_schemes", ["https"]))
            if scheme == "http" and policy.get("browser_allow_loopback_http", False):
                pass
            elif scheme not in allowed:
                return base | {"decision": "DENY_POLICY", "reason": "browser_scheme_not_allowed", "scheme": scheme}
        else:
            allowed = set(policy.get("allowed_schemes", ["https"]))
            if scheme == "http" and policy.get("development_loopback_http", False):
                pass
            elif scheme not in allowed:
                return base | {"decision": "DENY_POLICY", "reason": "scheme_not_allowed", "scheme": scheme}

        host = parsed.hostname.rstrip(".").lower()
        deny_hosts = {h.rstrip(".").lower() for h in policy.get("deny_hosts", [])}
        allow_hosts = {h.rstrip(".").lower() for h in policy.get("allow_hosts", [])}
        if host in deny_hosts:
            return base | {"decision": "DENY_POLICY", "reason": "host_denylist", "host": host}

        addresses = resolved_addresses(host, resolve_json) if policy.get("verify_resolved_addresses", True) else []
        classes = [classify_ip(a) for a in addresses]
        host_allowlisted = host in allow_hosts
        if policy.get("require_global_ip", True) and not host_allowlisted:
            if not classes:
                return base | {"decision": "DENY_DNS", "reason": "no_addresses", "host": host}
            non_global = [c for c in classes if not c["is_global"]]
            if non_global:
                return base | {
                    "decision": "DENY_POLICY",
                    "reason": "non_global_destination",
                    "host": host,
                    "resolved": classes,
                }

        return {
            "url": url,
            "kind": kind,
            "decision": "ALLOW",
            "reason": "policy_pass",
            "scheme": scheme,
            "host": host,
            "port": parsed.port,
            "resolved": classes,
            "host_allowlisted": host_allowlisted,
        }
    except socket.gaierror as exc:
        return base | {"decision": "DENY_DNS", "reason": "dns_resolution_failed", "error": str(exc)}
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        return base | {"reason": "validation_error", "error": str(exc)}


def main() -> int:
    p = argparse.ArgumentParser(description="Resolution-aware MCP/OAuth URL policy validator")
    p.add_argument("--policy", required=True)
    p.add_argument("--url", required=True)
    p.add_argument("--kind", choices=["fetch", "browser"], default="fetch")
    p.add_argument("--resolve-json", help="Optional synthetic DNS mapping for safe deterministic tests")
    args = p.parse_args()
    try:
        policy = load_policy(args.policy)
        result = decide(args.url, policy, args.kind, args.resolve_json)
    except Exception as exc:
        result = {"decision": "DENY_PARSE", "reason": "policy_load_failed", "error": str(exc)}
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result.get("decision") == "ALLOW" else 2


if __name__ == "__main__":
    sys.exit(main())
