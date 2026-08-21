#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone


def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def parse_dt(value):
    if value.endswith('Z'):
        value = value[:-1] + '+00:00'
    dt = datetime.fromisoformat(value)
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def main():
    p = argparse.ArgumentParser()
    for name in ['plan','diff','verification','review','policy','output']:
        p.add_argument(f'--{name}', required=True)
    args = p.parse_args()
    try:
        plan = load(args.plan); diff = load(args.diff); verification = load(args.verification)
        review = load(args.review); policy = load(args.policy)
    except Exception as e:
        print(f'input-error: {e}', file=sys.stderr); return 2

    findings = []
    approval_needed = False
    if not diff.get('contained', False): findings.append('diff-not-contained')
    if verification.get('incident_id') != plan.get('incident_id'): findings.append('verification-incident-mismatch')
    if not verification.get('targeted_checks_passed', False): findings.append('targeted-checks-failed')
    if policy.get('require_negative_control', True) and not verification.get('negative_control_passed', False): findings.append('negative-control-failed')
    if not verification.get('rollback_ready', False): findings.append('rollback-not-ready')
    if verification.get('transient_retry_count', 0) > policy.get('max_transient_retries', 1): findings.append('retry-limit-exceeded')

    if plan.get('severity') in set(policy.get('independent_review_severities', [])):
        if review.get('reviewer') == plan.get('implementer'): findings.append('reviewer-not-independent')
    if review.get('status') not in {'verified','human-approval-required','blocked'}: findings.append('invalid-review-status')
    if review.get('status') == 'blocked': findings.append('review-blocked')

    now = datetime.now(timezone.utc)
    for exc in plan.get('temporary_exceptions', []):
        try:
            if parse_dt(exc['expires_at']) <= now: findings.append(f'expired-exception:{exc.get("id","unknown")}')
        except Exception:
            findings.append(f'invalid-exception-expiry:{exc.get("id","unknown")}')

    if plan.get('approval_actions') and not plan.get('approval_granted', False): approval_needed = True
    if review.get('status') == 'human-approval-required': approval_needed = True

    if findings:
        status = policy.get('blocked_status', 'blocked')
        code = 5
    elif approval_needed:
        status = policy.get('approval_status', 'human-approval-required')
        code = 6
    else:
        status = policy.get('verified_status', 'verified')
        code = 0

    result = {'incident_id': plan.get('incident_id'), 'status': status, 'findings': findings, 'approval_required': approval_needed}
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
    print(json.dumps(result, indent=2))
    return code

if __name__ == '__main__':
    raise SystemExit(main())