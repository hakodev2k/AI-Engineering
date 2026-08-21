#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone


def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def parse_time(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def main():
    ap = argparse.ArgumentParser(description='Evaluate final repository secret-reference integrity gate.')
    ap.add_argument('--inventory', required=True)
    ap.add_argument('--validation', required=True)
    ap.add_argument('--review', required=True)
    ap.add_argument('--policy', required=True)
    ap.add_argument('--implementation-owner', default='implementation-agent')
    ap.add_argument('--output')
    args = ap.parse_args()
    try:
        inv_payload = load(args.inventory)
        validation = load(args.validation)
        review = load(args.review)
        policy = load(args.policy)
    except Exception as e:
        print(f'input error: {e}', file=sys.stderr); return 2

    inv = inv_payload.get('inventory', inv_payload)
    fp = inv_payload.get('inventory_fingerprint') or validation.get('inventory_fingerprint')
    reasons = []
    approval_needed = False

    if validation.get('status') == 'blocked': reasons.append('inventory validation is blocked')
    if validation.get('inventory_fingerprint') != fp: reasons.append('validation fingerprint does not match inventory')
    if review.get('inventory_fingerprint') != fp: reasons.append('review fingerprint does not match inventory')
    if review.get('reviewed_head') != inv.get('head'): reasons.append('reviewed HEAD does not match inventory HEAD')

    production_contract = any(c.get('scope') == 'production' for c in inv.get('contracts', []))
    if production_contract and policy.get('gate', {}).get('independent_review_for_production', True):
        if review.get('reviewer_id') == args.implementation_owner:
            reasons.append('production secret references require independent reviewer')

    status = review.get('status')
    if status == 'blocked': reasons.append('review status is blocked')
    elif status == 'human-approval-required': approval_needed = True
    elif status != 'verified': reasons.append('unsupported review status')

    approval = review.get('approval')
    if approval:
        try:
            expiry = parse_time(approval['expires_at'])
            if expiry <= datetime.now(timezone.utc): reasons.append('approval expired')
            if approval.get('action') not in policy.get('approval_required_actions', []): reasons.append('approval action not recognized by policy')
            if approval.get('secret_name') not in {c.get('name') for c in inv.get('contracts', [])}: reasons.append('approval secret_name not present in inventory')
        except Exception:
            reasons.append('malformed approval evidence')

    if validation.get('status') == 'review-required' and status != 'verified':
        approval_needed = approval_needed or bool(review.get('approval') is None)

    final = 'blocked' if reasons else ('human-approval-required' if approval_needed else 'verified')
    result = {'status': final, 'inventory_fingerprint': fp, 'head': inv.get('head'), 'reasons': reasons}
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, sort_keys=True); f.write('\n')
    print(json.dumps(result, sort_keys=True))
    return 0 if final == 'verified' else (3 if final == 'human-approval-required' else 2)

if __name__ == '__main__':
    raise SystemExit(main())
