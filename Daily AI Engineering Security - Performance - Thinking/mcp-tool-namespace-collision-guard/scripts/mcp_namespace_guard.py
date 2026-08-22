#!/usr/bin/env python3
"""Validate and deterministically namespace MCP tool manifests.
Exit: 0 allow, 2 invalid input, 3 collision/drift blocked.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from pathlib import Path
from typing import Any


def load(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def digest(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()


def normalize(value: str, pattern: str, replacement: str, lower: bool) -> str:
    out = re.sub(pattern, replacement, value)
    out = re.sub(r"_+", "_", out).strip("_")
    if lower:
        out = out.lower()
    if not out:
        raise ValueError(f"name normalizes to empty: {value!r}")
    return out


def analyze(manifest: dict[str, Any], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    servers = manifest.get("servers")
    if not isinstance(servers, list) or not servers:
        raise ValueError("manifest.servers must be a non-empty array")
    pattern = policy.get("invalid_char_pattern", r"[^A-Za-z0-9_]")
    replacement = policy.get("replacement", "_")
    lower = bool(policy.get("lowercase", True))
    separator = str(policy.get("separator", "__"))
    suffix_len = int(policy.get("digest_suffix_length", 8))
    if suffix_len < 4 or suffix_len > 32:
        raise ValueError("digest_suffix_length must be 4..32")

    rows: list[dict[str, Any]] = []
    seen_server_ids: set[str] = set()
    for s in servers:
        if not isinstance(s, dict): raise ValueError("server must be object")
        sid = s.get("id")
        tools = s.get("tools")
        if not isinstance(sid, str) or not sid: raise ValueError("server.id required")
        if sid in seen_server_ids: raise ValueError(f"duplicate server.id: {sid}")
        seen_server_ids.add(sid)
        if not isinstance(tools, list): raise ValueError(f"server {sid}: tools must be array")
        ns = normalize(sid, pattern, replacement, lower)
        for t in tools:
            if not isinstance(t, dict): raise ValueError(f"server {sid}: tool must be object")
            name = t.get("name"); schema = t.get("schema", {})
            if not isinstance(name, str) or not name: raise ValueError(f"server {sid}: tool.name required")
            norm = normalize(name, pattern, replacement, lower)
            sd = digest(schema)
            rows.append({"server_id": sid, "server_ns": ns, "raw_name": name, "tool_ns": norm, "schema_digest": sd})

    base_groups: dict[str, list[dict[str, Any]]] = {}
    for r in rows:
        base = f"{r['server_ns']}{separator}{r['tool_ns']}"
        r["base_alias"] = base
        base_groups.setdefault(base, []).append(r)

    collisions = []
    aliases: dict[str, dict[str, str]] = {}
    for base, group in sorted(base_groups.items()):
        if len(group) == 1:
            r = group[0]; alias = base
            aliases[alias] = {"server_id": r["server_id"], "raw_name": r["raw_name"], "schema_digest": r["schema_digest"]}
            continue
        identities = {(r["server_id"], r["raw_name"], r["schema_digest"]) for r in group}
        if len(identities) != len(group):
            collisions.append({"type": "duplicate_identity", "base_alias": base, "count": len(group)})
            continue
        for r in sorted(group, key=lambda x: (x["server_id"], x["raw_name"], x["schema_digest"])):
            suffix = digest([r["server_id"], r["raw_name"], r["schema_digest"]])[:suffix_len]
            alias = f"{base}{separator}{suffix}"
            if alias in aliases:
                collisions.append({"type": "digest_alias_collision", "alias": alias})
            else:
                aliases[alias] = {"server_id": r["server_id"], "raw_name": r["raw_name"], "schema_digest": r["schema_digest"]}
        collisions.append({"type": "normalized_collision_disambiguated", "base_alias": base, "count": len(group)})

    blocking = [c for c in collisions if c["type"] != "normalized_collision_disambiguated"]
    registry_digest = digest(aliases)
    out = {"decision": "deny" if blocking else "allow", "tool_count": len(rows), "aliases": aliases,
           "collisions": collisions, "blocking_collisions": blocking, "registry_digest": registry_digest}
    return out, (3 if blocking else 0)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest", type=Path); ap.add_argument("--policy", type=Path, required=True)
    a = ap.parse_args()
    try:
        out, code = analyze(load(a.manifest), load(a.policy))
    except (ValueError, TypeError, re.error) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr); return 2
    print(json.dumps(out, indent=2, ensure_ascii=False)); return code

if __name__ == "__main__":
    raise SystemExit(main())
