#!/usr/bin/env python3
import argparse, json, uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

def now(): return datetime.now(timezone.utc)
def iso(dt): return dt.isoformat().replace('+00:00','Z')
def load(p): return json.loads(Path(p).read_text(encoding='utf-8'))
def save(p,o): Path(p).write_text(json.dumps(o,indent=2,sort_keys=True)+'\n',encoding='utf-8')

def main():
    ap=argparse.ArgumentParser()
    sub=ap.add_subparsers(dest='cmd',required=True)
    c=sub.add_parser('issue'); c.add_argument('--actor',required=True); c.add_argument('--operation',required=True); c.add_argument('--capability',action='append',required=True); c.add_argument('--resource',action='append',required=True); c.add_argument('--risk',default='standard'); c.add_argument('--seconds',type=int,default=900); c.add_argument('--max-uses',type=int,default=1); c.add_argument('--policy-version',default='1.0'); c.add_argument('--approved-by'); c.add_argument('--approval-fingerprint'); c.add_argument('--out',required=True)
    r=sub.add_parser('revoke'); r.add_argument('--lease',required=True); r.add_argument('--out')
    e=sub.add_parser('expire'); e.add_argument('--lease',required=True); e.add_argument('--out')
    a=ap.parse_args()
    if a.cmd=='issue':
        if a.seconds<1 or a.seconds>3600 or a.max_uses<1: raise SystemExit('invalid lease bounds')
        t=now(); lease={'lease_id':str(uuid.uuid4()),'actor_id':a.actor,'operation_id':a.operation,'capabilities':sorted(set(a.capability)),'resource_scope':sorted(set(a.resource)),'risk_category':a.risk,'issued_at':iso(t),'expires_at':iso(t+timedelta(seconds=a.seconds)),'max_uses':a.max_uses,'use_count':0,'status':'active','policy_version':a.policy_version,'approved_by':a.approved_by,'approval_fingerprint':a.approval_fingerprint}
        save(a.out,lease); print(lease['lease_id'])
    else:
        lease=load(a.lease); lease['status']='revoked' if a.cmd=='revoke' else 'expired'; out=a.out or a.lease; save(out,lease); print(lease['status'])
if __name__=='__main__': main()
