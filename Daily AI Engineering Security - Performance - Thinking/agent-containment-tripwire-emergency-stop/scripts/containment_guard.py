#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as e:
        raise ValueError(f'cannot read {path}: {e}')

def preflight(policy, att):
    missing=[k for k in policy.get('required_attestations',[]) if att.get(k) is not True]
    if missing:
        return 2, {'decision':'block','reason':'missing_attestations','missing':missing}
    if policy.get('fail_closed') is not True:
        return 2, {'decision':'block','reason':'policy_not_fail_closed'}
    return 0, {'decision':'allow','reason':'preflight_ok'}

def event(policy, ev):
    et=ev.get('type')
    if not isinstance(et,str):
        return 3, {'decision':'block','reason':'invalid_event'}
    if et in set(policy.get('forbidden_event_types',[])):
        return 2, {'decision':'stop','reason':'tripwire','event_type':et}
    host=ev.get('network_host')
    if host is not None and host not in set(policy.get('allowed_network_hosts',[])):
        return 2, {'decision':'stop','reason':'unauthorized_network_host','network_host':host}
    return 0, {'decision':'allow','reason':'event_allowed'}

def main():
    p=argparse.ArgumentParser()
    sub=p.add_subparsers(dest='cmd',required=True)
    for name in ('preflight','event'):
        s=sub.add_parser(name); s.add_argument('--policy',required=True)
        s.add_argument('--attestation' if name=='preflight' else '--event',required=True)
    a=p.parse_args()
    try:
        policy=load(a.policy)
        code,out=preflight(policy,load(a.attestation)) if a.cmd=='preflight' else event(policy,load(a.event))
    except ValueError as e:
        code,out=3,{'decision':'block','reason':'input_error','error':str(e)}
    print(json.dumps(out,sort_keys=True))
    sys.exit(code)
if __name__=='__main__': main()
