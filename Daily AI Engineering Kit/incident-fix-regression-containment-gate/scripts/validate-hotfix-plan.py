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
    p.add_argument('--plan', required=True)
    p.add_argument('--policy', required=True)
    args = p.parse_args()
    try:
        plan, policy = load(args.plan), load(args.policy)
    except Exception as e:
        print(f'input-error: {e}', file=sys.stderr); return 2

    errors = []
    required = ['incident_id','severity','implementer','confirmed_symptom','allowed_paths','forbidden_paths','expected_behavior','verification','rollback','approval_actions','temporary_exceptions']
    for k in required:
        if k not in plan: errors.append(f'missing:{k}')
    if plan.get('severity') not in {'sev0','sev1','sev2','sev3'}: errors.append('invalid:severity')
    allowed = plan.get('allowed_paths', [])
    if not isinstance(allowed, list) or not allowed: errors.append('invalid:allowed_paths')
    forbidden = plan.get('forbidden_paths', [])
    if set(allowed) & set(forbidden): errors.append('scope:allowed-and-forbidden-overlap')

    verification = plan.get('verification', {})
    if not verification.get('commands'): errors.append('verification:missing-commands')
    if policy.get('require_negative_control', True) and not verification.get('negative_control_commands'):
        errors.append('verification:missing-negative-control')

    rollback = plan.get('rollback', {})
    if policy.get('require_rollback', True):
        if not rollback.get('mechanism'): errors.append('rollback:missing-mechanism')
        if not rollback.get('trigger'): errors.append('rollback:missing-trigger')

    now = datetime.now(timezone.utc)
    max_hours = float(policy.get('max_temporary_exception_hours', 168))
    for exc in plan.get('temporary_exceptions', []):
        for k in ['id','owner','reason','expires_at','follow_up']:
            if not exc.get(k): errors.append(f'exception:{exc.get("id","unknown")}:missing-{k}')
        try:
            expiry = parse_dt(exc.get('expires_at',''))
            if expiry <= now: errors.append(f'exception:{exc.get("id","unknown")}:expired')
            if (expiry-now).total_seconds() > max_hours*3600:
                errors.append(f'exception:{exc.get("id","unknown")}:expiry-exceeds-policy')
        except Exception:
            errors.append(f'exception:{exc.get("id","unknown")}:invalid-expiry')

    approval_required = set(policy.get('approval_required_actions', []))
    unknown_actions = [a for a in plan.get('approval_actions', []) if a not in approval_required]
    if unknown_actions: errors.append('approval:unknown-action:' + ','.join(sorted(unknown_actions)))

    if errors:
        print(json.dumps({'status':'blocked','errors':errors}, indent=2)); return 3
    print(json.dumps({'status':'valid','incident_id':plan['incident_id']}, indent=2)); return 0

if __name__ == '__main__':
    raise SystemExit(main())