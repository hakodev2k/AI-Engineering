#!/usr/bin/env python3
"""Evaluate sanitized MCP OAuth audience evidence.
Exit 0 allow, 3 degraded low-risk fallback, 4 deny, 2 invalid input.
Never pass raw bearer tokens to this script.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


def load(path: Path) -> dict:
    try:
        x = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(x, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return x


def canon(uri: str) -> str:
    p = urlsplit(uri)
    if p.scheme.lower() not in {"https", "http"} or not p.netloc:
        raise ValueError("resource URI must be absolute http(s)")
    host = p.hostname.lower() if p.hostname else ""
    port = f":{p.port}" if p.port and not ((p.scheme.lower()=="https" and p.port==443) or (p.scheme.lower()=="http" and p.port==80)) else ""
    netloc = host + port
    path = p.path or "/"
    return urlunsplit((p.scheme.lower(), netloc, path, p.query, ""))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("evidence", type=Path)
    ap.add_argument("--policy", required=True, type=Path)
    a = ap.parse_args()
    try:
        e, p = load(a.evidence), load(a.policy)
        expected = canon(str(p["canonical_resource"]))
        impact = str(e.get("impact", ""))
        if not impact:
            raise ValueError("impact required")
        audiences = e.get("verified_audiences", [])
        if not isinstance(audiences, list) or not all(isinstance(x, str) for x in audiences):
            raise ValueError("verified_audiences must be string array")
        verified = any(canon(x) == expected for x in audiences)
        resource_supported = e.get("resource_parameter_supported") is True
        resource_sent = e.get("resource_parameter_sent") is True
        opaque_verified = e.get("opaque_token_introspection_verified") is True
        token_kind = e.get("token_kind", "jwt")
        if token_kind == "opaque" and p.get("require_introspection_for_opaque_tokens", True) and not opaque_verified:
            print(json.dumps({"decision":"deny","reason":"opaque_token_not_introspected"})); return 4
        if verified and (not p.get("require_resource_parameter", True) or (resource_supported and resource_sent)):
            print(json.dumps({"decision":"allow","reason":"audience_and_resource_verified","expected":expected})); return 0
        fallback_ok = p.get("allow_provider_compatibility_fallback", False) and impact in p.get("fallback_allowed_for_impact", []) and verified
        if fallback_ok and not resource_supported:
            print(json.dumps({"decision":"degraded-low-risk","reason":"provider_resource_parameter_unsupported_but_audience_verified","expected":expected})); return 3
        reason = "wrong_or_unverified_audience" if not verified else "resource_parameter_missing_or_unverified"
        print(json.dumps({"decision":"deny","reason":reason,"expected":expected})); return 4
    except (ValueError, KeyError, TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr); return 2

if __name__ == "__main__":
    raise SystemExit(main())
