#!/usr/bin/env python3
import argparse
import json
import re
import sys
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise RuntimeError(f"cannot read JSON {path}: {exc}") from exc


def scan(text: str, patterns):
    findings = []
    for pattern in patterns:
        try:
            regex = re.compile(pattern, re.IGNORECASE | re.DOTALL)
        except re.error as exc:
            raise RuntimeError(f"invalid regex in policy: {pattern}: {exc}") from exc
        for match in regex.finditer(text):
            start = match.start()
            line = text.count("\n", 0, start) + 1
            snippet = " ".join(match.group(0).split())[:200]
            findings.append({"pattern": pattern, "line": line, "snippet": snippet})
    return findings


def main():
    parser = argparse.ArgumentParser(description="Statically inspect migration SQL/text for policy risk patterns.")
    parser.add_argument("--migration", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    migration_path = Path(args.migration)
    policy_path = Path(args.policy)
    output_path = Path(args.output)

    try:
        if not migration_path.is_file():
            raise RuntimeError(f"migration file not found: {migration_path}")
        if not policy_path.is_file():
            raise RuntimeError(f"policy file not found: {policy_path}")
        text = migration_path.read_text(encoding="utf-8", errors="replace")
        policy = load_json(policy_path)
        groups = {
            "destructive": policy.get("destructive_patterns", []),
            "lockRisk": policy.get("lock_risk_patterns", []),
            "security": policy.get("security_sensitive_patterns", []),
        }
        result = {
            "migration": str(migration_path),
            "bytes": len(text.encode("utf-8")),
            "destructive": scan(text, groups["destructive"]),
            "lockRisk": scan(text, groups["lockRisk"]),
            "security": scan(text, groups["security"]),
        }
        result["summary"] = {
            "destructiveFindings": len(result["destructive"]),
            "lockRiskFindings": len(result["lockRisk"]),
            "securityFindings": len(result["security"]),
        }
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
        print(json.dumps(result["summary"]))
        return 0
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    sys.exit(main())
