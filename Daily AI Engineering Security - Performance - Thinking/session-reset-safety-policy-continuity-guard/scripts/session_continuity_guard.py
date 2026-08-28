#!/usr/bin/env python3
import argparse, hashlib, json
from datetime import datetime, timezone, timedelta
from pathlib import Path

def load(path):
    try: return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(json.dumps({'ok': False, 'error': f'cannot read {path}: {exc}'})); raise SystemExit(2)

def target_key(value):
    return hashlib.sha256(str(value).encode('utf-8')).hexdigest()

def parse_ts(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00')).astimezone(timezone.utc)

def evaluate(event, history, policy, now=None):
    required = ['session_id','target','action_class','declared_context']
    missing=[k for k in required if k not in event]
    if missing: return {'ok':False,'decision':'block','reasons':['missing:'+k for k in missing]}
    now = now or datetime.now(timezone.utc)
    tkey = target_key(event['target'])
    action = event['action_class']
    high = action in set(policy.get('high_risk_action_classes', []))
    cutoff = now - timedelta(hours=float(policy.get('history_window_hours',24)))
    related=[]
    for item in history if isinstance(history,list) else []:
        try:
            if item.get('target_key')==tkey and item.get('action_class')==action and parse_ts(item['timestamp'])>=cutoff:
                related.append(item)
        except Exception:
            continue
    prior_blocks=[x for x in related if x.get('decision') in {'block','refuse','deny'}]
    prior_sessions={x.get('session_id') for x in prior_blocks if x.get('session_id')}
    reasons=[]
    declared=str(event.get('declared_context','')).casefold()
    simulation=any(w in declared for w in ('simulation','test','lab','red team','pentest'))
    auth=event.get('authorization') or {}
    auth_type=auth.get('type') if isinstance(auth,dict) else None
    auth_valid=bool(auth.get('verified')) if isinstance(auth,dict) else False
    auth_allowed=auth_type in set(policy.get('accepted_authorization_types',[]))
    if high and simulation and policy.get('simulation_claim_requires_authorization',True) and not (auth_valid and auth_allowed): reasons.append('simulation_claim_without_verified_authorization')
    if high and prior_blocks and event['session_id'] not in prior_sessions: reasons.append('prior_block_exists_across_session_boundary')
    resets=max(0, len(prior_sessions - {event['session_id']}))
    if high and prior_blocks and resets >= int(policy.get('max_session_resets_after_block',1)): reasons.append('restart_bypass_threshold_reached')
    if event.get('requested_effect') in {'read_secret','write_outside_workspace','connect_external_target'} and high and not (auth_valid and auth_allowed): reasons.append('high_risk_effect_requires_verified_authorization')
    if reasons: return {'ok':False,'decision':'block','target_key':tkey,'reasons':sorted(set(reasons)),'related_prior_blocks':len(prior_blocks)}
    return {'ok':True,'decision':'allow','target_key':tkey,'reasons':[],'related_prior_blocks':len(prior_blocks)}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--event',required=True); ap.add_argument('--history',required=True); ap.add_argument('--policy',required=True); a=ap.parse_args()
    r=evaluate(load(a.event),load(a.history),load(a.policy)); print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r['ok'] else 3
if __name__=='__main__': raise SystemExit(main())
