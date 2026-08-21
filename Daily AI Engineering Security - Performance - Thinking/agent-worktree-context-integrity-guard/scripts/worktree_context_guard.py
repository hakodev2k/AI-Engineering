#!/usr/bin/env python3
"""Capture and validate an AI agent's Git worktree context.

Exit codes:
  0 = pass
  2 = context/policy violation
  3 = invalid input or not a Git worktree
  4 = I/O or Git execution error

The script never mutates the repository.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def run_git(cwd: str, *args: str, check: bool = True) -> str:
    try:
        p = subprocess.run(
            ["git", "-C", cwd, *args],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
    except OSError as exc:
        raise RuntimeError(f"failed to execute git: {exc}") from exc
    if check and p.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {p.stderr.strip()}")
    return p.stdout.strip()


def canonical(path: str) -> str:
    return os.path.normcase(os.path.realpath(os.path.abspath(path)))


def current_state(cwd: str) -> dict[str, Any]:
    top = run_git(cwd, "rev-parse", "--show-toplevel")
    git_dir = run_git(cwd, "rev-parse", "--git-dir")
    common_dir = run_git(cwd, "rev-parse", "--git-common-dir")
    head = run_git(cwd, "rev-parse", "HEAD")
    branch = run_git(cwd, "symbolic-ref", "--quiet", "--short", "HEAD", check=False)
    upstream = run_git(cwd, "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}", check=False)
    status = run_git(cwd, "status", "--porcelain=v2", "--branch")
    index_dirty = any(line and not line.startswith("#") for line in status.splitlines())

    # Identify this exact worktree from Git's stable porcelain output.
    listing = run_git(cwd, "worktree", "list", "--porcelain")
    records: list[dict[str, str | bool]] = []
    rec: dict[str, str | bool] = {}
    for line in listing.splitlines() + [""]:
        if not line:
            if rec:
                records.append(rec)
                rec = {}
            continue
        key, _, value = line.partition(" ")
        rec[key] = value if value else True
    top_c = canonical(top)
    matched = next((r for r in records if "worktree" in r and canonical(str(r["worktree"])) == top_c), None)
    if not matched:
        raise RuntimeError("active worktree not found in git worktree list --porcelain")

    git_dir_abs = git_dir if os.path.isabs(git_dir) else os.path.join(top, git_dir)
    common_abs = common_dir if os.path.isabs(common_dir) else os.path.join(top, common_dir)
    return {
        "repo_top": top_c,
        "worktree_path": canonical(str(matched["worktree"])),
        "git_dir": canonical(git_dir_abs),
        "common_git_dir": canonical(common_abs),
        "head_oid": head,
        "branch": branch or None,
        "detached": not bool(branch),
        "upstream": upstream or None,
        "index_dirty": index_dirty,
    }


def load_json(path: str) -> dict[str, Any]:
    try:
        obj = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise RuntimeError(f"{path} must contain a JSON object")
    return obj


def capture(cwd: str, operation: str, expected_branch: str | None, expected_upstream: str | None) -> dict[str, Any]:
    state = current_state(cwd)
    return {
        "contract_version": "1.0",
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "operation": operation,
        "expected": {
            "repo_top": state["repo_top"],
            "worktree_path": state["worktree_path"],
            "common_git_dir": state["common_git_dir"],
            "head_oid": state["head_oid"],
            "branch": expected_branch if expected_branch is not None else state["branch"],
            "detached": state["detached"],
            "upstream": expected_upstream if expected_upstream is not None else state["upstream"],
        },
    }


def validate(cwd: str, contract: dict[str, Any], policy: dict[str, Any], operation: str | None) -> tuple[list[str], dict[str, Any]]:
    state = current_state(cwd)
    exp = contract.get("expected")
    if not isinstance(exp, dict):
        return ["contract.expected must be an object"], state
    op = operation or contract.get("operation")
    if op not in policy.get("allowed_operations", []):
        return [f"operation_not_allowed:{op}"], state

    errors: list[str] = []
    if canonical(str(exp.get("repo_top", ""))) != state["repo_top"]:
        errors.append("repo_top_mismatch")
    if policy.get("require_worktree_path_match", True) and canonical(str(exp.get("worktree_path", ""))) != state["worktree_path"]:
        errors.append("worktree_path_mismatch")
    if policy.get("require_common_git_dir_match", True) and canonical(str(exp.get("common_git_dir", ""))) != state["common_git_dir"]:
        errors.append("common_git_dir_mismatch")

    expected_branch = exp.get("branch")
    if expected_branch is not None and policy.get("require_exact_branch_when_declared", True):
        if state["branch"] != expected_branch:
            errors.append("branch_mismatch")
    if exp.get("detached") is True and not state["detached"]:
        errors.append("detached_state_mismatch")
    if exp.get("detached") is False and state["detached"]:
        errors.append("detached_state_mismatch")
    if policy.get("fail_closed_on_detached_head", False) and state["detached"]:
        errors.append("detached_head_disallowed")

    expected_upstream = exp.get("upstream")
    if expected_upstream and policy.get("require_upstream_match_when_declared", False):
        if state["upstream"] != expected_upstream:
            errors.append("upstream_mismatch")

    if op == "patch-apply":
        if policy.get("require_head_oid_match_for_patch_apply", True) and state["head_oid"] != exp.get("head_oid"):
            errors.append("patch_base_head_mismatch")
        if policy.get("require_clean_index_for_patch_apply", True) and state["index_dirty"]:
            errors.append("patch_apply_requires_clean_worktree")

    return errors, state


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_cap = sub.add_parser("capture")
    p_cap.add_argument("--cwd", default=".")
    p_cap.add_argument("--operation", required=True)
    p_cap.add_argument("--expected-branch")
    p_cap.add_argument("--expected-upstream")
    p_cap.add_argument("--out", required=True)

    p_chk = sub.add_parser("check")
    p_chk.add_argument("--cwd", default=".")
    p_chk.add_argument("--contract", required=True)
    p_chk.add_argument("--policy", required=True)
    p_chk.add_argument("--operation")
    p_chk.add_argument("--json", action="store_true")

    args = parser.parse_args()
    try:
        if args.cmd == "capture":
            contract = capture(args.cwd, args.operation, args.expected_branch, args.expected_upstream)
            Path(args.out).write_text(json.dumps(contract, indent=2) + "\n", encoding="utf-8")
            print(args.out)
            return 0

        contract = load_json(args.contract)
        policy = load_json(args.policy)
        errors, state = validate(args.cwd, contract, policy, args.operation)
        result = {"ok": not errors, "errors": errors, "actual": state}
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print("PASS" if not errors else "BLOCK: " + ", ".join(errors))
        return 0 if not errors else 2
    except RuntimeError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 4
    except (TypeError, ValueError) as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
