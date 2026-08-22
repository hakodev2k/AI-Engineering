#!/usr/bin/env python3
"""Deterministic MCP tool identity derivation and invocation revalidation.

Exit codes:
  0 success / invocation allowed
  2 invalid input
  3 identity mismatch / denied
  4 I/O error
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urlsplit, urlunsplit


def canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def normalize_remote_origin(url: str) -> str:
    parts = urlsplit(url)
    if parts.scheme not in {"http", "https"} or not parts.hostname:
        raise ValueError("remote transport requires an absolute http(s) URL")
    host = parts.hostname.lower()
    port = parts.port
    default = (parts.scheme == "http" and port == 80) or (parts.scheme == "https" and port == 443)
    netloc = host if port is None or default else f"{host}:{port}"
    path = parts.path or "/"
    return urlunsplit((parts.scheme.lower(), netloc, path, "", ""))


def transport_material(record: Dict[str, Any]) -> Dict[str, Any]:
    transport = record.get("transport")
    if not isinstance(transport, dict):
        raise ValueError("record.transport must be an object")
    kind = transport.get("type")
    if kind == "stdio":
        command = transport.get("command")
        if not isinstance(command, str) or not command.strip():
            raise ValueError("stdio transport.command is required")
        args = transport.get("args", [])
        if not isinstance(args, list) or not all(isinstance(x, str) for x in args):
            raise ValueError("stdio transport.args must be an array of strings")
        cwd = transport.get("cwd", "")
        if not isinstance(cwd, str):
            raise ValueError("stdio transport.cwd must be a string")
        return {"type": "stdio", "command": command, "args": args, "cwd": cwd}
    if kind in {"http", "streamable-http", "sse"}:
        url = transport.get("url")
        if not isinstance(url, str):
            raise ValueError("remote transport.url is required")
        return {"type": kind, "origin": normalize_remote_origin(url)}
    raise ValueError("unsupported transport.type")


def derive(record: Dict[str, Any]) -> Dict[str, Any]:
    instance_id = record.get("server_instance_id")
    tool_name = record.get("tool_name")
    generation = record.get("connection_generation")
    schema = record.get("input_schema")
    alias = record.get("display_alias", tool_name)

    if not isinstance(instance_id, str) or not instance_id.strip():
        raise ValueError("server_instance_id is required")
    if not isinstance(tool_name, str) or not tool_name.strip():
        raise ValueError("tool_name is required")
    if not isinstance(generation, int) or generation < 0:
        raise ValueError("connection_generation must be a non-negative integer")
    if not isinstance(schema, dict):
        raise ValueError("input_schema must be an object")
    if not isinstance(alias, str) or not alias.strip():
        raise ValueError("display_alias must be a non-empty string")

    transport = transport_material(record)
    schema_digest = sha256_text(canonical_json(schema))
    origin_fingerprint = sha256_text(canonical_json({"server_instance_id": instance_id, "transport": transport}))
    identity_tuple = {
        "server_instance_id": instance_id,
        "origin_fingerprint": origin_fingerprint,
        "connection_generation": generation,
        "tool_name": tool_name,
        "schema_digest": schema_digest,
    }
    canonical_id = "mcp-tool:" + sha256_text(canonical_json(identity_tuple))
    return {
        **identity_tuple,
        "canonical_id": canonical_id,
        "display_alias": alias,
        "transport": transport,
    }


def load_json(path: str) -> Dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except OSError as exc:
        raise IOError(str(exc)) from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def verify_invocation(approval: Dict[str, Any], live_record: Dict[str, Any]) -> Dict[str, Any]:
    live = derive(live_record) if "input_schema" in live_record else live_record
    required = ["canonical_id", "origin_fingerprint", "connection_generation", "schema_digest", "tool_name"]
    missing = [k for k in required if k not in approval or k not in live]
    if missing:
        raise ValueError("missing identity fields: " + ", ".join(sorted(set(missing))))

    mismatches = {}
    for field in required:
        if approval[field] != live[field]:
            mismatches[field] = {"approved": approval[field], "live": live[field]}

    if mismatches:
        return {"status": "denied", "reason": "identity_mismatch", "mismatches": mismatches}
    return {"status": "allowed", "canonical_id": live["canonical_id"]}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    p_derive = sub.add_parser("derive")
    p_derive.add_argument("--record", required=True)

    p_verify = sub.add_parser("verify-invocation")
    p_verify.add_argument("--approval", required=True)
    p_verify.add_argument("--live", required=True)

    args = parser.parse_args()
    try:
        if args.command == "derive":
            result = derive(load_json(args.record))
            print(json.dumps(result, indent=2, sort_keys=True))
            return 0
        approval = load_json(args.approval)
        live = load_json(args.live)
        result = verify_invocation(approval, live)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result["status"] == "allowed" else 3
    except ValueError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 2
    except IOError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
