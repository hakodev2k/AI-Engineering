#!/usr/bin/env python3
import argparse
import json
import pathlib
import re
import sys

PATTERNS = {
    "cache-read": re.compile(r"\b(GetAsync|GetStringAsync|IMemoryCache|IDistributedCache|cache\.get|redis\.get)\b", re.I),
    "cache-write": re.compile(r"\b(SetAsync|SetStringAsync|cache\.set|redis\.set|CreateEntry)\b", re.I),
    "cache-remove": re.compile(r"\b(RemoveAsync|Remove\(|cache\.remove|redis\.delete|KeyDelete)\b", re.I),
    "mutation": re.compile(r"\b(SaveChangesAsync|SaveChanges\(|INSERT\s+INTO|UPDATE\s+|DELETE\s+FROM|ExecuteUpdate|ExecuteDelete)\b", re.I),
    "broad-flush": re.compile(r"\b(FLUSHALL|FLUSHDB|Clear\(\)|RemoveByPrefix|DeleteByPattern)\b", re.I),
}

SKIP = {".git", "bin", "obj", "node_modules", ".venv", "dist", "build"}
TEXT_SUFFIXES = {".cs", ".py", ".js", ".ts", ".tsx", ".java", ".sql", ".go", ".rb", ".php"}

def iter_files(root: pathlib.Path):
    for p in root.rglob("*"):
        if p.is_file() and p.suffix.lower() in TEXT_SUFFIXES and not any(part in SKIP for part in p.parts):
            yield p

def main():
    ap = argparse.ArgumentParser(description="Find cache/mutation coupling risks; read-only scanner.")
    ap.add_argument("root", nargs="?", default=".")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    root = pathlib.Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f"error: invalid root: {root}", file=sys.stderr)
        return 2

    findings = []
    for p in iter_files(root):
        try:
            text = p.read_text(encoding="utf-8", errors="ignore")
        except OSError as e:
            print(f"warning: {p}: {e}", file=sys.stderr)
            continue
        hits = {name: len(rx.findall(text)) for name, rx in PATTERNS.items()}
        if hits["broad-flush"]:
            findings.append({"file": str(p.relative_to(root)), "risk": "high", "reason": "broad cache flush/reset primitive", "hits": hits})
        elif hits["mutation"] and (hits["cache-read"] or hits["cache-write"]) and not hits["cache-remove"]:
            findings.append({"file": str(p.relative_to(root)), "risk": "medium", "reason": "mutation plus cache usage without obvious invalidation", "hits": hits})

    result = {"root": str(root), "finding_count": len(findings), "findings": findings}
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        for f in findings:
            print(f"{f['risk'].upper()} {f['file']}: {f['reason']}")
        print(f"findings={len(findings)}")
    return 1 if any(f["risk"] == "high" for f in findings) else 0

if __name__ == "__main__":
    raise SystemExit(main())
