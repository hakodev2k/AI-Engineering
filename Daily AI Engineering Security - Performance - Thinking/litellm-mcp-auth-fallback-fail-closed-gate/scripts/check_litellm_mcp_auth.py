#!/usr/bin/env python3
"""Fail-closed static gate for LiteLLM MCP authentication configuration."""
import json
import re
import sys
from pathlib import Path

VERSION_RE = re.compile(r"^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$")
MIN_FIXED = (1, 84, 0)
SENSITIVE = {"command-exec", "filesystem-write", "filesystem-delete", "repo-write", "deployment", "credential-access", "cloud-admin"}


def version_tuple(value):
    m = VERSION_RE.match(str(value).strip())
    if not m:
        raise ValueError(f"invalid semantic version: {value!r}")
    return tuple(int(x) for x in m.groups())


def load(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}")
    if not isinstance(data, dict):
        raise ValueError("top-level JSON must be an object")
    return data


def inspect(data):
    findings = []
    try:
        ver = version_tuple(data.get("litellm_version", ""))
    except ValueError as exc:
        return [str(exc)]
    mcp_exposed = data.get("mcp_exposed")
    if not isinstance(mcp_exposed, bool):
        findings.append("mcp_exposed must be boolean")
        mcp_exposed = True
    compensating_block = data.get("mcp_routes_blocked", False)
    if not isinstance(compensating_block, bool):
        findings.append("mcp_routes_blocked must be boolean")
        compensating_block = False
    if mcp_exposed and ver < MIN_FIXED and not compensating_block:
        findings.append(f"BLOCK LiteLLM {data.get('litellm_version')} is below fixed 1.84.0 while MCP is exposed")
    routes = data.get("routes", [])
    if not isinstance(routes, list):
        return findings + ["routes must be a list"]
    for i, route in enumerate(routes):
        if not isinstance(route, dict):
            findings.append(f"routes[{i}] must be an object")
            continue
        name = route.get("name", f"route-{i}")
        public = route.get("public", False)
        pattern = str(route.get("public_path_prefix", ""))
        oauth = route.get("oauth_passthrough", False)
        targets_oauth = route.get("all_targets_oauth2", False)
        anonymous = route.get("anonymous_tool_access", False)
        caps = route.get("capabilities", [])
        if not isinstance(caps, list) or not all(isinstance(x, str) for x in caps):
            findings.append(f"{name}: capabilities must be a string list")
            caps = []
        if public and not pattern.startswith("/.well-known/"):
            findings.append(f"{name}: BLOCK public MCP exception is not scoped to /.well-known/ path")
        if oauth and not targets_oauth:
            findings.append(f"{name}: BLOCK OAuth passthrough without all targeted servers explicitly OAuth2")
        dangerous = sorted(set(caps) & SENSITIVE)
        if anonymous and dangerous:
            findings.append(f"{name}: BLOCK anonymous access to sensitive capabilities: {', '.join(dangerous)}")
    return findings


def main(argv):
    if len(argv) != 2:
        print(f"usage: {argv[0]} <gateway.json>", file=sys.stderr)
        return 1
    try:
        findings = inspect(load(argv[1]))
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    if findings:
        print("BLOCK")
        for f in findings:
            print(f"- {f}")
        return 2
    print("PASS: LiteLLM MCP authentication configuration satisfies declared fail-closed invariants")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
