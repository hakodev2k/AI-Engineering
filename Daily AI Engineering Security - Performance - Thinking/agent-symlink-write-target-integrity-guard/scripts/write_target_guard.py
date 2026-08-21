#!/usr/bin/env python3
"""Deterministic preflight for agent filesystem writes.

Exit codes:
  0 safe under policy
  2 blocked by policy
  3 invalid input/policy
  4 filesystem/resolution error

The script never modifies the target filesystem.
"""
from __future__ import annotations
import argparse, json, os, pathlib, re, sys, time


def load_policy(path: str) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data.get("writable_roots"), list):
            raise ValueError("writable_roots must be a list")
        return data
    except Exception as exc:
        print(json.dumps({"status":"error","reason":f"invalid policy: {exc}"}))
        sys.exit(3)


def inside(path: pathlib.Path, root: pathlib.Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def first_existing_ancestor(path: pathlib.Path) -> pathlib.Path:
    cur = path
    while not cur.exists() and cur != cur.parent:
        cur = cur.parent
    return cur


def inspect(target: str, policy: dict, command: str | None) -> tuple[int, dict]:
    started = time.perf_counter()
    requested = pathlib.Path(target).expanduser().absolute()
    ancestor = first_existing_ancestor(requested.parent)
    if policy.get("require_existing_parent", True) and not requested.parent.exists():
        return 2, {"status":"blocked","reason":"destination parent does not exist","requested":str(requested)}
    try:
        canonical_parent = requested.parent.resolve(strict=True)
        leaf_exists = requested.exists() or requested.is_symlink()
        leaf_is_link = requested.is_symlink()
        canonical_target = requested.resolve(strict=False)
    except Exception as exc:
        code = 2 if policy.get("fail_closed_on_resolution_error", True) else 4
        return code, {"status":"blocked" if code == 2 else "error","reason":f"resolution failure: {exc}","requested":str(requested)}

    roots = []
    for raw in policy.get("writable_roots", []):
        try:
            roots.append(pathlib.Path(raw).expanduser().absolute().resolve(strict=True))
        except Exception as exc:
            return 3, {"status":"error","reason":f"invalid writable root {raw}: {exc}"}

    violations = []
    if not any(inside(canonical_parent, r) for r in roots):
        violations.append("canonical parent outside writable roots")
    if leaf_exists and not any(inside(canonical_target, r) for r in roots):
        violations.append("canonical target outside writable roots")
    if leaf_is_link and not policy.get("allow_symlink_leaf_write", False):
        violations.append("leaf target is a symbolic link")

    parts = {p.lower() for p in canonical_target.parts}
    protected = [x.lower() for x in policy.get("protected_path_fragments", [])]
    if any(x in parts for x in protected):
        violations.append("target intersects protected path fragment")

    command_hits = []
    if command:
        for pattern in policy.get("high_risk_shell_patterns", []):
            try:
                if re.search(pattern, command):
                    command_hits.append(pattern)
            except re.error:
                return 3, {"status":"error","reason":f"invalid regex in policy: {pattern}"}

    elapsed_ms = round((time.perf_counter() - started) * 1000, 3)
    result = {
        "status": "blocked" if violations else "pass",
        "requested": str(requested),
        "canonical_parent": str(canonical_parent),
        "canonical_target": str(canonical_target),
        "leaf_exists": leaf_exists,
        "leaf_is_symlink": leaf_is_link,
        "violations": violations,
        "command_requires_write_preflight": bool(command_hits),
        "matched_command_patterns": command_hits,
        "elapsed_ms": elapsed_ms
    }
    return (2 if violations else 0), result


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("target")
    ap.add_argument("--policy", default="config/policy.json")
    ap.add_argument("--command", help="optional shell command for redirection/write detection")
    args = ap.parse_args()
    policy = load_policy(args.policy)
    code, result = inspect(args.target, policy, args.command)
    print(json.dumps(result, indent=2))
    return code

if __name__ == "__main__":
    raise SystemExit(main())
