#!/usr/bin/env python3
from pathlib import Path
import sys
EXPECTED='''README.md
checklists/definition-of-done.md
config/role-config.yaml
examples/opportunity.example.json
hooks/lifecycle-hooks.md
knowledge/product-strategy-and-discovery.md
knowledge/product-metrics-and-experiments.md
metrics/product-management-quality.md
rules/operating-rules.md
schemas/opportunity.schema.json
scripts/validate-opportunity.py
scripts/validate-package.py
skills/opportunity-discovery.md
skills/opportunity-sizing-and-prioritization.md
skills/product-strategy.md
skills/roadmap-and-bet-management.md
skills/experiment-and-launch-decision.md
subagents/customer-signal-analyst.md
subagents/market-researcher.md
subagents/metrics-analyst.md
subagents/risk-and-assumption-reviewer.md
templates/product-brief.md
templates/decision-record.md
templates/post-launch-review.md
workflows/discovery-to-bet.md
workflows/roadmap-reprioritization.md
workflows/launch-and-learning.md'''.splitlines()
root=Path(__file__).resolve().parent.parent
missing=[p for p in EXPECTED if not (root/p).is_file()]
if missing:
    print('ERROR missing:', *missing, sep='\n- ', file=sys.stderr); sys.exit(2)
print(f'OK: {len(EXPECTED)} required files present')
