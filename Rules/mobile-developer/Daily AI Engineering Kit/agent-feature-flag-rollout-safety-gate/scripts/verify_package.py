#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/policy.yaml",
    "schemas/rollout-result.schema.json",
    "scripts/validate_rollout.py",
    "scripts/verify_package.py",
    "skills/rollout-planning.md",
    "skills/rollout-verification.md",
    "rules/feature-flag-safety.md",
    "subagents/rollout-planner.md",
    "subagents/rollout-verifier.md",
    "workflows/progressive-rollout.md",
    "hooks/lifecycle.md",
    "templates/rollout-plan.yaml",
    "examples/safe-rollout.yaml",
    "examples/unsafe-rollout.yaml",
    "tests/test_validate_rollout.py",
]

missing = [path for path in REQUIRED if not (ROOT / path).is_file()]
if missing:
    print("Missing required files: " + ", ".join(missing))
    sys.exit(2)

empty = [str(path.relative_to(ROOT)) for path in ROOT.rglob("*") if path.is_file() and path.stat().st_size == 0]
if empty:
    print("Empty files: " + ", ".join(empty))
    sys.exit(3)

forbidden = ["implementation omitted", "remaining files omitted", "same as above", "continue similarly", "other files omitted for brevity"]
hits = []
for path in ROOT.rglob("*"):
    if path.is_file():
        try:
            text = path.read_text(encoding="utf-8").lower()
        except UnicodeDecodeError:
            continue
        for token in forbidden:
            if token in text:
                hits.append(f"{path.relative_to(ROOT)}:{token}")
if hits:
    print("Forbidden placeholder text: " + ", ".join(hits))
    sys.exit(4)

print(f"Package verification passed: {len(REQUIRED)} required files present and non-empty.")
