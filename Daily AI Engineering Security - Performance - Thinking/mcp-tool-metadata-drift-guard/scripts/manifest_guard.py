#!/usr/bin/env python3
"""Pin and verify MCP tool metadata snapshots.
Commands:
  pin current.json snapshot.json --server-id ID --policy policy.json
  verify current.json snapshot.json --server-id ID --policy policy.json
Exit: 0 allow/pinned, 2 invalid input, 4 review required/drift, 5 identity mismatch.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def read_json(path:Path, limit:int)->object:
    try:
        raw=path.read_bytes()
    except OSError as e: raise ValueError(f'cannot read {path}: {e}') from e
    if len(raw)>limit: raise ValueError(f'{path} exceeds max_manifest_bytes')
    try: return json.loads(raw)
    except json.JSONDecodeError as e: raise ValueError(f'invalid JSON in {path}: {e}') from e


def canonical_tools(doc:object, policy:dict)->list[dict]:
    if isinstance(doc,dict) and 'tools' in doc: tools=doc['tools']
    else: tools=doc
    if not isinstance(tools,list): raise ValueError('manifest must be tool list or object with tools')
    fields=policy.get('security_fields',['name','description','inputSchema','annotations'])
    out=[]
    for t in tools:
        if not isinstance(t,dict) or not isinstance(t.get('name'),str) or not t['name']: raise ValueError('every tool requires name')
        item={k:t.get(k) for k in fields if k in t}
        if policy.get('ignore_annotation_title',True) and isinstance(item.get('annotations'),dict):
            item['annotations']={k:v for k,v in item['annotations'].items() if k!='title'}
        out.append(item)
    return sorted(out,key=lambda x:x['name'])


def digest(tools:list[dict])->str:
    raw=json.dumps(tools,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()


def diff(old:list[dict], new:list[dict])->list[dict]:
    a={x['name']:x for x in old}; b={x['name']:x for x in new}; changes=[]
    for name in sorted(set(a)|set(b)):
        if name not in a: changes.append({'tool':name,'change':'added'})
        elif name not in b: changes.append({'tool':name,'change':'removed'})
        elif a[name]!=b[name]:
            fields=sorted(k for k in set(a[name])|set(b[name]) if a[name].get(k)!=b[name].get(k))
            changes.append({'tool':name,'change':'modified','fields':fields})
    return changes


def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument('command',choices=['pin','verify']); ap.add_argument('current',type=Path); ap.add_argument('snapshot',type=Path); ap.add_argument('--server-id',required=True); ap.add_argument('--policy',type=Path,required=True); a=ap.parse_args()
    try:
        policy=json.loads(a.policy.read_text(encoding='utf-8')); limit=int(policy.get('max_manifest_bytes',1048576))
        current=canonical_tools(read_json(a.current,limit),policy); cur_d=digest(current)
        if a.command=='pin':
            snap={'server_id':a.server_id,'sha256':cur_d,'tools':current}
            a.snapshot.parent.mkdir(parents=True,exist_ok=True); a.snapshot.write_text(json.dumps(snap,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
            print(json.dumps({'decision':'pinned','server_id':a.server_id,'sha256':cur_d,'tool_count':len(current)})); return 0
        snap=read_json(a.snapshot,limit)
        if not isinstance(snap,dict) or not isinstance(snap.get('tools'),list): raise ValueError('invalid snapshot')
        if policy.get('require_server_identity',True) and snap.get('server_id')!=a.server_id:
            print(json.dumps({'decision':'deny','reason':'server_identity_mismatch'})); return 5
        old=canonical_tools(snap['tools'],policy); changes=diff(old,current)
        if changes:
            print(json.dumps({'decision':'review_required','old_sha256':digest(old),'new_sha256':cur_d,'changes':changes},ensure_ascii=False)); return 4
        print(json.dumps({'decision':'allow','sha256':cur_d,'tool_count':len(current)})); return 0
    except (OSError,ValueError,TypeError,json.JSONDecodeError) as e:
        print(json.dumps({'decision':'invalid','error':str(e)}),file=sys.stderr); return 2

if __name__=='__main__': raise SystemExit(main())
