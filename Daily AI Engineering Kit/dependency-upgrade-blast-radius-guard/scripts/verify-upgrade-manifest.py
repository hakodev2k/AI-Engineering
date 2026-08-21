#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

REQUIRED = [
    'dependency','current_version','target_version','risk_level','affected_surfaces',
    'required_checks','rollback','approval','status'
]


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        raise RuntimeError(f'cannot read {path}: {exc}')


def fail(msg, errors):
    errors.append(msg)


def main():
    parser = argparse.ArgumentParser(description='Validate dependency upgrade manifest and optional dependency diff.')
    parser.add_argument('--manifest', default='upgrade-manifest.json')
    parser.add_argument('--dependency-diff')
    parser.add_argument('--preflight', action='store_true')
    args = parser.parse_args()

    errors = []
    try:
        m = load_json(args.manifest)
        for key in REQUIRED:
            if key not in m:
                fail(f'missing required field: {key}', errors)
        if not isinstance(m.get('affected_surfaces', []), list) or not m.get('affected_surfaces'):
            fail('affected_surfaces must be a non-empty list', errors)
        if not isinstance(m.get('required_checks', []), list) or not m.get('required_checks'):
            fail('required_checks must be a non-empty list', errors)
        if not isinstance(m.get('rollback', {}), dict) or not m.get('rollback', {}).get('steps'):
            fail('rollback.steps is required', errors)
        approval = m.get('approval', {})
        if not isinstance(approval, dict):
            fail('approval must be an object', errors)
        elif approval.get('required') and not approval.get('approved'):
            fail('required human approval is missing', errors)
        if args.preflight and m.get('status') not in {'reviewed','approved','ready'}:
            fail('preflight requires status reviewed/approved/ready', errors)

        if args.dependency_diff:
            d = load_json(args.dependency_diff)
            actual = set(d.get('dependency_files', []))
            expected = set(m.get('expected_dependency_files', []))
            unexpected = sorted(actual - expected)
            if unexpected:
                fail('unexpected dependency files changed: ' + ', '.join(unexpected), errors)

        if errors:
            for e in errors:
                print(f'ERROR: {e}', file=sys.stderr)
            return 1
        print('Upgrade manifest verification passed.')
        return 0
    except Exception as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
