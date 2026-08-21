#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED='''README.md
checklists/definition-of-done.md
config/role-config.yaml
examples/data-contract.example.json
hooks/lifecycle-hooks.md
knowledge/data-engineering-principles.md
knowledge/schema-evolution-and-backfill.md
metrics/data-pipeline-health.md
rules/operating-rules.md
schemas/data-contract.schema.json
scripts/validate-data-contract.py
scripts/validate-package.py
skills/data-contract-engineering.md
skills/ingestion-pipeline-design.md
skills/transformation-and-modeling.md
skills/data-quality-and-reconciliation.md
skills/backfill-and-replay.md
skills/pipeline-incident-response.md
subagents/contract-reviewer.md
subagents/data-quality-analyst.md
subagents/lineage-impact-reviewer.md
subagents/pipeline-reliability-reviewer.md
templates/backfill-plan.md
templates/data-product-handoff.md
templates/incident-record.md
templates/pipeline-design.md
workflows/new-data-product.md
workflows/schema-change.md
workflows/backfill-recovery.md
workflows/pipeline-incident.md'''.splitlines()
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
    print("ERROR: missing files:", *missing, sep="\n - ", file=sys.stderr); sys.exit(1)
for p in (ROOT/'scripts').glob('*.py'):
    if not (p.stat().st_mode & 0o111):
        print(f"ERROR: script not executable: {p.relative_to(ROOT)}", file=sys.stderr); sys.exit(1)
print(f"OK: package contains all {len(REQUIRED)} required files")
