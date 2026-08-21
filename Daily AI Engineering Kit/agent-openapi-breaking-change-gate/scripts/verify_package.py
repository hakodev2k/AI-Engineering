#!/usr/bin/env python3
import sys
from pathlib import Path

REQUIRED = [
    'README.md',
    'config/policy.yaml',
    'rules/api-contract-safety.md',
    'skills/contract-diff-analysis.md',
    'skills/breaking-change-review.md',
    'subagents/contract-explorer.md',
    'subagents/contract-reviewer.md',
    'workflows/openapi-contract-gate.md',
    'hooks/lifecycle.md',
    'schemas/gate-result.schema.json',
    'templates/breaking-change-approval.md',
    'examples/baseline.json',
    'examples/candidate-breaking.json',
    'scripts/openapi_breaking_gate.py',
    'tests/test_openapi_breaking_gate.py'
]

def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
    missing = [p for p in REQUIRED if not (root / p).is_file() or (root / p).stat().st_size == 0]
    if missing:
        print('Missing or empty:')
        for p in missing: print(f'- {p}')
        return 2
    readme = (root / 'README.md').read_text(encoding='utf-8')
    broken = [p for p in REQUIRED[1:] if p not in readme]
    if broken:
        print('README does not reference required files:')
        for p in broken: print(f'- {p}')
        return 3
    print(f'Package verification passed: {len(REQUIRED)} required files present and referenced.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
