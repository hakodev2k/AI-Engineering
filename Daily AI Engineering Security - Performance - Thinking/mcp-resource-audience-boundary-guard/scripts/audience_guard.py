#!/usr/bin/env python3
"""Policy guard for already-verified MCP OAuth claims.
Exit: 0 allow, 2 invalid input/config, 3 deny. Never accepts raw tokens.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


def load(path: Path) -> dict:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return obj


def canonical_resource(value: str) -> str:
    if not isinstance(value, str) or not value:
        raise ValueError("resource must be a non-empty string")
    p = urlsplit(value)
    if p.scheme.lower() not in {"https", "http"} or not p.netloc:
        raise ValueError("resource must be an absolute HTTP(S) URI")
    host = p.hostname.lower() if p.hostname else ""
    port = f":{p.port}" if p.port else ""
    user = f"{p.username}@" if p.username else ""
    netloc = f"{user}{host}{port}"
    return urlunsplit((p.scheme.lower(), netloc, p.path or "/", p.query, ""))


def as_list(value):
    if isinstance(value, str): return [value]
    if isinstance(value, list) and all(isinstance(x, str) for x in value): return value
    return []


def decide(claims: dict, policy: dict) -> tuple[dict, int]:
    resource = canonical_resource(policy.get("resource"))
    issuers = set(policy.get("trusted_issuers", []))
    if not issuers or not all(isinstance(x, str) for x in issuers):
        raise ValueError("trusted_issuers must be a non-empty string list")
    if claims.get("raw_token") or claims.get("access_token"):
        return {"decision":"deny","reason":"raw_token_input_forbidden"}, 3
    if policy.get("allow_token_passthrough", False) or claims.get("downstream_mode") == "passthrough":
        return {"decision":"deny","reason":"token_passthrough_forbidden"}, 3
    if claims.get("iss") not in issuers:
        return {"decision":"deny","reason":"untrusted_issuer"}, 3
    audiences = []
    for a in as_list(claims.get("aud")):
        try: audiences.append(canonical_resource(a))
        except ValueError: audiences.append(a)
    if resource not in audiences:
        return {"decision":"deny","reason":"wrong_or_missing_audience"}, 3
    if "resource" in claims and claims["resource"] is not None:
        try: claim_resource = canonical_resource(claims["resource"])
        except ValueError: return {"decision":"deny","reason":"invalid_resource_claim"}, 3
        if claim_resource != resource:
            return {"decision":"deny","reason":"resource_claim_mismatch"}, 3
    required = set(policy.get("required_scopes", []))
    scope_value = claims.get("scope", "")
    scopes = set(scope_value.split()) if isinstance(scope_value, str) else set(as_list(scope_value))
    if not required.issubset(scopes):
        return {"decision":"deny","reason":"insufficient_scope","missing":sorted(required-scopes)}, 3
    if policy.get("require_subject", True) and not isinstance(claims.get("sub"), str):
        return {"decision":"deny","reason":"missing_subject"}, 3
    return {"decision":"allow","reason":"resource_boundary_satisfied"}, 0


def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument("claims", type=Path); ap.add_argument("--policy", required=True, type=Path); a=ap.parse_args()
    try: out, code = decide(load(a.claims), load(a.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr); return 2
    print(json.dumps(out, indent=2, sort_keys=True)); return code

if __name__ == "__main__": raise SystemExit(main())
