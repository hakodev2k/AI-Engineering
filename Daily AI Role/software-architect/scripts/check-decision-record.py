#!/usr/bin/env python3
from pathlib import Path
import sys

HEADINGS = [
    '# Architecture Decision Record', '## Context', '## Decision drivers',
    '## Options considered', '## Decision', '## Consequences',
    '## Verification', '## Approval'
]

def main() -> int:
    if len(sys.argv) != 2:
        print('usage: check-decision-record.py <adr.md>', file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    if not path.is_file():
        print(f'not found: {path}', file=sys.stderr)
        return 2
    text = path.read_text(encoding='utf-8', errors='replace')
    missing = [h for h in HEADINGS if h not in text]
    if missing:
        for h in missing:
            print(f'missing heading: {h}', file=sys.stderr)
        return 1
    if 'Status:' not in text or 'Decision owner:' not in text:
        print('missing Status or Decision owner metadata', file=sys.stderr)
        return 1
    print('adr-structure-valid')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
