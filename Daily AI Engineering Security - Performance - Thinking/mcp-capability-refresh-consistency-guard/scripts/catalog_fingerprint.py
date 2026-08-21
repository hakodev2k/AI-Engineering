#!/usr/bin/env python3
"""Create deterministic semantic fingerprints for MCP tool catalogs."""
import argparse, hashlib, json, pathlib, sys

VOLATILE_KEYS = {"ttlMs", "cacheScope"}

def normalize(value):
    if isinstance(value, dict):
        return {k: normalize(v) for k, v in sorted(value.items()) if k not in VOLATILE_KEYS}
    if isinstance(value, list):
        return [normalize(v) for v in value]
    return value

def normalize_tool(tool):
    if not isinstance(tool, dict) or not isinstance(tool.get("name"), str):
        raise ValueError("each tool must be an object with string name")
    return normalize(tool)

def load_catalog(path):
    data = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    if isinstance(data, dict) and "tools" in data:
        data = data["tools"]
    if not isinstance(data, list):
        raise ValueError("catalog must be a JSON array or object containing tools[]")
    tools = [normalize_tool(x) for x in data]
    names = [x["name"] for x in tools]
    if len(names) != len(set(names)):
        raise ValueError("duplicate tool names are not allowed")
    tools.sort(key=lambda x: x["name"])
    return tools

def digest(value):
    raw = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def summarize(tools):
    return {"catalog_sha256": digest(tools), "tool_count": len(tools), "tools": {t["name"]: digest(t) for t in tools}}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("catalog")
    p.add_argument("--compare")
    args = p.parse_args()
    try:
        a = load_catalog(args.catalog)
        sa = summarize(a)
        result = {"catalog": args.catalog, **sa}
        if args.compare:
            b = load_catalog(args.compare)
            sb = summarize(b)
            an, bn = sa["tools"], sb["tools"]
            result.update({
                "compare": args.compare,
                "compare_sha256": sb["catalog_sha256"],
                "match": sa["catalog_sha256"] == sb["catalog_sha256"],
                "added": sorted(set(bn) - set(an)),
                "removed": sorted(set(an) - set(bn)),
                "changed": sorted(k for k in set(an) & set(bn) if an[k] != bn[k]),
            })
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return 3 if args.compare and not result["match"] else 0
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
