#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    'README.md',
    'config/checkpoint-policy.yaml',
    'schemas/checkpoint.schema.json',
    'scripts/checkpoint_gate.py',
    'scripts/verify_package.py',
    'tests/test_checkpoint_gate.py',
    'skills/checkpointed-job-execution.md',
    'rules/checkpoint-safety.md',
    'subagents/job-planner.md',
    'subagents/verification-agent.md',
    'workflows/checkpoint-resume-workflow.md',
    'hooks/lifecycle.md',
    'templates/replay-approval.md',
    'examples/checkpoint.json',
]

def main():
    root = Path(__file__).resolve().parents[1]
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    if missing:
        print('Missing required files:', file=sys.stderr)
        for p in missing: print(f'- {p}', file=sys.stderr)
        return 2
    banned = ['implementation omitted', 'remaining files omitted', 'same as above', 'add logic here', 'continue similarly', 'other files omitted for brevity']
    for rel in REQUIRED:
        text = (root / rel).read_text(encoding='utf-8', errors='ignore').lower()
        for phrase in banned:
            if phrase in text:
                print(f'Banned placeholder phrase in {rel}: {phrase}', file=sys.stderr)
                return 3
    print(f'Package verified: {len(REQUIRED)} required files present')
    return 0
if __name__ == '__main__':
    raise SystemExit(main())
