#!/usr/bin/env python3
import argparse, hashlib, json, os, sys
from pathlib import Path


def load_policy(path):
    try:
        p=json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as e:
        raise ValueError(f'cannot load policy: {e}')
    for key in ('spill_threshold_bytes','preview_bytes','max_read_bytes'):
        if int(p.get(key,0)) <= 0:
            raise ValueError(f'invalid policy field: {key}')
    return p


def digest(data):
    return hashlib.sha256(data).hexdigest()


def safe_preview(data, limit):
    head=data[:limit]
    return head.decode('utf-8', errors='replace')


def spill(input_path, store, policy):
    src=Path(input_path)
    if not src.is_file():
        raise ValueError('input file not found')
    data=src.read_bytes()
    sha=digest(data)
    threshold=int(policy['spill_threshold_bytes'])
    preview_limit=int(policy['preview_bytes'])
    envelope={
        'sha256':sha,
        'size_bytes':len(data),
        'preview':safe_preview(data,preview_limit),
        'preview_bytes':min(len(data),preview_limit),
        'spilled':len(data) >= threshold,
        'retrieval':None,
    }
    if len(data) >= threshold:
        root=Path(store)
        root.mkdir(parents=True, exist_ok=True)
        target=root / f'{sha}.bin'
        if target.exists():
            existing=target.read_bytes()
            if digest(existing) != sha:
                raise ValueError('existing spill digest mismatch')
        else:
            tmp=root / f'.{sha}.{os.getpid()}.tmp'
            tmp.write_bytes(data)
            os.replace(tmp,target)
        envelope['retrieval']={'sha256':sha,'offset_unit':'byte','max_read_bytes':int(policy['max_read_bytes'])}
    return envelope


def read_range(store, sha, offset, length, max_read):
    if not isinstance(sha,str) or len(sha)!=64 or any(c not in '0123456789abcdef' for c in sha):
        raise ValueError('invalid sha256')
    if offset < 0 or length <= 0 or length > max_read:
        raise ValueError('invalid range')
    path=Path(store)/f'{sha}.bin'
    if not path.is_file():
        raise ValueError('spill not found')
    data=path.read_bytes()
    if digest(data)!=sha:
        raise ValueError('spill digest mismatch')
    if offset > len(data):
        raise ValueError('offset beyond end')
    chunk=data[offset:offset+length]
    return {
        'sha256':sha,
        'offset':offset,
        'length':len(chunk),
        'eof':offset+len(chunk)>=len(data),
        'text':chunk.decode('utf-8', errors='replace')
    }


def main():
    ap=argparse.ArgumentParser()
    sub=ap.add_subparsers(dest='cmd',required=True)
    s=sub.add_parser('spill'); s.add_argument('--input',required=True); s.add_argument('--store',required=True); s.add_argument('--policy',required=True)
    r=sub.add_parser('read'); r.add_argument('--store',required=True); r.add_argument('--sha256',required=True); r.add_argument('--offset',type=int,required=True); r.add_argument('--length',type=int,required=True); r.add_argument('--policy',required=True)
    a=ap.parse_args()
    try:
        p=load_policy(a.policy)
        out=spill(a.input,a.store,p) if a.cmd=='spill' else read_range(a.store,a.sha256,a.offset,a.length,int(p['max_read_bytes']))
        print(json.dumps(out,ensure_ascii=False,indent=2,sort_keys=True))
        return 0
    except Exception as e:
        print(json.dumps({'ok':False,'error':str(e)}),file=sys.stderr)
        return 2

if __name__=='__main__':
    raise SystemExit(main())
