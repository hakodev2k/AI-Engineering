#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

DEFAULT_PATTERNS = {
    "drop-table": r"\bDROP\s+TABLE\b",
    "drop-column": r"\bDROP\s+COLUMN\b",
    "alter-column": r"\bALTER\s+COLUMN\b",
    "rename": r"\bRENAME\s+(?:COLUMN|TABLE)\b",
    "set-not-null": r"\bSET\s+NOT\s+NULL\b",
    "truncate": r"\bTRUNCATE\s+TABLE\b",
    "delete-without-where": r"\bDELETE\s+FROM\s+[\w.]+\s*;"
}

def scan(path: pathlib.Path):
    text = path.read_text(encoding="utf-8", errors="replace")
    findings = []
    for name, pattern in DEFAULT_PATTERNS.items():
        for match in re.finditer(pattern, text, flags=re.IGNORECASE | re.MULTILINE):
            line = text.count("\n", 0, match.start()) + 1
            findings.append({"rule": name, "line": line, "match": match.group(0)[:120]})
    return findings

def main():
    p = argparse.ArgumentParser(description="Detect migration operations that require review or approval.")
    p.add_argument("paths", nargs="+", help="Migration files to scan")
    p.add_argument("--json-out", default=None)
    args = p.parse_args()
    result = {"files": [], "blocking_findings": 0}
    for raw in args.paths:
        path = pathlib.Path(raw)
        if not path.is_file():
            print(f"missing file: {path}", file=sys.stderr)
            return 2
        findings = scan(path)
        result["files"].append({"path": str(path), "findings": findings})
        result["blocking_findings"] += len(findings)
    payload = json.dumps(result, indent=2)
    if args.json_out:
        pathlib.Path(args.json_out).write_text(payload + "\n", encoding="utf-8")
    print(payload)
    return 1 if result["blocking_findings"] else 0

if __name__ == "__main__":
    raise SystemExit(main())
