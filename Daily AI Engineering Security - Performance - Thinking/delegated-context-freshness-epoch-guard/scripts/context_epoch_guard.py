#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, os, sys, time
from pathlib import Path

def sha256_file(path: Path)->str:
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()

def normalize(root:Path,value:str)->Path:
    p=(root/value).resolve() if not Path(value).is_absolute() else Path(value).resolve()
    try:p.relative_to(root.resolve())
    except ValueError as e: raise ValueError(f'path escapes root: {value}') from e
    return p

def snapshot(root:Path,paths:list[str])->dict:
    entries=[]
    for value in sorted(set(paths)):
        p=normalize(root,value); rel=p.relative_to(root.resolve()).as_posix()
        if not p.exists(): entries.append({'path':rel,'exists':False,'sha256':None,'size':None})
        elif not p.is_file(): raise ValueError(f'not a regular file: {rel}')
        else: entries.append({'path':rel,'exists':True,'sha256':sha256_file(p),'size':p.stat().st_size})
    return {'version':1,'created_unix':int(time.time()),'root':str(root.resolve()),'entries':entries}

def check(root:Path,manifest:dict)->dict:
    changes=[]
    for old in manifest.get('entries',[]):
        p=normalize(root,old['path']); exists=p.exists() and p.is_file()
        cur={'exists':exists,'sha256':sha256_file(p) if exists else None,'size':p.stat().st_size if exists else None}
        if any(cur[k]!=old.get(k) for k in cur): changes.append({'path':old['path'],'before':{k:old.get(k) for k in cur},'after':cur})
    return {'fresh':not changes,'changes':changes,'checked_entries':len(manifest.get('entries',[]))}

def main()->int:
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest='cmd',required=True)
    s=sub.add_parser('snapshot'); s.add_argument('--root',required=True); s.add_argument('--out',required=True); s.add_argument('paths',nargs='+')
    c=sub.add_parser('check'); c.add_argument('--root',required=True); c.add_argument('--manifest',required=True); c.add_argument('--json',action='store_true')
    a=ap.parse_args()
    try:
        root=Path(a.root).resolve()
        if not root.is_dir(): raise ValueError('root must be an existing directory')
        if a.cmd=='snapshot':
            data=snapshot(root,a.paths); out=Path(a.out); out.parent.mkdir(parents=True,exist_ok=True); tmp=out.with_suffix(out.suffix+'.tmp')
            tmp.write_text(json.dumps(data,indent=2,sort_keys=True)+'\n',encoding='utf-8'); os.replace(tmp,out); print(f'snapshot={out} entries={len(data["entries"])}'); return 0
        manifest=json.loads(Path(a.manifest).read_text(encoding='utf-8')); result=check(root,manifest)
        print(json.dumps(result,sort_keys=True) if a.json else ('fresh' if result['fresh'] else f'stale: {len(result["changes"])} changed context file(s)'))
        return 0 if result['fresh'] else 3
    except (OSError,ValueError,KeyError,json.JSONDecodeError) as e:
        print(f'input-error: {e}',file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
