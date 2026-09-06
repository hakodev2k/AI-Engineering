#!/usr/bin/env python3
"""Fail-closed MCP caller/backend authorization boundary checker.

Input is a sanitized JSON deployment description. The script never requires or
prints secret values; it evaluates presence/scope metadata only.

Exit codes:
  0 = policy pass
  1 = invalid input/runtime error
  2 = blocking security findings
"""

from __future__ import annotations

import ipaddress
import json
import sys
from pathlib import Path
from typing import Any

PRIVILEGED_CLASSES = {"write", "destructive", "administrative", "secret-read", "egress"}
ALLOWED_AUTH_MODES = {"none", "shared-secret", "per-caller", "authenticated-proxy", "mtls"}


def fail(message: str) -> int:
    print(json.dumps({"status": "error", "error": message}, indent=2))
    return 1


def is_broad_bind(value: str) -> bool:
    v = value.strip().lower()
    if v in {"0.0.0.0", "::", "*", "all", "any"}:
        return True
    try:
        ip = ipaddress.ip_address(v.strip("[]"))
        return not ip.is_loopback
    except ValueError:
        # Hostnames are treated as potentially reachable unless the caller
        # explicitly marks the deployment external_reachable=false.
        return v not in {"localhost"}


def require_bool(obj: dict[str, Any], key: str) -> bool:
    value = obj.get(key)
    if not isinstance(value, bool):
        raise ValueError(f"{key} must be boolean")
    return value


def require_list(obj: dict[str, Any], key: str) -> list[Any]:
    value = obj.get(key)
    if not isinstance(value, list):
        raise ValueError(f"{key} must be a list")
    return value


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        return fail("usage: verify_mcp_auth_boundary.py <deployment.json>")

    path = Path(argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return fail(f"input file not found: {path}")
    except (OSError, json.JSONDecodeError) as exc:
        return fail(f"cannot read valid JSON: {exc}")

    if not isinstance(data, dict):
        return fail("top-level JSON must be an object")

    try:
        bind = data["bind_address"]
        if not isinstance(bind, str) or not bind.strip():
            raise ValueError("bind_address must be a non-empty string")
        external_reachable = require_bool(data, "external_reachable")
        auth_mode = data["inbound_auth_mode"]
        if auth_mode not in ALLOWED_AUTH_MODES:
            raise ValueError(f"inbound_auth_mode must be one of {sorted(ALLOWED_AUTH_MODES)}")
        caller_identities = require_list(data, "caller_identities")
        tools = require_list(data, "tools")
        backend = data["backend_credential"]
        if not isinstance(backend, dict):
            raise ValueError("backend_credential must be an object")
        backend_present = require_bool(backend, "present")
        backend_scope = backend.get("scope", [])
        if not isinstance(backend_scope, list):
            raise ValueError("backend_credential.scope must be a list")
    except (KeyError, ValueError) as exc:
        return fail(str(exc))

    findings: list[dict[str, str]] = []
    privileged_tools = 0
    tools_without_caller_policy = 0

    normalized_callers = {str(x) for x in caller_identities if str(x).strip()}
    per_caller_identity = auth_mode in {"per-caller", "authenticated-proxy", "mtls"}
    broad = is_broad_bind(bind)

    if backend_present and external_reachable and auth_mode == "none":
        findings.append({
            "code": "UNAUTHENTICATED_BACKEND_AUTHORITY",
            "message": "reachable MCP listener has a backend credential but no inbound authentication",
        })

    if broad and external_reachable and auth_mode == "none":
        findings.append({
            "code": "BROAD_BIND_NO_AUTH",
            "message": "broad/non-loopback listener is externally reachable without inbound authentication",
        })

    for index, tool in enumerate(tools):
        if not isinstance(tool, dict):
            return fail(f"tools[{index}] must be an object")
        name = tool.get("name")
        cls = tool.get("class", "read")
        authorized_callers = tool.get("authorized_callers", [])
        if not isinstance(name, str) or not name:
            return fail(f"tools[{index}].name must be a non-empty string")
        if not isinstance(cls, str):
            return fail(f"tools[{index}].class must be a string")
        if not isinstance(authorized_callers, list):
            return fail(f"tools[{index}].authorized_callers must be a list")

        if cls in PRIVILEGED_CLASSES:
            privileged_tools += 1
            if not authorized_callers:
                tools_without_caller_policy += 1
                findings.append({
                    "code": "PRIVILEGED_TOOL_WITHOUT_CALLER_POLICY",
                    "message": f"privileged tool '{name}' has no authorized_callers",
                })
            if not per_caller_identity:
                findings.append({
                    "code": "PRIVILEGED_TOOL_WITHOUT_DISTINCT_CALLER_IDENTITY",
                    "message": f"privileged tool '{name}' is exposed without a per-caller identity mechanism",
                })
            unknown = sorted(set(map(str, authorized_callers)) - normalized_callers)
            if unknown:
                findings.append({
                    "code": "UNKNOWN_AUTHORIZED_CALLER",
                    "message": f"tool '{name}' authorizes identities not declared at listener level: {unknown}",
                })

    read_only = bool(data.get("read_only", False))
    if read_only and privileged_tools:
        findings.append({
            "code": "READ_ONLY_CONTRADICTION",
            "message": "deployment declares read_only=true but privileged tools are still registered",
        })

    required_backend_scope = set()
    for tool in tools:
        if isinstance(tool, dict):
            required = tool.get("required_backend_scope", [])
            if not isinstance(required, list):
                return fail(f"tool {tool.get('name', '<unknown>')} required_backend_scope must be a list")
            required_backend_scope.update(map(str, required))
    unused_scope = sorted(set(map(str, backend_scope)) - required_backend_scope)

    metrics = {
        "privileged_tools": privileged_tools,
        "tools_without_caller_policy": tools_without_caller_policy,
        "declared_callers": len(normalized_callers),
        "unused_backend_scope_entries": len(unused_scope),
        "broad_bind": broad,
        "external_reachable": external_reachable,
    }

    if unused_scope:
        findings.append({
            "code": "BACKEND_SCOPE_EXCEEDS_DECLARED_TOOL_NEED",
            "message": f"backend credential includes unused scope entries: {unused_scope}",
        })

    status = "pass" if not findings else "block"
    print(json.dumps({"status": status, "metrics": metrics, "findings": findings}, indent=2, sort_keys=True))
    return 0 if status == "pass" else 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
