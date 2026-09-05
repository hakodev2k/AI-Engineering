#!/usr/bin/env python3
import json, sys
from pathlib import Path

RISK_FILES=("binding.gyp", ".node", ".exe", ".dll", ".cmd", ".bat", ".ps1")
RISK_SCRIPTS={"preinstall","install","postinstall","prepare"}

def read_json(p):
    try: return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception as e: raise ValueError(f"cannot read {p}: {e}")

def main(a):
    if len(a)!=3:
        print(f"usage: {a[0]} <policy.json> <manifest.json>",file=sys.stderr); return 1
    try:
        pol, man=read_json(a[1]), read_json(a[2])
        name, ver=man["name"], man["version"]
        digest=man.get("sha256","")
        scripts=man.get("scripts",{})
        files=man.get("files",[])
        publisher=man.get("publisher","")
        if not all(isinstance(x,str) for x in [name,ver,digest,publisher]) or not isinstance(scripts,dict) or not isinstance(files,list):
            raise ValueError("invalid manifest field types")
    except (KeyError,ValueError) as e:
        print(f"ERROR: {e}",file=sys.stderr); return 1
    findings=[]
    blocked={tuple(x) for x in pol.get("blocked_packages",[])}
    if (name,ver) in blocked: findings.append("BLOCK known malicious/blocked package version")
    if not digest or len(digest)<32: findings.append("QUARANTINE missing/weak immutable digest")
    allowed=set(pol.get("allowed_publishers",[]))
    if allowed and publisher not in allowed: findings.append(f"QUARANTINE unapproved publisher: {publisher or '<missing>'}")
    risky_scripts=sorted(RISK_SCRIPTS & set(scripts))
    if risky_scripts: findings.append("QUARANTINE lifecycle scripts: "+", ".join(risky_scripts))
    risky_files=[]
    for f in files:
        if not isinstance(f,str): continue
        low=f.lower()
        if low=="binding.gyp" or low.endswith(RISK_FILES[1:]): risky_files.append(f)
    if risky_files: findings.append("QUARANTINE executable/native surfaces: "+", ".join(sorted(risky_files)[:20]))
    if findings:
        print("QUARANTINE")
        for f in findings: print("- "+f)
        return 2
    print(f"PASS: {name}@{ver} has no blocking finding in supplied evidence")
    return 0
if __name__=="__main__": sys.exit(main(sys.argv))
