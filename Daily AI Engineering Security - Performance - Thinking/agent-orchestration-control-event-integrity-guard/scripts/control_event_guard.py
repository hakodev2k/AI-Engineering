#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

REQUIRED = ('event_id','kind','source_role','synthetic','causal_id','state')

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        raise ValueError(f'cannot load {path}: {exc}')

def validate_event(event, policy, known_causal=None, prior_state=None):
    findings=[]
    for key in REQUIRED:
        if key not in event:
            findings.append({'reason':'missing_field','field':key})
    if findings:
        return findings
    if event['kind'] not in policy.get('allowed_event_kinds',[]):
        findings.append({'reason':'unknown_event_kind','kind':event['kind']})
    if event['source_role'] not in policy.get('control_event_roles',[]):
        findings.append({'reason':'invalid_source_role','source_role':event['source_role']})
    if policy.get('require_causal_id', True) and not str(event.get('causal_id','')).strip():
        findings.append({'reason':'missing_causal_id'})
    if known_causal is not None and event.get('causal_id') not in known_causal:
        findings.append({'reason':'unknown_causal_target','causal_id':event.get('causal_id')})
    if event.get('synthetic') is True and event.get('source_role') == 'user' and policy.get('forbid_synthetic_user_role',True):
        findings.append({'reason':'synthetic_user_turn_forbidden'})
    if event.get('kind') == 'subagent_completed' and policy.get('require_result_ref_on_completion',True) and not event.get('result_ref'):
        findings.append({'reason':'completion_missing_result_ref'})
    allowed = policy.get('routing_classes',{}).get(event.get('kind'))
    route = event.get('routing_class')
    if route is not None and allowed is not None and route not in allowed:
        findings.append({'reason':'wrong_routing_class','routing_class':route,'allowed':allowed})
    terminals=set(policy.get('terminal_states',[]))
    if prior_state in terminals and event.get('state') not in terminals:
        findings.append({'reason':'terminal_state_regression','prior_state':prior_state,'state':event.get('state')})
    return findings

def main():
    p=argparse.ArgumentParser(description='Validate agent orchestration control-event integrity.')
    p.add_argument('event'); p.add_argument('--policy',required=True)
    p.add_argument('--known-causal',help='JSON array of valid causal IDs')
    p.add_argument('--prior-state')
    a=p.parse_args()
    try:
        event=load(a.event); policy=load(a.policy)
        known=set(load(a.known_causal)) if a.known_causal else None
        findings=validate_event(event,policy,known,a.prior_state)
        out={'status':'blocked' if findings else 'pass','findings':findings}
        print(json.dumps(out,indent=2,sort_keys=True))
        return 2 if findings else 0
    except Exception as exc:
        print(json.dumps({'status':'error','error':str(exc)})); return 3

if __name__=='__main__': sys.exit(main())
