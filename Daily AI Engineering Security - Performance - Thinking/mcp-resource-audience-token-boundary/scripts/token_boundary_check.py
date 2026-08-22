#!/usr/bin/env python3
"""Validate non-secret token metadata and MCP/upstream credential separation.
Exit 0 allow, 2 invalid input, 3 deny.
"""
import argparse, json, sys
from pathlib import Path


def load(path):
    try:
        value=json.loads(Path(path).read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc:
        raise ValueError(str(exc)) from exc
    if not isinstance(value,dict): raise ValueError('input must be a JSON object')
    return value


def main():
    p=argparse.ArgumentParser(); p.add_argument('record'); p.add_argument('--policy',required=True); a=p.parse_args()
    try:
        r=load(a.record); policy=load(a.policy)
        for k in ('issuer','audience','scopes','token_fingerprint','upstream_token_fingerprint'):
            if k not in r: raise ValueError(f'missing {k}')
        if not isinstance(r['scopes'],list) or not all(isinstance(x,str) for x in r['scopes']): raise ValueError('scopes must be string array')
        if not isinstance(policy.get('required_scopes',[]),list): raise ValueError('required_scopes must be array')
        failures=[]
        if r['issuer'] != policy.get('expected_issuer'): failures.append('issuer_mismatch')
        allowed=set(policy.get('expected_audiences',[]))
        audiences=set(r['audience'] if isinstance(r['audience'],list) else [r['audience']])
        if not allowed.intersection(audiences): failures.append('audience_or_resource_mismatch')
        if not set(policy.get('required_scopes',[])).issubset(set(r['scopes'])): failures.append('missing_required_scope')
        if r.get('expired') is True: failures.append('expired_token')
        if r['token_fingerprint'] == r['upstream_token_fingerprint']: failures.append('inbound_token_passthrough')
        out={'decision':'deny' if failures else 'allow','failures':failures,'token_fingerprint':r['token_fingerprint']}
        print(json.dumps(out,indent=2))
        return 3 if failures else 0
    except ValueError as exc:
        print(json.dumps({'decision':'invalid','error':str(exc)}),file=sys.stderr); return 2

if __name__=='__main__': raise SystemExit(main())
