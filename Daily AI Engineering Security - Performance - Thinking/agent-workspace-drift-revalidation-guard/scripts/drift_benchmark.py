#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

GUARD = Path(__file__).with_name("workspace_guard.py")


def run(*args, cwd=None):
    return subprocess.run([sys.executable, str(GUARD), *args], cwd=cwd, capture_output=True, text=True)


def git(root, *args):
    subprocess.run(["git", *args], cwd=root, check=True, capture_output=True)


def main():
    cases=[]
    with tempfile.TemporaryDirectory() as td:
        root=Path(td)
        git(root,"init")
        git(root,"config","user.email","benchmark@example.invalid")
        git(root,"config","user.name","Drift Benchmark")
        (root/"app.txt").write_text("v1\n")
        git(root,"add","app.txt"); git(root,"commit","-m","init")
        snap=root/"snap.json"
        r=run("capture","--root",str(root),"--snapshot",str(snap),"--files","app.txt")
        if r.returncode!=0: raise RuntimeError(r.stderr)
        r=run("check","--root",str(root),"--snapshot",str(snap))
        cases.append(("clean",r.returncode==0))
        (root/"app.txt").write_text("v2\n")
        r=run("check","--root",str(root),"--snapshot",str(snap))
        cases.append(("tracked-file-change",r.returncode==10 and "file-changed" in r.stdout))
        (root/"app.txt").write_text("v1\n")
        git(root,"checkout","-b","other")
        r=run("check","--root",str(root),"--snapshot",str(snap))
        cases.append(("branch-change",r.returncode==20 and "hard-stop" in r.stdout))
    passed=sum(1 for _,ok in cases if ok)
    result={"passed":passed,"total":len(cases),"cases":[{"name":n,"ok":ok} for n,ok in cases]}
    print(json.dumps(result,indent=2))
    return 0 if passed==len(cases) else 1

if __name__=="__main__": sys.exit(main())
