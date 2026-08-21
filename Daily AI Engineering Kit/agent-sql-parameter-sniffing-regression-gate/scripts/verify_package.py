#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    "README.md",
    "config/policy.yaml",
    "schemas/benchmark-result.schema.json",
    "rules/sql-parameter-sniffing-safety.md",
    "skills/parameter-sniffing-investigation.md",
    "skills/mitigation-selection.md",
    "subagents/query-evidence-collector.md",
    "subagents/performance-investigator.md",
    "subagents/independent-verifier.md",
    "workflows/investigate-and-mitigate.md",
    "hooks/lifecycle.md",
    "scripts/benchmark_parameter_sets.py",
    "scripts/verify_package.py",
    "templates/parameter-matrix.json",
    "examples/parameter-cases.json",
    "tests/test_benchmark_parameter_sets.py",
]

root = Path(__file__).resolve().parents[1]
missing = [p for p in REQUIRED if not (root / p).is_file()]
if missing:
    print("Missing required files:")
    for p in missing:
        print(f"- {p}")
    sys.exit(1)
for path in REQUIRED:
    text = (root / path).read_text(encoding="utf-8")
    if not text.strip():
        print(f"Empty required file: {path}")
        sys.exit(2)
print(f"Package verified: {len(REQUIRED)} required files present and non-empty")
