#!/usr/bin/env python3
import argparse, hashlib, json, re, subprocess, sys
from pathlib import Path

MARKER = re.compile(r"^<<<<<<< .*?$", re.M)

def revision():
    try:
        return subprocess.check_output(["git","rev-parse","HEAD"], text=True).strip()
    except Exception:
        return "unknown-revision"

def risk_for(path):
    p=path.lower()
    if any(x in p for x in ("/security/","/auth/","/migrations/","/infra/","/contracts/","/api/")) or Path(path).suffix.lower() in (".sql",".tf",".bicep"):
        return "high"
    return "medium"

def parse_file(path):
    text=Path(path).read_text(encoding="utf-8")
    lines=text.splitlines()
    out=[]; i=0; n=0
    while i < len(lines):
        if lines[i].startswith("<<<<<<< "):
            start=i+1; i+=1; ours=[]; base=[]; theirs=[]
            while i<len(lines) and not lines[i].startswith(("||||||| ","=======")):
                ours.append(lines[i]); i+=1
            if i<len(lines) and lines[i].startswith("||||||| "):
                i+=1
                while i<len(lines) and lines[i] != "=======": base.append(lines[i]); i+=1
            if i>=len(lines) or lines[i] != "=======": raise ValueError(f"malformed conflict in {path}:{start}")
            i+=1
            while i<len(lines) and not lines[i].startswith(">>>>>>> "): theirs.append(lines[i]); i+=1
            if i>=len(lines): raise ValueError(f"unterminated conflict in {path}:{start}")
            end=i+1; n+=1
            out.append({"id":f"{path}#{n}","file":path.replace('\\','/'),"start_line":start,"end_line":end,"ours":"\n".join(ours),"theirs":"\n".join(theirs),"base":"\n".join(base),"risk":risk_for(path)})
        i+=1
    return out

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--files",nargs="+"); ap.add_argument("--output",required=True); ns=ap.parse_args()
    try:
        files=ns.files
        if not files:
            raw=subprocess.check_output(["git","diff","--name-only","--diff-filter=U"], text=True)
            files=[x for x in raw.splitlines() if x.strip()]
        conflicts=[]
        for f in files: conflicts.extend(parse_file(f))
        data={"version":"1.0","repository_revision":revision(),"conflicts":conflicts}
        Path(ns.output).write_text(json.dumps(data,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
        print(json.dumps({"status":"ok","conflicts":len(conflicts)})); return 0
    except Exception as e:
        print(json.dumps({"status":"error","error":str(e)})); return 1
if __name__=="__main__": sys.exit(main())
