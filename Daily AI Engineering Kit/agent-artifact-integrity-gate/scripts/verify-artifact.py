#!/usr/bin/env python3
import argparse, hashlib, json, os, sys
from datetime import datetime, timezone


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def parse_dt(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--artifact', required=True)
    p.add_argument('--record', required=True)
    p.add_argument('--policy', default='config/artifact-policy.json')
    p.add_argument('--task-id')
    p.add_argument('--repository-id')
    p.add_argument('--require-verified', action='store_true')
    args = p.parse_args()

    try:
        policy = json.load(open(args.policy, encoding='utf-8'))
        record = json.load(open(args.record, encoding='utf-8'))
    except Exception as e:
        print(f'config/read error: {e}', file=sys.stderr); return 2
    errors = []
    if not os.path.isfile(args.artifact): errors.append('artifact-missing')
    else:
        actual = sha256_file(args.artifact)
        if actual != record.get('sha256'): errors.append('hash-mismatch')
    try:
        if parse_dt(record['expires_at']) <= datetime.now(timezone.utc): errors.append('artifact-expired')
    except Exception:
        errors.append('invalid-expiry')
    if record.get('producer_status') in policy.get('blocking_producer_statuses', []): errors.append('producer-status-blocking')
    if policy.get('require_task_binding') and args.task_id and record.get('task_id') != args.task_id: errors.append('task-mismatch')
    if policy.get('require_repository_binding') and args.repository_id and record.get('repository_id') != args.repository_id: errors.append('repository-mismatch')
    if args.require_verified and record.get('integrity_status') != 'verified': errors.append('independent-verification-required')
    result = {'artifact_id': record.get('artifact_id'), 'valid': not errors, 'errors': errors}
    print(json.dumps(result, indent=2))
    return 0 if not errors else 10

if __name__ == '__main__':
    raise SystemExit(main())
