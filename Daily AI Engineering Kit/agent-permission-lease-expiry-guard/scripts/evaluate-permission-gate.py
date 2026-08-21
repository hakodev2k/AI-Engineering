#!/usr/bin/env python3
import argparse,json
from datetime import datetime,timezone
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding='utf-8'))
def ts(v): return datetime.fromisoformat(v.replace('Z','+00:00'))

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--lease',required=True); ap.add_argument('--action',required=True); ap.add_argument('--now'); a=ap.parse_args()
    l,x=load(a.lease),load(a.action); n=ts(a.now) if a.now else datetime.now(timezone.utc); reasons=[]
    if l.get('status')!='active': reasons.append('lease-not-active')
    if n>=ts(l['expires_at']): reasons.append('lease-expired')
    if l.get('use_count',0)>=l.get('max_uses',0): reasons.append('max-use-exhausted')
    if l.get('actor_id')!=x.get('actor_id'): reasons.append('actor-mismatch')
    if l.get('operation_id')!=x.get('operation_id'): reasons.append('operation-mismatch')
    if x.get('capability') not in l.get('capabilities',[]): reasons.append('capability-out-of-scope')
    if x.get('resource') not in l.get('resource_scope',[]): reasons.append('resource-out-of-scope')
    result={'decision':'allow' if not reasons else 'blocked','reasons':reasons,'lease_id':l.get('lease_id')}
    print(json.dumps(result,sort_keys=True)); raise SystemExit(0 if not reasons else 2)
if __name__=='__main__': main()
