#!/usr/bin/env python3
import argparse,json,sys

def load(p):
    with open(p,encoding='utf-8') as f:return json.load(f)
def emit(status,reasons,code):
    print(json.dumps({'status':status,'reasons':reasons},indent=2)); return code

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--plan',required=True);ap.add_argument('--execution',required=True);ap.add_argument('--review',required=True);ap.add_argument('--policy',required=True);a=ap.parse_args()
    try:
        p,e,r,policy=load(a.plan),load(a.execution),load(a.review),load(a.policy); reasons=[]
        if e.get('plan_revision')!=p.get('plan_revision') or r.get('plan_revision')!=p.get('plan_revision'): reasons.append('stale-plan-revision')
        if e.get('change_fingerprint')!=p.get('change_fingerprint') or r.get('change_fingerprint')!=p.get('change_fingerprint'): reasons.append('stale-change-fingerprint')
        by_id={x.get('test_id'):x for x in e.get('runs',[])}
        for t in p.get('selected_tests',[]):
            run=by_id.get(t.get('id'))
            if not run: reasons.append('missing-run:'+str(t.get('id'))); continue
            if run.get('status')!='passed' or run.get('exit_code')!=0: reasons.append('failed-run:'+str(t.get('id')))
            if int(run.get('discovered',0))<=0 or int(run.get('executed',0))<=0: reasons.append('not-executed:'+str(t.get('id')))
        mandatory=set(p.get('mandatory_suites',[])); executed={x.get('suite') for x in e.get('runs',[]) if x.get('status')=='passed' and int(x.get('executed',0))>0}
        if 'full' not in mandatory:
            for s in sorted(mandatory-executed): reasons.append('mandatory-suite-not-passed:'+s)
        high=bool(p.get('risk_triggers'))
        if high and policy.get('high_risk_requires_independent_review',True) and p.get('author_id') and r.get('reviewer_id')==p.get('author_id'): reasons.append('reviewer-not-independent')
        rv=r.get('status')
        if rv=='broaden-required': return emit('broaden-required',r.get('findings',[]) or ['reviewer-requested-broader-suite'],10)
        if rv!='verified': reasons.append('review-not-verified')
        if p.get('unresolved_impact'): reasons.append('unresolved-impact-remains')
        if reasons:return emit('blocked',reasons,20)
        return emit('verified',[],0)
    except Exception as ex:return emit('blocked',[str(ex)],20)
if __name__=='__main__':sys.exit(main())