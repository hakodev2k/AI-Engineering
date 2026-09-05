#!/usr/bin/env python3
"""Fail-closed exact-scope gate for destructive actions."""
import hashlib, json, sys, time
from pathlib import Path


def load(path):
    try:
        obj=json.loads(Path(path).read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as e:
        raise ValueError(f'{path}: {e}')
    if not isinstance(obj,dict): raise ValueError(f'{path}: expected object')
    return obj


def canon_targets(v):
    if not isinstance(v,list) or not all(isinstance(x,str) and x.strip() for x in v):
        raise ValueError('targets must be non-empty strings')
    return sorted(set(x.strip() for x in v))


def validate(policy, approval, plan, now=None):
    errors=[]; now=int(time.time() if now is None else now)
    op=plan.get('operation'); approved_op=approval.get('operation')
    destructive=set(policy.get('destructive_operations',[]))
    if op not in destructive: errors.append(f'operation {op!r} is not declared destructive/known')
    if op != approved_op: errors.append('operation differs from approval')
    try:
        planned=canon_targets(plan.get('targets',[])); allowed=canon_targets(approval.get('targets',[]))
    except ValueError as e:
        return [str(e)]
    extra=sorted(set(planned)-set(allowed))
    if extra: errors.append('unapproved targets: '+', '.join(extra))
    exp=approval.get('expires_at')
    if not isinstance(exp,int) or exp < now: errors.append('approval expired or invalid')
    if not isinstance(approval.get('nonce'),str) or len(approval['nonce'])<8: errors.append('missing/weak nonce')
    human_required=set(policy.get('human_required',[]))
    if op in human_required and approval.get('approved_by_type')!='human': errors.append('explicit human approval required')
    af=approval.get('target_fingerprints',{}); pf=plan.get('target_fingerprints',{})
    if not isinstance(af,dict) or not isinstance(pf,dict): errors.append('fingerprints must be objects')
    else:
        for t in planned:
            if not af.get(t) or af.get(t)!=pf.get(t): errors.append(f'stale/missing fingerprint: {t}')
    return errors


def main(argv):
    if len(argv)!=4:
        print(f'usage: {argv[0]} <policy.json> <approval.json> <planned-action.json>',file=sys.stderr); return 1
    try: p,a,x=map(load,argv[1:])
    except ValueError as e: print('ERROR:',e,file=sys.stderr); return 1
    errs=validate(p,a,x)
    if errs:
        print('BLOCK'); [print('- '+e) for e in errs]; return 2
    digest=hashlib.sha256(json.dumps(x,sort_keys=True).encode()).hexdigest()[:16]
    print(f'PASS action_digest={digest}'); return 0

if __name__=='__main__': sys.exit(main(sys.argv))
