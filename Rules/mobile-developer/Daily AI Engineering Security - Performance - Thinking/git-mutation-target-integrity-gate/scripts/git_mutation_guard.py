#!/usr/bin/env python3
"""Fail-closed repository mutation target guard.

Input JSON examples:
{"operation":"push","default_branch":"main","remote_branch":"feature/x","approved_default_branch":false}
{"operation":"cleanup","candidate_path":"/tmp/codex/wt/repo","allowed_roots":["/tmp/codex/wt"],"allow_remove_root":false}

Exit codes: 0 ALLOW, 1 invalid evidence, 2 policy BLOCK.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any


def canonical(value: str) -> Path:
    if not value or not isinstance(value, str):
        raise ValueError("path must be a non-empty string")
    return Path(os.path.realpath(os.path.abspath(os.path.expanduser(value))))


def strictly_within(candidate: Path, root: Path, allow_equal: bool) -> bool:
    try:
        rel = candidate.relative_to(root)
    except ValueError:
        return False
    if rel == Path('.'):
        return allow_equal
    return True


def evaluate(data: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    op = data.get("operation")
    if op in {"push", "force-push", "delete-remote-branch"}:
        default = data.get("default_branch")
        remote = data.get("remote_branch")
        if not isinstance(default, str) or not default or not isinstance(remote, str) or not remote:
            raise ValueError("Git mutation requires default_branch and remote_branch")
        same = remote.removeprefix("refs/heads/") == default.removeprefix("refs/heads/")
        approved = bool(data.get("approved_default_branch", False))
        if same and (op == "force-push" or not approved):
            return "BLOCK", {"reason": "protected-default-branch", "resolved_target": remote}
        return "ALLOW", {"reason": "branch-target-allowed", "resolved_target": remote}

    if op in {"cleanup", "remove-worktree", "delete-path"}:
        candidate_raw = data.get("candidate_path")
        roots_raw = data.get("allowed_roots")
        if not isinstance(candidate_raw, str) or not isinstance(roots_raw, list) or not roots_raw:
            raise ValueError("Filesystem mutation requires candidate_path and non-empty allowed_roots")
        candidate = canonical(candidate_raw)
        roots = [canonical(str(x)) for x in roots_raw]
        allow_equal = bool(data.get("allow_remove_root", False))
        matched = next((root for root in roots if strictly_within(candidate, root, allow_equal)), None)
        if matched is None:
            return "BLOCK", {"reason": "path-outside-managed-root", "resolved_target": str(candidate), "allowed_roots": [str(x) for x in roots]}
        return "ALLOW", {"reason": "path-contained", "resolved_target": str(candidate), "matched_root": str(matched)}

    raise ValueError(f"unsupported operation: {op!r}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="JSON facts file")
    args = parser.parse_args()
    try:
        raw = Path(args.input).read_text(encoding="utf-8")
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise ValueError("input must be a JSON object")
        decision, detail = evaluate(data)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"decision": "INVALID", "error": str(exc)}))
        return 1
    print(json.dumps({"decision": decision, **detail}, ensure_ascii=False))
    return 0 if decision == "ALLOW" else 2


if __name__ == "__main__":
    sys.exit(main())
