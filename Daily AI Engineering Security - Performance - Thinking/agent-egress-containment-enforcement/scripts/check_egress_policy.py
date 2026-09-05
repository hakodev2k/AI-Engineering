#!/usr/bin/env python3
"""Validate a task-scoped agent egress policy using fail-closed structural rules."""
from __future__ import annotations
import ipaddress
import json
import re
import sys
from pathlib import Path

HOST_RE = re.compile(r"^(?=.{1,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)*[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$" )
WILDCARDS = {"*", "0.0.0.0/0", "::/0"}
ALLOWED_PROTOCOLS = {"tcp", "udp"}


def load_policy(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def valid_hostname(host: str) -> bool:
    if not host or any(ord(c) < 33 or ord(c) == 127 for c in host):
        return False
    if "\x00" in host or "%" in host or "/" in host or "\\" in host:
        return False
    return bool(HOST_RE.fullmatch(host.rstrip(".")))


def validate(policy: dict) -> list[str]:
    errors: list[str] = []
    if policy.get("default_deny") is not True:
        errors.append("default_deny MUST be true")
    if policy.get("allow_wildcard_internet") is True:
        errors.append("wildcard internet access is blocked by this guard")
    destinations = policy.get("destinations")
    if not isinstance(destinations, list):
        return errors + ["destinations MUST be a list"]
    seen: set[tuple[str, int, str]] = set()
    for idx, item in enumerate(destinations):
        prefix = f"destinations[{idx}]"
        if not isinstance(item, dict):
            errors.append(f"{prefix} MUST be an object")
            continue
        host = item.get("hostname")
        if not isinstance(host, str) or host in WILDCARDS or not valid_hostname(host):
            errors.append(f"{prefix}.hostname is invalid or wildcard")
            host = "<invalid>"
        ports = item.get("ports")
        if not isinstance(ports, list) or not ports or any(not isinstance(p, int) or p < 1 or p > 65535 for p in ports):
            errors.append(f"{prefix}.ports MUST contain valid TCP/UDP ports")
            ports = []
        protocols = item.get("protocols")
        if not isinstance(protocols, list) or not protocols or any(p not in ALLOWED_PROTOCOLS for p in protocols):
            errors.append(f"{prefix}.protocols MUST be a non-empty subset of {sorted(ALLOWED_PROTOCOLS)}")
            protocols = []
        cidrs = item.get("resolved_cidrs")
        if not isinstance(cidrs, list) or not cidrs:
            errors.append(f"{prefix}.resolved_cidrs MUST be non-empty")
            cidrs = []
        for raw in cidrs:
            try:
                network = ipaddress.ip_network(raw, strict=False)
                if str(network) in WILDCARDS or network.prefixlen == 0:
                    errors.append(f"{prefix}.resolved_cidrs MUST NOT contain wildcard networks")
            except (TypeError, ValueError):
                errors.append(f"{prefix}.resolved_cidrs contains invalid CIDR: {raw!r}")
        if not isinstance(item.get("purpose"), str) or not item.get("purpose", "").strip():
            errors.append(f"{prefix}.purpose MUST explain task necessity")
        if not isinstance(item.get("requires_human_approval_for_write"), bool):
            errors.append(f"{prefix}.requires_human_approval_for_write MUST be boolean")
        for port in ports:
            for proto in protocols:
                key = (str(host).lower(), port, proto)
                if key in seen:
                    errors.append(f"duplicate route: {host}:{port}/{proto}")
                seen.add(key)
    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(f"usage: {argv[0]} <policy.json>", file=sys.stderr)
        return 1
    try:
        policy = load_policy(Path(argv[1]))
        errors = validate(policy)
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    if errors:
        print("BLOCK")
        for error in errors:
            print(f"- {error}")
        return 2
    print(f"PASS: {len(policy['destinations'])} task-scoped destination(s); default deny enforced")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
