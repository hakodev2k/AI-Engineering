#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED = [
    "README.md",
    "config/rollback-readiness.json",
    "rules/rollback-safety.md",
    "skills/assess-rollback-readiness.md",
    "subagents/change-risk-assessor.md",
    "subagents/verification-agent.md",
    "workflows/rollback-readiness.md",
    "hooks/pre-change-gate.md",
    "scripts/assess-changes.py",
    "scripts/verify-package.py",
    "schemas/assessment.schema.json",
    "examples/sample-assessment.json",
    "tests/test_assess_changes.py"
]


def main():
    root = Path(__file__).resolve().parents[1]
    errors = []
    for rel in REQUIRED:
        path = root / rel
        if not path.is_file():
            errors.append(f"missing file: {rel}")
        elif path.stat().st_size == 0:
            errors.append(f"empty file: {rel}")

    for rel in ["config/rollback-readiness.json", "schemas/assessment.schema.json", "examples/sample-assessment.json"]:
        try:
            json.loads((root / rel).read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"invalid JSON {rel}: {exc}")

    refs = {
        "hooks/pre-change-gate.md": ["scripts/assess-changes.py", "config/rollback-readiness.json"],
        "skills/assess-rollback-readiness.md": ["scripts/assess-changes.py", "rules/rollback-safety.md", "schemas/assessment.schema.json"],
        "workflows/rollback-readiness.md": ["scripts/assess-changes.py", "config/rollback-readiness.json"],
        "README.md": REQUIRED[1:]
    }
    for source, expected in refs.items():
        text = (root / source).read_text(encoding="utf-8") if (root / source).is_file() else ""
        for ref in expected:
            if ref not in text:
                errors.append(f"{source} does not reference {ref}")

    forbidden = ["TODO", "implementation omitted", "remaining files omitted", "same as above", "continue similarly"]
    for rel in REQUIRED:
        path = root / rel
        if path.is_file() and path.suffix in {".md", ".py", ".json"}:
            text = path.read_text(encoding="utf-8")
            for marker in forbidden:
                if marker.lower() in text.lower():
                    errors.append(f"forbidden placeholder marker '{marker}' in {rel}")

    if errors:
        for err in errors:
            print(f"ERROR: {err}", file=sys.stderr)
        return 1
    print(f"OK: verified {len(REQUIRED)} required package files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
