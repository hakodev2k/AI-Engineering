#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

REQUIRED = [
    "README.md",
    "config/policy.json",
    "schemas/finding.schema.json",
    "skills/investigate-job-overlap.md",
    "skills/design-concurrency-safety.md",
    "rules/concurrency-safety.md",
    "subagents/job-explorer.md",
    "subagents/concurrency-verifier.md",
    "workflows/overlap-safety-workflow.md",
    "hooks/preflight-overlap-scan.md",
    "hooks/final-verification.md",
    "scripts/scan-job-overlap.py",
    "scripts/verify-package.py",
    "examples/job-inventory.json",
    "tests/test_scan_job_overlap.py"
]

FORBIDDEN = ["implementation omitted", "remaining files omitted", "same as above", "add logic here", "continue similarly", "other files omitted for brevity"]


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--package-root", required=True)
    args = p.parse_args()
    root = Path(args.package_root).resolve()
    errors = []
    for rel in REQUIRED:
        path = root / rel
        if not path.is_file():
            errors.append(f"missing: {rel}")
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if not text.strip():
            errors.append(f"empty: {rel}")
        low = text.lower()
        for phrase in FORBIDDEN:
            if phrase in low:
                errors.append(f"forbidden placeholder in {rel}: {phrase}")
    try:
        policy = json.loads((root / "config/policy.json").read_text(encoding="utf-8"))
        if policy.get("max_retries") != 2:
            errors.append("config/policy.json max_retries must be 2")
    except Exception as exc:
        errors.append(f"invalid policy JSON: {exc}")
    try:
        json.loads((root / "schemas/finding.schema.json").read_text(encoding="utf-8"))
        json.loads((root / "examples/job-inventory.json").read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"invalid JSON artifact: {exc}")
    if errors:
        for error in errors:
            print(error)
        return 1
    print(f"Verified {len(REQUIRED)} required package files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
