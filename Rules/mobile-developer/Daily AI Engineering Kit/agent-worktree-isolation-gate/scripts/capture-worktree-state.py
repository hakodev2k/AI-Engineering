#!/usr/bin/env python3
import argparse, json, subprocess, sys
from pathlib import Path


def run(*args):
    p=subprocess.run(args,text=True,capture_output=True)
    if p.returncode!=0:
        raise RuntimeError(p.stderr.strip() or 'git command failed')
    return p.stdout.strip()


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--output',required=True)
    ns=ap.parse_args()
    try:
        root=run('git','rev-parse','--show-toplevel')
        branch=run('git','rev-parse','--abbrev-ref','HEAD')
        head=run('git','rev-parse','HEAD')
        porcelain=run('git','status','--porcelain=v1')
        worktrees=run('git','worktree','list','--porcelain')
        state={
            'repository_root':str(Path(root).resolve()),
            'worktree_path':str(Path.cwd().resolve()),
            'branch':branch,
            'head_revision':head,
            'dirty':bool(porcelain),
            'status_lines':[x for x in porcelain.splitlines() if x],
            'worktree_porcelain':worktrees.splitlines()
        }
        Path(ns.output).write_text(json.dumps(state,indent=2)+'\n',encoding='utf-8')
        print(json.dumps({'status':'captured','output':ns.output}))
        return 0
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)}))
        return 1

if __name__=='__main__': sys.exit(main())
