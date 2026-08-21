#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    "README.md",
    "rules/engineering-rules.md",
    "skills/api-feature.md",
    "skills/bug-investigation.md",
    "skills/database-change.md",
    "skills/performance-diagnosis.md",
    "subagents/repository-explorer.md",
    "subagents/database-investigator.md",
    "subagents/implementation-agent.md",
    "subagents/code-reviewer.md",
    "subagents/verification-agent.md",
    "workflows/feature-delivery.md",
    "workflows/production-incident.md",
    "workflows/code-review.md",
    "hooks/quality-gates.md",
    "scripts/dotnet-verify.ps1",
    "scripts/validate-task.py",
    "knowledge/backend-operating-guide.md",
    "checklists/definition-of-done.md",
    "schemas/task-contract.schema.json",
    "templates/handoff.md",
]

FORBIDDEN = [
    "implementation omitted",
    "remaining files omitted",
    "other files omitted for brevity",
    "add logic here",
    "continue similarly",
]


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    errors = []

    for rel in REQUIRED:
        path = root / rel
        if not path.is_file():
            errors.append(f"missing required file: {rel}")
        elif path.stat().st_size == 0:
            errors.append(f"empty file: {rel}")

    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".md", ".py", ".ps1", ".json", ".yaml", ".yml", ".toml"}:
            continue
        text = path.read_text(encoding="utf-8", errors="replace").lower()
        for phrase in FORBIDDEN:
            if phrase in text:
                errors.append(f"forbidden placeholder phrase in {path.relative_to(root)}: {phrase}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print(f"Package audit passed: {len(REQUIRED)} required files found")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
