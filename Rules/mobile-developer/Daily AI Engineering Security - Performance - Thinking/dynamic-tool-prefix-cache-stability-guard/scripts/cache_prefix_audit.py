#!/usr/bin/env python3
"""Detect avoidable prompt-cache drift in tool catalogs.

Exit 0: stable or semantic change; 2: invalid input; 3: semantic-equal but raw/order drift.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def load(path: Path):
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    return value


def tool_list(value):
    if isinstance(value, dict) and "tools" in value:
        value = value["tools"]
    if not isinstance(value, list) or not all(isinstance(x, dict) for x in value):
        raise ValueError("tool catalog must be an array of objects or {tools:[...]}")
    for i, tool in enumerate(value):
        if not isinstance(tool.get("name"), str) or not tool["name"]:
            raise ValueError(f"tool[{i}].name must be a non-empty string")
    return value


def canonical(tools):
    return sorted(tools, key=lambda x: x["name"])


def encoded(value, canonical_keys=False):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=canonical_keys).encode("utf-8")


def sha(data: bytes):
    return hashlib.sha256(data).hexdigest()


def main():
    p=argparse.ArgumentParser()
    p.add_argument("current", type=Path)
    p.add_argument("--previous", type=Path)
    p.add_argument("--policy", type=Path, required=True)
    a=p.parse_args()
    try:
        policy=load(a.policy)
        if not isinstance(policy, dict): raise ValueError("policy must be an object")
        cur=tool_list(load(a.current))
        cur_raw=sha(encoded(cur, False))
        cur_can=sha(encoded(canonical(cur), bool(policy.get("canonicalize_json_keys", True))))
        result={"current_raw_sha256":cur_raw,"current_canonical_sha256":cur_can,"tool_count":len(cur),"classification":"baseline"}
        code=0
        if a.previous:
            prev=tool_list(load(a.previous))
            prev_raw=sha(encoded(prev, False))
            prev_can=sha(encoded(canonical(prev), bool(policy.get("canonicalize_json_keys", True))))
            semantic_equal=prev_can==cur_can
            raw_equal=prev_raw==cur_raw
            if semantic_equal and not raw_equal:
                result["classification"]="avoidable_byte_or_order_drift"; code=3
            elif semantic_equal:
                result["classification"]="stable"
            else:
                result["classification"]="semantic_catalog_change"
            result.update({"previous_raw_sha256":prev_raw,"previous_canonical_sha256":prev_can,"semantic_equal":semantic_equal,"raw_equal":raw_equal})
    except (ValueError, TypeError) as exc:
        print(json.dumps({"error":str(exc)}), file=sys.stderr); return 2
    print(json.dumps(result, indent=2, ensure_ascii=False)); return code

if __name__ == "__main__":
    raise SystemExit(main())
