#!/usr/bin/env python3
"""Deterministic MCP cache admission guard.

Input JSON fields:
server_origin, protocol_version, method, canonical_request, resource_identity,
declared_scope, ttl_ms, payload, authorization_fingerprint.

Exit 0: admitted, 2: invalid input/config, 3: rejected by policy.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def req_str(data: dict, name: str) -> str:
    value = data.get(name)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{name} must be a non-empty string")
    return value.strip()


def canonical_key(parts: list[str]) -> str:
    encoded = json.dumps(parts, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        data, policy = load(args.input), load(args.policy)
        server = req_str(data, "server_origin")
        protocol = req_str(data, "protocol_version")
        method = req_str(data, "method")
        request = req_str(data, "canonical_request")
        resource = req_str(data, "resource_identity")
        scope = data.get("declared_scope")
        if scope not in {"private", "public"}:
            if policy.get("reject_unknown_scope", True):
                result = {"decision": "reject", "reason": "unknown_cache_scope"}
                print(json.dumps(result, indent=2)); return 3 if args.strict else 0
            scope = policy.get("default_scope", "private")
        ttl = data.get("ttl_ms")
        if not isinstance(ttl, int) or isinstance(ttl, bool) or ttl < 0:
            raise ValueError("ttl_ms must be a non-negative integer")
        payload = data.get("payload")
        if not isinstance(payload, (dict, list, str, int, float, bool)) and payload is not None:
            raise ValueError("payload must be JSON-compatible")
        payload_bytes = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
        payload_sha = hashlib.sha256(payload_bytes).hexdigest()
        trusted = server in policy.get("share_trusted_servers", [])
        effective = scope
        reasons = []
        if scope == "public" and not (policy.get("allow_shared_cache", False) and trusted):
            if policy.get("downgrade_untrusted_public_to_private", True):
                effective = "private"; reasons.append("public_scope_downgraded")
            else:
                result = {"decision": "reject", "reason": "untrusted_public_scope", "payload_sha256": payload_sha}
                print(json.dumps(result, indent=2)); return 3 if args.strict else 0
        auth = data.get("authorization_fingerprint")
        if effective == "private":
            if policy.get("require_authorization_fingerprint_for_private", True) and (not isinstance(auth, str) or not auth.strip()):
                raise ValueError("authorization_fingerprint required for private cache")
            max_ttl = int(policy.get("max_ttl_ms_private", 300000))
            parts = [server, protocol, method, request, resource, str(auth)]
        else:
            max_ttl = int(policy.get("max_ttl_ms_shared", 60000))
            parts = [server, protocol, method, request, resource]
        effective_ttl = min(ttl, max_ttl)
        result = {
            "decision": effective,
            "effective_scope": effective,
            "cache_key": canonical_key(parts),
            "payload_sha256": payload_sha,
            "ttl_ms": effective_ttl,
            "share_trusted_server": trusted,
            "reasons": reasons,
        }
        print(json.dumps(result, indent=2))
        return 0
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
