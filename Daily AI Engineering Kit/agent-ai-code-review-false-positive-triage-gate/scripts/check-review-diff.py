#!/usr/bin/env python3
import argparse,json,subprocess,sys
from pathlib import Path

def git(repo,*args):
    p=subprocess.run(["git","-C",repo,*args],text=True,capture_output=True)
    if p.returncode: raise RuntimeError(p.stderr.strip() or "git failed")
    return p.stdout

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--repo",required=True);ap.add_argument("--base",default="HEAD~1");ap.add_argument("--output",required=True);a=ap.parse_args()
    repo=str(Path(a.repo).resolve())
    if not Path(repo,".git").exists(): print("ERROR: not a git repository",file=sys.stderr);return 2
    try:
        names=[x for x in git(repo,"diff","--name-only",a.base,"HEAD").splitlines() if x]
        stats=git(repo,"diff","--numstat",a.base,"HEAD")
    except Exception as e: print(f"ERROR: {e}",file=sys.stderr);return 3
    rows=[]
    for line in stats.splitlines():
        parts=line.split("\t",2)
        if len(parts)==3: rows.append({"added":parts[0],"deleted":parts[1],"path":parts[2]})
    out={"base":a.base,"head":"HEAD","changed_files":names,"numstat":rows}
    Path(a.output).write_text(json.dumps(out,indent=2)+"\n")
    print(f"wrote {a.output} with {len(names)} changed file(s)")
    return 0
if __name__=="__main__": raise SystemExit(main())
