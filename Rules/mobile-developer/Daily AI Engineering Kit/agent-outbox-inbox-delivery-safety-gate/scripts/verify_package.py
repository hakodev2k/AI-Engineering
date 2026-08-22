#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    "README.md",
    "config/policy.yaml",
    "schemas/delivery-result.schema.json",
    "skills/outbox-safety-review.md",
    "skills/inbox-idempotency-review.md",
    "rules/delivery-safety.md",
    "subagents/repository-explorer.md",
    "subagents/delivery-planner.md",
    "subagents/implementation-agent.md",
    "subagents/verification-agent.md",
    "workflows/delivery-safety-gate.md",
    "hooks/lifecycle.md",
    "scripts/outbox_inbox_gate.py",
    "scripts/verify_package.py",
    "templates/delivery-review.md",
    "examples/delivery-snapshot.json",
    "tests/test_outbox_inbox_gate.py",
]

FORBIDDEN = ["implementation omitted", "remaining files omitted", "same as above", "add logic here", "continue similarly", "other files omitted for brevity"]


def main():
    root = Path(__file__).resolve().parent.parent
    problems = []
    for relative in REQUIRED:
        path = root / relative
        if not path.is_file() or path.stat().st_size == 0:
            problems.append(f"missing or empty: {relative}")
            continue
        text = path.read_text(encoding="utf-8", errors="replace").lower()
        for marker in FORBIDDEN:
            if marker in text:
                problems.append(f"forbidden omission marker in {relative}: {marker}")
    readme = (root / "README.md").read_text(encoding="utf-8", errors="replace") if (root / "README.md").exists() else ""
    for relative in REQUIRED[1:]:
        if relative not in readme:
            problems.append(f"README does not reference: {relative}")
    if problems:
        for problem in problems:
            print(f"FAIL: {problem}")
        return 1
    print(f"PASS: {len(REQUIRED)} required files exist, are non-empty, and README references all package artifacts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
