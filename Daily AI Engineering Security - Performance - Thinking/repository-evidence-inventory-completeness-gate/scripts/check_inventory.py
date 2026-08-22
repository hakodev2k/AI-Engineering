#!/usr/bin/env python3
"""Check repository evidence-inventory completeness.

Config JSON:
{
  "roots":["docs","src"],
  "evidence_classes":[
    {"name":"screenshots","patterns":["**/*.png"],"required":true},
    {"name":"handover","patterns":["**/*handover*.md"],"required":true}
  ],
  "exclude":["**/node_modules/**","**/.git/**"]
}

Exit: 0 complete, 2 invalid, 3 incomplete.
"""
from __future__ import annotations
import argparse, fnmatch, hashlib, json, os, sys
from pathlib import Path


def load(path: Path):
    try: v=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read config: {exc}") from exc
    if not isinstance(v,dict): raise ValueError("config must be object")
    return v


def glob_variants(pattern: str) -> list[str]:
    """Allow **/ to match zero or more directories, unlike plain fnmatch."""
    variants={pattern}
    while "**/" in pattern:
        pattern=pattern.replace("**/","",1)
        variants.add(pattern)
    return list(variants)


def matches(path: str, patterns: list[str]) -> bool:
    for pattern in patterns:
        for candidate in glob_variants(pattern):
            if fnmatch.fnmatch(path,candidate) or Path(path).match(candidate):
                return True
    return False


def main():
    p=argparse.ArgumentParser(description=__doc__); p.add_argument("repo",type=Path); p.add_argument("config",type=Path); p.add_argument("--baseline",type=Path)
    a=p.parse_args()
    try:
        repo=a.repo.resolve(); cfg=load(a.config)
        if not repo.is_dir(): raise ValueError("repo must be directory")
        roots=cfg.get("roots",["."]); classes=cfg.get("evidence_classes",[]); exclude=cfg.get("exclude",[])
        if not isinstance(roots,list) or not all(isinstance(x,str) for x in roots): raise ValueError("roots must be strings")
        if not isinstance(classes,list): raise ValueError("evidence_classes must be array")
        if not isinstance(exclude,list) or not all(isinstance(x,str) for x in exclude): raise ValueError("exclude must be strings")
        files=set(); missing_roots=[]
        for root in roots:
            rp=(repo/root).resolve()
            try: rp.relative_to(repo)
            except ValueError: raise ValueError(f"root escapes repository: {root}")
            if not rp.exists(): missing_roots.append(root); continue
            for base,dirs,names in os.walk(rp,followlinks=False):
                dirs[:] = [d for d in dirs if not matches(str((Path(base)/d).relative_to(repo)).replace('\\','/'),exclude)]
                for n in names:
                    rel=str((Path(base)/n).relative_to(repo)).replace('\\','/')
                    if not matches(rel,exclude): files.add(rel)
        results=[]; all_required=True
        for c in classes:
            if not isinstance(c,dict): raise ValueError("evidence class must be object")
            name=c.get("name"); pats=c.get("patterns"); required=c.get("required",True)
            if not isinstance(name,str) or not name or not isinstance(pats,list) or not pats or not all(isinstance(x,str) for x in pats): raise ValueError("class requires name and patterns")
            hits=sorted(f for f in files if matches(f,pats)); resolved=bool(hits) or not required
            if required and not hits: all_required=False
            results.append({"name":name,"required":bool(required),"count":len(hits),"resolved":resolved,"files":hits})
        manifest_hash=hashlib.sha256("\n".join(sorted(files)).encode()).hexdigest()
        added=[]
        if a.baseline:
            b=load(a.baseline); old=set(b.get("all_files",[])); added=sorted(files-old)
        complete=all_required and not missing_roots
        out={"complete":complete,"repository":str(repo),"missing_roots":missing_roots,"total_files":len(files),"manifest_sha256":manifest_hash,"evidence_classes":results,"new_since_baseline":added,"all_files":sorted(files)}
        print(json.dumps(out,indent=2)); return 0 if complete else 3
    except (ValueError,TypeError,OSError) as exc:
        print(json.dumps({"complete":False,"error":str(exc)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())
