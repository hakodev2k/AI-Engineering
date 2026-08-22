#!/usr/bin/env python3
"""Metadata-only workspace scanner for symlink/worktree path aliases.

Exit codes: 0 no blocking findings, 2 invalid input, 3 blocking findings, 4 scan I/O failure.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy root must be object")
    return data


def inside(path: str, root: str) -> bool:
    try:
        return os.path.commonpath([path, root]) == root
    except ValueError:
        return False


def main() -> int:
    ap = argparse.ArgumentParser(description="Scan workspace aliases without executing repository content")
    ap.add_argument("--root", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--max-entries", type=int, default=200000)
    args = ap.parse_args()

    try:
        policy = load_json(args.policy)
        lexical_root = os.path.abspath(os.path.expanduser(args.root))
        canonical_root = os.path.realpath(lexical_root)
        protected = [os.path.realpath(os.path.abspath(os.path.expanduser(str(p)))) for p in policy.get("protected_roots", [])]
        findings: list[dict[str, Any]] = []
        scanned = 0

        for current, dirs, files in os.walk(lexical_root, topdown=True, followlinks=False):
            names = list(dirs) + list(files)
            for name in names:
                scanned += 1
                if scanned > args.max_entries:
                    findings.append({"severity": "blocking", "kind": "scan-limit", "path": current, "detail": "entry limit exceeded"})
                    dirs[:] = []
                    break
                p = os.path.join(current, name)
                if os.path.islink(p):
                    target_text = os.readlink(p)
                    resolved = os.path.realpath(p)
                    kind = "symlink-in-root" if inside(resolved, canonical_root) else "symlink-escape"
                    severity = "info" if kind == "symlink-in-root" else "blocking"
                    protected_hit = next((r for r in protected if inside(resolved, r)), None)
                    if protected_hit:
                        kind = "symlink-protected-root"
                        severity = "blocking"
                    findings.append({"severity": severity, "kind": kind, "path": p, "target": target_text, "resolved": resolved, "protected_root": protected_hit})
                if name == ".git":
                    try:
                        if os.path.isfile(p) and not os.path.islink(p):
                            text = Path(p).read_text(encoding="utf-8", errors="replace")[:4096].strip()
                            if text.lower().startswith("gitdir:"):
                                raw = text.split(":", 1)[1].strip()
                                gd = raw if os.path.isabs(raw) else os.path.abspath(os.path.join(current, raw))
                                resolved = os.path.realpath(gd)
                                if not inside(resolved, canonical_root):
                                    findings.append({"severity": "review", "kind": "gitdir-outside-workspace", "path": p, "resolved": resolved})
                    except OSError as exc:
                        findings.append({"severity": "blocking", "kind": "git-metadata-unreadable", "path": p, "detail": str(exc)})
            dirs[:] = [d for d in dirs if not os.path.islink(os.path.join(current, d))]

        blocking = sum(1 for f in findings if f["severity"] == "blocking")
        print(json.dumps({"root": lexical_root, "canonical_root": canonical_root, "entries_scanned": scanned, "blocking_findings": blocking, "findings": findings}, ensure_ascii=False, indent=2))
        return 0 if blocking == 0 else 3
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2
    except OSError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
