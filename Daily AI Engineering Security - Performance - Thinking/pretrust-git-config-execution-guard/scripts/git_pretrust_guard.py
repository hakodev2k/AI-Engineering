#!/usr/bin/env python3
"""Static Git pretrust scanner. Never invokes git. 0=safe, 2=blocked, 3=error."""
from __future__ import annotations
import argparse,json,re,sys
from pathlib import Path
BOOL={"true","false","yes","no","on","off","1","0"}
SEC=re.compile(r"^\s*\[\s*([^\]]+)\s*\]\s*(?:[#;].*)?$")
KV=re.compile(r"^\s*([A-Za-z0-9.-]+)\s*(?:=\s*(.*))?$")
def gitdir(repo:Path)->Path:
 d=repo/".git"
 if d.is_dir(): return d.resolve()
 if d.is_file():
  t=d.read_text(encoding="utf-8").strip()
  if not t.lower().startswith("gitdir:"): raise ValueError("invalid gitdir pointer")
  p=Path(t.split(":",1)[1].strip()); p=(repo/p).resolve() if not p.is_absolute() else p.resolve()
  if not p.is_dir(): raise ValueError("gitdir target missing")
  return p
 raise ValueError("missing .git metadata")
def clean(v:str)->str:
 v=v.strip()
 if len(v)>=2 and v[0]==v[-1]=='"': return v[1:-1]
 for m in (" #"," ;"):
  i=v.find(m)
  if i>=0:v=v[:i]
 return v.strip().strip('"')
def scan(p:Path):
 section=None; out=[]
 for n,raw in enumerate(p.read_text(encoding="utf-8").splitlines(),1):
  if not raw.strip() or raw.lstrip().startswith(("#",";")):continue
  m=SEC.match(raw)
  if m: section=m.group(1).strip().lower();continue
  m=KV.match(raw)
  if not m:
   if raw[:1].isspace():continue
   raise ValueError(f"unrecognized config syntax line {n}")
  if section is None:raise ValueError(f"key outside section line {n}")
  value=clean(m.group(2) if m.group(2) is not None else "true")
  if section=="core" and m.group(1).lower()=="fsmonitor" and value.lower() not in BOOL:
   out.append({"key":"core.fsmonitor","value":value,"line":n,"reason":"non-boolean value may name executable helper"})
 return out
def inspect(arg:str):
 repo=Path(arg).expanduser().resolve()
 if not repo.is_dir():raise ValueError("repository path is not directory")
 cfg=gitdir(repo)/"config"
 if not cfg.is_file():raise ValueError("Git config missing")
 f=scan(cfg);return {"repository":str(repo),"config_path":str(cfg),"findings":f,"decision":"blocked" if f else "safe"}
def main():
 ap=argparse.ArgumentParser();ap.add_argument("repository");ap.add_argument("--json",action="store_true");a=ap.parse_args()
 try:r=inspect(a.repository);code=2 if r["findings"] else 0
 except (OSError,UnicodeError,ValueError) as e:r={"repository":a.repository,"decision":"error","error":str(e)};code=3
 print(json.dumps(r,sort_keys=True) if a.json else json.dumps(r,indent=2,sort_keys=True));return code
if __name__=="__main__":sys.exit(main())
