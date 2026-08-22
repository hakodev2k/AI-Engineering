#!/usr/bin/env python3
"""Durable freshness-aware evidence index for files and command-result artifacts.

Exit codes: 0 fresh/action completed; 2 missing/stale/invalid evidence; 3 usage/environment error.
"""
from __future__ import annotations
import argparse, hashlib, json, os, sys, tempfile, time
from pathlib import Path

SCHEMA = 1

def sha256_path(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()

def load_index(path: Path) -> dict:
    if not path.exists():
        return {"schema": SCHEMA, "files": {}, "commands": {}}
    obj = json.loads(path.read_text(encoding='utf-8'))
    if not isinstance(obj, dict) or obj.get('schema') != SCHEMA:
        raise ValueError('unsupported index schema')
    obj.setdefault('files', {}); obj.setdefault('commands', {})
    return obj

def save_index(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    data = (json.dumps(obj, indent=2, sort_keys=True) + '\n').encode()
    fd, tmp = tempfile.mkstemp(prefix='.evidence-index-', dir=str(path.parent))
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(data); f.flush(); os.fsync(f.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp): os.unlink(tmp)

def norm_file(p: str) -> str:
    return str(Path(p).expanduser().resolve())

def cmd_key(command: str) -> str:
    return hashlib.sha256(command.strip().encode()).hexdigest()

def emit(obj, code=0):
    print(json.dumps(obj, sort_keys=True)); return code

def add_file(a):
    idxp=Path(a.index); idx=load_index(idxp); p=Path(a.path).expanduser().resolve()
    if not p.is_file(): return emit({"status":"invalid","reason":"file-missing"},2)
    key=str(p); idx['files'][key]={"sha256":sha256_path(p),"bytes":p.stat().st_size,"observed_at":int(time.time())}
    save_index(idxp,idx); return emit({"status":"recorded","type":"file","key":key,"sha256":idx['files'][key]['sha256']})

def check_file(a):
    idx=load_index(Path(a.index)); p=Path(a.path).expanduser().resolve(); key=str(p); ent=idx['files'].get(key)
    if not ent or not p.is_file(): return emit({"status":"missing","type":"file","key":key},2)
    cur=sha256_path(p)
    if cur != ent.get('sha256'): return emit({"status":"stale-refresh-required","type":"file","key":key,"recorded_sha256":ent.get('sha256'),"current_sha256":cur},2)
    return emit({"status":"fresh-reference","type":"file","key":key,"sha256":cur,"bytes":ent.get('bytes'),"observed_at":ent.get('observed_at')})

def add_command(a):
    idxp=Path(a.index); idx=load_index(idxp); art=Path(a.artifact).expanduser().resolve()
    if not art.is_file(): return emit({"status":"invalid","reason":"artifact-missing"},2)
    key=cmd_key(a.command); idx['commands'][key]={"command":a.command.strip(),"state_fingerprint":a.state_fingerprint,"artifact":str(art),"artifact_sha256":sha256_path(art),"bytes":art.stat().st_size,"observed_at":int(time.time())}
    save_index(idxp,idx); return emit({"status":"recorded","type":"command","key":key,"artifact":str(art)})

def check_command(a):
    idx=load_index(Path(a.index)); key=cmd_key(a.command); ent=idx['commands'].get(key)
    if not ent: return emit({"status":"missing","type":"command","key":key},2)
    if ent.get('state_fingerprint') != a.state_fingerprint: return emit({"status":"stale-refresh-required","type":"command","key":key,"reason":"state-fingerprint"},2)
    art=Path(ent.get('artifact',''))
    if not art.is_file(): return emit({"status":"stale-refresh-required","type":"command","key":key,"reason":"artifact-missing"},2)
    cur=sha256_path(art)
    if cur != ent.get('artifact_sha256'): return emit({"status":"stale-refresh-required","type":"command","key":key,"reason":"artifact-hash"},2)
    return emit({"status":"fresh-reference","type":"command","key":key,"artifact":str(art),"artifact_sha256":cur,"bytes":ent.get('bytes'),"observed_at":ent.get('observed_at')})

def build_parser():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest='cmd',required=True)
    for name in ('add-file','check-file'):
        p=sub.add_parser(name); p.add_argument('--index',required=True); p.add_argument('--path',required=True)
    p=sub.add_parser('add-command'); p.add_argument('--index',required=True); p.add_argument('--command',required=True); p.add_argument('--state-fingerprint',required=True); p.add_argument('--artifact',required=True)
    p=sub.add_parser('check-command'); p.add_argument('--index',required=True); p.add_argument('--command',required=True); p.add_argument('--state-fingerprint',required=True)
    return ap

def main():
    try:
        a=build_parser().parse_args()
        return {'add-file':add_file,'check-file':check_file,'add-command':add_command,'check-command':check_command}[a.cmd](a)
    except (OSError, ValueError, json.JSONDecodeError) as e:
        return emit({"status":"error","error":str(e)},3)

if __name__ == '__main__': raise SystemExit(main())
