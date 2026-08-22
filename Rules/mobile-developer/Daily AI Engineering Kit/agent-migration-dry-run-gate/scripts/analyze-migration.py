#!/usr/bin/env python3
import argparse
import json
import re
import sys
from pathlib import Path

BLOCKED = {
    "drop-database": re.compile(r"\bDROP\s+DATABASE\b", re.I),
    "drop-table": re.compile(r"\bDROP\s+TABLE\b", re.I),
    "truncate-table": re.compile(r"\bTRUNCATE\s+TABLE\b", re.I),
    "drop-column": re.compile(r"\bDROP\s+COLUMN\b|\.DropColumn\s*\(", re.I),
}
APPROVAL = {
    "alter-table": re.compile(r"\bALTER\s+TABLE\b|\.AlterColumn\s*\(", re.I),
    "create-index": re.compile(r"\bCREATE\s+(?:UNIQUE\s+)?INDEX\b|\.CreateIndex\s*\(", re.I),
    "drop-index": re.compile(r"\bDROP\s+INDEX\b|\.DropIndex\s*\(", re.I),
    "delete-data": re.compile(r"\bDELETE\s+FROM\b|\.DeleteData\s*\(", re.I),
    "update-data": re.compile(r"\bUPDATE\s+[\w\[\].\"]+\s+SET\b|\.UpdateData\s*\(", re.I),
    "rename": re.compile(r"\bRENAME\b|sp_rename|\.Rename(?:Column|Table|Index)\s*\(", re.I),
}
RISK = {
    "add-not-null": re.compile(r"\bNOT\s+NULL\b|nullable\s*:\s*false", re.I),
    "foreign-key": re.compile(r"\bFOREIGN\s+KEY\b|\.AddForeignKey\s*\(", re.I),
    "raw-sql": re.compile(r"\.Sql\s*\(", re.I),
}

def scan(path: Path):
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        return {"path": str(path), "error": str(exc), "findings": []}
    findings = []
    for severity, patterns in (("blocked", BLOCKED), ("approval", APPROVAL), ("risk", RISK)):
        for name, pattern in patterns.items():
            for match in pattern.finditer(text):
                line = text.count("\n", 0, match.start()) + 1
                findings.append({"kind": name, "severity": severity, "line": line})
    return {"path": str(path), "findings": findings}

def main():
    parser = argparse.ArgumentParser(description="Static safety scan for SQL and ORM migration files.")
    parser.add_argument("files", nargs="+", help="Migration files to inspect")
    parser.add_argument("--output", help="Optional JSON report path")
    args = parser.parse_args()

    missing = [f for f in args.files if not Path(f).is_file()]
    if missing:
        print(json.dumps({"error": "missing migration files", "files": missing}, indent=2), file=sys.stderr)
        return 2

    results = [scan(Path(f)) for f in args.files]
    findings = [x for r in results for x in r.get("findings", [])]
    report = {
        "version": 1,
        "blocked": any(x["severity"] == "blocked" for x in findings),
        "approval_required": any(x["severity"] in {"blocked", "approval"} for x in findings),
        "files_scanned": len(results),
        "finding_count": len(findings),
        "results": results,
    }
    payload = json.dumps(report, indent=2)
    if args.output:
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(payload + "\n", encoding="utf-8")
    print(payload)
    return 3 if report["blocked"] else 0

if __name__ == "__main__":
    raise SystemExit(main())
