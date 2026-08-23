#!/usr/bin/env python3
import subprocess, sys

def run(args):
    return subprocess.run(args,capture_output=True,text=True)
def main():
    if run(['git','rev-parse','--is-inside-work-tree']).returncode!=0:
        print('ERROR: not inside a git repository',file=sys.stderr); return 2
    r=run(['git','status','--short'])
    if r.returncode!=0: print(r.stderr,file=sys.stderr); return 2
    print('Changed/untracked files:')
    print(r.stdout.strip() or '(none)')
    d=run(['git','diff','--check'])
    if d.returncode!=0:
        print('git diff --check failed:',file=sys.stderr); print(d.stdout+d.stderr,file=sys.stderr); return 1
    print('DIFF CHECK OK'); return 0
if __name__=='__main__': sys.exit(main())
