#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        raise ValueError(f'{path}: {exc}')

def nonempty_str(obj, key):
    v=obj.get(key)
    if not isinstance(v,str) or not v.strip(): raise ValueError(f'session.{key} must be a non-empty string')
    return v.strip()

def validate_session(s):
    if not isinstance(s,dict): raise ValueError('session must be a JSON object')
    sid=nonempty_str(s,'session_id'); server=nonempty_str(s,'server_id'); ver=nonempty_str(s,'negotiated_version')
    era=s.get('protocol_era')
    if era not in ('legacy','modern'): raise ValueError('session.protocol_era must be legacy or modern')
    caps=s.get('effective_capabilities')
    if not isinstance(caps,list) or any(not isinstance(x,str) or not x.strip() for x in caps):
        raise ValueError('session.effective_capabilities must be an array of non-empty strings')
    if len(set(caps)) != len(caps): raise ValueError('session.effective_capabilities must be unique')
    return sid,server,ver,era,set(caps)

def validate_plan(p):
    if not isinstance(p,dict): raise ValueError('plan must be a JSON object')
    req=p.get('required_capabilities')
    if not isinstance(req,list) or any(not isinstance(x,str) or not x.strip() for x in req):
        raise ValueError('plan.required_capabilities must be an array of non-empty strings')
    if len(set(req)) != len(req): raise ValueError('plan.required_capabilities must be unique')
    return req

def main():
    ap=argparse.ArgumentParser(description='Validate an MCP plan against an observed session capability contract')
    ap.add_argument('session'); ap.add_argument('plan'); args=ap.parse_args()
    try:
        s=read_json(args.session); p=read_json(args.plan)
        sid,server,ver,era,caps=validate_session(s); req=validate_plan(p)
    except ValueError as exc:
        print(json.dumps({'status':'invalid','error':str(exc)},sort_keys=True)); return 1
    missing=sorted(set(req)-caps)
    out={'status':'pass' if not missing else 'blocked','session_id':sid,'server_id':server,'negotiated_version':ver,'protocol_era':era,'required_capabilities':req,'missing_capabilities':missing}
    print(json.dumps(out,sort_keys=True))
    return 0 if not missing else 2

if __name__=='__main__': sys.exit(main())
