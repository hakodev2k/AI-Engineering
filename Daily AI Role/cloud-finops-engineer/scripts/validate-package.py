#!/usr/bin/env python3
from pathlib import Path
import os, sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
"README.md","checklists/definition-of-done.md","config/role-config.yaml","examples/finops-work-item.example.json",
"hooks/lifecycle-hooks.md","knowledge/finops-reasoning-principles.md","knowledge/allocation-and-unit-economics.md",
"knowledge/commitments-and-rightsizing.md","metrics/finops-quality.md","rules/operating-rules.md",
"schemas/finops-work-item.schema.json","scripts/validate-finops-work-item.py","scripts/validate-package.py",
"skills/cost-allocation.md","skills/anomaly-investigation.md","skills/forecast-and-budget-analysis.md",
"skills/optimization-analysis.md","skills/commitment-analysis.md","skills/unit-economics.md",
"subagents/allocation-reviewer.md","subagents/optimization-risk-reviewer.md","subagents/commitment-reviewer.md","subagents/forecast-reviewer.md",
"templates/finops-work-item.md","templates/optimization-recommendation.md","templates/commitment-decision.md","templates/failure-learning-record.md","templates/handoff.md",
"workflows/monthly-finops-review.md","workflows/cost-anomaly-response.md","workflows/optimization-to-realization.md","workflows/commitment-decision.md"
]
missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
if missing:
    print("Missing files:\n" + "\n".join(missing), file=sys.stderr); sys.exit(1)
for p in ["scripts/validate-finops-work-item.py","scripts/validate-package.py"]:
    if not os.access(ROOT / p, os.X_OK):
        print(f"Not executable: {p}", file=sys.stderr); sys.exit(1)
print(f"VALID package: {len(REQUIRED)} required files present")
