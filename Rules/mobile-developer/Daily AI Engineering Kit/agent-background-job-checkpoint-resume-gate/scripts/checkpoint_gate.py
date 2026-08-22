#!/usr/bin/env python3
import argparse, hashlib, json, os, sys, tempfile
from datetime import datetime, timezone
from pathlib import Path

STATUSES={"running","failed","completed"}

def utc_now(): return datetime.now(timezone.utc).isoformat()
def fingerprint(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for chunk in iter(lambda:f.read(65536),b''): h.update(chunk)
    return h.hexdigest()

def load(path):
    p=Path(path)
    if not p.exists(): return None
    with p.open(encoding='utf-8') as f: return json.load(f)

def validate(cp):
    req=['job_id','job_type','input_fingerprint','status','cursor','processed_count','updated_at_utc','side_effects_committed']
    miss=[k for k in req if k not in cp]
    if miss: raise ValueError('missing fields: '+','.join(miss))
    if cp['status'] not in STATUSES: raise ValueError('invalid status')
    if not isinstance(cp['processed_count'],int) or cp['processed_count']<0: raise ValueError('processed_count must be non-negative integer')
    if not isinstance(cp['side_effects_committed'],bool): raise ValueError('side_effects_committed must be boolean')

def atomic_write(path,data):
    p=Path(path); p.parent.mkdir(parents=True,exist_ok=True)
    fd,tmp=tempfile.mkstemp(prefix=p.name+'.',dir=str(p.parent))
    try:
        with os.fdopen(fd,'w',encoding='utf-8') as f:
            json.dump(data,f,indent=2,sort_keys=True); f.write('\n'); f.flush(); os.fsync(f.fileno())
        os.replace(tmp,p)
    except Exception:
        try: os.unlink(tmp)
        except OSError: pass
        raise

def cmd_init(a):
    cp={'job_id':a.job_id,'job_type':a.job_type,'input_fingerprint':fingerprint(a.input),'status':'running','cursor':None,'processed_count':0,'updated_at_utc':utc_now(),'last_error':None,'side_effects_committed':False,'metadata':{}}
    atomic_write(a.checkpoint,cp); print(json.dumps(cp)); return 0

def cmd_verify(a):
    cp=load(a.checkpoint)
    if cp is None: print('checkpoint missing',file=sys.stderr); return 2
    try: validate(cp)
    except Exception as e: print(str(e),file=sys.stderr); return 3
    if cp['job_id']!=a.job_id or cp['job_type']!=a.job_type: print('job identity mismatch',file=sys.stderr); return 4
    if cp['input_fingerprint']!=fingerprint(a.input): print('input fingerprint mismatch',file=sys.stderr); return 5
    if cp['status']=='completed': print('checkpoint already completed',file=sys.stderr); return 6
    print('checkpoint verified'); return 0

def cmd_update(a):
    cp=load(a.checkpoint)
    if cp is None: print('checkpoint missing',file=sys.stderr); return 2
    validate(cp)
    cp['cursor']=json.loads(a.cursor) if a.cursor else cp['cursor']
    cp['processed_count']=a.processed_count if a.processed_count is not None else cp['processed_count']
    cp['status']=a.status or cp['status']; cp['last_error']=a.error; cp['side_effects_committed']=a.side_effects_committed or cp['side_effects_committed']; cp['updated_at_utc']=utc_now()
    atomic_write(a.checkpoint,cp); print(json.dumps(cp)); return 0

def main():
    p=argparse.ArgumentParser(); s=p.add_subparsers(dest='cmd',required=True)
    i=s.add_parser('init'); i.add_argument('--checkpoint',required=True); i.add_argument('--job-id',required=True); i.add_argument('--job-type',required=True); i.add_argument('--input',required=True); i.set_defaults(fn=cmd_init)
    v=s.add_parser('verify'); v.add_argument('--checkpoint',required=True); v.add_argument('--job-id',required=True); v.add_argument('--job-type',required=True); v.add_argument('--input',required=True); v.set_defaults(fn=cmd_verify)
    u=s.add_parser('update'); u.add_argument('--checkpoint',required=True); u.add_argument('--cursor'); u.add_argument('--processed-count',type=int); u.add_argument('--status',choices=sorted(STATUSES)); u.add_argument('--error'); u.add_argument('--side-effects-committed',action='store_true'); u.set_defaults(fn=cmd_update)
    a=p.parse_args();
    try: return a.fn(a)
    except Exception as e: print(f'error: {e}',file=sys.stderr); return 10
if __name__=='__main__': raise SystemExit(main())
