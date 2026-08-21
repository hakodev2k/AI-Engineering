#!/usr/bin/env python3
"""Conservative repository text-reference scanner for dead-code evidence.

This script does not prove code is dead. It produces deterministic evidence that
must be combined with language-aware, dynamic-discovery, contract, and runtime checks.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import sys
from typing import Iterable

DEFAULT_IGNORES = {
    ".git", ".hg", ".svn", "node_modules", "bin", "obj", "dist", "build",
    "coverage", ".idea", ".vs", ".vscode", "vendor", "packages"
}

TEXT_EXTENSIONS = {
    ".cs", ".fs", ".vb", ".ts", ".tsx", ".js", ".jsx", ".py", ".java",
    ".kt", ".go", ".rs", ".cpp", ".c", ".h", ".hpp", ".rb", ".php",
    ".json", ".yaml", ".yml", ".toml", ".xml", ".config", ".props",
    ".targets", ".csproj", ".fsproj", ".sln", ".md", ".txt", ".sh",
    ".ps1", ".sql", ".html", ".vue", ".razor", ".cshtml"
}


def variants(candidate: str) -> list[str]:
    values = {candidate}
    stripped = re.sub(r"[^A-Za-z0-9]+", " ", candidate).strip()
    words = re.findall(r"[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)|\d+", stripped) or stripped.split()
    if words:
        lower = [w.lower() for w in words]
        values.update({
            "".join(words),
            "".join(lower),
            "-".join(lower),
            "_".join(lower),
            ".".join(lower),
        })
        if lower:
            values.add(lower[0] + "".join(w.title() for w in lower[1:]))
            values.add("".join(w.title() for w in lower))
    return sorted(v for v in values if v)


def iter_files(root: Path, ignore_names: set[str]) -> Iterable[Path]:
    for current, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in ignore_names]
        for name in files:
            path = Path(current) / name
            if path.suffix.lower() in TEXT_EXTENSIONS or path.name in {"Dockerfile", "Makefile", "AGENTS.md", "CLAUDE.md"}:
                yield path


def scan(root: Path, candidate: str, max_file_bytes: int) -> dict:
    needles = variants(candidate)
    matches = []
    searched = 0
    skipped_large = 0
    unreadable = []

    for path in iter_files(root, DEFAULT_IGNORES):
        try:
            if path.stat().st_size > max_file_bytes:
                skipped_large += 1
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            searched += 1
        except OSError as exc:
            unreadable.append({"path": str(path.relative_to(root)), "error": str(exc)})
            continue

        for line_no, line in enumerate(text.splitlines(), 1):
            found = [needle for needle in needles if needle in line]
            if found:
                matches.append({
                    "path": str(path.relative_to(root)),
                    "line": line_no,
                    "variants": found,
                    "text": line.strip()[:500],
                })

    return {
        "candidate": candidate,
        "variants": needles,
        "repository_root": str(root.resolve()),
        "files_searched": searched,
        "files_skipped_large": skipped_large,
        "unreadable_files": unreadable,
        "matches": matches,
        "match_count": len(matches),
        "note": "Text scan only; absence of matches is not proof of dead code. Check dynamic discovery, contracts, registrations, tests, and runtime evidence separately."
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Scan a repository for conservative text references to a dead-code candidate.")
    parser.add_argument("--repo", required=True, help="Repository root")
    parser.add_argument("--candidate", required=True, help="Candidate identifier/name")
    parser.add_argument("--output", required=True, help="JSON output path")
    parser.add_argument("--max-file-bytes", type=int, default=2_000_000)
    args = parser.parse_args()

    root = Path(args.repo)
    if not root.is_dir():
        print(f"error: repository root does not exist: {root}", file=sys.stderr)
        return 2
    if not args.candidate.strip():
        print("error: candidate must not be empty", file=sys.stderr)
        return 2

    report = scan(root, args.candidate.strip(), args.max_file_bytes)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"scanned={report['files_searched']} matches={report['match_count']} output={output}")
    return 0 if not report["unreadable_files"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
