#!/usr/bin/env python3
"""Deterministically validate sanitized MCP OAuth conformance evidence.

Input JSON example:
{
  "canonical_resource": "https://mcp.example.com/mcp",
  "authorization_resource": "https://mcp.example.com/mcp",
  "token_resource": "https://mcp.example.com/mcp",
  "expected_issuer": "https://auth.example.com",
  "token_issuer": "https://auth.example.com",
  "expected_audience": "https://mcp.example.com/mcp",
  "token_audiences": ["https://mcp.example.com/mcp"],
  "required_privileges": ["Mcp.Tools.ReadWrite"],
  "token_privileges": ["Mcp.Tools.ReadWrite"],
  "expired": false,
  "inbound_token_fingerprint": "sha256:...",
  "downstream_token_fingerprint": "sha256:..."
}

Never provide raw tokens. Exit 0 allow, 3 block, 2 invalid input.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from urllib.parse import urlparse


def load(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("input must be a JSON object")
    return data


def nonempty_str(data: dict, key: str) -> str:
    value = data.get(key)
    if not isinstance(value, str) or not value:
        raise ValueError(f"{key} must be a non-empty string")
    return value


def string_list(data: dict, key: str) -> list[str]:
    value = data.get(key)
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{key} must be an array of non-empty strings")
    return value


def valid_https_resource(uri: str) -> bool:
    parsed = urlparse(uri)
    return parsed.scheme == "https" and bool(parsed.netloc) and parsed.fragment == ""


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    args = p.parse_args()
    try:
        d = load(args.input)
        canonical = nonempty_str(d, "canonical_resource")
        auth_resource = nonempty_str(d, "authorization_resource")
        token_resource = nonempty_str(d, "token_resource")
        expected_issuer = nonempty_str(d, "expected_issuer")
        token_issuer = nonempty_str(d, "token_issuer")
        expected_audience = nonempty_str(d, "expected_audience")
        audiences = string_list(d, "token_audiences")
        required = string_list(d, "required_privileges")
        actual = string_list(d, "token_privileges")
        expired = d.get("expired")
        if not isinstance(expired, bool):
            raise ValueError("expired must be boolean")
        inbound_fp = d.get("inbound_token_fingerprint")
        downstream_fp = d.get("downstream_token_fingerprint")
        for key, fp in (("inbound_token_fingerprint", inbound_fp), ("downstream_token_fingerprint", downstream_fp)):
            if fp is not None and (not isinstance(fp, str) or not fp.startswith("sha256:")):
                raise ValueError(f"{key} must be null or a sha256: fingerprint; raw tokens are forbidden")

        checks = {
            "canonical_resource_https": valid_https_resource(canonical),
            "authorization_resource_matches": auth_resource == canonical,
            "token_resource_matches": token_resource == canonical,
            "issuer_matches": token_issuer == expected_issuer,
            "audience_matches": expected_audience == canonical and expected_audience in audiences,
            "not_expired": not expired,
            "required_privileges_present": set(required).issubset(set(actual)),
            "no_token_passthrough": not (inbound_fp is not None and downstream_fp is not None and inbound_fp == downstream_fp),
        }
        failed = [name for name, passed in checks.items() if not passed]
        decision = "allow" if not failed else "block"
        print(json.dumps({"decision": decision, "checks": checks, "failed": failed}, indent=2, sort_keys=True))
        return 0 if decision == "allow" else 3
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
