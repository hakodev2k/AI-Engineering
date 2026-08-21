#!/usr/bin/env python3
"""Deterministic path-integrity guard for agent filesystem mutations.

Standard library only.
Exit codes: 0 allow/safe inspect, 2 invalid input/policy, 3 policy denial/drift, 4 filesystem error.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy/record root must be a JSON object")
    return data


def save_json(path: str, data: dict[str, Any]) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_suffix(p.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")
    os.replace(tmp, p)


def expand_abs(path: str, base: str | None = None) -> str:
    p = os.path.expanduser(path)
    if not os.path.isabs(p):
        p = os.path.join(base or os.getcwd(), p)
    return os.path.abspath(p)


def same_or_child(path: str, root: str) -> bool:
    try:
        return os.path.commonpath([path, root]) == root
    except ValueError:
        return False


def identity(path: str, follow: bool = True) -> dict[str, Any] | None:
    try:
        st = os.stat(path, follow_symlinks=follow)
    except FileNotFoundError:
        return None
    return {
        "dev": int(st.st_dev),
        "ino": int(st.st_ino),
        "mode": int(st.st_mode),
        "size": int(st.st_size),
    }


def nearest_existing_ancestor(path: str) -> str:
    cur = path
    while not os.path.lexists(cur):
        parent = os.path.dirname(cur)
        if parent == cur:
            raise OSError(f"no existing ancestor for {path}")
        cur = parent
    return cur


def symlink_transitions(path: str, max_depth: int) -> list[dict[str, str]]:
    """Inspect lexical components without recursively following directory links ourselves."""
    result: list[dict[str, str]] = []
    drive, tail = os.path.splitdrive(os.path.abspath(path))
    cur = drive + os.sep if drive else os.sep
    parts = [p for p in tail.split(os.sep) if p]
    for part in parts:
        cur = os.path.join(cur, part)
        if os.path.islink(cur):
            target = os.readlink(cur)
            result.append({"link": cur, "target": target, "resolved": os.path.realpath(cur)})
            if len(result) > max_depth:
                raise ValueError(f"symlink transition count exceeds max {max_depth}")
        if not os.path.lexists(cur):
            break
    return result


def resolve_policy(policy: dict[str, Any], cwd: str) -> tuple[list[str], list[str], list[str]]:
    roots = [os.path.realpath(expand_abs(str(x), cwd)) for x in policy.get("workspace_roots", [])]
    protected = [os.path.realpath(expand_abs(str(x), cwd)) for x in policy.get("protected_roots", [])]
    aliases = [os.path.realpath(expand_abs(str(x), cwd)) for x in policy.get("allow_explicit_symlink_roots", [])]
    if not roots:
        raise ValueError("workspace_roots must contain at least one root")
    return roots, protected, aliases


def evaluate(path: str, operation: str, policy: dict[str, Any], cwd: str) -> dict[str, Any]:
    lexical = expand_abs(path, cwd)
    ancestor = nearest_existing_ancestor(lexical)
    canonical_ancestor = os.path.realpath(ancestor)

    if os.path.exists(lexical) or os.path.islink(lexical):
        canonical = os.path.realpath(lexical)
    else:
        parent = os.path.dirname(lexical)
        canonical = os.path.join(os.path.realpath(parent), os.path.basename(lexical))

    roots, protected, explicit_alias_roots = resolve_policy(policy, cwd)
    max_depth = int(policy.get("max_symlink_depth", 16))
    transitions = symlink_transitions(lexical, max_depth)
    matched_root = next((r for r in roots if same_or_child(canonical, r)), None)
    protected_root = next((r for r in protected if same_or_child(canonical, r)), None)

    errors: list[str] = []
    if protected_root and bool(policy.get("reject_symlink_to_protected_root", True)):
        errors.append(f"canonical target intersects protected root: {protected_root}")
    if not matched_root:
        errors.append("canonical target is outside all writable workspace roots")

    if os.path.islink(lexical) and not os.path.exists(lexical) and bool(policy.get("reject_broken_symlinks_for_write", True)):
        errors.append("write target is a broken symlink")

    if transitions:
        allowed_same_root = bool(policy.get("allow_symlinks_within_same_writable_root", True)) and matched_root is not None
        allowed_explicit = any(same_or_child(canonical, r) for r in explicit_alias_roots)
        if not (allowed_same_root or allowed_explicit):
            errors.append("symlink transition is not allowed by policy")

    parent = os.path.dirname(lexical)
    parent_real = os.path.realpath(parent)
    record = {
        "version": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "operation": operation,
        "cwd": cwd,
        "lexical_path": lexical,
        "canonical_path": canonical,
        "nearest_existing_ancestor": ancestor,
        "canonical_ancestor": canonical_ancestor,
        "parent_lexical": parent,
        "parent_canonical": parent_real,
        "parent_identity": identity(parent_real, True),
        "target_identity": identity(canonical, True),
        "lexical_target_lstat_identity": identity(lexical, False),
        "symlink_transitions": transitions,
        "matched_root": matched_root,
        "protected_root": protected_root,
        "decision": "deny" if errors else "allow",
        "reasons": errors or ["canonical target is within an approved writable root and outside protected roots"],
    }
    return record


def preflight(args: argparse.Namespace) -> int:
    policy = load_json(args.policy)
    cwd = os.getcwd()
    rec = evaluate(args.path, args.operation, policy, cwd)
    if args.record:
        save_json(args.record, rec)
    print(json.dumps(rec, ensure_ascii=False, indent=2))
    return 0 if rec["decision"] == "allow" else 3


def commit_check(args: argparse.Namespace) -> int:
    policy = load_json(args.policy)
    old = load_json(args.record)
    path = str(old.get("lexical_path", ""))
    operation = str(old.get("operation", "write"))
    if not path:
        raise ValueError("record missing lexical_path")
    cwd = str(old.get("cwd") or os.getcwd())
    current = evaluate(path, operation, policy, cwd)
    errors: list[str] = []

    if current["decision"] != "allow":
        errors.extend(current["reasons"])

    if bool(policy.get("reject_parent_identity_drift", True)):
        if old.get("parent_identity") != current.get("parent_identity"):
            errors.append("parent filesystem identity changed since preflight")
        if old.get("parent_canonical") != current.get("parent_canonical"):
            errors.append("parent canonical path changed since preflight")

    if bool(policy.get("reject_target_identity_drift", True)):
        old_target = old.get("target_identity")
        cur_target = current.get("target_identity")
        if old_target is not None and old_target != cur_target:
            errors.append("existing target filesystem identity changed since preflight")
        if old.get("canonical_path") != current.get("canonical_path"):
            errors.append("canonical target changed since preflight")

    result = {
        "decision": "deny" if errors else "allow",
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "lexical_path": path,
        "canonical_path": current.get("canonical_path"),
        "matched_root": current.get("matched_root"),
        "reasons": errors or ["identity is stable and path remains within policy"],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["decision"] == "allow" else 3


def inspect_cmd(args: argparse.Namespace) -> int:
    policy = load_json(args.policy)
    rec = evaluate(args.path, "inspect", policy, os.getcwd())
    print(json.dumps(rec, ensure_ascii=False, indent=2))
    return 0 if rec["decision"] == "allow" else 3


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Agent symlink/canonical path integrity guard")
    sub = p.add_subparsers(dest="command", required=True)

    pf = sub.add_parser("preflight")
    pf.add_argument("--path", required=True)
    pf.add_argument("--operation", required=True, choices=["create", "write", "rename", "delete", "chmod", "patch", "symlink", "git", "other"])
    pf.add_argument("--policy", required=True)
    pf.add_argument("--record")
    pf.set_defaults(func=preflight)

    cc = sub.add_parser("commit-check")
    cc.add_argument("--record", required=True)
    cc.add_argument("--policy", required=True)
    cc.set_defaults(func=commit_check)

    ins = sub.add_parser("inspect")
    ins.add_argument("--path", required=True)
    ins.add_argument("--policy", required=True)
    ins.set_defaults(func=inspect_cmd)
    return p


def main() -> int:
    try:
        args = build_parser().parse_args()
        return int(args.func(args))
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2
    except OSError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
