#!/usr/bin/env python3
import argparse,json,sys
from datetime import datetime,timezone,timedelta

def load(p):
    with open(p,encoding='utf-8') as f:return json.load(f)
def parse(x):return datetime.fromisoformat(x.replace('Z','+00:00'))
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--store',required=True); ap.add_argument('--resource',required=True); ap.add_argument('--policy',required=True); ap.add_argument('--review'); ap.add_argument('--approval-reference'); a=ap.parse_args()
    store=load(a.store); policy=load(a.policy); rec=store.get('resources',{}).get(a.resource); reasons=[]; t=datetime.now(timezone.utc)
    if not rec: print(json.dumps({"decision":"safe-to-acquire","reason":"no-existing-lease"})); return
    expired=parse(rec['expires_at']) <= t
    heartbeat_stale=parse(rec['heartbeat_at']) + timedelta(seconds=policy.get('default_lease_seconds',120)+policy.get('max_clock_skew_seconds',10)) <= t
    if rec.get('status')=='active' and not expired: reasons.append('active-lease-not-expired')
    if not expired: reasons.append('expiry-not-proven')
    if not heartbeat_stale and rec.get('status')=='active': reasons.append('heartbeat-not-stale')
    risk=rec.get('risk','medium'); review_required=risk in ('high','critical') or 'forced-takeover' in policy.get('independent_review_required_for',[])
    if review_required:
        if not a.review: reasons.append('independent-review-required')
        else:
            r=load(a.review)
            if r.get('resource_key')!=a.resource or r.get('reviewed_fencing_token')!=rec.get('fencing_token') or r.get('verdict')!='takeover-approved': reasons.append('review-binding-invalid')
    if risk in ('high','critical') and not a.approval_reference: reasons.append('human-approval-required')
    decision='safe-to-acquire' if not reasons else ('human-approval-required' if set(reasons)=={'human-approval-required'} else 'blocked')
    print(json.dumps({"decision":decision,"reasons":reasons,"previous_fencing_token":rec.get('fencing_token')},sort_keys=True)); sys.exit(0 if decision=='safe-to-acquire' else 2)
if __name__=='__main__':main()
