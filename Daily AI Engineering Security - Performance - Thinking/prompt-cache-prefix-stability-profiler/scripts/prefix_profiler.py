#!/usr/bin/env python3
"""Canonicalize and compare cache-intended prompt prefixes. Standard library only."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any

def load(path: Path) -> Any:
    try: return json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f'cannot read {path}: {exc}') from exc

def scrub(v: Any, strip: set[str]) -> Any:
    if isinstance(v,dict): return {k:scrub(v[k],strip) for k in sorted(v) if k not in strip}
    if isinstance(v,list): return [scrub(x,strip) for x in v]
    return v

def normalize_tools(v: Any, sort_by: str, strip:set[str]) -> Any:
    x=scrub(v,strip)
    if isinstance(x,list) and all(isinstance(i,dict) for i in x):
        return sorted(x,key=lambda i:str(i.get(sort_by,'')))
    return x

def digest(v: Any) -> str:
    raw=json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf-8')
    return hashlib.sha256(raw).hexdigest()

def snapshot(req:dict[str,Any], cfg:dict[str,Any])->dict[str,str]:
    strip=set(cfg.get('strip_fields',[])); order=cfg.get('sort_tool_definitions_by','name'); out={}
    for seg in cfg.get('stable_segments',['tools','system','static_context']):
        value=req.get(seg)
        if seg=='tools': value=normalize_tools(value,order,strip)
        else: value=scrub(value,strip)
        out[seg]=digest(value)
    out['combined_prefix']=digest([out[s] for s in cfg.get('stable_segments',['tools','system','static_context'])])
    return out

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument('before',type=Path); ap.add_argument('after',type=Path); ap.add_argument('--config',required=True,type=Path); a=ap.parse_args()
    try:
        b,aft,cfg=load(a.before),load(a.after),load(a.config)
        if not all(isinstance(x,dict) for x in (b,aft,cfg)): raise ValueError('inputs and config must be JSON objects')
        bs,as_=snapshot(b,cfg),snapshot(aft,cfg); stable=cfg.get('stable_segments',['tools','system','static_context']); first=None
        changes={s:(bs[s]!=as_[s]) for s in stable}
        for s in stable:
            if changes[s]: first=s; break
        out={'same_prefix':bs['combined_prefix']==as_['combined_prefix'],'first_divergent_segment':first,'segment_changed':changes,'before_fingerprints':{k:v[:16] for k,v in bs.items()},'after_fingerprints':{k:v[:16] for k,v in as_.items()}}
        print(json.dumps(out,indent=2)); return 3 if first else 0
    except (ValueError,TypeError) as exc:
        print(json.dumps({'error':str(exc)}),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
