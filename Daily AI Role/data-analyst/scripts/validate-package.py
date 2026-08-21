#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
REQ='''README.md
checklists/definition-of-done.md
config/role-config.yaml
examples/analysis-contract.example.json
hooks/lifecycle-hooks.md
knowledge/analytical-reasoning.md
knowledge/metrics-and-experiments.md
metrics/analysis-quality.md
rules/operating-rules.md
schemas/analysis-contract.schema.json
scripts/validate-analysis-contract.py
scripts/validate-package.py
skills/analysis-question-framing.md
skills/data-validation.md
skills/metric-and-segmentation-analysis.md
skills/experiment-and-causal-readout.md
skills/insight-communication.md
subagents/data-quality-reviewer.md
subagents/metric-definition-reviewer.md
subagents/statistical-reviewer.md
subagents/insight-challenger.md
templates/analysis-plan.md
templates/decision-brief.md
templates/experiment-readout.md
templates/handoff.md
workflows/ad-hoc-analysis.md
workflows/metric-investigation.md
workflows/experiment-readout.md
workflows/analysis-incident-response.md'''.splitlines()
missing=[p for p in REQ if not (ROOT/p).is_file()]
if missing:
    print('ERROR missing files:',*missing,sep='\n- ',file=sys.stderr); sys.exit(1)
for p in ['scripts/validate-analysis-contract.py','scripts/validate-package.py']:
    if not ((ROOT/p).stat().st_mode & 0o111):
        print(f'ERROR not executable: {p}',file=sys.stderr); sys.exit(1)
print(f'OK: {len(REQ)} required files present; scripts executable')
