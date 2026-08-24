#!/usr/bin/env python3
"""Detect repository path casing defects that break case-sensitive environments."""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import unicodedata
from pathlib import Path, PurePosixPath
from typing import Any, Iterable

EXIT_PASS = 0
EXIT_FAIL = 2
EXIT_INVALID = 4
EXIT_ERROR = 5

IMPORT_RE = re.compile(
    r"(?:\bfrom\s*|\brequire\s*\(\s*|\bimport\s*\(\s*|\bimport\s+|\bexport(?:\s+[^;]*?\s+from\s+)?)"
    r"['\"](?P<ref>\.{1,2}/[^'\"]+)['\"]"
)


def normalized_key(value: str) -> str:
    return unicodedata.normalize("NFC", value).casefold()


def load_policy(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"invalid policy JSON: {exc}") from exc
    if not isinstance(data, dict) or data.get("version") != 1:
        raise ValueError("policy must be an object with version=1")
    for key in ("ignored_directories", "source_extensions", "module_extensions", "index_names"):
        if not isinstance(data.get(key), list) or not all(isinstance(item, str) and item for item in data[key]):
            raise ValueError(f"policy.{key} must be a non-empty string array")
    if not isinstance(data.get("block_unresolved_relative_imports"), bool):
        raise ValueError("policy.block_unresolved_relative_imports must be boolean")
    if not isinstance(data.get("max_file_bytes"), int) or data["max_file_bytes"] <= 0:
        raise ValueError("policy.max_file_bytes must be a positive integer")
    return data


def git_paths(root: Path) -> list[str] | None:
    try:
        result = subprocess.run(
            ["git", "-C", str(root), "ls-files", "-z"],
            check=False,
            capture_output=True,
        )
    except OSError:
        return None
    if result.returncode != 0:
        return None
    return sorted(p.decode("utf-8", "surrogateescape") for p in result.stdout.split(b"\0") if p)


def filesystem_paths(root: Path, ignored: set[str]) -> list[str]:
    collected: list[str] = []
    for current, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in ignored]
        base = Path(current)
        for name in files:
            path = (base / name).relative_to(root).as_posix()
            collected.append(path)
    return sorted(collected)


def make_finding(kind: str, severity: str, message: str, paths: Iterable[str], source_file: str | None = None, reference: str | None = None) -> dict[str, Any]:
    return {
        "kind": kind,
        "severity": severity,
        "message": message,
        "paths": list(paths),
        "source_file": source_file,
        "reference": reference,
    }


def path_collisions(paths: list[str]) -> list[dict[str, Any]]:
    buckets: dict[str, list[str]] = {}
    for path in paths:
        buckets.setdefault(normalized_key(path), []).append(path)
    findings: list[dict[str, Any]] = []
    for variants in buckets.values():
        unique = sorted(set(variants))
        if len(unique) > 1:
            findings.append(make_finding(
                "path-case-collision", "error",
                "Paths collide on a case-insensitive filesystem.", unique
            ))
    return findings


def prefix_collisions(paths: list[str]) -> list[dict[str, Any]]:
    seen: dict[str, set[str]] = {}
    for path in paths:
        parts = PurePosixPath(path).parts
        for index in range(1, len(parts)):
            prefix = "/".join(parts[:index])
            seen.setdefault(normalized_key(prefix), set()).add(prefix)
    findings: list[dict[str, Any]] = []
    for variants in seen.values():
        if len(variants) > 1:
            findings.append(make_finding(
                "directory-case-collision", "error",
                "Directory prefixes use conflicting casing.", sorted(variants)
            ))
    return findings


def build_case_index(paths: list[str]) -> dict[str, list[str]]:
    index: dict[str, list[str]] = {}
    for path in paths:
        index.setdefault(normalized_key(path), []).append(path)
    return index


