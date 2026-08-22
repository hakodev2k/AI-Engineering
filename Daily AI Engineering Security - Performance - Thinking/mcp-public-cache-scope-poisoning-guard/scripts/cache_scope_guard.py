#!/usr/bin/env python3
"""Deterministic MCP cache-scope admission guard.
Exit: 0 allow, 2 invalid, 4 downgrade, 5 deny.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any
ALLOW, INVALID, DOWNGRADE, DENY = 0, 2, 4, 5

def load(path: Path) -> dict[str, Any]:
    try:
        value=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc:
        raise ValueError(f'cannot read {path}: {exc}') from exc
    if not isinstance(value,dict): raise ValueError(f'{path} must contain a JSON object')
    return value

def fp(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()[:20]

def decide(r: dict[str,Any], p: dict[str,Any]) -> tuple[dict[str,Any],int]:
    required=['server_id','method','protocol_version','declared_scope','ttl_ms','content_sha256','auth_context_fingerprint']
    missing=[k for k in required if k not in r]
    if missing: raise ValueError('missing fields: '+','.join(missing))
    if r['declared_scope'] not in {'public','private'}: raise ValueError('declared_scope must be public|private')
    if not isinstance(r['ttl_ms'],int) or r['ttl_ms'] < 0: raise ValueError('ttl_ms must be non-negative integer')
    for k in ['server_id','method','protocol_version','content_sha256','auth_context_fingerprint']:
        if not isinstance(r[k],str) or not r[k]: raise ValueError(f'{k} must be non-empty string')
    trusted=p.get('trusted_public',{})
    allowed_methods=set(trusted.get(r['server_id'],[])) if isinstance(trusted,dict) else set()
    public_ok=r['declared_scope']=='public' and r['method'] in allowed_methods and r.get('server_identity_verified') is True
    if r.get('stored_content_sha256') and r['stored_content_sha256'] != r['content_sha256']:
        return {'decision':'deny','reason':'content_digest_mismatch'}, DENY
    if r.get('stored_server_id') and r['stored_server_id'] != r['server_id']:
        return {'decision':'deny','reason':'server_identity_mismatch'}, DENY
    if r.get('cache_event')=='read' and r.get('stored_effective_scope')=='private':
        if r.get('stored_auth_context_fingerprint') != r['auth_context_fingerprint']:
            return {'decision':'deny','reason':'private_context_mismatch'}, DENY
    if r['declared_scope']=='public' and not public_ok:
        fallback=p.get('untrusted_public_fallback','private')
        if fallback not in {'private','no-store'}: raise ValueError('invalid untrusted_public_fallback')
        return {'decision':'downgrade','reason':'public_claim_not_locally_trusted','effective_scope':fallback,'partition':fp(r['auth_context_fingerprint']) if fallback=='private' else None}, DOWNGRADE
    effective='public' if public_ok else 'private'
    partition='shared' if effective=='public' else fp(r['auth_context_fingerprint'])
    key='|'.join([r['server_id'],r['method'],r['protocol_version'],effective,partition])
    return {'decision':'allow','reason':'policy_satisfied','effective_scope':effective,'partition':partition,'cache_key_sha256':hashlib.sha256(key.encode()).hexdigest()}, ALLOW

def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument('record',type=Path); ap.add_argument('--policy',required=True,type=Path); a=ap.parse_args()
    try: out,code=decide(load(a.record),load(a.policy))
    except (ValueError,TypeError) as exc:
        print(json.dumps({'decision':'invalid','error':str(exc)}),file=sys.stderr); return INVALID
    print(json.dumps(out,indent=2)); return code
if __name__=='__main__': raise SystemExit(main())
