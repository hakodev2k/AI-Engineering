#!/usr/bin/env python3
"""Deterministic MCP OAuth boundary checker. Uses decoded synthetic claims; never decodes/verifies JWT signatures."""
from __future__ import annotations
import argparse, hashlib, json, sys, time
from pathlib import Path
from typing import Any

def load(path: Path) -> dict[str, Any]:
    try: obj=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f'cannot read {path}: {exc}') from exc
    if not isinstance(obj,dict): raise ValueError(f'{path} must contain a JSON object')
    return obj

def fp(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()[:16]

def aud_values(v: Any) -> set[str]:
    if isinstance(v,str): return {v}
    if isinstance(v,list) and all(isinstance(x,str) for x in v): return set(v)
    return set()

def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument('request',type=Path); ap.add_argument('--policy',required=True,type=Path); a=ap.parse_args()
    try:
        r,p=load(a.request),load(a.policy)
        claims=r.get('claims'); tool=r.get('tool'); inbound=r.get('inbound_bearer',''); outbound=r.get('outbound_bearer',''); prov=r.get('outbound_provenance')
        if not isinstance(claims,dict) or not isinstance(tool,str): raise ValueError('claims object and tool string required')
        violations=[]; now=int(time.time()); skew=int(p.get('clock_skew_seconds',60))
        if claims.get('iss') not in p.get('allowed_issuers',[]): violations.append('issuer_not_allowed')
        if p.get('canonical_resource') not in aud_values(claims.get('aud')): violations.append('wrong_or_missing_audience')
        exp=claims.get('exp')
        if p.get('require_expiry',True) and not isinstance(exp,(int,float)): violations.append('missing_expiry')
        elif isinstance(exp,(int,float)) and exp + skew < now: violations.append('expired')
        scopes=set(str(claims.get('scope','')).split()); required=set(p.get('required_scopes_by_tool',{}).get(tool,[]))
        if not required.issubset(scopes): violations.append('missing_required_scope')
        if outbound:
            if p.get('require_outbound_credential_provenance',True) and prov not in p.get('allowed_outbound_provenance',[]): violations.append('unapproved_outbound_provenance')
            if p.get('block_identical_inbound_outbound_bearer',True) and inbound and outbound == inbound: violations.append('token_passthrough')
        out={'decision':'deny' if violations else 'allow','violations':violations,'tool':tool,'inbound_fingerprint':fp(inbound) if inbound else None,'outbound_fingerprint':fp(outbound) if outbound else None,'outbound_provenance':prov}
        print(json.dumps(out,indent=2)); return 5 if violations else 0
    except (ValueError,TypeError) as exc:
        print(json.dumps({'decision':'invalid','error':str(exc)}),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
