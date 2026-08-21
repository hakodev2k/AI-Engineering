#!/usr/bin/env python3
"""Fail-closed MCP authorization metadata guard. Never accepts raw bearer tokens."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

INVALID, DENY = 2, 5

def load(path:Path):
    try:v=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc:raise ValueError(f'cannot read {path}: {exc}') from exc
    if not isinstance(v,dict):raise ValueError(f'{path} must contain an object')
    return v

def strings(v,name):
    if not isinstance(v,list) or not all(isinstance(x,str) and x for x in v):raise ValueError(f'{name} must be non-empty strings')
    return set(v)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('input',type=Path);ap.add_argument('--policy',type=Path,required=True);a=ap.parse_args()
    try:
        d,p=load(a.input),load(a.policy)
        forbidden=set(p.get('forbidden_secret_fields',[])); present=sorted(k for k in d if k.lower() in forbidden)
        if present:
            out={'decision':'deny','reasons':['raw secret fields are forbidden'],'forbidden_fields':present};print(json.dumps(out,indent=2));return DENY
        issuer=d.get('issuer'); audiences=d.get('audiences'); active=d.get('active'); scopes=d.get('scopes',[]); operation=d.get('operation'); passthrough=d.get('passthrough_requested',False); downstream=d.get('downstream_target')
        if not isinstance(operation,str) or not operation:raise ValueError('operation must be non-empty string')
        if not isinstance(passthrough,bool):raise ValueError('passthrough_requested must be boolean')
        aud=set() if audiences is None else strings(audiences,'audiences'); sc=strings(scopes,'scopes') if scopes else set()
        reasons=[]
        expected=p.get('expected_resource')
        if p.get('require_issuer',True):
            if not isinstance(issuer,str) or not issuer: reasons.append('issuer missing')
            elif issuer not in set(p.get('allowed_issuers',[])): reasons.append('issuer not allowed')
        if p.get('require_audience',True):
            if not expected: raise ValueError('policy expected_resource is required')
            if expected not in aud: reasons.append('expected MCP resource not present in audience')
        if p.get('require_active',True) and active is not True: reasons.append('token active state is not explicitly true')
        scope_map=p.get('required_scopes_by_operation',{})
        if not isinstance(scope_map,dict): raise ValueError('required_scopes_by_operation must be object')
        if operation not in scope_map:
            reasons.append('operation is not explicitly configured')
            required=set()
        else:
            required=set(scope_map[operation])
        missing=sorted(required-sc)
        if missing:reasons.append('required scopes missing')
        if p.get('forbid_token_passthrough',True) and passthrough:reasons.append('inbound token passthrough is forbidden')
        if downstream is not None and not isinstance(downstream,str):raise ValueError('downstream_target must be string when supplied')
        out={'decision':'deny' if reasons else 'allow','operation':operation,'issuer':issuer,'audiences':sorted(aud),'expected_resource':expected,'missing_scopes':missing,'downstream_target':downstream,'reasons':reasons}
        print(json.dumps(out,indent=2,sort_keys=True));return DENY if reasons else 0
    except (ValueError,TypeError) as exc:
        print(json.dumps({'decision':'invalid','error':str(exc)}),file=sys.stderr);return INVALID
if __name__=='__main__':raise SystemExit(main())
