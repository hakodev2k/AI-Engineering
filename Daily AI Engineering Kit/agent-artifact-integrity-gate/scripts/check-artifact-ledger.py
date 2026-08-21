#!/usr/bin/env python3
import argparse, json, os, sys, hashlib
from datetime import datetime, timezone


def hash_file(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for c in iter(lambda:f.read(1024*1024), b''): h.update(c)
    return h.hexdigest()


def dt(v): return datetime.fromisoformat(v.replace('Z','+00:00'))


def main():
    p=argparse.ArgumentParser()
    p.add_argument('--ledger', required=True)
    p.add_argument('--policy', default='config/artifact-policy.json')
    args=p.parse_args()
    try: policy=json.load(open(args.policy,encoding='utf-8'))
    except Exception as e: print(f'policy error: {e}',file=sys.stderr); return 2
    if not os.path.isdir(args.ledger): print(json.dumps({'valid':True,'records':0,'violations':[]})); return 0
    violations=[]; ids={}; records=[]
    for name in sorted(os.listdir(args.ledger)):
        if not name.endswith('.json'): continue
        path=os.path.join(args.ledger,name)
        try: r=json.load(open(path,encoding='utf-8'))
        except Exception as e: violations.append({'record':path,'error':f'invalid-json:{e}'}); continue
        records.append((path,r)); aid=r.get('artifact_id')
        if not aid: violations.append({'record':path,'error':'missing-artifact-id'})
        elif aid in ids: violations.append({'record':path,'error':'duplicate-artifact-id','other':ids[aid]})
        else: ids[aid]=path
    known=set(ids)
    now=datetime.now(timezone.utc)
    for path,r in records:
        ap=r.get('artifact_path','')
        if not os.path.isfile(ap): violations.append({'record':path,'error':'artifact-missing','artifact':ap})
        else:
            try:
                if hash_file(ap)!=r.get('sha256'): violations.append({'record':path,'error':'hash-mismatch','artifact':ap})
            except OSError as e: violations.append({'record':path,'error':f'artifact-read-error:{e}'})
        try:
            if dt(r.get('expires_at',''))<=now: violations.append({'record':path,'error':'expired'})
        except Exception: violations.append({'record':path,'error':'invalid-expiry'})
        if r.get('producer_status') in policy.get('blocking_producer_statuses',[]): violations.append({'record':path,'error':'blocking-producer-status'})
        for source in r.get('source_artifact_ids',[]):
            if source not in known: violations.append({'record':path,'error':'missing-source-record','source_artifact_id':source})
    print(json.dumps({'valid':not violations,'records':len(records),'violations':violations},indent=2))
    return 0 if not violations else 10

if __name__=='__main__': raise SystemExit(main())
