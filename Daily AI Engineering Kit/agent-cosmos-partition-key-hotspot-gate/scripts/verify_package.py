#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    'README.md',
    'config/policy.yaml',
    'scripts/analyze_partition_hotspots.py',
    'scripts/verify_package.py',
    'skills/partition-hotspot-investigation.md',
    'skills/remediation-design.md',
    'rules/cosmos-partition-safety.md',
    'subagents/repository-explorer.md',
    'subagents/performance-reviewer.md',
    'subagents/verification-agent.md',
    'workflows/hotspot-investigation.md',
    'hooks/lifecycle.md',
    'schemas/hotspot-report.schema.json',
    'examples/partition-sample.csv',
    'tests/test_analyze_partition_hotspots.py'
]


def main():
    root = Path(__file__).resolve().parents[1]
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    if missing:
        print('missing files: ' + ', '.join(missing), file=sys.stderr)
        return 2
    readme = (root / 'README.md').read_text(encoding='utf-8')
    broken = [p for p in REQUIRED[1:] if p not in readme]
    if broken:
        print('README does not reference: ' + ', '.join(broken), file=sys.stderr)
        return 3
    forbidden = ['implementation omitted', 'remaining files omitted', 'same as above', 'continue similarly']
    for path in REQUIRED:
        text = (root / path).read_text(encoding='utf-8')
        for token in forbidden:
            if token in text.lower():
                print(f'forbidden placeholder in {path}: {token}', file=sys.stderr)
                return 4
    print('package verification passed')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
