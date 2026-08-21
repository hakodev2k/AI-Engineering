#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

ALLOWED_STATUS = {'pass', 'warn', 'block', 'needs-approval', 'insufficient-evidence'}
ALLOWED_SEVERITY = {'low', 'medium', 'high', 'critical'}


def fail(message):
    print(f'INVALID: {message}')
    raise SystemExit(2)


def main():
    parser = argparse.ArgumentParser(description='Validate timeout budget assessment JSON.')
    parser.add_argument('assessment')
    args = parser.parse_args()

    path = Path(args.assessment)
    if not path.is_file():
        fail(f'file not found: {path}')
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as exc:
        fail(str(exc))

    required = {'status', 'entrypoint', 'parent_budget_ms', 'findings', 'verification', 'unresolved_risks'}
    missing = sorted(required - data.keys())
    if missing:
        fail(f'missing fields: {", ".join(missing)}')
    if data['status'] not in ALLOWED_STATUS:
        fail('invalid status')
    if not isinstance(data['entrypoint'], str) or not data['entrypoint'].strip():
        fail('entrypoint must be non-empty')
    if not isinstance(data['parent_budget_ms'], int) or data['parent_budget_ms'] <= 0:
        fail('parent_budget_ms must be positive integer')
    if not isinstance(data['findings'], list):
        fail('findings must be an array')
    for index, finding in enumerate(data['findings']):
        for key in ('id', 'severity', 'component', 'finding', 'evidence', 'recommended_action'):
            if key not in finding:
                fail(f'finding[{index}] missing {key}')
        if finding['severity'] not in ALLOWED_SEVERITY:
            fail(f'finding[{index}] invalid severity')
        if not isinstance(finding['evidence'], list) or not finding['evidence']:
            fail(f'finding[{index}] evidence must be non-empty')
    verification = data['verification']
    for key in ('budget_propagation_checked', 'retry_deadline_checked', 'tests_executed', 'result'):
        if key not in verification:
            fail(f'verification missing {key}')
    if verification['result'] not in {'passed', 'failed', 'not-run'}:
        fail('invalid verification.result')
    if data['status'] == 'pass':
        if verification['result'] != 'passed':
            fail('pass requires verification.result=passed')
        if data['unresolved_risks']:
            fail('pass requires no unresolved_risks')
    if data['status'] == 'needs-approval' and not data.get('approvals_required'):
        fail('needs-approval requires approvals_required')

    print('VALID')


if __name__ == '__main__':
    main()
