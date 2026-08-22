#!/usr/bin/env python3
import argparse
import json
import re
import sys
from pathlib import Path

REQUIRED = [
    "README.md",
    "config/correlation-policy.yaml",
    "skills/log-correlation-investigation.md",
    "skills/root-cause-validation.md",
    "rules/investigation-safety.md",
    "subagents/log-evidence-collector.md",
    "subagents/root-cause-analyst.md",
    "subagents/verification-agent.md",
    "workflows/incident-root-cause-workflow.md",
    "hooks/lifecycle.md",
    "scripts/correlate_logs.py",
    "scripts/verify_package.py",
    "schemas/evidence.schema.json",
    "templates/root-cause-report.md",
    "examples/sample-logs.jsonl",
    "tests/test_correlate_logs.py"
]
SECRET_PATTERN = re.compile(r'(?i)(authorization|password|access_token|api_key)\s*[=:]\s*(?!\[REDACTED\])\S+')


def validate_evidence(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    for key in ["status", "incident", "events", "first_abnormal_event", "hypotheses", "missing_sources"]:
        if key not in data:
            raise ValueError(f"evidence missing key: {key}")
    text = json.dumps(data)
    if SECRET_PATTERN.search(text):
        raise ValueError("possible unredacted secret-like field in evidence")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    ap.add_argument("--evidence")
    args = ap.parse_args()
    root = Path(args.root)
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    if missing:
        print("missing files:\n" + "\n".join(missing), file=sys.stderr)
        return 1
    if args.evidence:
        try:
            validate_evidence(Path(args.evidence))
        except Exception as exc:
            print(f"evidence validation failed: {exc}", file=sys.stderr)
            return 2
    print("package verification passed")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
