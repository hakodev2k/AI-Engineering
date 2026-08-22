#!/usr/bin/env python3
import argparse, hashlib, json, os, sys
from datetime import datetime, timezone

def load(path):
    with open(path,'r',encoding='utf-8') as f: return json.load(f)

def load_jsonl(path):
    if not os.path.exists(path): return []
    out=[]
    with open(path,'r',encoding='utf-8') as f:
        for line in f:
            line=line.strip()
            if line: out.append(json.loads(line))
    return out

def canon(v): return json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def fp(v): return hashlib.sha256(canon(v).encode()).hexdigest()
def iso(s): return datetime.fromisoformat(s.replace('Z','+00:00')).astimezone(timezone.utc)

def main():
    ap=argparse.ArgumentParser()
    for n in ['request','approval','intent','review','ledger','policy']: ap.add_argument('--'+n,required=True)
    ap.add_argument('--phase',choices=['pre-execution','post-use'],default='pre-execution')
    a=ap.parse_args(); r=load(a.request); approval=load(a.approval); intent=load(a.intent); review=load(a.review); p=load(a.policy); ledger=load_jsonl(a.ledger)
    reasons=[]; now=datetime.now(timezone.utc)
    if approval.get('request_id')!=r.get('request_id') or approval.get('revision')!=r.get('revision'): reasons.append('approval-request-binding-mismatch')
    if approval.get('action_fingerprint')!=r.get('action_fingerprint'): reasons.append('approval-fingerprint-mismatch')
    if approval.get('status')!='approved': reasons.append('not-approved')
    if approval.get('revoked',False): reasons.append('revoked')
    try:
        if now>=iso(approval.get('expires_at',r['expires_at'])): reasons.append('expired')
    except Exception: reasons.append('expiry-invalid')
    ib={k:intent.get(k) for k in ['request_id','revision','action_type','risk_category','target','environment','scope','payload_fingerprint','policy_version']}
    if fp(ib)!=r.get('action_fingerprint'): reasons.append('intent-fingerprint-mismatch')
    if review.get('reviewed_fingerprint')!=r.get('action_fingerprint') or review.get('verdict')!='approved-for-execution': reasons.append('review-invalid')
    if r.get('risk_category') in p.get('independent_approval_required_for',[]):
        if approval.get('approver_id') in [intent.get('executor_id'), review.get('reviewer_id')]: reasons.append('approver-not-independent')
        if review.get('reviewer_id')==intent.get('executor_id'): reasons.append('reviewer-not-independent')
    uses=sum(1 for x in ledger if x.get('request_id')==r.get('request_id') and x.get('revision')==r.get('revision') and x.get('action_fingerprint')==r.get('action_fingerprint'))
    if r.get('reuse_mode')=='single-use' and uses>0: reasons.append('single-use-consumed')
    if r.get('reuse_mode')=='bounded-reuse' and uses>=r.get('max_uses',1): reasons.append('reuse-limit-reached')
    if reasons:
        decision='human-approval-required' if any(x in reasons for x in ['expired','single-use-consumed','reuse-limit-reached','intent-fingerprint-mismatch','approval-fingerprint-mismatch']) else 'block'
        code=3 if decision=='human-approval-required' else 2
    else:
        decision='allow'; code=0
    print(json.dumps({'decision':decision,'phase':a.phase,'uses':uses,'reasons':reasons},indent=2)); return code

if __name__=='__main__': sys.exit(main())
