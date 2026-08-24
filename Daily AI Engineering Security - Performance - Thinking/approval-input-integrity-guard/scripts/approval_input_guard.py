#!/usr/bin/env python3
"""Canonicalize and verify approval-bearing tool arguments without dependencies."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def envelope(tool, args):
    if not isinstance(tool, str) or not tool.strip():
        raise ValueError("tool must be a non-empty string")
    if not isinstance(args, (dict, list)):
        raise ValueError("arguments must be a JSON object or array")
    return {"tool": tool.strip(), "arguments": args}


def digest(env):
    return hashlib.sha256(canonical(env).encode("utf-8")).hexdigest()


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--approval", required=True, help="JSON with tool, arguments, optional digest")
    p.add_argument("--execution", help="JSON with tool and arguments; omit to print approval digest")
    ns = p.parse_args()
    try:
        a = load(ns.approval)
        aenv = envelope(a.get("tool"), a.get("arguments"))
        adigest = digest(aenv)
        declared = a.get("digest")
        if declared is not None and declared != adigest:
            print("BLOCK approval digest does not match approval payload", file=sys.stderr)
            return 3
        if not ns.execution:
            print(json.dumps({"digest": adigest, "canonical": aenv}, ensure_ascii=False))
            return 0
        e = load(ns.execution)
        eenv = envelope(e.get("tool"), e.get("arguments"))
        edigest = digest(eenv)
        if adigest != edigest:
            print(json.dumps({"status":"BLOCK","approval_digest":adigest,"execution_digest":edigest}, indent=2))
            return 4
        print(json.dumps({"status":"ALLOW","digest":adigest}, indent=2))
        return 0
    except ValueError as exc:
        print(f"BLOCK {exc}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
