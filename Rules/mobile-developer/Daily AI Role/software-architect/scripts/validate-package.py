#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    'README.md','config/role.yaml','rules/core-rules.md',
    'skills/architecture-requirement-analysis.md','skills/system-design.md',
    'skills/architecture-review.md','skills/technology-evaluation.md',
    'subagents/requirement-analyst.md','subagents/security-reviewer.md',
    'subagents/reliability-reviewer.md','subagents/cost-performance-reviewer.md',
    'workflows/new-system-design.md','workflows/change-impact-review.md',
    'workflows/incident-architecture-review.md','hooks/lifecycle-hooks.md',
    'knowledge/architecture-principles.md','knowledge/nfr-playbook.md',
    'templates/architecture-decision-record.md','templates/system-design-brief.md',
    'checklists/final-review.md','schemas/design-brief.schema.json',
    'examples/sample-design-brief.json','metrics/quality-scorecard.md'
]
FORBIDDEN = ['implementation omitted', 'remaining files omitted', 'same as above', 'add logic here', 'continue similarly', 'other files omitted for brevity']

def main() -> int:
    errors = []
    for rel in REQUIRED:
        p = ROOT / rel
        if not p.is_file():
            errors.append(f'missing: {rel}')
            continue
        if p.stat().st_size == 0:
            errors.append(f'empty: {rel}')
        if p.suffix.lower() in {'.md','.yaml','.yml','.json','.py'}:
            text = p.read_text(encoding='utf-8', errors='replace').lower()
            for phrase in FORBIDDEN:
                if phrase in text:
                    errors.append(f'forbidden placeholder in {rel}: {phrase}')
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f'package-valid: {len(REQUIRED)} required artifacts present')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
