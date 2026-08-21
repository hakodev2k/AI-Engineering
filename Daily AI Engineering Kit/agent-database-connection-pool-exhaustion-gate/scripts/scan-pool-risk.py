#!/usr/bin/env python3
import argparse
import json
import re
import sys
from pathlib import Path

PATTERNS = [
    (re.compile(r"\.Open\s*\(|OpenAsync\s*\("), "connection_open", 2),
    (re.compile(r"\.Result\b|\.Wait\s*\("), "blocking_db_wait", 3),
    (re.compile(r"Task\.WhenAll\s*\(|Parallel\.(For|ForEach)"), "unbounded_parallelism", 4),
    (re.compile(r"retry|Retry|while\s*\(\s*true\s*\)"), "retry_loop", 3),
    (re.compile(r"BeginTransaction|TransactionScope"), "long_transaction", 3),
    (re.compile(r"AddSingleton\s*<[^>]*(DbContext|IDbConnection)|AddSingleton\([^\n]*(DbContext|IDbConnection)"), "singleton_db_context", 5),
    (re.compile(r"Max Pool Size|Min Pool Size|Pooling\s*=|Connection Lifetime"), "manual_connection_string_pool_tuning", 2),
]

def iter_files(root: Path):
    allowed = {".cs", ".fs", ".vb", ".config", ".json", ".yaml", ".yml", ".xml"}
    for p in root.rglob("*"):
        if p.is_file() and p.suffix.lower() in allowed and ".git" not in p.parts:
            yield p

def scan(root: Path):
    findings = []
    for path in iter_files(root):
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for rx, kind, score in PATTERNS:
            for match in rx.finditer(text):
                line = text.count("\n", 0, match.start()) + 1
                findings.append({"file": str(path.relative_to(root)), "line": line, "kind": kind, "score": score, "match": match.group(0)[:120]})
        if re.search(r"new\s+(SqlConnection|NpgsqlConnection|DbConnection)\s*\(", text) and not re.search(r"using\s*(?:var|\()|await\s+using", text):
            findings.append({"file": str(path.relative_to(root)), "line": 1, "kind": "missing_dispose", "score": 4, "match": "connection construction without obvious using/await using"})
    return findings

def main():
    ap = argparse.ArgumentParser(description="Heuristic scanner for database connection-pool exhaustion risks.")
    ap.add_argument("root", nargs="?", default=".")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f"error: root directory not found: {root}", file=sys.stderr)
        return 2
    findings = scan(root)
    total = sum(x["score"] for x in findings)
    high = any(x["score"] >= 4 for x in findings) or total >= 7
    payload = {"root": str(root), "finding_count": len(findings), "risk_score": total, "high_risk": high, "findings": findings}
    if args.json:
        print(json.dumps(payload, indent=2))
    else:
        print(f"findings={len(findings)} risk_score={total} high_risk={str(high).lower()}")
        for f in findings:
            print(f"{f['file']}:{f['line']} {f['kind']} score={f['score']} :: {f['match']}")
    return 1 if high else 0

if __name__ == "__main__":
    raise SystemExit(main())
