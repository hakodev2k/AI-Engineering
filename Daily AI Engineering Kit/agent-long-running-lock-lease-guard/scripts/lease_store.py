#!/usr/bin/env python3
import argparse, hashlib, json, os, tempfile, time, uuid
from datetime import datetime, timezone, timedelta


def now(): return datetime.now(timezone.utc)
def iso(dt): return dt.isoformat().replace('+00:00','Z')
def parse(ts): return datetime.fromisoformat(ts.replace('Z','+00:00'))
def canonical_hash(obj): return hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(',',':')).encode()).hexdigest()
def load(path, default=None):
    if not os.path.exists(path): return default
    with open(path, encoding='utf-8') as f: return json.load(f)
def atomic_write(path, data):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(os.path.abspath(path)), text=True)
    try:
        with os.fdopen(fd,'w',encoding='utf-8') as f: json.dump(data,f,indent=2,sort_keys=True); f.write('\n')
        os.replace(tmp,path)
    finally:
        if os.path.exists(tmp): os.unlink(tmp)

def main():
    p=argparse.ArgumentParser()
    p.add_argument('command',choices=['acquire','heartbeat','release','show'])
    p.add_argument('--store',required=True); p.add_argument('--resource'); p.add_argument('--owner'); p.add_argument('--scope-json'); p.add_argument('--lease-seconds',type=int,default=120); p.add_argument('--lease-id'); p.add_argument('--fencing-token',type=int)
    a=p.parse_args(); store=load(a.store,{"resources":{},"next_fencing_token":1}); resources=store['resources']
    if a.command=='show': print(json.dumps(store,indent=2,sort_keys=True)); return
    if not a.resource or not a.owner: raise SystemExit('--resource and --owner are required')
    current=resources.get(a.resource); t=now()
    if a.command=='acquire':
        if current and current.get('status')=='active' and parse(current['expires_at']) > t:
            print(json.dumps({"decision":"blocked","reason":"active-lease-exists","current_owner":current['owner_id'],"expires_at":current['expires_at']})); raise SystemExit(2)
        if a.lease_seconds < 10 or a.lease_seconds > 900: raise SystemExit('lease seconds must be 10..900')
        scope=load(a.scope_json,{}) if a.scope_json else {}
        token=store['next_fencing_token']; store['next_fencing_token']=token+1
        rec={"resource_key":a.resource,"owner_id":a.owner,"lease_id":str(uuid.uuid4()),"fencing_token":token,"acquired_at":iso(t),"expires_at":iso(t+timedelta(seconds=a.lease_seconds)),"heartbeat_at":iso(t),"status":"active","scope_fingerprint":canonical_hash(scope),"risk":scope.get('risk','medium'),"evidence":[]}
        resources[a.resource]=rec; atomic_write(a.store,store); print(json.dumps(rec,sort_keys=True)); return
    if not current: print(json.dumps({"decision":"blocked","reason":"lease-missing"})); raise SystemExit(2)
    if current['owner_id']!=a.owner or current['lease_id']!=a.lease_id or current['fencing_token']!=a.fencing_token:
        print(json.dumps({"decision":"blocked","reason":"ownership-mismatch"})); raise SystemExit(2)
    if a.command=='heartbeat':
        if current['status']!='active' or parse(current['expires_at']) <= t:
            print(json.dumps({"decision":"blocked","reason":"lease-expired-or-inactive"})); raise SystemExit(2)
        current['heartbeat_at']=iso(t); current['expires_at']=iso(t+timedelta(seconds=a.lease_seconds)); atomic_write(a.store,store); print(json.dumps(current,sort_keys=True)); return
    current['status']='released'; current['expires_at']=iso(t); atomic_write(a.store,store); print(json.dumps(current,sort_keys=True))
if __name__=='__main__': main()
