#!/usr/bin/env python3
import argparse, json, sys

def main() -> int:
    p = argparse.ArgumentParser(description='Verify delegated-agent policy attestation evidence.')
    p.add_argument('file')
    p.add_argument('--require-topology', required=True)
    p.add_argument('--policy-hash', required=True)
    args = p.parse_args()
    try:
        data = json.load(open(args.file, encoding='utf-8'))
    except Exception as exc:
        print(f'invalid attestation: {exc}', file=sys.stderr); return 2
    if data.get('policy_hash') != args.policy_hash:
        print('policy hash mismatch', file=sys.stderr); return 3
    rows = [x for x in data.get('delegates', []) if x.get('topology') == args.require_topology]
    if not rows:
        print('required topology not attested', file=sys.stderr); return 3
    ids = [x.get('delegate_id') for x in rows]
    if any(not x for x in ids) or len(ids) != len(set(ids)):
        print('missing or duplicate delegate identity', file=sys.stderr); return 3
    required = {'pre_tool', 'permission_request', 'parent_reconciled'}
    failures = []
    for row in rows:
        observed = set(row.get('observed_controls', []))
        missing = required - observed
        if missing or row.get('status') != 'pass' or row.get('unresolved_decisions', 0) != 0:
            failures.append({'delegate_id': row.get('delegate_id'), 'missing': sorted(missing), 'status': row.get('status')})
    if failures:
        print(json.dumps({'status':'block','failures':failures}, indent=2)); return 3
    print(json.dumps({'status':'pass','topology':args.require_topology,'delegates':len(rows)}))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
