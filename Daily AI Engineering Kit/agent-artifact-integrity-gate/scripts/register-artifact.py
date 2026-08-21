#!/usr/bin/env python3
import argparse, hashlib, json, os, sys, uuid
from datetime import datetime, timedelta, timezone


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--artifact', required=True)
    p.add_argument('--record', required=True)
    p.add_argument('--task-id', required=True)
    p.add_argument('--repository-id', required=True)
    p.add_argument('--producer', required=True)
    p.add_argument('--artifact-type', required=True)
    p.add_argument('--ttl-hours', type=int, default=24)
    p.add_argument('--repository-ref')
    p.add_argument('--producer-status', choices=['executed','completed','blocked','failed'], default='completed')
    p.add_argument('--source-artifact-id', action='append', default=[])
    args = p.parse_args()

    if args.ttl_hours <= 0:
        print('ttl-hours must be > 0', file=sys.stderr); return 2
    if not os.path.isfile(args.artifact):
        print(f'artifact not found: {args.artifact}', file=sys.stderr); return 2

    now = datetime.now(timezone.utc)
    record = {
        'artifact_id': str(uuid.uuid4()),
        'artifact_path': os.path.normpath(args.artifact),
        'artifact_type': args.artifact_type,
        'sha256': sha256_file(args.artifact),
        'task_id': args.task_id,
        'repository_id': args.repository_id,
        'repository_ref': args.repository_ref,
        'producer': args.producer,
        'producer_status': args.producer_status,
        'created_at': now.isoformat(),
        'expires_at': (now + timedelta(hours=args.ttl_hours)).isoformat(),
        'integrity_status': 'registered',
        'source_artifact_ids': sorted(set(args.source_artifact_id)),
        'verifier': None,
        'verified_at': None,
        'verification_notes': None
    }
    parent = os.path.dirname(args.record)
    if parent: os.makedirs(parent, exist_ok=True)
    with open(args.record, 'w', encoding='utf-8') as f:
        json.dump(record, f, indent=2)
    print(json.dumps({'artifact_id': record['artifact_id'], 'sha256': record['sha256'], 'record': args.record}))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
