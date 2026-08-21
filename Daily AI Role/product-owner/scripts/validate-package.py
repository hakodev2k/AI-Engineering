#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQ='''README.md
checklists/definition-of-done.md
config/role-config.yaml
examples/product-item.example.json
hooks/lifecycle-hooks.md
knowledge/product-principles.md
knowledge/prioritization-and-discovery.md
metrics/product-delivery-health.md
rules/operating-rules.md
schemas/product-item.schema.json
scripts/validate-product-item.py
scripts/validate-package.py
skills/backlog-prioritization.md
skills/discovery-and-problem-framing.md
skills/acceptance-and-ready-decision.md
skills/release-scope-and-outcome-review.md
skills/stakeholder-alignment.md
subagents/discovery-analyst.md
subagents/backlog-reviewer.md
subagents/acceptance-verifier.md
subagents/release-risk-reviewer.md
templates/product-decision-record.md
templates/product-item.md
templates/handoff.md
workflows/discovery-to-ready.md
workflows/backlog-reprioritization.md
workflows/release-acceptance.md'''.splitlines()
missing=[p for p in REQ if not (ROOT/p).is_file()]
if missing:
 print('ERROR missing files:',*missing,sep='\n- ',file=sys.stderr);sys.exit(2)
print(f'OK: {len(REQ)} required files present')
