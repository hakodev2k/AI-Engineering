#!/usr/bin/env python3
import argparse, hashlib, json, sys

def load(p):
    with open(p,'r',encoding='utf-8') as f: return json.load(f)

def attempt_fp(d):
    keys=['version','attempt_id','task_id','action_name','risk','target_system','target_resource','idempotency_key','request_fingerprint','dangerous_action','approval_fingerprint']
    b=json.dumps({k:d.get(k) for k in keys},sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
    return hashlib.sha256(b).hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('attempt'); ap.add_argument('reconciliation'); ap.add_argument('--policy',required=True); ap.add_argument('--review'); ap.add_argument('--approval'); ap.add_argument('--output'); a=ap.parse_args()
    try:
        attempt=load(a.attempt); rec=load(a.reconciliation); policy=load(a.policy); reasons=[]
        if rec.get('status')!='resolved': reasons.append('reconciliation is not resolved')
        if rec.get('decision') not in ['accept-success','accept-failure']: reasons.append('final decision is not terminal')
        high=attempt.get('risk') in policy.get('high_risk_levels',['high','critical'])
        fp=attempt_fp(attempt)
        if high and policy.get('require_independent_verifier_for_high_risk',True):
            if not a.review: reasons.append('high-risk action requires independent review')
            else:
                review=load(a.review)
                if review.get('attempt_id')!=attempt.get('attempt_id') or review.get('attempt_fingerprint')!=fp: reasons.append('review does not bind exact attempt')
                if review.get('status')!='approved' or review.get('decision')!=rec.get('decision'): reasons.append('review does not approve resolved decision')
        if attempt.get('dangerous_action') and policy.get('dangerous_actions_require_human_approval',True):
            if not a.approval: reasons.append('dangerous action requires human approval evidence')
            else:
                approval=load(a.approval)
                if approval.get('approved') is not True or approval.get('attempt_fingerprint')!=fp: reasons.append('approval missing, denied, or stale')
        status='verified' if not reasons else 'blocked'
        out={'status':status,'attempt_fingerprint':fp,'decision':rec.get('decision'),'reasons':reasons}
        text=json.dumps(out,indent=2)
        if a.output: open(a.output,'w',encoding='utf-8').write(text+'\n')
        else: print(text)
        return 0 if status=='verified' else 2
    except Exception as e:
        print(json.dumps({'error':str(e)}),file=sys.stderr); return 1
if __name__=='__main__': raise SystemExit(main())
