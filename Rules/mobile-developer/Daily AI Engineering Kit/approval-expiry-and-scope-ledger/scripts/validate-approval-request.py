#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone

def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def iso(s):
    return datetime.fromisoformat(s.replace('Z', '+00:00')).astimezone(timezone.utc)

def canon(v):
    return json.dumps(v, sort_keys=True, separators=(',', ':'), ensure_ascii=False)

def fp(v):
    return hashlib.sha256(canon(v).encode()).hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--request',required=True); ap.add_argument('--policy',required=True); a=ap.parse_args()
    r,p=load(a.request),load(a.policy); errs=[]
    req=['request_id','revision','action_type','risk_category','target','environment','scope','payload_fingerprint','action_fingerprint','policy_version','reuse_mode','requested_at','expires_at','required_approver_role']
    for k in req:
        if k not in r: errs.append(f'missing:{k}')
    if errs:
        print(json.dumps({'status':'invalid','errors':errs},indent=2)); return 2
    if r['policy_version'] != p['policy_version']: errs.append('policy-version-mismatch')
    if not isinstance(r['scope'],list) or not r['scope']: errs.append('scope-empty')
    payload=r.get('payload')
    if fp(payload)!=r['payload_fingerprint']: errs.append('payload-fingerprint-mismatch')
    action_basis={k:r[k] for k in ['request_id','revision','action_type','risk_category','target','environment','scope','payload_fingerprint','policy_version']}
    if fp(action_basis)!=r['action_fingerprint']: errs.append('action-fingerprint-mismatch')
    try:
        ttl=(iso(r['expires_at'])-iso(r['requested_at'])).total_seconds()/60
        if ttl<=0 or ttl>p['max_ttl_minutes']: errs.append('ttl-invalid')
    except Exception: errs.append('timestamp-invalid')
    if r['reuse_mode']=='bounded-reuse':
        if r['risk_category'] not in p['allowed_reusable_categories']: errs.append('reuse-category-not-allowed')
        if not isinstance(r.get('max_uses'),int) or r['max_uses']<1 or r['max_uses']>p['max_reusable_uses']: errs.append('max-uses-invalid')
    print(json.dumps({'status':'valid' if not errs else 'invalid','errors':errs},indent=2)); return 0 if not errs else 2

if __name__=='__main__': sys.exit(main())
