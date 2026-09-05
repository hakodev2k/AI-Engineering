#!/usr/bin/env python3
"""Detect MCP registry truncation, missing required tools, and capacity pressure."""
import hashlib
import json
import sys
from pathlib import Path


def load(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}")
    if not isinstance(data, dict):
        raise ValueError("contract must be a JSON object")
    return data


def norm_list(data, key):
    value = data.get(key)
    if not isinstance(value, list) or not all(isinstance(x, str) and x.strip() for x in value):
        raise ValueError(f"{key} must be a list of non-empty strings")
    normalized = [x.strip() for x in value]
    if len(normalized) != len(set(normalized)):
        raise ValueError(f"{key} contains duplicates")
    return set(normalized)


def fingerprint(items):
    payload = "\n".join(sorted(items)).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()[:16]


def inspect(data):
    advertised = norm_list(data, "advertised_tools")
    visible = norm_list(data, "visible_tools")
    required = norm_list(data, "required_tools")
    capacity = data.get("documented_capacity")
    if capacity is not None and (not isinstance(capacity, int) or capacity < 1):
        raise ValueError("documented_capacity must be null or positive integer")
    missing_required = sorted(required - visible)
    missing_advertised = sorted(advertised - visible)
    unexpected_visible = sorted(visible - advertised)
    findings = []
    if missing_required:
        findings.append(f"missing {len(missing_required)} required tool(s)")
    if len(visible) < len(advertised):
        findings.append(f"visible registry has {len(visible)}/{len(advertised)} advertised tools")
    if capacity is not None and len(advertised) > capacity:
        findings.append(f"advertised tool count {len(advertised)} exceeds documented capacity {capacity}")
    retention = 1.0 if not advertised else len(visible & advertised) / len(advertised)
    coverage = 1.0 if not required else len(required & visible) / len(required)
    return {
        "decision": "block" if missing_required else "pass",
        "advertised_count": len(advertised),
        "visible_count": len(visible),
        "required_count": len(required),
        "retention_ratio": round(retention, 6),
        "required_coverage": round(coverage, 6),
        "advertised_fingerprint": fingerprint(advertised),
        "visible_fingerprint": fingerprint(visible),
        "missing_required": missing_required,
        "missing_advertised": missing_advertised,
        "unexpected_visible": unexpected_visible,
        "findings": findings,
    }


def main(argv):
    if len(argv) != 2:
        print(f"usage: {argv[0]} <contract.json>", file=sys.stderr)
        return 1
    try:
        result = inspect(load(argv[1]))
    except (OSError, ValueError) as exc:
        print(json.dumps({"decision":"error","error":str(exc)}))
        return 1
    print(json.dumps(result, indent=2))
    return 4 if result["decision"] == "block" else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
