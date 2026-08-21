#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
"README.md","config/policy.yaml","schemas/output-contract.schema.json",
"scripts/schema_drift_gate.py","scripts/verify_package.py","tests/test_schema_drift_gate.py",
"skills/contract-baseline-review.md","skills/drift-remediation.md","rules/output-contract-safety.md",
"subagents/contract-reviewer.md","subagents/verification-agent.md","workflows/schema-drift-gate.md",
"hooks/lifecycle.md","templates/change-approval.md","examples/baseline.schema.json","examples/candidate-breaking.schema.json"
]
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
    print("Missing package files:")
    print("\n".join(missing))
    raise SystemExit(2)
for p in REQUIRED:
    text=(ROOT/p).read_text(encoding="utf-8")
    if not text.strip():
        print(f"Empty file: {p}")
        raise SystemExit(3)
print(f"Package verified: {len(REQUIRED)} files")
