#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

RISK_PATTERNS = [
    (re.compile(r"nth-child\s*\("), "nth-child", "high"),
    (re.compile(r"xpath=|//[a-zA-Z]"), "xpath", "high"),
    (re.compile(r"locator\(['\"][.#][^'\"]{20,}['\"]\)"), "long-css", "medium"),
    (re.compile(r"\.[A-Za-z0-9_-]*[a-f0-9]{6,}[A-Za-z0-9_-]*"), "possible-hashed-class", "medium"),
    (re.compile(r"\.nth\s*\("), "nth-locator", "medium"),
]

PREFERRED = ["getByRole", "getByLabel", "getByPlaceholder", "getByText", "getByTestId"]


def scan_file(path: Path):
    findings = []
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return findings
    lines = text.splitlines()
    for lineno, line in enumerate(lines, 1):
        for regex, kind, severity in RISK_PATTERNS:
            if regex.search(line):
                findings.append({
                    "file": str(path),
                    "line": lineno,
                    "kind": kind,
                    "severity": severity,
                    "snippet": line.strip()[:240],
                })
    return findings


def main():
    parser = argparse.ArgumentParser(description="Scan Playwright tests for brittle selector patterns.")
    parser.add_argument("root", nargs="?", default=".")
    parser.add_argument("--json-out")
    args = parser.parse_args()

    root = Path(args.root)
    if not root.exists():
        raise SystemExit(f"root not found: {root}")

    files = []
    for suffix in ("*.ts", "*.tsx", "*.js", "*.jsx"):
        files.extend(root.rglob(suffix))

    findings = []
    for path in sorted(set(files)):
        if any(part in {"node_modules", "dist", "build", ".git"} for part in path.parts):
            continue
        findings.extend(scan_file(path))

    result = {
        "root": str(root),
        "files_scanned": len(set(files)),
        "findings": findings,
        "preferred_locators": PREFERRED,
    }
    payload = json.dumps(result, indent=2)
    if args.json_out:
        Path(args.json_out).write_text(payload + "\n", encoding="utf-8")
    else:
        print(payload)
    raise SystemExit(2 if any(f["severity"] == "high" for f in findings) else 0)


if __name__ == "__main__":
    main()
