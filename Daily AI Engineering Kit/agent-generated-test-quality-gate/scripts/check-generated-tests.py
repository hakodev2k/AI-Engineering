#!/usr/bin/env python3
"""Static guard for low-signal generated tests.

Usage:
  python scripts/check-generated-tests.py [--base HEAD~1] [--all]

Exit codes: 0 pass, 2 quality violations, 3 environment/input error.
"""
from __future__ import annotations
import argparse
import pathlib
import re
import subprocess
import sys

TEST_PATTERNS = ("*Tests.cs", "*Test.cs", "test_*.py", "*_test.py", "*.spec.ts", "*.test.ts", "*.spec.js", "*.test.js")
ASSERT_RE = re.compile(r"\b(Assert\.|Should\(|Shouldly|expect\(|assert\s+|FluentAssertions)")
DISABLED_RE = re.compile(r"\b(Skip\s*=|\.skip\s*\(|\.only\s*\(|[Ii]gnore\s*=|@pytest\.mark\.skip|@unittest\.skip)")
WEAK_RE = re.compile(r"\b(Assert\.NotNull|Assert\.IsNotNull|not\.toBeNull\(|toBeDefined\(\))")


def git_changed(base: str) -> list[str]:
    cp = subprocess.run(["git", "diff", "--name-only", f"{base}...HEAD"], text=True, capture_output=True)
    if cp.returncode != 0:
        raise RuntimeError(cp.stderr.strip() or "git diff failed")
    return [p for p in cp.stdout.splitlines() if p.strip()]


def is_test(path: pathlib.Path) -> bool:
    return any(path.match(pattern) for pattern in TEST_PATTERNS) or any(part.lower() in {"tests", "test"} for part in path.parts)


def scan(path: pathlib.Path) -> list[str]:
    findings: list[str] = []
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        return [f"cannot read file: {exc}"]
    if not ASSERT_RE.search(text):
        findings.append("no recognizable assertion")
    if DISABLED_RE.search(text):
        findings.append("contains skipped/focused test marker")
    weak_count = len(WEAK_RE.findall(text))
    assertion_count = len(ASSERT_RE.findall(text))
    if assertion_count and weak_count == assertion_count:
        findings.append("all recognizable assertions are weak existence checks")
    return findings


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="HEAD~1")
    ap.add_argument("--all", action="store_true", help="scan all tracked test files")
    args = ap.parse_args()
    try:
        if args.all:
            cp = subprocess.run(["git", "ls-files"], text=True, capture_output=True, check=True)
            candidates = cp.stdout.splitlines()
        else:
            candidates = git_changed(args.base)
    except (RuntimeError, subprocess.CalledProcessError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 3

    test_files = [pathlib.Path(p) for p in candidates if pathlib.Path(p).is_file() and is_test(pathlib.Path(p))]
    violations = 0
    for path in test_files:
        for finding in scan(path):
            violations += 1
            print(f"FAIL {path}: {finding}")
    print(f"Scanned {len(test_files)} test file(s); violations={violations}")
    return 2 if violations else 0


if __name__ == "__main__":
    raise SystemExit(main())
