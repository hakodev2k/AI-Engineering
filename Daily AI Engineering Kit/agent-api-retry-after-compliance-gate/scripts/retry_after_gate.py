#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime


def parse_retry_after(value, now=None):
    if value is None: return None
    value = value.strip()
    if not value: return None
    if value.isdigit(): return max(0, int(value))
    try:
        dt = parsedate_to_datetime(value)
        if dt.tzinfo is None: dt = dt.replace(tzinfo=timezone.utc)
        now = now or datetime.now(timezone.utc)
        return max(0, int((dt - now).total_seconds()))
    except Exception:
        return None


def evaluate(method, status, retry_after, policy):
    method = method.upper()
    statuses = set(policy["allow_retry_statuses"])
    forbidden = set(m.upper() for m in policy["forbid_retry_methods"])
    if status not in statuses:
        return {"decision":"do-not-retry","reason":"status-not-retryable","delay_seconds":0}
    if method in forbidden:
        return {"decision":"approval-required","reason":"method-may-have-side-effects","delay_seconds":0}
    parsed = parse_retry_after(retry_after)
    if policy.get("honor_retry_after", True) and retry_after is not None and parsed is None:
        return {"decision":"block","reason":"invalid-retry-after","delay_seconds":0}
    delay = parsed if parsed is not None else int(policy["default_delay_seconds"])
    delay = min(delay, int(policy["max_delay_seconds"]))
    return {"decision":"retry","reason":"bounded-retry-allowed","delay_seconds":delay}


def main():
    p=argparse.ArgumentParser()
    p.add_argument('--method', required=True)
    p.add_argument('--status', required=True, type=int)
    p.add_argument('--retry-after')
    p.add_argument('--policy', default='config/retry-after-policy.json')
    p.add_argument('--output')
    a=p.parse_args()
    try:
        policy=json.load(open(a.policy, encoding='utf-8'))
        result=evaluate(a.method,a.status,a.retry_after,policy)
    except (OSError, ValueError, KeyError, TypeError) as e:
        print(f'configuration error: {e}', file=sys.stderr); return 3
    text=json.dumps(result, indent=2)
    if a.output:
        with open(a.output,'w',encoding='utf-8') as f:f.write(text+'\n')
    print(text)
    return 0 if result['decision'] in ('retry','do-not-retry') else 2

if __name__=='__main__': raise SystemExit(main())
