#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f'{path}: {exc}') from exc

def main():
    ap=argparse.ArgumentParser(description='Validate an interrupted-agent resume contract.')
    ap.add_argument('--policy', required=True); ap.add_argument('--checkpoint', required=True)
    args=ap.parse_args()
    try:
        policy=load_json(args.policy); cp=load_json(args.checkpoint)
    except ValueError as exc:
        print(json.dumps({'decision':'BLOCK','reasons':[str(exc)]})); return 2
    reasons=[]
    required=['task_id','state','last_verified_phase','resume_attempts']
    for key in required:
        if key not in cp: reasons.append(f'missing:{key}')
    if policy.get('require_input_fingerprint',True) and not cp.get('input_fingerprint'):
        reasons.append('missing:input_fingerprint')
    if cp.get('state') not in policy.get('allowed_checkpoint_states',[]):
        reasons.append('state_not_recoverable')
    if not isinstance(cp.get('resume_attempts'),int) or cp.get('resume_attempts',10**9) >= int(policy.get('max_resume_attempts',2)):
        reasons.append('resume_budget_exhausted')
    ledger=cp.get('side_effect_ledger')
    if policy.get('require_side_effect_ledger',True) and not isinstance(ledger,list):
        reasons.append('missing_or_invalid:side_effect_ledger')
        ledger=[]
    allowed_outcomes={'confirmed_success','confirmed_failure','unknown'}
    for i,e in enumerate(ledger):
        if not isinstance(e,dict) or not e.get('operation_id') or e.get('outcome') not in allowed_outcomes:
            reasons.append(f'invalid_effect:{i}'); continue
        if policy.get('blocking_unknown_effect_outcome',True) and e.get('outcome')=='unknown' and not e.get('idempotent',False):
            reasons.append(f'unknown_non_idempotent_effect:{e.get("operation_id")}')
    if policy.get('require_verifier',True) and not cp.get('verifier_required',False):
        reasons.append('verifier_not_required_by_checkpoint')
    decision='BLOCK' if reasons else 'ALLOW'
    digest=hashlib.sha256(json.dumps(cp,sort_keys=True,separators=(',',':')).encode()).hexdigest()
    print(json.dumps({'decision':decision,'reasons':reasons,'checkpoint_sha256':digest},indent=2))
    return 2 if reasons else 0

if __name__=='__main__': sys.exit(main())
