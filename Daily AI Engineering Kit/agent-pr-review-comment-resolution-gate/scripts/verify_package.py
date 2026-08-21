#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/policy.yaml",
    "schemas/review-resolution.schema.json",
    "rules/pr-review-safety.md",
    "skills/review-comment-triage.md",
    "skills/review-fix-verify.md",
    "subagents/review-triage-agent.md",
    "subagents/review-implementation-agent.md",
    "subagents/review-verification-agent.md",
    "workflows/resolve-review-comments.md",
    "hooks/lifecycle.md",
    "scripts/review_gate.py",
    "scripts/diff_scope_gate.py",
    "templates/resolution.json",
    "tests/test_review_gate.py"
]

def main():
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    empty = [p for p in REQUIRED if (ROOT / p).is_file() and (ROOT / p).stat().st_size == 0]
    if missing or empty:
        for p in missing: print(f"ERROR missing: {p}", file=sys.stderr)
        for p in empty: print(f"ERROR empty: {p}", file=sys.stderr)
        return 1
    text = "\n".join((ROOT / p).read_text(encoding="utf-8", errors="ignore") for p in REQUIRED)
    forbidden = ["implementation omitted", "remaining files omitted", "same as above", "continue similarly"]
    hits = [x for x in forbidden if x in text.lower()]
    if hits:
        print(f"ERROR forbidden placeholders: {hits}", file=sys.stderr)
        return 1
    print(f"PASS: {len(REQUIRED)} required files exist and are non-empty")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
