#!/usr/bin/env python3
import argparse,json,hashlib
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding='utf-8'))
def fp(o): return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--lease',required=True); ap.add_argument('--action',required=True); ap.add_argument('--review'); ap.add_argument('--revocation-evidence'); a=ap.parse_args(); l,x=load(a.lease),load(a.action); reasons=[]
    high=x.get('risk_category') in {'production-write','secret-management','infrastructure-change','destructive-data','security-control-change','breaking-contract'}
    if high:
        if not a.review: reasons.append('independent-review-required')
        else:
            r=load(a.review)
            if r.get('reviewer_id')==x.get('actor_id'): reasons.append('reviewer-not-independent')
            if r.get('decision')!='approved': reasons.append('review-not-approved')
            if r.get('action_fingerprint')!=x.get('action_fingerprint'): reasons.append('stale-review-binding')
    if l.get('status') in {'revoked','expired','consumed'}:
        if not a.revocation_evidence: reasons.append('revocation-evidence-required')
        else:
            e=load(a.revocation_evidence)
            if e.get('lease_id')!=l.get('lease_id') or e.get('verified') is not True: reasons.append('invalid-revocation-evidence')
    print(json.dumps({'decision':'verified' if not reasons else 'blocked','reasons':reasons,'lease_fingerprint':fp(l),'action_fingerprint':x.get('action_fingerprint')},sort_keys=True)); raise SystemExit(0 if not reasons else 2)
if __name__=='__main__': main()
