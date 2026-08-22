#!/usr/bin/env python3
from pathlib import Path
import json, sys

root = Path(__file__).resolve().parents[1]
required = [
    'README.md',
    'rules/operating-rules.md',
    'skills/question-framing.md',
    'skills/evidence-planning.md',
    'skills/source-evaluation.md',
    'skills/experiment-and-benchmark-design.md',
    'skills/synthesis-and-recommendation.md',
    'skills/reproducibility-and-handoff.md',
    'subagents/source-scout.md',
    'subagents/evidence-reviewer.md',
    'subagents/experiment-reviewer.md',
    'subagents/decision-challenger.md',
    'workflows/rapid-research.md',
    'workflows/deep-dive-research.md',
    'workflows/benchmark-evaluation.md',
    'workflows/research-update.md',
    'hooks/lifecycle-hooks.md',
    'knowledge/research-reasoning-principles.md',
    'knowledge/source-quality.md',
    'knowledge/experiments-and-uncertainty.md',
    'templates/research-work-item.md',
    'templates/evidence-matrix.md',
    'templates/research-brief.md',
    'templates/experiment-protocol.md',
    'templates/handoff.md',
    'templates/failure-learning-record.md',
    'schemas/research-work-item.schema.json',
    'examples/research-work-item.example.json',
    'metrics/research-quality.md',
    'checklists/definition-of-done.md',
    'scripts/validate-research-work-item.py',
    'scripts/validate-package.py'
]
missing = [p for p in required if not (root / p).is_file()]
empty = [p for p in required if (root / p).is_file() and (root / p).stat().st_size == 0]
if missing or empty:
    print('missing:', missing)
    print('empty:', empty)
    sys.exit(1)
for p in ['schemas/research-work-item.schema.json', 'examples/research-work-item.example.json']:
    try:
        json.loads((root / p).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'invalid json {p}: {e}')
        sys.exit(1)
print(f'OK: {len(required)} files')
