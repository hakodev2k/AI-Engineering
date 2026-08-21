#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone

def load(p):
    with open(p,encoding='utf-8') as f:return json.load(f)
def parse(ts):return datetime.fromisoformat(ts.replace('Z','+00:00'))
def h(obj):return hashlib.sha256(json.dumps(obj,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--store',required=True); ap.add_argument('--intent',required=True); ap.add_argument('--policy',required=True); ap.add_argument('--output'); a=ap.parse_args()
    store=load(a.store); intent=load(a.intent); policy=load(a.policy); rec=store.get('resources',{}).get(intent.get('resource_key')); reasons=[]
    if not rec: reasons.append('lease-missing')
    else:
        if rec.get('status')!='active': reasons.append('lease-not-active')
        if parse(rec['expires_at']) <= datetime.now(timezone.utc): reasons.append('lease-expired')
        for k in ('owner_id','lease_id','fencing_token','scope_fingerprint'):
            if intent.get(k)!=rec.get(k): reasons.append(f'{k}-mismatch')
        if policy.get('require_fencing_token_for_mutation',True) and not isinstance(intent.get('fencing_token'),int): reasons.append('fencing-token-required')
    approval_actions=set(policy.get('human_approval_required_for',[]))
    if intent.get('action') in approval_actions and not intent.get('approval_reference'): reasons.append('human-approval-required')
    decision='verified' if not reasons else ('human-approval-required' if reasons==['human-approval-required'] else 'blocked')
    out={"decision":decision,"reasons":reasons,"resource_key":intent.get('resource_key'),"fencing_token":intent.get('fencing_token')}
    if a.output:
        with open(a.output,'w',encoding='utf-8') as f: json.dump(out,f,indent=2,sort_keys=True); f.write('\n')
    print(json.dumps(out,sort_keys=True)); sys.exit(0 if decision=='verified' else 2)
if __name__=='__main__': main()
