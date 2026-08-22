#!/usr/bin/env python3
"""Fail-closed preflight for path containment and symlink traversal.

This script is a deterministic policy gate, not a complete replacement for descriptor-relative
secure-open APIs. High-risk callers must still avoid check-then-use races as documented in README.
"""
from __future__ import annotations
import argparse, json, os, pathlib, stat, sys


def within(path: pathlib.Path, root: pathlib.Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def inspect_components(path: pathlib.Path):
    """Return existing symlink components without following them for metadata."""
    absolute = pathlib.Path(os.path.abspath(path))
    parts = absolute.parts
    current = pathlib.Path(parts[0]) if parts else pathlib.Path(os.sep)
    found = []
    for part in parts[1:]:
        current = current / part
        try:
            mode = os.lstat(current).st_mode
        except FileNotFoundError:
            break
        if stat.S_ISLNK(mode):
            try:
                target = os.readlink(current)
            except OSError:
                target = "<unreadable-link>"
            found.append({"component": str(current), "target": target})
    return found


def evaluate(root: pathlib.Path, requested: pathlib.Path, allow_in_root_symlink: bool):
    root_abs = pathlib.Path(os.path.abspath(root))
    req_abs = pathlib.Path(os.path.abspath(requested))
    try:
        root_real = root_abs.resolve(strict=True)
    except OSError as exc:
        return {"allowed": False, "reason": f"approved root cannot be resolved: {exc}", "root": str(root_abs)}

    symlinks = inspect_components(req_abs)
    # strict=False resolves existing components and normalizes the unresolved tail.
    try:
        resolved = req_abs.resolve(strict=False)
    except OSError as exc:
        return {"allowed": False, "reason": f"requested path cannot be resolved: {exc}", "root": str(root_real), "requested": str(req_abs), "symlinks": symlinks}

    if not within(resolved, root_real):
        return {"allowed": False, "reason": "resolved target escapes approved root", "root": str(root_real), "requested": str(req_abs), "resolved": str(resolved), "symlinks": symlinks}
    if symlinks and not allow_in_root_symlink:
        return {"allowed": False, "reason": "symlink component present and policy forbids traversal", "root": str(root_real), "requested": str(req_abs), "resolved": str(resolved), "symlinks": symlinks}
    return {"allowed": True, "reason": "resolved target is inside approved root", "root": str(root_real), "requested": str(req_abs), "resolved": str(resolved), "symlinks": symlinks}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True, help="Approved filesystem root; must exist")
    ap.add_argument("--path", required=True, help="Requested file path")
    ap.add_argument("--operation", choices=["read", "write", "replace", "rename", "execute"], required=True)
    ap.add_argument("--allow-in-root-symlink", action="store_true", help="Allow symlink components only when final resolved target remains under root")
    args = ap.parse_args()
    try:
        result = evaluate(pathlib.Path(args.root), pathlib.Path(args.path), args.allow_in_root_symlink)
    except Exception as exc:
        print(json.dumps({"allowed": False, "error": f"guard failure: {type(exc).__name__}: {exc}"}, indent=2))
        return 2
    result["operation"] = args.operation
    if args.operation in {"write", "replace", "rename", "execute"}:
        result["warning"] = "Preflight does not eliminate TOCTOU; use no-follow/descriptor-relative or validate-then-activate semantics for high-risk operations."
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result.get("allowed") else 3

if __name__ == "__main__":
    raise SystemExit(main())
