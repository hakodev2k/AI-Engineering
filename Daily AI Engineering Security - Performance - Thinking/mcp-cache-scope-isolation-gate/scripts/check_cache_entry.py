#!/usr/bin/env python3
"""Fail-closed policy gate for storing MCP responses in shared/private caches."""
import json
import sys
from pathlib import Path


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def validate(policy, entry):
    errors=[]
    if not isinstance(policy, dict) or not isinstance(entry, dict):
        return ["policy and entry must be objects"]
    scope=entry.get("cache_scope", "private")
    cache_kind=entry.get("cache_kind", "private")
    endpoint=entry.get("endpoint")
    server_id=entry.get("server_id")
    protocol=entry.get("protocol_version")
    principal=entry.get("principal")
    fields=entry.get("content_fields", [])
    if scope not in {"public","private"}:
        errors.append(f"invalid cache_scope {scope!r}; fail closed")
    if cache_kind not in {"shared","private","no-store"}:
        errors.append(f"invalid cache_kind {cache_kind!r}")
    for name,val in [("endpoint",endpoint),("server_id",server_id),("protocol_version",protocol)]:
        if not isinstance(val,str) or not val.strip(): errors.append(f"{name} is required")
    if not isinstance(fields,list) or not all(isinstance(x,str) for x in fields):
        errors.append("content_fields must be a string list"); fields=[]
    forbidden=set(policy.get("forbidden_shared_fields", ["instructions","tools","prompts","resources","secrets","user_data"]))
    public_endpoints=set(policy.get("public_endpoints", []))
    trusted=set(policy.get("trusted_server_ids", []))
    allow_auth_shared=bool(policy.get("allow_authenticated_shared_cache", False))
    if cache_kind == "shared":
        if scope != "public": errors.append("shared cache requires locally accepted public scope")
        if server_id not in trusted: errors.append("shared cache requires trusted server_id")
        if endpoint not in public_endpoints: errors.append("endpoint is not allowlisted for shared cache")
        overlap=sorted(set(fields)&forbidden)
        if overlap: errors.append("forbidden shared content field(s): " + ", ".join(overlap))
        if principal and not allow_auth_shared: errors.append("authenticated/principal-bound response may not enter shared cache")
    if cache_kind == "private" and principal is not None and (not isinstance(principal,str) or not principal.strip()):
        errors.append("private principal namespace must be a non-empty string when supplied")
    key_parts=entry.get("cache_key_parts", [])
    if not isinstance(key_parts,list) or not all(isinstance(x,str) for x in key_parts):
        errors.append("cache_key_parts must be a string list"); key_parts=[]
    required={"server_id","protocol_version"}
    if cache_kind == "private" and principal: required.add("principal")
    missing=sorted(required-set(key_parts))
    if cache_kind != "no-store" and missing: errors.append("cache key missing required dimension(s): " + ", ".join(missing))
    return errors


def main(argv):
    if len(argv)!=3:
        print(f"usage: {argv[0]} <policy.json> <entry.json>",file=sys.stderr); return 1
    try:
        policy=read_json(argv[1]); entry=read_json(argv[2]); errors=validate(policy,entry)
    except (OSError,ValueError) as exc:
        print(f"ERROR: {exc}",file=sys.stderr); return 1
    if errors:
        print("BLOCK")
        for e in errors: print(f"- {e}")
        return 5
    print("ALLOW")
    return 0

if __name__=="__main__": sys.exit(main(sys.argv))
