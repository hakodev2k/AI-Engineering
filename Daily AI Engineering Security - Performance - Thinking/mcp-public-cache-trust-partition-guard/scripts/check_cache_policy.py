#!/usr/bin/env python3
"""Validate MCP cache scope and trust-partition policy."""
import json
import sys
from pathlib import Path

SENSITIVE_FLAGS = ("authenticated", "tenant_scoped", "user_scoped", "permission_sensitive")
DEFAULT_REQUIRED = ["server_id", "tenant_id", "principal_id", "authz_fingerprint"]


def load(path: Path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}")
    if not isinstance(data, dict) or not isinstance(data.get("entries"), list):
        raise ValueError("top-level object must contain entries: []")
    return data


def inspect_entry(entry, index, required_fields):
    if not isinstance(entry, dict):
        return [f"entries[{index}] must be an object"]
    name = str(entry.get("name", f"entry-{index}"))
    scope = entry.get("scope")
    key_fields = entry.get("cache_key_fields", [])
    ttl = entry.get("ttl_ms", 0)
    errors = []
    if scope not in {"public", "private", "none"}:
        errors.append(f"{name}: scope must be public, private, or none")
    if not isinstance(key_fields, list) or not all(isinstance(x, str) for x in key_fields):
        errors.append(f"{name}: cache_key_fields must be a string list")
        key_fields = []
    if not isinstance(ttl, int) or ttl < 0:
        errors.append(f"{name}: ttl_ms must be a non-negative integer")
    sensitive = any(entry.get(flag) is True for flag in SENSITIVE_FLAGS)
    instructions = entry.get("contains_instructions") is True
    globally_invariant = entry.get("globally_invariant_approved") is True
    if scope == "public" and instructions and not globally_invariant:
        errors.append(f"{name}: BLOCK instruction-bearing content in public cache without explicit invariant approval")
    if scope == "public" and sensitive and not globally_invariant:
        errors.append(f"{name}: BLOCK authorization/tenant/user-sensitive content in public cache")
    if scope == "private" and sensitive:
        missing = [field for field in required_fields if field not in key_fields]
        if missing:
            errors.append(f"{name}: BLOCK private sensitive cache missing partition fields: {', '.join(missing)}")
    if entry.get("sensitivity_known") is not True and scope != "none":
        errors.append(f"{name}: BLOCK cache admission when sensitivity is unknown")
    return errors


def main(argv):
    if len(argv) != 2:
        print(f"usage: {argv[0]} <policy.json>", file=sys.stderr)
        return 1
    try:
        data = load(Path(argv[1]))
        required = data.get("required_private_partition_fields", DEFAULT_REQUIRED)
        if not isinstance(required, list) or not required or not all(isinstance(x, str) for x in required):
            raise ValueError("required_private_partition_fields must be a non-empty string list")
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    findings = []
    for i, entry in enumerate(data["entries"]):
        findings.extend(inspect_entry(entry, i, required))
    if findings:
        print("BLOCK")
        for finding in findings:
            print(f"- {finding}")
        return 2
    print(f"PASS: {len(data['entries'])} cache entrie(s) satisfy trust-partition policy")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
