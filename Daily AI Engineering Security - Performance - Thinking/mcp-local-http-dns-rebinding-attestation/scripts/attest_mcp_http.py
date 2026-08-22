#!/usr/bin/env python3
"""Runtime attestation for local MCP Streamable HTTP Host/Origin/auth controls.

Safe behavior: sends only the MCP `initialize` request; it never calls tools.
Exit codes: 0=pass, 2=invalid input/config, 4=manual review, 5=blocking exposure.
"""
from __future__ import annotations

import argparse
import http.client
import json
import os
import socket
import ssl
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

PASS, INVALID, REVIEW, BLOCK = 0, 2, 4, 5


def load_policy(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("policy must be a JSON object")
    for key in ("allowed_hosts", "foreign_host_probes", "foreign_origin_probes"):
        if not isinstance(value.get(key), list) or not all(isinstance(x, str) and x for x in value[key]):
            raise ValueError(f"{key} must be a non-empty string list")
    timeout = value.get("request_timeout_seconds", 3)
    if not isinstance(timeout, (int, float)) or timeout <= 0 or timeout > 30:
        raise ValueError("request_timeout_seconds must be within (0, 30]")
    return value


def initialize_body() -> bytes:
    payload = {
        "jsonrpc": "2.0",
        "id": "dns-rebinding-attestation",
        "method": "initialize",
        "params": {
            "protocolVersion": "2025-06-18",
            "capabilities": {},
            "clientInfo": {"name": "mcp-local-http-attestor", "version": "1.0"},
        },
    }
    return json.dumps(payload, separators=(",", ":")).encode("utf-8")


def request(endpoint: str, timeout: float, host_header: str | None, origin: str | None,
            authorization: str | None) -> dict[str, Any]:
    parsed = urlsplit(endpoint)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise ValueError("endpoint must be an absolute http(s) URL")
    if parsed.username or parsed.password:
        raise ValueError("endpoint URL must not contain userinfo")
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    path = parsed.path or "/"
    if parsed.query:
        path += "?" + parsed.query
    headers = {
        "Accept": "application/json, text/event-stream",
        "Content-Type": "application/json",
        "MCP-Protocol-Version": "2025-06-18",
        "User-Agent": "mcp-local-http-attestor/1.0",
    }
    if host_header:
        headers["Host"] = host_header
    if origin:
        headers["Origin"] = origin
    if authorization:
        headers["Authorization"] = authorization
    connection: http.client.HTTPConnection | http.client.HTTPSConnection
    if parsed.scheme == "https":
        connection = http.client.HTTPSConnection(parsed.hostname, port, timeout=timeout, context=ssl.create_default_context())
    else:
        connection = http.client.HTTPConnection(parsed.hostname, port, timeout=timeout)
    started = time.monotonic()
    try:
        connection.request("POST", path, body=initialize_body(), headers=headers)
        response = connection.getresponse()
        # Read only a bounded amount; bodies can contain server metadata and are unnecessary for this test.
        response.read(2048)
        return {"status": response.status, "latency_ms": round((time.monotonic() - started) * 1000, 1)}
    except (OSError, socket.timeout, ssl.SSLError, http.client.HTTPException) as exc:
        return {"error": type(exc).__name__, "detail": str(exc)[:200]}
    finally:
        connection.close()


def rejected(result: dict[str, Any]) -> bool:
    return result.get("status") in {401, 403}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("endpoint")
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--auth-env", default="MCP_ATTEST_AUTHORIZATION",
                        help="environment variable containing complete Authorization header value")
    args = parser.parse_args()
    try:
        policy = load_policy(args.policy)
        parsed = urlsplit(args.endpoint)
        if not parsed.hostname:
            raise ValueError("endpoint hostname required")
    except ValueError as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID

    timeout = float(policy.get("request_timeout_seconds", 3))
    auth = os.environ.get(args.auth_env)
    if policy.get("require_authentication") is True and not auth:
        print(json.dumps({"decision": "manual-review", "reason": f"{args.auth_env} not set for positive control"}, indent=2))
        return REVIEW

    positive_host = parsed.hostname if parsed.port is None else f"{parsed.hostname}:{parsed.port}"
    report: dict[str, Any] = {"endpoint": args.endpoint, "probes": []}

    positive = request(args.endpoint, timeout, positive_host, None, auth)
    report["positive_control"] = positive
    if "error" in positive or not isinstance(positive.get("status"), int):
        report.update(decision="manual-review", reason="positive_control_unreachable")
        print(json.dumps(report, indent=2))
        return REVIEW
    if positive["status"] >= 500:
        report.update(decision="manual-review", reason="positive_control_server_error")
        print(json.dumps(report, indent=2))
        return REVIEW

    blocked = []
    ambiguous = []
    for host in policy["foreign_host_probes"]:
        result = request(args.endpoint, timeout, host, None, auth)
        item = {"kind": "foreign_host", "value": host, **result, "rejected": rejected(result)}
        report["probes"].append(item)
        if "error" in result:
            ambiguous.append(item)
        elif not item["rejected"]:
            blocked.append(item)

    for origin in policy["foreign_origin_probes"]:
        result = request(args.endpoint, timeout, positive_host, origin, auth)
        item = {"kind": "foreign_origin", "value": origin, **result, "rejected": rejected(result)}
        report["probes"].append(item)
        if "error" in result:
            ambiguous.append(item)
        elif not item["rejected"]:
            blocked.append(item)

    if policy.get("require_authentication") is True:
        result = request(args.endpoint, timeout, positive_host, None, None)
        item = {"kind": "unauthenticated", "value": "authorization-omitted", **result, "rejected": rejected(result)}
        report["probes"].append(item)
        if "error" in result:
            ambiguous.append(item)
        elif not item["rejected"]:
            blocked.append(item)

    if blocked:
        report.update(decision="block", reason="prohibited_request_accepted", blocking_count=len(blocked))
        print(json.dumps(report, indent=2))
        return BLOCK
    if ambiguous:
        report.update(decision="manual-review", reason="one_or_more_negative_probes_ambiguous")
        print(json.dumps(report, indent=2))
        return REVIEW
    report.update(decision="pass", reason="all_prohibited_requests_rejected")
    print(json.dumps(report, indent=2))
    return PASS


if __name__ == "__main__":
    raise SystemExit(main())
