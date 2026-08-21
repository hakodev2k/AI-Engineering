#!/usr/bin/env python3
"""Deterministic manifest/worktree/path guard for parallel coding agents.

Exit codes: 0 pass, 2 invalid input, 3 policy/invariant violation, 4 git/filesystem error.
"""
from __future__ import annotations
import argparse, json, os, subprocess, sys
from pathlib import Path
from typing import Any


def fail(msg: str, code: int = 3) -> int:
    print(json.dumps({"ok": False, "error": msg}), file=sys.stderr)
    return code


def load(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        raise ValueError(f"cannot load {path}: {e}") from e
    if not isinstance(data, dict):
        raise ValueError("manifest must be a JSON object")
    return data


def git(cwd: str, *args: str) -> str:
    p = subprocess.run(["git", *args], cwd=cwd, text=True, capture_output=True)
    if p.returncode != 0:
        raise OSError((p.stderr or p.stdout).strip() or f"git {' '.join(args)} failed")
    return p.stdout.strip()


def canonical(path: str) -> str:
    return os.path.normcase(os.path.realpath(os.path.abspath(path)))


def required(m: dict[str, Any]) -> list[str]:
    keys = ["task_id", "agent_id", "repo_root", "worktree", "branch", "base_sha", "owned_paths"]
    errors = []
    for k in keys:
        if k not in m or m[k] in (None, "", []): errors.append(f"missing {k}")
    if not isinstance(m.get("owned_paths"), list): errors.append("owned_paths must be array")
    return errors


def norm_prefix(repo: str, value: str) -> str:
    p = canonical(os.path.join(repo, value) if not os.path.isabs(value) else value)
    r = canonical(repo)
    if os.path.commonpath([p, r]) != r:
        raise ValueError(f"path escapes repo: {value}")
    return p


def overlap(a: str, b: str) -> bool:
    return a == b or a.startswith(b + os.sep) or b.startswith(a + os.sep)


def validate_manifest(m: dict[str, Any], active_dir: str | None) -> list[str]:
    errors = required(m)
    if errors: return errors
    repo = canonical(str(m["repo_root"]))
    try:
        own = [norm_prefix(repo, str(x)) for x in m["owned_paths"]]
    except ValueError as e:
        return [str(e)]
    if len(set(own)) != len(own): errors.append("duplicate owned path")
    if active_dir:
        d = Path(active_dir)
        if d.exists():
            for f in d.glob("*.json"):
                try: other = load(str(f))
                except ValueError: continue
                if other.get("task_id") == m.get("task_id") and other.get("agent_id") == m.get("agent_id"): continue
                if not other.get("active", True): continue
                try: other_paths = [norm_prefix(canonical(str(other.get("repo_root", repo))), str(x)) for x in other.get("owned_paths", [])]
                except ValueError: continue
                for x in own:
                    for y in other_paths:
                        if overlap(x, y): errors.append(f"ownership overlap with {f.name}: {x} <-> {y}")
    return errors


def workspace_errors(m: dict[str, Any]) -> list[str]:
    errors = []
    wt = canonical(str(m["worktree"])); expected_repo = canonical(str(m["repo_root"]))
    try:
        actual_root = canonical(git(wt, "rev-parse", "--show-toplevel"))
        branch = git(wt, "branch", "--show-current")
        head = git(wt, "rev-parse", "HEAD")
    except OSError as e:
        return [str(e)]
    # repo_root can mean worktree root for this worker; canonical identity is the manifest binding.
    if actual_root != wt: errors.append(f"git root mismatch: {actual_root} != {wt}")
    if expected_repo != wt: errors.append(f"manifest repo_root/worktree mismatch: {expected_repo} != {wt}")
    if branch != str(m["branch"]): errors.append(f"branch mismatch: {branch} != {m['branch']}")
    if not branch: errors.append("detached HEAD not allowed")
    p = subprocess.run(["git", "merge-base", "--is-ancestor", str(m["base_sha"]), head], cwd=wt)
    if p.returncode != 0: errors.append("base_sha is not an ancestor of HEAD")
    if m.get("require_clean_start"):
        try:
            if git(wt, "status", "--porcelain"): errors.append("worktree is not clean")
        except OSError as e: errors.append(str(e))
    return errors


def command_manifest(a: argparse.Namespace) -> int:
    try: m = load(a.manifest)
    except ValueError as e: return fail(str(e), 2)
    errors = validate_manifest(m, a.active_dir)
    if errors: return fail("; ".join(errors))
    print(json.dumps({"ok": True, "status": "manifest-ok", "task_id": m["task_id"], "agent_id": m["agent_id"]}))
    return 0


def command_preflight(a: argparse.Namespace) -> int:
    try: m = load(a.manifest)
    except ValueError as e: return fail(str(e), 2)
    errors = required(m) + workspace_errors(m)
    if errors: return fail("; ".join(errors))
    print(json.dumps({"ok": True, "status": "workspace-ok", "branch": m["branch"], "worktree": canonical(m["worktree"])}))
    return 0


def command_write(a: argparse.Namespace) -> int:
    try: m = load(a.manifest)
    except ValueError as e: return fail(str(e), 2)
    errors = required(m) + workspace_errors(m)
    repo = canonical(str(m.get("repo_root", ".")))
    try: owned = [norm_prefix(repo, str(x)) for x in m.get("owned_paths", [])]
    except ValueError as e: return fail(str(e), 2)
    denied = []
    for raw in a.path:
        try: target = norm_prefix(repo, raw)
        except ValueError as e: denied.append(str(e)); continue
        if not any(target == p or target.startswith(p + os.sep) for p in owned): denied.append(f"unowned path: {raw}")
    errors.extend(denied)
    if errors: return fail("; ".join(errors))
    print(json.dumps({"ok": True, "status": "write-allowed", "paths": a.path}))
    return 0


def main() -> int:
    p = argparse.ArgumentParser(); sub = p.add_subparsers(dest="cmd", required=True)
    x = sub.add_parser("manifest"); x.add_argument("--manifest", required=True); x.add_argument("--active-dir"); x.set_defaults(fn=command_manifest)
    x = sub.add_parser("preflight"); x.add_argument("--manifest", required=True); x.set_defaults(fn=command_preflight)
    x = sub.add_parser("write"); x.add_argument("--manifest", required=True); x.add_argument("--path", action="append", required=True); x.set_defaults(fn=command_write)
    try: return int(p.parse_args().fn(p.parse_args()))
    except OSError as e: return fail(str(e), 4)

if __name__ == "__main__":
    raise SystemExit(main())
