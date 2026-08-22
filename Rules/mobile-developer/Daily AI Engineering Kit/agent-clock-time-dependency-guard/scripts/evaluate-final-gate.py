#!/usr/bin/env python3
import argparse,json,sys,hashlib
p=argparse.ArgumentParser();p.add_argument('decision');p.add_argument('evaluation');p.add_argument('--review');p.add_argument('--policy',required=True);a=p.parse_args()
try:
 d=json.load(open(a.decision,encoding='utf-8'));e=json.load(open(a.evaluation,encoding='utf-8'));policy=json.load(open(a.policy,encoding='utf-8'))
 reasons=[]
 if e.get('status')!='evaluated': reasons.append('decision-not-freshly-evaluated')
 if e.get('decision_id')!=d.get('decision_id') or e.get('observation_id')!=d.get('time_observation',{}).get('observation_id'): reasons.append('decision-binding-mismatch')
 risk=d['risk'];review=None
 canonical=json.dumps(d,sort_keys=True,separators=(',',':')).encode();fp=hashlib.sha256(canonical).hexdigest()
 if risk in policy.get('require_independent_review_for',[]):
  if not a.review: reasons.append('missing-independent-review')
  else:
   review=json.load(open(a.review,encoding='utf-8'))
   if review.get('decision_fingerprint')!=fp: reasons.append('stale-review')
   if review.get('reviewer_id')==d.get('executor_id'): reasons.append('self-review-not-independent')
   if review.get('status')!='approved': reasons.append('review-not-approved')
 if d.get('approval_required') and not (review and review.get('human_approval_confirmed') is True): reasons.append('human-approval-required')
 status='verified' if not reasons else ('review-required' if reasons==['missing-independent-review'] else 'blocked')
 print(json.dumps({'status':status,'decision_fingerprint':fp,'reasons':reasons},indent=2));sys.exit(0 if status=='verified' else 4)
except Exception as ex:
 print(json.dumps({'status':'blocked','reasons':['gate-error'],'error':str(ex)}));sys.exit(2)
