#!/usr/bin/env python3
"""Canonicalize a JSON tool array and emit stable bytes + SHA-256 fingerprint.
Exit 0 success, 2 invalid input.
"""
import argparse, hashlib, json, sys
from pathlib import Path

VOLATILE_DEFAULT={"request_id","session_id","discovered_at","timestamp"}


def strip_volatile(value, volatile):
    if isinstance(value, dict):
        return {k: strip_volatile(v, volatile) for k,v in value.items() if k not in volatile}
    if isinstance(value, list): return [strip_volatile(v, volatile) for v in value]
    return value


def identity(tool):
    if not isinstance(tool,dict): raise ValueError('every tool must be an object')
    name=tool.get('name')
    if not isinstance(name,str) or not name: raise ValueError('every tool requires non-empty name')
    namespace=tool.get('namespace','')
    version=tool.get('version','')
    if not isinstance(namespace,str) or not isinstance(version,str): raise ValueError('namespace/version must be strings')
    return (namespace,name,version)


def main():
    p=argparse.ArgumentParser(); p.add_argument('input',type=Path); p.add_argument('--keep-volatile',action='store_true'); p.add_argument('--output',type=Path); a=p.parse_args()
    try:
        data=json.loads(a.input.read_text(encoding='utf-8'))
        if not isinstance(data,list): raise ValueError('input must be a JSON array')
        cleaned=data if a.keep_volatile else [strip_volatile(x,VOLATILE_DEFAULT) for x in data]
        keys=[identity(x) for x in cleaned]
        if len(keys)!=len(set(keys)): raise ValueError('duplicate stable tool identity')
        ordered=sorted(cleaned,key=identity)
        raw=json.dumps(ordered,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf-8')
        digest=hashlib.sha256(raw).hexdigest()
        if a.output: a.output.write_bytes(raw+b'\n')
        print(json.dumps({'sha256':digest,'tool_count':len(ordered),'bytes':len(raw)},indent=2))
        return 0
    except (OSError,json.JSONDecodeError,ValueError) as exc:
        print(json.dumps({'error':str(exc)}),file=sys.stderr); return 2

if __name__=='__main__': raise SystemExit(main())
