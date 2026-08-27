#!/usr/bin/env python3
import argparse, hashlib, json, sys, time
from pathlib import Path

def norm_paths(paths):
    return sorted({p.replace('\\','/').strip('/') for p in paths if p.strip()})

def key_for(head, command, paths):
    payload=json.dumps({'head':head,'command':command,'paths':norm_paths(paths)},sort_keys=True,separators=(',',':'))
    return hashlib.sha256(payload.encode()).hexdigest()

def make_receipt(head, command, paths, exit_code, output, timestamp=None):
    ts=time.time() if timestamp is None else float(timestamp)
    return {'version':1,'head':head,'command':command,'paths':norm_paths(paths),'exit_code':int(exit_code),'output_sha256':hashlib.sha256(output.encode()).hexdigest(),'timestamp':ts,'verification_key':key_for(head,command,paths)}

def validate(receipt, head, command, paths, max_age_seconds=21600, now=None):
    now=time.time() if now is None else float(now)
    expected=key_for(head,command,paths); reasons=[]
    if receipt.get('verification_key')!=expected: reasons.append('verification_key_mismatch')
    if int(receipt.get('exit_code',1))!=0: reasons.append('verification_failed')
    age=now-float(receipt.get('timestamp',0))
    if age<0: reasons.append('receipt_from_future')
    if age>max_age_seconds: reasons.append('receipt_expired')
    return {'ok':not reasons,'status':'satisfied' if not reasons else 'stale','reasons':reasons,'verification_key':expected,'age_seconds':max(0,age)}

def read_json(path): return json.loads(Path(path).read_text(encoding='utf-8'))

def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest='cmd',required=True)
    c=sub.add_parser('create'); c.add_argument('--receipt',required=True); c.add_argument('--head',required=True); c.add_argument('--command',required=True); c.add_argument('--paths',nargs='*',default=[]); c.add_argument('--exit-code',type=int,required=True); c.add_argument('--output-file')
    v=sub.add_parser('validate'); v.add_argument('--receipt',required=True); v.add_argument('--head',required=True); v.add_argument('--command',required=True); v.add_argument('--paths',nargs='*',default=[]); v.add_argument('--max-age-seconds',type=int,default=21600)
    a=ap.parse_args()
    try:
        if a.cmd=='create':
            output=Path(a.output_file).read_text(encoding='utf-8',errors='replace') if a.output_file else ''
            r=make_receipt(a.head,a.command,a.paths,a.exit_code,output); Path(a.receipt).write_text(json.dumps(r,indent=2,sort_keys=True),encoding='utf-8'); print(json.dumps({'ok':True,'verification_key':r['verification_key']})); return 0
        r=validate(read_json(a.receipt),a.head,a.command,a.paths,a.max_age_seconds); print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r['ok'] else 3
    except (OSError,ValueError,TypeError,json.JSONDecodeError) as e:
        print(json.dumps({'ok':False,'status':'error','error':str(e)}),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
