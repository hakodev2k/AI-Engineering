#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

DEFAULT = {
    "block_patterns": ["DROP DATABASE", "TRUNCATE TABLE"],
    "approval_patterns": ["DROP TABLE", "DROP COLUMN", "ALTER COLUMN", "DELETE FROM", "UPDATE ", "CREATE INDEX", "DROP INDEX", "ALTER TABLE"],
    "warning_patterns": ["NOT NULL", "WITH (ONLINE = OFF)"],
    "max_statements": 500,
    "require_where_for_delete_update": True,
}

def load_policy(path):
    if not path:
        return DEFAULT.copy()
    try:
        import yaml
    except ImportError:
        raise RuntimeError("PyYAML is required when --policy is used: pip install pyyaml")
    data = yaml.safe_load(Path(path).read_text(encoding="utf-8")) or {}
    policy = DEFAULT.copy(); policy.update(data)
    return policy

def strip_comments(sql):
    sql = re.sub(r"/\*.*?\*/", "", sql, flags=re.S)
    return re.sub(r"--[^\n]*", "", sql)

def finding(severity, rule, evidence, line):
    return {"severity": severity, "rule": rule, "evidence": evidence.strip()[:240], "line": line}

def scan(sql, policy):
    clean = strip_comments(sql)
    findings = []
    lines = clean.splitlines()
    for no, line in enumerate(lines, 1):
        upper = line.upper()
        for p in policy["block_patterns"]:
            if p.upper() in upper: findings.append(finding("block", f"pattern:{p}", line, no))
        for p in policy["approval_patterns"]:
            if p.upper() in upper: findings.append(finding("approval_required", f"pattern:{p}", line, no))
        for p in policy["warning_patterns"]:
            if p.upper() in upper: findings.append(finding("warning", f"pattern:{p}", line, no))
    statements = [s.strip() for s in clean.split(";") if s.strip()]
    if len(statements) > int(policy["max_statements"]):
        findings.append(finding("approval_required", "statement-count-limit", f"{len(statements)} statements exceeds {policy['max_statements']}", 1))
    if policy.get("require_where_for_delete_update", True):
        for stmt in statements:
            normalized = re.sub(r"\s+", " ", stmt).strip().upper()
            if (normalized.startswith("DELETE FROM ") or normalized.startswith("UPDATE ")) and " WHERE " not in normalized:
                first = stmt.splitlines()[0]
                line = clean[:clean.find(stmt)].count("\n") + 1 if stmt in clean else 1
                findings.append(finding("block", "unbounded-data-change", first, line))
    return findings, len(statements)

def main(argv=None):
    ap = argparse.ArgumentParser(description="Non-executing SQL migration safety preflight")
    ap.add_argument("--input", required=True)
    ap.add_argument("--policy")
    ap.add_argument("--output")
    args = ap.parse_args(argv)
    src = Path(args.input)
    if not src.is_file():
        print(f"input not found: {src}", file=sys.stderr); return 4
    try:
        policy = load_policy(args.policy)
        sql = src.read_text(encoding="utf-8")
        findings, count = scan(sql, policy)
    except (OSError, UnicodeError, RuntimeError, ValueError) as e:
        print(str(e), file=sys.stderr); return 5
    status = "block" if any(x["severity"] == "block" for x in findings) else "approval_required" if any(x["severity"] == "approval_required" for x in findings) else "pass"
    result = {"status": status, "input": str(src), "statement_count": count, "findings": findings, "errors": []}
    text = json.dumps(result, indent=2)
    if args.output:
        try: Path(args.output).write_text(text + "\n", encoding="utf-8")
        except OSError as e: print(str(e), file=sys.stderr); return 6
    else: print(text)
    return {"pass": 0, "approval_required": 2, "block": 3}[status]

if __name__ == "__main__":
    raise SystemExit(main())
