#!/usr/bin/env python3
"""Read-only Git worktree identity and write-path boundary verifier."""
import argparse,json,os,pathlib,subprocess,sys

def git(cwd,*args):
    p=subprocess.run(["git",*args],cwd=cwd,text=True,capture_output=True)
    if p.returncode: raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout.strip()
def inside(path,root):
    try: return os.path.commonpath([str(path),str(root)])==str(root)
    except ValueError: return False

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--expected-root",required=True); ap.add_argument("--expected-branch"); ap.add_argument("--cwd",default=os.getcwd()); ap.add_argument("--write-path",action="append",default=[]); a=ap.parse_args()
    try:
        root=pathlib.Path(a.expected_root).expanduser().resolve(); cwd=pathlib.Path(a.cwd).expanduser().resolve()
        observed=pathlib.Path(git(cwd,"rev-parse","--show-toplevel")).resolve(); branch=git(cwd,"branch","--show-current")
        wt=git(cwd,"worktree","list","--porcelain").splitlines(); registered={pathlib.Path(x[9:]).resolve() for x in wt if x.startswith("worktree ")}
        violations=[]
        if observed!=root: violations.append("git_top_level_mismatch")
        if not inside(cwd,root): violations.append("cwd_outside_expected_root")
        if root not in registered: violations.append("expected_root_not_registered_worktree")
        if a.expected_branch is not None and branch!=a.expected_branch: violations.append("branch_mismatch")
        checked=[]
        for raw in a.write_path:
            p=(cwd/raw).resolve() if not pathlib.Path(raw).is_absolute() else pathlib.Path(raw).resolve()
            checked.append(str(p))
            if not inside(p,root): violations.append(f"write_path_escape:{raw}")
        out={"status":"BLOCK" if violations else "PASS","expected_root":str(root),"observed_root":str(observed),"cwd":str(cwd),"branch":branch,"write_paths":checked,"violations":violations}
        print(json.dumps(out,indent=2)); return 3 if violations else 0
    except Exception as exc:
        print(json.dumps({"status":"INVALID","error":str(exc)})); return 2
if __name__=="__main__": raise SystemExit(main())
