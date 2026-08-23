#!/usr/bin/env python3
"""Profile prompt-cache continuity using safe segment hashes and usage metadata.
Profile JSON fields: segments:[{name,sha256}], usage:{input_tokens,cached_tokens,cache_write_tokens}, latency_ms, quality_score, critical_context_ok, cache_key(optional), model(optional).
Exit 0 pass, 2 invalid, 3 regression with --strict.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any


def load(path:Path)->dict[str,Any]:
    try: obj=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f'cannot read {path}: {exc}') from exc
    if not isinstance(obj,dict): raise ValueError('profile/policy must be object')
    return obj

def validate_profile(p:dict[str,Any])->None:
    seg=p.get('segments'); usage=p.get('usage')
    if not isinstance(seg,list) or not seg: raise ValueError('segments must be non-empty list')
    for s in seg:
        if not isinstance(s,dict) or not isinstance(s.get('name'),str) or not isinstance(s.get('sha256'),str) or len(s['sha256'])<16: raise ValueError('each segment needs name and hash')
    if not isinstance(usage,dict): raise ValueError('usage required')
    for k in ('input_tokens','cached_tokens','cache_write_tokens'):
        v=usage.get(k,0)
        if not isinstance(v,int) or v<0: raise ValueError(f'usage.{k} must be non-negative int')
    if usage.get('cached_tokens',0)>usage.get('input_tokens',0): raise ValueError('cached_tokens cannot exceed input_tokens')
    if not isinstance(p.get('latency_ms'),(int,float)) or p['latency_ms']<0: raise ValueError('latency_ms required')
    if not isinstance(p.get('quality_score'),(int,float)): raise ValueError('quality_score required')
    if not isinstance(p.get('critical_context_ok'),bool): raise ValueError('critical_context_ok required')

def metric(p:dict[str,Any])->dict[str,float]:
    u=p['usage']; inp=max(u.get('input_tokens',0),1); cached=u.get('cached_tokens',0)
    return {'cached_input_ratio':cached/inp,'uncached_input_tokens':u.get('input_tokens',0)-cached,'cache_write_tokens':u.get('cache_write_tokens',0),'latency_ms':float(p['latency_ms']),'quality_score':float(p['quality_score'])}

def divergence(a:dict[str,Any],b:dict[str,Any])->dict[str,Any]:
    sa,sb=a['segments'],b['segments']; n=min(len(sa),len(sb))
    for i in range(n):
        if sa[i]['name']!=sb[i]['name'] or sa[i]['sha256']!=sb[i]['sha256']:
            return {'index':i,'previous':sa[i]['name'],'current':sb[i]['name']}
    if len(sa)!=len(sb): return {'index':n,'previous':sa[n]['name'] if n<len(sa) else None,'current':sb[n]['name'] if n<len(sb) else None}
    return {'index':None,'previous':None,'current':None}

def analyze(cur:dict[str,Any], prev:dict[str,Any]|None, policy:dict[str,Any])->dict[str,Any]:
    validate_profile(cur); cm=metric(cur); reasons=[]; div=None
    mincache=float(policy.get('min_cached_input_ratio',0)); maxunc=float(policy.get('max_uncached_input_regression_ratio',1)); maxlat=float(policy.get('max_latency_regression_ratio',1)); maxq=float(policy.get('max_quality_regression_ratio',0)); requirectx=bool(policy.get('require_critical_context_retention',True))
    if cm['cached_input_ratio']<mincache: reasons.append('cached_input_ratio_below_threshold')
    if requirectx and not cur['critical_context_ok']: reasons.append('critical_context_lost')
    if prev is not None:
        validate_profile(prev); pm=metric(prev); div=divergence(prev,cur)
        if cm['uncached_input_tokens'] > pm['uncached_input_tokens']*(1+maxunc): reasons.append('uncached_input_regression')
        if cm['latency_ms'] > pm['latency_ms']*(1+maxlat): reasons.append('latency_regression')
        if cm['quality_score'] < pm['quality_score']*(1-maxq): reasons.append('quality_regression')
    return {'decision':'regression' if reasons else 'pass','reasons':reasons,'metrics':cm,'earliest_divergence':div,'cache_key_changed':None if prev is None else prev.get('cache_key')!=cur.get('cache_key'),'model_changed':None if prev is None else prev.get('model')!=cur.get('model')}

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument('current',type=Path); ap.add_argument('--previous',type=Path); ap.add_argument('--policy',required=True,type=Path); ap.add_argument('--strict',action='store_true'); a=ap.parse_args()
    try: result=analyze(load(a.current),load(a.previous) if a.previous else None,load(a.policy))
    except (ValueError,TypeError) as exc: print(json.dumps({'decision':'invalid','error':str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2)); return 3 if a.strict and result['decision']!='pass' else 0
if __name__=='__main__': raise SystemExit(main())
