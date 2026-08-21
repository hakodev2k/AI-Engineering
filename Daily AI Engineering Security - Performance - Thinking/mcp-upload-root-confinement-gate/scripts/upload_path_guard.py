#!/usr/bin/env python3
"""Validate a server-local upload source without reading its contents."""
from __future__ import annotations
import argparse, json, os, sys
from pathlib import Path
ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5

def load_policy(path: Path) -> dict:
    try: obj=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"invalid policy: {exc}") from exc
    if not isinstance(obj,dict): raise ValueError("policy must be object")
    return obj

def evaluate(candidate: Path, policy: dict) -> tuple[int,dict]:
    roots=policy.get("allowed_roots",[])
    if not isinstance(roots,list) or not roots or not all(isinstance(x,str) and x for x in roots):
        return INVALID,{"decision":"invalid","reason":"allowed_roots must be non-empty string list"}
    try:
        raw=candidate.expanduser()
        if policy.get("reject_symlinks",True) and raw.is_symlink():
            return DENY,{"decision":"deny","reason":"symlink source forbidden"}
        resolved=raw.resolve(strict=True)
        if not resolved.is_file(): return DENY,{"decision":"deny","reason":"source is not regular file"}
        resolved_roots=[Path(r).expanduser().resolve(strict=True) for r in roots]
        matched=next((r for r in resolved_roots if resolved==r or r in resolved.parents),None)
        size=resolved.stat().st_size
    except (OSError,RuntimeError) as exc:
        return INVALID,{"decision":"invalid","reason":f"path resolution failed: {exc}"}
    max_bytes=policy.get("max_file_bytes",10485760)
    if not isinstance(max_bytes,int) or isinstance(max_bytes,bool) or max_bytes<0:
        return INVALID,{"decision":"invalid","reason":"max_file_bytes must be non-negative integer"}
    meta={"canonical_path":str(resolved),"size_bytes":size,"matched_root":str(matched) if matched else None}
    if size>max_bytes: return DENY,{"decision":"deny","reason":"file exceeds size limit",**meta}
    if matched: return ALLOW,{"decision":"allow","reason":"path confined to allowed root",**meta}
    if policy.get("require_approval_for_outside_root",False):
        return APPROVAL,{"decision":"approval_required","reason":"outside configured roots",**meta}
    return DENY,{"decision":"deny","reason":"outside configured roots",**meta}

def main()->int:
    p=argparse.ArgumentParser(); p.add_argument("--policy",type=Path,required=True); p.add_argument("--path",type=Path,required=True); a=p.parse_args()
    try: policy=load_policy(a.policy)
    except ValueError as exc: print(json.dumps({"decision":"invalid","reason":str(exc)})); return INVALID
    code,result=evaluate(a.path,policy); print(json.dumps(result,sort_keys=True)); return code
if __name__=="__main__": raise SystemExit(main())
