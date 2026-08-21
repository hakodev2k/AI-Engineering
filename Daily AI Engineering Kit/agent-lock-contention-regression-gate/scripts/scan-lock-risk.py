#!/usr/bin/env python3
import argparse
import json
import pathlib
import re
import sys

LOCK_PATTERNS = [r"\block\s*\(", r"Monitor\.Enter", r"SemaphoreSlim", r"\bMutex\b", r"ReaderWriterLockSlim"]
BLOCKING_PATTERNS = [r"\.Result\b", r"\.Wait\s*\(", r"Thread\.Sleep\s*\("]
IO_PATTERNS = [r"HttpClient", r"SendAsync\s*\(", r"SaveChanges(?:Async)?\s*\(", r"ExecuteSql", r"ReadAsync\s*\(", r"WriteAsync\s*\("]


def scan_file(path: pathlib.Path):
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError as exc:
        return [{"file": str(path), "line": 0, "risk": "error", "evidence": str(exc)}]
    lines = text.splitlines()
    findings = []
    lock_lines = []
    for idx, line in enumerate(lines, 1):
        if any(re.search(p, line) for p in LOCK_PATTERNS):
            lock_lines.append(idx)
            findings.append({"file": str(path), "line": idx, "risk": "medium", "kind": "lock", "evidence": line.strip()})
        if any(re.search(p, line) for p in BLOCKING_PATTERNS):
            findings.append({"file": str(path), "line": idx, "risk": "high", "kind": "blocking-wait", "evidence": line.strip()})
    for lock_line in lock_lines:
        start = max(0, lock_line - 1)
        end = min(len(lines), lock_line + 30)
        window = "\n".join(lines[start:end])
        if any(re.search(p, window) for p in IO_PATTERNS):
            findings.append({"file": str(path), "line": lock_line, "risk": "high", "kind": "io-near-lock", "evidence": "I/O-like call found within 30 lines of lock acquisition"})
        nested = sum(1 for p in LOCK_PATTERNS if re.search(p, window))
        if nested >= 2:
            findings.append({"file": str(path), "line": lock_line, "risk": "high", "kind": "nested-lock-suspected", "evidence": "Multiple lock primitives found in local window"})
    return findings


def main():
    ap = argparse.ArgumentParser(description="Heuristically scan source files for lock-contention regression risks.")
    ap.add_argument("paths", nargs="+", help="Files or directories to scan")
    ap.add_argument("--json", action="store_true", help="Emit JSON")
    args = ap.parse_args()
    files = []
    for raw in args.paths:
        p = pathlib.Path(raw)
        if not p.exists():
            print(f"missing path: {p}", file=sys.stderr)
            return 2
        if p.is_file():
            files.append(p)
        else:
            files.extend(x for x in p.rglob("*") if x.is_file() and x.suffix.lower() in {".cs", ".java", ".kt", ".js", ".ts", ".py", ".go"})
    findings = []
    for f in files:
        findings.extend(scan_file(f))
    if args.json:
        print(json.dumps({"findings": findings}, indent=2))
    else:
        for item in findings:
            print(f"{item.get('risk','?'):>6} {item.get('kind','scan'):>22} {item['file']}:{item['line']} {item['evidence']}")
    return 1 if any(f.get("risk") in {"high", "critical"} for f in findings) else 0

if __name__ == "__main__":
    raise SystemExit(main())
