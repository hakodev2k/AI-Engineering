#!/usr/bin/env python3
"""Deterministically compare protected paths in declared vs effective config JSON."""
from __future__ import annotations
import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

MISSING = object()

def load_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def canonical(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def digest(value: Any) -> str:
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()

def get_path(obj: Any, dotted: str) -> Any:
    cur = obj
    for part in dotted.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return MISSING
        cur = cur[part]
    return cur

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("declared")
    p.add_argument("observed")
    p.add_argument("--protected", action="append", required=True, dest="protected")
    p.add_argument("--actor", default="unknown")
    p.add_argument("--lifecycle", default="unknown")
    args = p.parse_args()
    try:
        declared = load_json(args.declared)
        observed = load_json(args.observed)
        if not isinstance(declared, dict) or not isinstance(observed, dict):
            raise ValueError("top-level JSON values must be objects")
        mismatches = []
        for path in sorted(set(args.protected)):
            exp = get_path(declared, path)
            got = get_path(observed, path)
            if exp is MISSING or got is MISSING:
                mismatches.append({"path": path, "reason": "missing", "expected_present": exp is not MISSING, "observed_present": got is not MISSING})
            elif canonical(exp) != canonical(got):
                mismatches.append({"path": path, "reason": "different", "expected_sha256": digest(exp), "observed_sha256": digest(got)})
        report = {
            "status": "pass" if not mismatches else "block",
            "actor": args.actor,
            "lifecycle": args.lifecycle,
            "declared_sha256": digest(declared),
            "observed_sha256": digest(observed),
            "protected_paths": sorted(set(args.protected)),
            "mismatches": mismatches,
        }
        print(json.dumps(report, sort_keys=True))
        return 0 if not mismatches else 2
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 1

if __name__ == "__main__":
    raise SystemExit(main())
