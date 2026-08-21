#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

PATTERNS = [
    ("cancellationtoken-none", re.compile(r"CancellationToken\.None"), "high"),
    ("delay-without-token", re.compile(r"Task\.Delay\s*\([^,\)]*\)"), "medium"),
    ("blocking-wait", re.compile(r"\.(Wait\s*\(|Result\b)"), "high"),
    ("swallowed-cancellation", re.compile(r"catch\s*\(\s*OperationCanceledException[^\)]*\)\s*\{\s*\}"), "high"),
    ("async-without-token", re.compile(r"async\s+Task(?:<[^>]+>)?\s+\w+\s*\((?![^\)]*CancellationToken)"), "medium"),
]

SKIP_DIRS = {".git", "bin", "obj", "node_modules", "dist", "build"}
EXTENSIONS = {".cs", ".fs", ".vb", ".ts", ".js"}

def scan(root: Path):
    findings = []
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in EXTENSIONS:
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        try:
            lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
        except OSError:
            continue
        for number, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped.startswith("//") or stripped.startswith("#"):
                continue
            for kind, pattern, risk in PATTERNS:
                if pattern.search(line):
                    findings.append({
                        "file": str(path.relative_to(root)),
                        "line": number,
                        "kind": kind,
                        "risk": risk,
                        "evidence": stripped[:300]
                    })
    return findings

def main():
    parser = argparse.ArgumentParser(description="Scan source for async cancellation propagation risks.")
    parser.add_argument("root", nargs="?", default=".")
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f"error: invalid root: {root}")
        return 2
    findings = scan(root)
    if args.as_json:
        print(json.dumps({"root": str(root), "findings": findings}, indent=2))
    else:
        for f in findings:
            print(f"{f['risk'].upper():8} {f['kind']:24} {f['file']}:{f['line']}  {f['evidence']}")
        print(f"Findings: {len(findings)}")
    return 1 if any(f["risk"] in {"high", "critical"} for f in findings) else 0

if __name__ == "__main__":
    raise SystemExit(main())
