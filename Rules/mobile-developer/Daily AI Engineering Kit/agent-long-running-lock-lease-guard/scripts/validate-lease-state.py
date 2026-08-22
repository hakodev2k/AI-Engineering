#!/usr/bin/env python3
import argparse,json,sys
from datetime import datetime

def parse(x): return datetime.fromisoformat(x.replace('Z','+00:00'))
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--store',required=True); a=ap.parse_args(); data=json.load(open(a.store,encoding='utf-8')); errors=[]; tokens=[]
    if not isinstance(data.get('resources'),dict): errors.append('resources must be object')
    for key,r in data.get('resources',{}).items():
        for f in ('resource_key','owner_id','lease_id','fencing_token','acquired_at','expires_at','heartbeat_at','status','scope_fingerprint'):
            if f not in r: errors.append(f'{key}: missing {f}')
        if r.get('resource_key')!=key: errors.append(f'{key}: resource_key mismatch')
        if r.get('status') not in ('active','released','expired','revoked'): errors.append(f'{key}: invalid status')
        if isinstance(r.get('fencing_token'),int): tokens.append(r['fencing_token'])
        try:
            if parse(r['heartbeat_at']) < parse(r['acquired_at']): errors.append(f'{key}: heartbeat before acquire')
            if parse(r['expires_at']) < parse(r['acquired_at']): errors.append(f'{key}: expiry before acquire')
        except Exception: errors.append(f'{key}: invalid timestamp')
        if len(r.get('scope_fingerprint',''))!=64: errors.append(f'{key}: invalid scope fingerprint')
    if len(tokens)!=len(set(tokens)): errors.append('duplicate fencing token')
    out={"status":"verified" if not errors else "blocked","errors":errors}; print(json.dumps(out,sort_keys=True)); sys.exit(0 if not errors else 2)
if __name__=='__main__':main()
