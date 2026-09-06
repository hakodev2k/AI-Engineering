#!/usr/bin/env python3
"""Validate sandbox read-boundary probe evidence without changing ACLs.

Input observations JSON must contain:
{
  "sandbox_healthy": true,
  "probes": [
    {"path": "C:\\...", "result": "allowed|denied|error", "canonical_path": "C:\\..."}
  ]
}

Exit codes: 0 attested, 2 boundary violation, 3 incomplete/invalid evidence.
"""
from __future__ import annotations

import argparse
import json
import ntpath
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def norm_windows(path: str) -> str:
    if not isinstance(path, str) or not path.strip():
        raise ValueError("probe path must be a non-empty string")
    return ntpath.normcase(ntpath.normpath(path.strip()))


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--policy", required=True)
    p.add_argument("--observations", required=True)
    p.add_argument("--output")
    args = p.parse_args()

    try:
        policy = load_json(args.policy)
        obs = load_json(args.observations)
        allowed = {norm_windows(x) for x in policy.get("required_allowed_probes", [])}
        denied = {norm_windows(x) for x in policy.get("required_denied_probes", [])}
        if not allowed or not denied:
            raise ValueError("policy must define at least one required allowed and denied probe")
        probes = obs.get("probes")
        if not isinstance(probes, list):
            raise ValueError("observations.probes must be an array")
    except ValueError as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 3

    report: dict[str, Any] = {"status": "verified", "violations": [], "missing": [], "errors": []}
    by_path: dict[str, dict[str, Any]] = {}
    for item in probes:
        if not isinstance(item, dict):
            report["errors"].append("non-object probe")
            continue
        try:
            path = norm_windows(item.get("path", ""))
        except ValueError as exc:
            report["errors"].append(str(exc))
            continue
        result = item.get("result")
        if result not in {"allowed", "denied", "error"}:
            report["errors"].append(f"invalid result for {path}: {result!r}")
            continue
        if policy.get("require_canonical_paths", True):
            canonical = item.get("canonical_path")
            if not isinstance(canonical, str) or not canonical.strip():
                report["errors"].append(f"missing canonical_path for {path}")
            elif norm_windows(canonical) != path:
                report["errors"].append(f"canonical path mismatch for {path}: {canonical}")
        by_path[path] = item

    for path in sorted(allowed | denied):
        if path not in by_path:
            report["missing"].append(path)

    for path in allowed:
        item = by_path.get(path)
        if item and item.get("result") != "allowed":
            report["errors"].append(f"required allowed probe is not usable: {path} -> {item.get('result')}")

    for path in denied:
        item = by_path.get(path)
        if item and item.get("result") == "allowed":
            report["violations"].append(f"forbidden read succeeded: {path}")
        elif item and item.get("result") == "error":
            report["errors"].append(f"denied probe returned ambiguous error rather than explicit denial: {path}")

    if obs.get("sandbox_healthy") is not True:
        report["errors"].append("sandbox_healthy is not true")

    if report["violations"]:
        report["status"] = "boundary-violation"
        code = 2
    elif report["missing"] or report["errors"]:
        report["status"] = "incomplete"
        code = 3
    else:
        code = 0

    encoded = json.dumps(report, indent=2, sort_keys=True)
    print(encoded)
    if args.output:
        try:
            Path(args.output).write_text(encoded + "\n", encoding="utf-8")
        except OSError as exc:
            print(f"INVALID: cannot write output: {exc}", file=sys.stderr)
            return 3
    return code


if __name__ == "__main__":
    raise SystemExit(main())
