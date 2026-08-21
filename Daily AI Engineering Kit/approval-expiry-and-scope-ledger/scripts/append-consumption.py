#!/usr/bin/env python3
import argparse, json, os, sys, tempfile
from datetime import datetime, timezone

def load(path):
    with open(path,'r',encoding='utf-8') as f: return json.load(f)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--ledger',required=True); ap.add_argument('--request',required=True); ap.add_argument('--executor',required=True); ap.add_argument('--result',required=True,choices=['succeeded','failed','cancelled']); ap.add_argument('--evidence',required=True); a=ap.parse_args()
    r=load(a.request)
    entry={
      'request_id':r['request_id'],'revision':r['revision'],'action_fingerprint':r['action_fingerprint'],
      'executor_id':a.executor,'result':a.result,'evidence':a.evidence,
      'consumed_at':datetime.now(timezone.utc).isoformat().replace('+00:00','Z')
    }
    directory=os.path.dirname(os.path.abspath(a.ledger)); os.makedirs(directory,exist_ok=True)
    existing=''
    if os.path.exists(a.ledger):
        with open(a.ledger,'r',encoding='utf-8') as f: existing=f.read()
    fd,tmp=tempfile.mkstemp(prefix='.approval-ledger-',dir=directory,text=True); os.close(fd)
    try:
        with open(tmp,'w',encoding='utf-8') as f:
            f.write(existing)
            if existing and not existing.endswith('\n'): f.write('\n')
            f.write(json.dumps(entry,sort_keys=True,separators=(',',':'))+'\n')
            f.flush(); os.fsync(f.fileno())
        os.replace(tmp,a.ledger)
    finally:
        if os.path.exists(tmp): os.unlink(tmp)
    print(json.dumps(entry,indent=2)); return 0

if __name__=='__main__': sys.exit(main())
