#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import stat
import sys
from pathlib import Path
from typing import Any, Iterable


def is_within(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def is_reparse_or_link(path: Path) -> bool:
    try:
        if path.is_symlink():
            return True
        st = path.lstat()
        attrs = getattr(st, "st_file_attributes", 0)
        flag = getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0x400)
        return bool(attrs & flag)
    except (FileNotFoundError, OSError):
        return False


def lexical_candidate(raw: str, root: Path) -> Path:
    p = Path(raw)
    candidate = p if p.is_absolute() else root / p
    return Path(os.path.abspath(os.path.normpath(str(candidate))))


def nearest_existing(path: Path) -> Path | None:
    current = path
    while True:
        if current.exists() or current.is_symlink():
            return current
        if current.parent == current:
            return None
        current = current.parent


def component_evidence(candidate: Path, root: Path) -> list[str]:
    evidence: list[str] = []
    try:
        rel = candidate.relative_to(root)
    except ValueError:
        return evidence
    current = root
    for part in rel.parts:
        current = current / part
        if current.exists() or current.is_symlink():
            if is_reparse_or_link(current):
                try:
                    target = current.resolve(strict=False)
                    evidence.append(f"link:{current} -> {target}")
                except OSError as exc:
                    evidence.append(f"link-resolution-error:{current}:{exc}")
    return evidence


def inspect(raw: str, root: Path) -> dict[str, Any]:
    candidate = lexical_candidate(raw, root)
    evidence = component_evidence(candidate, root)
    if not is_within(candidate, root):
        return {"path": raw, "safe": False, "kind": "lexical_escape", "resolved": str(candidate), "evidence": evidence}

    existing = nearest_existing(candidate)
    if existing is None:
        return {"path": raw, "safe": False, "kind": "no_existing_ancestor", "resolved": None, "evidence": evidence}

    if existing.is_symlink() and not existing.exists():
        evidence.append(f"broken-link:{existing}")
        return {"path": raw, "safe": False, "kind": "broken_link", "resolved": None, "evidence": evidence}

    try:
        resolved_ancestor = existing.resolve(strict=True)
    except (FileNotFoundError, OSError) as exc:
        evidence.append(f"resolution-error:{existing}:{exc}")
        return {"path": raw, "safe": False, "kind": "resolution_error", "resolved": None, "evidence": evidence}

    if not is_within(resolved_ancestor, root):
        return {"path": raw, "safe": False, "kind": "resolved_escape", "resolved": str(resolved_ancestor), "evidence": evidence}

    suffix = candidate.relative_to(existing) if candidate != existing else Path()
    predicted = resolved_ancestor / suffix
    if not is_within(predicted, root):
        return {"path": raw, "safe": False, "kind": "predicted_escape", "resolved": str(predicted), "evidence": evidence}

    kind = "internal_link" if evidence else "direct"
    return {"path": raw, "safe": True, "kind": kind, "resolved": str(predicted), "evidence": evidence}


def scan_paths(root: Path) -> Iterable[str]:
    for current, dirs, files in os.walk(root, followlinks=False):
        base = Path(current)
        for name in sorted(dirs + files):
            p = base / name
            yield str(p.relative_to(root))


def load_paths(path: Path) -> list[str]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read paths file: {exc}") from exc
    result = [line.strip() for line in lines if line.strip() and not line.lstrip().startswith("#")]
    if not result:
        raise ValueError("paths file contains no paths")
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Prevent agent filesystem edits from escaping a trusted workspace through links or traversal")
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--paths-file", type=Path)
    parser.add_argument("--scan-all", action="store_true")
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    if bool(args.paths_file) == bool(args.scan_all):
        print("choose exactly one of --paths-file or --scan-all", file=sys.stderr)
        return 2
    try:
        root = args.root.resolve(strict=True)
    except (FileNotFoundError, OSError) as exc:
        print(f"invalid root: {exc}", file=sys.stderr)
        return 2
    if not root.is_dir():
        print("root must be a directory", file=sys.stderr)
        return 2

    try:
        paths = list(scan_paths(root)) if args.scan_all else load_paths(args.paths_file)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    findings = [inspect(raw, root) for raw in paths]
    violations = sum(not item["safe"] for item in findings)
    links = sum(bool(item["evidence"]) for item in findings)
    report = {
        "status": "fail" if violations else "pass",
        "root": str(root),
        "summary": {"checked": len(findings), "violations": violations, "links": links},
        "findings": findings,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    if violations:
        print(f"boundary gate failed: {violations} violation(s)", file=sys.stderr)
        return 1
    print(f"boundary gate passed: {len(findings)} path(s) checked")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
