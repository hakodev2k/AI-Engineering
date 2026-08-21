#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).parents[1]
REQUIRED = [
    "README.md",
    "config/cache-policy.yaml",
    "schemas/cache-request.schema.json",
    "scripts/cache_key_gate.py",
    "scripts/verify_package.py",
    "tests/test_cache_key_gate.py",
    "skills/cache-boundary-analysis.md",
    "skills/cache-key-design.md",
    "rules/cache-safety.md",
    "subagents/cache-boundary-reviewer.md",
    "subagents/cache-verification-agent.md",
    "workflows/cache-contamination-gate.md",
    "hooks/lifecycle.md",
    "templates/cache-review-report.md",
    "examples/request-safe.json",
    "examples/request-cross-tenant-risk.json",
]

missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
if missing:
    print("Missing required files:")
    for p in missing:
        print(" -", p)
    raise SystemExit(1)

for p in REQUIRED:
    text = (ROOT / p).read_text(encoding="utf-8")
    if not text.strip():
        print("Empty required file:", p)
        raise SystemExit(1)
    banned = ["implementation omitted", "remaining files omitted", "same as above", "add logic here", "continue similarly", "other files omitted for brevity"]
    lowered = text.lower()
    if any(x in lowered for x in banned):
        print("Banned omission marker in:", p)
        raise SystemExit(1)

print(f"Package verified: {len(REQUIRED)} required files present and non-empty")
