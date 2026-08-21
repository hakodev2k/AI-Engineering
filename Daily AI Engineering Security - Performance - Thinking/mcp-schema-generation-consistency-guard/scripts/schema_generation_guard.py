#!/usr/bin/env python3
"""Build and compare deterministic MCP tool-catalog generation manifests.

This script does not execute tools and does not replace a host JSON-Schema compiler.
It verifies catalog shape, unique names, schema presence/type, and stable digests.
Exit codes: 0 success/match, 2 mismatch/invalid catalog, 3 usage/environment error.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def canonical(value) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def digest(value) -> str:
    return hashlib.sha256(canonical(value)).hexdigest()


def load(path: str):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def normalize_catalog(raw) -> dict:
    tools = raw.get("tools") if isinstance(raw, dict) else raw
    if not isinstance(tools, list):
        raise ValueError("catalog must be a list or an object containing a tools list")
    names = set()
    normalized = []
    for index, tool in enumerate(tools):
        if not isinstance(tool, dict):
            raise ValueError(f"tool[{index}] must be an object")
        name = tool.get("name")
        if not isinstance(name, str) or not name.strip():
            raise ValueError(f"tool[{index}] has invalid name")
        if name in names:
            raise ValueError(f"duplicate tool name: {name}")
        names.add(name)
        output_schema = tool.get("outputSchema")
        if output_schema is not None and not isinstance(output_schema, dict):
            raise ValueError(f"tool {name}: outputSchema must be an object")
        input_schema = tool.get("inputSchema")
        if input_schema is not None and not isinstance(input_schema, dict):
            raise ValueError(f"tool {name}: inputSchema must be an object")
        normalized.append({
            "name": name,
            "input_schema_sha256": digest(input_schema) if input_schema is not None else None,
            "output_schema_sha256": digest(output_schema) if output_schema is not None else None,
            "has_output_schema": output_schema is not None,
        })
    normalized.sort(key=lambda x: x["name"])
    manifest = {"version": 1, "tool_count": len(normalized), "tools": normalized}
    manifest["generation_sha256"] = digest(manifest)
    return manifest


def write(path: str, value: dict) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="command", required=True)
    build = sub.add_parser("build")
    build.add_argument("--catalog", required=True)
    build.add_argument("--output", required=True)
    compare = sub.add_parser("compare")
    compare.add_argument("--left", required=True)
    compare.add_argument("--right", required=True)
    args = ap.parse_args()
    try:
        if args.command == "build":
            manifest = normalize_catalog(load(args.catalog))
            write(args.output, manifest)
            print(json.dumps({"status": "built", "generation": manifest["generation_sha256"], "tools": manifest["tool_count"]}))
            return 0
        left, right = load(args.left), load(args.right)
        same = left.get("generation_sha256") == right.get("generation_sha256")
        print(json.dumps({"status": "match" if same else "different", "left": left.get("generation_sha256"), "right": right.get("generation_sha256")}))
        return 0 if same else 2
    except (OSError, json.JSONDecodeError, ValueError, KeyError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 2
    except Exception as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