def candidate_targets(source_file: str, reference: str, policy: dict[str, Any]) -> list[str]:
    source_parent = PurePosixPath(source_file).parent
    base = source_parent.joinpath(reference)
    raw = base.as_posix()
    candidates = [raw]
    suffix = PurePosixPath(raw).suffix
    if not suffix:
        candidates.extend(raw + ext for ext in policy["module_extensions"])
        candidates.extend(f"{raw}/{name}" for name in policy["index_names"])
    return [str(PurePosixPath(candidate)) for candidate in candidates]


def scan_imports(root: Path, paths: list[str], policy: dict[str, Any]) -> list[dict[str, Any]]:
    path_set = set(paths)
    case_index = build_case_index(paths)
    source_ext = set(policy["source_extensions"])
    findings: list[dict[str, Any]] = []
    for relative in paths:
        if PurePosixPath(relative).suffix not in source_ext:
            continue
        absolute = root / Path(relative)
        try:
            if absolute.stat().st_size > policy["max_file_bytes"]:
                findings.append(make_finding(
                    "source-file-skipped", "warning",
                    "Source file exceeded max_file_bytes and was not scanned for imports.", [relative], relative, None
                ))
                continue
            text = absolute.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            findings.append(make_finding(
                "source-file-unreadable", "warning",
                "Source file could not be decoded as UTF-8 for import scanning.", [relative], relative, None
            ))
            continue
        for match in IMPORT_RE.finditer(text):
            reference = match.group("ref")
            candidates = candidate_targets(relative, reference, policy)
            if any(candidate in path_set for candidate in candidates):
                continue
            insensitive_hits: list[str] = []
            for candidate in candidates:
                insensitive_hits.extend(case_index.get(normalized_key(candidate), []))
            insensitive_hits = sorted(set(insensitive_hits))
            if insensitive_hits:
                findings.append(make_finding(
                    "relative-import-case-mismatch", "error",
                    "Relative module reference resolves only with case-insensitive matching.",
                    insensitive_hits, relative, reference
                ))
            else:
                severity = "error" if policy["block_unresolved_relative_imports"] else "warning"
                findings.append(make_finding(
                    "unresolved-relative-import", severity,
                    "Relative module reference could not be resolved by the portability scanner.",
                    candidates, relative, reference
                ))
    return findings


def evaluate(root: Path, policy: dict[str, Any]) -> dict[str, Any]:
    tracked = git_paths(root)
    source = "git" if tracked is not None else "filesystem"
    paths = tracked if tracked is not None else filesystem_paths(root, set(policy["ignored_directories"]))
    findings = path_collisions(paths) + prefix_collisions(paths) + scan_imports(root, paths, policy)
    blocking = sum(1 for f in findings if f["severity"] == "error")
    warnings = sum(1 for f in findings if f["severity"] == "warning")
    return {
        "status": "fail" if blocking else "pass",
        "root": str(root.resolve()),
        "source": source,
        "checked_paths": len(paths),
        "blocking_findings": blocking,
        "warnings": warnings,
        "findings": findings,
    }


def emit(report: dict[str, Any], output: Path | None) -> None:
    rendered = json.dumps(report, indent=2, sort_keys=True)
    print(rendered)
    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        root = args.root.resolve()
        if not root.is_dir():
            raise ValueError(f"repository root is not a directory: {root}")
        policy = load_policy(args.policy)
        report = evaluate(root, policy)
        emit(report, args.output)
        return EXIT_FAIL if report["status"] == "fail" else EXIT_PASS
    except ValueError as exc:
        report = {"status": "invalid", "root": str(args.root), "source": "unknown", "checked_paths": 0, "blocking_findings": 0, "warnings": 0, "findings": [make_finding("invalid-input", "error", str(exc), [])]}
        emit(report, args.output)
        return EXIT_INVALID
    except Exception as exc:
        report = {"status": "error", "root": str(args.root), "source": "unknown", "checked_paths": 0, "blocking_findings": 0, "warnings": 0, "findings": [make_finding("scanner-error", "error", str(exc), [])]}
        emit(report, args.output)
        return EXIT_ERROR


if __name__ == "__main__":
    raise SystemExit(main())
