#!/usr/bin/env python3
import pathlib, sys

REQUIRED = [
    'README.md',
    'config/lock-policy.yaml',
    'rules/distributed-lock-safety.md',
    'skills/lock-investigation.md',
    'skills/safe-lock-remediation.md',
    'subagents/lock-investigator.md',
    'subagents/lock-implementer.md',
    'subagents/lock-verifier.md',
    'workflows/lock-safety-gate.md',
    'hooks/lifecycle.md',
    'scripts/redis_lock_gate.py',
    'scripts/verify_package.py',
    'templates/lock-finding.md',
    'examples/lock-gate-result.json',
    'schemas/lock-result.schema.json',
    'tests/test_redis_lock_gate.py',
]
BANNED = ['implementation omitted', 'remaining files omitted', 'same as above', 'add logic here', 'continue similarly', 'other files omitted for brevity']

def main():
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    missing = [p for p in REQUIRED if not (root / p).is_file() or (root / p).stat().st_size == 0]
    if missing:
        print('missing files: ' + ', '.join(missing), file=sys.stderr); return 2
    errors=[]
    for rel in REQUIRED:
        text=(root/rel).read_text(encoding='utf-8')
        low=text.lower()
        for marker in BANNED:
            if marker in low: errors.append(f'{rel}: banned marker {marker}')
    readme=(root/'README.md').read_text(encoding='utf-8')
    for rel in REQUIRED[1:]:
        if rel not in readme: errors.append(f'README missing reference: {rel}')
    if errors:
        print('\n'.join(errors), file=sys.stderr); return 3
    print('package verification passed'); return 0
if __name__=='__main__': sys.exit(main())
