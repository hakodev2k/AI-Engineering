#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def walk_diff(current, candidate, path="$", out=None):
    out = out if out is not None else []
    if type(current) is not type(candidate):
        out.append({"path": path, "change": "type-changed", "current_type": type(current).__name__, "candidate_type": type(candidate).__name__})
        return out
    if isinstance(current, dict):
        ckeys, nkeys = set(current), set(candidate)
        for key in sorted(ckeys - nkeys):
            out.append({"path": f"{path}.{key}", "change": "removed"})
        for key in sorted(nkeys - ckeys):
            out.append({"path": f"{path}.{key}", "change": "added"})
        for key in sorted(ckeys & nkeys):
            walk_diff(current[key], candidate[key], f"{path}.{key}", out)
    elif isinstance(current, list):
        if current != candidate:
            out.append({"path": path, "change": "array-changed", "current_length": len(current), "candidate_length": len(candidate)})
    elif current != candidate:
        out.append({"path": path, "change": "value-changed", "current": current, "candidate": candidate})
    return out


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main():
    p = argparse.ArgumentParser(description="Create a deterministic structural JSON contract diff.")
    p.add_argument("--current", required=True)
    p.add_argument("--candidate", required=True)
    p.add_argument("--output", default="contract-drift-report.json")
    p.add_argument("--kind", default="json-contract")
    args = p.parse_args()

    try:
        current = load(args.current)
        candidate = load(args.candidate)
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        print(f"error: cannot load contracts: {exc}", file=sys.stderr)
        return 2

    changes = walk_diff(current, candidate)
    report = {
        "schema_version": 1,
        "contract_kind": args.kind,
        "current": args.current,
        "candidate": args.candidate,
        "summary": {
            "total": len(changes),
            "added": sum(1 for x in changes if x["change"] == "added"),
            "removed": sum(1 for x in changes if x["change"] == "removed"),
            "other": sum(1 for x in changes if x["change"] not in {"added", "removed"})
        },
        "changes": changes
    }
    Path(args.output).write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(changes)} change(s) -> {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
