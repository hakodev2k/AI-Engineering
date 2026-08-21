#!/usr/bin/env python3
import argparse
import json
import sys

ALLOWED_NON_OBSERVATION = {'action-attempt', 'inference', 'user-provided', 'capability', 'unrelated'}


def load_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as fh:
            return json.load(fh)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f'cannot load {path}: {exc}')


def main() -> int:
    p = argparse.ArgumentParser(description='Validate externally grounded completion claims against evidence records.')
    p.add_argument('--claims', required=True, help='JSON array of claims')
    p.add_argument('--evidence', required=True, help='JSON array of evidence records')
    args = p.parse_args()

    try:
        claims = load_json(args.claims)
        evidence = load_json(args.evidence)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    if not isinstance(claims, list) or not isinstance(evidence, list):
        print('claims and evidence must be JSON arrays', file=sys.stderr)
        return 2

    success_index = {}
    for item in evidence:
        if not isinstance(item, dict):
            continue
        if item.get('status') != 'succeeded':
            continue
        source = item.get('source_id')
        action = item.get('action')
        evidence_id = item.get('id')
        if source and action and evidence_id:
            success_index.setdefault((source, action), []).append(evidence_id)

    results = []
    failures = 0
    for claim in claims:
        if not isinstance(claim, dict) or not claim.get('id'):
            print('each claim must be an object with id', file=sys.stderr)
            return 2
        kind = claim.get('kind')
        if kind in ALLOWED_NON_OBSERVATION:
            results.append({'claim_id': claim['id'], 'verdict': 'allow', 'evidence_id': None})
            continue
        if kind != 'observation-complete':
            results.append({'claim_id': claim['id'], 'verdict': 'rewrite-required', 'reason': 'unknown-claim-kind'})
            failures += 1
            continue
        source = claim.get('source_id')
        action = claim.get('action')
        matched = success_index.get((source, action), []) if source and action else []
        if matched:
            results.append({'claim_id': claim['id'], 'verdict': 'allow', 'evidence_id': matched[-1]})
        else:
            results.append({'claim_id': claim['id'], 'verdict': 'rewrite-required', 'reason': 'missing-success-evidence'})
            failures += 1

    print(json.dumps({'verdict': 'allow' if failures == 0 else 'rewrite-required', 'claims': results}, indent=2, sort_keys=True))
    return 0 if failures == 0 else 3


if __name__ == '__main__':
    sys.exit(main())
