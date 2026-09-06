#!/usr/bin/env python3
"""OpenAPI generated-client drift gate.

Exit codes:
0 = verified / pass
2 = policy or drift failure
3 = invalid input / tool failure

The script is intentionally generator-agnostic. It fingerprints configured API specs and generated roots,
optionally executes configured generator commands, and proves that regeneration leaves no generated diff.
"""
from __future__ import annotations

import argparse
import fnmatch
import hashlib
import json
import os
import shlex
import subprocess
import sys
from pathlib import Path
from typing import Iterable


def load_config(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    required = ["spec_paths", "generated_roots", "generator_commands"]
    missing = [k for k in required if k not in data]
    if missing:
        raise ValueError(f"missing config keys: {', '.join(missing)}")
    if not isinstance(data["generator_commands"], list):
        raise ValueError("generator_commands must be an array")
    return data


def run(cmd: list[str], cwd: Path) -> tuple[int, str, str]:
    p = subprocess.run(cmd, cwd=str(cwd), text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return p.returncode, p.stdout, p.stderr


def git(repo: Path, *args: str) -> str:
    rc, out, err = run(["git", *args], repo)
    if rc:
        raise RuntimeError(err.strip() or f"git {' '.join(args)} failed")
    return out.strip()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def ignored(rel: str, globs: Iterable[str]) -> bool:
    return any(fnmatch.fnmatch(rel, g) for g in globs)


def collect_files(repo: Path, roots: Iterable[str], globs: Iterable[str]) -> list[Path]:
    files: list[Path] = []
    for root_s in roots:
        root = (repo / root_s).resolve()
        if not root.exists():
            continue
        if root.is_file():
            rel = root.relative_to(repo.resolve()).as_posix()
            if not ignored(rel, globs):
                files.append(root)
            continue
        for p in root.rglob("*"):
            if p.is_file():
                rel = p.resolve().relative_to(repo.resolve()).as_posix()
                if not ignored(rel, globs):
                    files.append(p.resolve())
    return sorted(set(files), key=lambda p: p.as_posix())


def fingerprint(repo: Path, paths: Iterable[Path]) -> dict:
    result = {}
    for p in paths:
        rel = p.resolve().relative_to(repo.resolve()).as_posix()
        result[rel] = sha256_file(p)
    canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode()
    return {"files": result, "digest": hashlib.sha256(canonical).hexdigest()}


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def cmd_snapshot(args: argparse.Namespace) -> int:
    repo = Path(args.repo).resolve()
    cfg = load_config(Path(args.config))
    specs = collect_files(repo, cfg["spec_paths"], cfg.get("ignore_globs", []))
    generated = collect_files(repo, cfg["generated_roots"], cfg.get("ignore_globs", []))
    if not specs:
        raise ValueError("no configured OpenAPI spec exists")
    revision = git(repo, "rev-parse", "HEAD")
    dirty = bool(git(repo, "status", "--porcelain"))
    payload = {
        "status": "snapshotted",
        "revision": revision,
        "dirty": dirty,
        "spec": fingerprint(repo, specs),
        "generated": fingerprint(repo, generated),
        "generated_roots": cfg["generated_roots"],
        "generator_commands": cfg["generator_commands"],
    }
    write_json(Path(args.out), payload)
    print(args.out)
    return 0


def changed_generated(repo: Path, roots: list[str]) -> list[str]:
    lines = git(repo, "status", "--porcelain").splitlines()
    roots_norm = [r.rstrip("/") + "/" for r in roots]
    result = []
    for line in lines:
        if not line:
            continue
        path = line[3:] if len(line) > 3 else ""
        path = path.split(" -> ")[-1]
        if any(path == r.rstrip("/") or path.startswith(r) for r in roots_norm):
            result.append(line)
    return result


def cmd_regenerate(args: argparse.Namespace) -> int:
    repo = Path(args.repo).resolve()
    cfg = load_config(Path(args.config))
    if cfg.get("require_clean_worktree_before_regeneration", True):
        status = git(repo, "status", "--porcelain")
        if status:
            write_json(Path(args.out), {"status": "blocked", "reason": "worktree-not-clean", "git_status": status.splitlines()})
            return 2
    commands = cfg.get("generator_commands", [])
    if not commands:
        write_json(Path(args.out), {"status": "blocked", "reason": "generator-commands-not-configured"})
        return 2
    logs = []
    for index, command in enumerate(commands, start=1):
        if not isinstance(command, str) or not command.strip():
            raise ValueError("generator command entries must be non-empty strings")
        rc, out, err = run(shlex.split(command), repo)
        logs.append({"index": index, "command": command, "exit_code": rc, "stdout": out, "stderr": err})
        if rc:
            write_json(Path(args.out), {"status": "failed", "reason": "generator-command-failed", "logs": logs})
            return 3
    changed = changed_generated(repo, cfg["generated_roots"])
    status = "verified" if not changed else "drift"
    write_json(Path(args.out), {"status": status, "changed_generated": changed, "logs": logs})
    return 0 if status == "verified" else 2


def cmd_verify_pair(args: argparse.Namespace) -> int:
    a = json.loads(Path(args.before).read_text(encoding="utf-8"))
    b = json.loads(Path(args.after).read_text(encoding="utf-8"))
    errors = []
    if a.get("revision") != b.get("revision"):
        errors.append("source revision changed")
    if a.get("spec", {}).get("digest") != b.get("spec", {}).get("digest"):
        errors.append("OpenAPI spec changed")
    if a.get("generated", {}).get("digest") != b.get("generated", {}).get("digest"):
        errors.append("generated client fingerprint changed")
    payload = {"status": "verified" if not errors else "failed", "errors": errors}
    write_json(Path(args.out), payload)
    return 0 if not errors else 2


def main() -> int:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("snapshot")
    s.add_argument("--repo", default=".")
    s.add_argument("--config", required=True)
    s.add_argument("--out", required=True)
    s.set_defaults(func=cmd_snapshot)
    r = sub.add_parser("regenerate")
    r.add_argument("--repo", default=".")
    r.add_argument("--config", required=True)
    r.add_argument("--out", required=True)
    r.set_defaults(func=cmd_regenerate)
    v = sub.add_parser("verify-pair")
    v.add_argument("--before", required=True)
    v.add_argument("--after", required=True)
    v.add_argument("--out", required=True)
    v.set_defaults(func=cmd_verify_pair)
    args = p.parse_args()
    try:
        return args.func(args)
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as e:
        print(f"gate: {e}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
