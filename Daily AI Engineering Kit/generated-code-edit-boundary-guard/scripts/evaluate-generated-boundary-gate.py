#!/usr/bin/env python3
import argparse, json, sys

def load(p):
    with open(p,'r',encoding='utf-8') as f: return json.load(f)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--manifest',required=True); ap.add_argument('--diff-report',required=True)
    ap.add_argument('--review',required=True); ap.add_argument('--verification',required=True); ap.add_argument('--policy',required=True)
    a=ap.parse_args(); m,d,r,v,p=map(load,[a.manifest,a.diff_report,a.review,a.verification,a.policy])
    reasons=[]; approval_needed=False
    if d.get('status')!='clean': reasons.append('diff-report-not-clean')
    if not v.get('build_passed',False): reasons.append('build-not-passed')
    if not v.get('tests_passed',False): reasons.append('tests-not-passed')
    impl=m.get('implementation_owner')
    reviewer=r.get('reviewer_id')
    protected_changed=any(f.get('status') in ('regenerated-with-source','protected-exception','protected-direct-edit') for f in d.get('findings',[]))
    if protected_changed and p.get('require_independent_review_for_protected_changes',True):
        if not reviewer or reviewer==impl: reasons.append('reviewer-not-independent')
    if r.get('decision')=='blocked': reasons.append('review-blocked')
    if r.get('decision')=='human-approval-required': approval_needed=True
    for item in m.get('items',[]):
        ex=item.get('exception') or {}
        if ex and not ex.get('approved',False): approval_needed=True
    if reasons:
        status='blocked'; code=2
    elif approval_needed:
        status='human-approval-required'; code=3
    else:
        status='verified'; code=0
    out={'status':status,'reasons':reasons}
    print(json.dumps(out))
    return code

if __name__=='__main__': raise SystemExit(main())
