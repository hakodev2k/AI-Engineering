#!/usr/bin/env python3
"""Deterministically classify persisted agent work before resume."""
from __future__ import annotations
import argparse, json, sys
from datetime import datetime, timezone
from pathlib import Path

TERMINAL={'completed','cancelled','canceled','stopped','denied'}


def parse_ts(v, name):
    if not isinstance(v,str) or not v.strip(): raise ValueError(f'{name} must be an ISO-8601 string')
    s=v.replace('Z','+00:00')
    try: d=datetime.fromisoformat(s)
    except ValueError as e: raise ValueError(f'{name}: invalid timestamp') from e
    if d.tzinfo is None: raise ValueError(f'{name}: timezone required')
    return d.astimezone(timezone.utc)


def decide(data,max_age):
    required=('session_id','task_id','last_real_activity_at','current_time','prior_state','provenance')
    missing=[k for k in required if k not in data or data[k] in (None,'')]
    if missing: return {'decision':'quarantine','reasons':['missing_provenance:'+','.join(missing)]}
    now=parse_ts(data['current_time'],'current_time'); last=parse_ts(data['last_real_activity_at'],'last_real_activity_at')
    age=(now-last).total_seconds()
    if age < 0: return {'decision':'quarantine','reasons':['activity_timestamp_in_future'],'age_seconds':age}
    state=str(data['prior_state']).lower()
    reasons=[]
    if state in TERMINAL: return {'decision':'deny','reasons':['prior_state_terminal'],'age_seconds':age}
    if age > max_age: reasons.append('stale_activity')
    if not isinstance(data['provenance'],dict) or not data['provenance'].get('source'):
        reasons.append('provenance_source_missing')
    if data.get('state_drift') is True: reasons.append('state_drift_requires_revalidation')
    if data.get('side_effect_capable') is True and data.get('approval_current') is not True:
        reasons.append('side_effect_reapproval_required')
    return {'decision':'quarantine' if reasons else 'allow','reasons':reasons or ['recent_nonterminal_provenance_complete'],'age_seconds':age}


def main():
    ap=argparse.ArgumentParser(); ap.add_argument('envelope',type=Path); ap.add_argument('--max-age-seconds',type=int,default=300); ap.add_argument('--json',action='store_true')
    a=ap.parse_args()
    if a.max_age_seconds < 0:
        print('error: max age must be >= 0',file=sys.stderr); return 2
    try:
        data=json.loads(a.envelope.read_text(encoding='utf-8')); result=decide(data,a.max_age_seconds)
    except (OSError,json.JSONDecodeError,ValueError) as e:
        print(f'error: {e}',file=sys.stderr); return 2
    print(json.dumps(result,indent=2,sort_keys=True) if a.json else f"{result['decision']}: {', '.join(result['reasons'])}")
    return 0 if result['decision']=='allow' else 1

if __name__=='__main__': raise SystemExit(main())
