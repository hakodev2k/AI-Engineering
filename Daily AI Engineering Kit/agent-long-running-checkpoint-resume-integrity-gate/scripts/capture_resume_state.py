#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, subprocess, sys
from pathlib import Path

def run(repo: Path, *args: str) -> str:
    p=subprocess.run(["git","-C",str(repo),*args],capture_output=True,text=True)
    if p.returncode: raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout

def sha256_text(s:str)->str:return hashlib.sha256(s.encode()).hexdigest()
def norm_scope(scope:str)->str:
    parts=sorted({p.strip().replace('\\','/') for p in scope.split(',') if p.strip()})
    return ','.join(parts)

def main()->int:
    p=argparse.ArgumentParser();p.add_argument('--repo',type=Path,default=Path('.'));p.add_argument('--task-id',required=True);p.add_argument('--scope',required=True);p.add_argument('--output',required=True,type=Path);p.add_argument('--environment-fingerprint',default='');a=p.parse_args()
    try:
        root=Path(run(a.repo,'rev-parse','--show-toplevel').strip())
        head=run(root,'rev-parse','HEAD').strip()
        status=run(root,'status','--porcelain=v1','--untracked-files=all')
        diff=run(root,'diff','--binary','HEAD')
    except RuntimeError as e: print(str(e),file=sys.stderr);return 2
    data={'version':1,'task_id':a.task_id,'scope_hash':sha256_text(norm_scope(a.scope)),'repo_head':head,'working_tree_clean':not bool(status.strip()),'diff_hash':sha256_text(diff),'environment_fingerprint':a.environment_fingerprint}
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(data,indent=2,sort_keys=True)+'\n')
    print(f"captured {head} clean={data['working_tree_clean']}");return 0
if __name__=='__main__':raise SystemExit(main())
