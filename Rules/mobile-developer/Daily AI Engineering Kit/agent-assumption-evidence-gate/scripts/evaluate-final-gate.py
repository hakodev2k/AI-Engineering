#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding='utf-8'))
def fp(o): return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('report'); ap.add_argument('assumptions'); ap.add_argument('policy'); ap.add_argument('--review'); ap.add_argument('--actor',required=True); ap.add_argument('--output'); a=ap.parse_args()
    report,items,policy=load(a.report),load(a.assumptions),load(a.policy)
    blockers=[]
    if report.get('assumption_fingerprint')!=fp(items): blockers.append('report is stale: assumption fingerprint mismatch')
    if report.get('policy_fingerprint')!=fp(policy): blockers.append('report is stale: policy fingerprint mismatch')
    if report.get('status')=='blocked': blockers.extend(report.get('blocking',[]))
    review=None
    if a.review:
        review=load(a.review)
        if review.get('assumption_fingerprint')!=fp(items): blockers.append('review is stale: assumption fingerprint mismatch')
        if review.get('policy_fingerprint')!=fp(policy): blockers.append('review is stale: policy fingerprint mismatch')
        high=[x for x in items if x.get('materiality') in set(policy.get('high_risk_levels',['high','critical'])) and x.get('used_by')]
        if high and policy.get('require_independent_review_for_high_risk',True) and review.get('reviewer')==a.actor: blockers.append('high-risk review must be independent from actor')
        if review.get('decision')!='approve': blockers.append('review did not approve')
    elif report.get('status')=='review-required': blockers.append('review required but not provided')
    high_used=[x for x in items if x.get('materiality') in set(policy.get('high_risk_levels',['high','critical'])) and x.get('used_by')]
    if high_used and policy.get('require_independent_review_for_high_risk',True) and not review: blockers.append('high-risk used assumptions require independent review')
    status='verified' if not blockers else 'blocked'
    result={'status':status,'blocking':sorted(set(blockers)),'assumption_fingerprint':fp(items),'policy_fingerprint':fp(policy)}
    text=json.dumps(result,indent=2)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    else: print(text)
    return 0 if status=='verified' else 3
if __name__=='__main__': sys.exit(main())