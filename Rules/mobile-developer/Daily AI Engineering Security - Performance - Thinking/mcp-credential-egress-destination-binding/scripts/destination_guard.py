#!/usr/bin/env python3
"""Validate a credential-bearing outbound destination before credentials are attached.

Exit codes: 0 allow, 2 invalid input/config, 5 deny.
"""
from __future__ import annotations
import argparse, ipaddress, json, socket, sys
from pathlib import Path
from urllib.parse import urlsplit


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def host_matches(host: str, suffixes: list[str]) -> bool:
    host = host.rstrip(".").lower()
    for suffix in suffixes:
        s = suffix.lower().rstrip(".")
        if s.startswith("."):
            if host.endswith(s) and host != s[1:]:
                return True
        elif host == s:
            return True
    return False


def prohibited_ip(text: str) -> bool:
    ip = ipaddress.ip_address(text)
    return any((ip.is_private, ip.is_loopback, ip.is_link_local, ip.is_multicast,
                ip.is_reserved, ip.is_unspecified))


def resolve(host: str, port: int) -> list[str]:
    addresses = set()
    for result in socket.getaddrinfo(host, port, type=socket.SOCK_STREAM):
        addresses.add(result[4][0])
    return sorted(addresses)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--credential-class", required=True)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--no-dns", action="store_true", help="Skip DNS resolution; intended only for offline policy tests")
    args = parser.parse_args()
    try:
        cfg = load_json(args.policy)
        classes = cfg.get("credential_classes")
        if not isinstance(classes, dict) or args.credential_class not in classes:
            raise ValueError("unknown credential class")
        policy = classes[args.credential_class]
        if not isinstance(policy, dict):
            raise ValueError("credential class policy must be object")
        u = urlsplit(args.url)
        if not u.scheme or not u.hostname:
            raise ValueError("absolute URL with hostname required")
        scheme = u.scheme.lower()
        host = u.hostname.rstrip(".").lower()
        port = u.port or (443 if scheme == "https" else 80 if scheme == "http" else None)
        findings: list[str] = []
        if scheme not in policy.get("allowed_schemes", ["https"]):
            findings.append("scheme not allowed")
        if port not in policy.get("allowed_ports", [443]):
            findings.append("port not allowed")
        if (u.username is not None or u.password is not None) and not policy.get("allow_userinfo", False):
            findings.append("URL userinfo not allowed")
        try:
            ipaddress.ip_address(host)
            is_literal = True
        except ValueError:
            is_literal = False
        if is_literal and not policy.get("allow_ip_literals", False):
            findings.append("IP literal not allowed")
        suffixes = policy.get("allowed_host_suffixes", [])
        if not isinstance(suffixes, list) or not all(isinstance(x, str) for x in suffixes):
            raise ValueError("allowed_host_suffixes must be string array")
        if not host_matches(host, suffixes):
            findings.append("host not bound to credential policy")
        addresses: list[str] = []
        if not findings and not args.no_dns:
            try:
                addresses = resolve(host, int(port))
            except socket.gaierror as exc:
                findings.append(f"DNS resolution failed: {exc}")
            if not addresses:
                findings.append("DNS returned no addresses")
            if policy.get("deny_private_or_special_ips", True):
                for address in addresses:
                    try:
                        if prohibited_ip(address):
                            findings.append(f"resolved prohibited address: {address}")
                    except ValueError:
                        findings.append(f"invalid resolved address: {address}")
        decision = "deny" if findings else "allow"
        print(json.dumps({"decision": decision, "credential_class": args.credential_class,
                          "canonical": {"scheme": scheme, "host": host, "port": port},
                          "resolved_addresses": addresses,
                          "redirects_allowed": bool(policy.get("allow_redirects", False)),
                          "findings": findings}, indent=2))
        return 5 if findings else 0
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
