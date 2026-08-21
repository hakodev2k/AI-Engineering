#!/usr/bin/env python3
"""Fail-closed audit for Windows/WSL path rebinding. Read-only; never mutates state."""
from __future__ import annotations
import argparse, json, ntpath, posixpath, re, sys
from pathlib import Path

WIN = re.compile(r"^[A-Za-z]:[\\/]")
WSL = re.compile(r"^/mnt/([A-Za-z])(?:/|$)")
MIXED_WIN = re.compile(r"^[A-Za-z]:[\\/]mnt[\\/][A-Za-z](?:[\\/]|$)", re.I)
MIXED_WSL = re.compile(r"^/mnt/[A-Za-z]/.*[A-Za-z]:[\\/]", re.I)

def load(path: str) -> dict:
    try: obj = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: raise ValueError(f"cannot load {path}: {exc}") from exc
    if not isinstance(obj, dict): raise ValueError("JSON root must be object")
    return obj

def style(p: str) -> str:
    if MIXED_WIN.search(p) or MIXED_WSL.search(p): return "mixed"
    if WIN.match(p): return "windows"
    if p.startswith("/"): return "wsl" if WSL.match(p) else "posix"
    return "relative"

def norm(p: str, env: str) -> str:
    return ntpath.normcase(ntpath.normpath(p)) if env == "windows" else posixpath.normpath(p)

def under(path: str, root: str, env: str) -> bool:
    p, r = norm(path, env), norm(root, env)
    try: return ntpath.commonpath([p, r]) == r if env == "windows" else posixpath.commonpath([p, r]) == r
    except ValueError: return False

def translate(path: str, mappings: dict[str, str], dest: str) -> str | None:
    candidates = sorted(mappings.items(), key=lambda kv: len(kv[0]), reverse=True)
    for src, target in candidates:
        src_env = "windows" if WIN.match(src) else "wsl"
        if under(path, src, src_env):
            rel = ntpath.relpath(path, src) if src_env == "windows" else posixpath.relpath(path, src)
            if rel == ".": return target
            parts = re.split(r"[\\/]+", rel)
            return ntpath.join(target, *parts) if dest == "windows" else posixpath.join(target, *parts)
    return path if style(path) == dest else None

def audit(state: dict, cfg: dict) -> dict:
    dest = cfg.get("destination_environment")
    if dest not in {"windows","wsl"}: raise ValueError("destination_environment must be windows or wsl")
    mappings = cfg.get("mappings", {}); approved = cfg.get("approved_destination_roots", []); protected = cfg.get("protected_destination_roots", [])
    if not isinstance(mappings, dict) or not approved: raise ValueError("mappings object and approved_destination_roots are required")
    entries = state.get("paths")
    if not isinstance(entries, list): raise ValueError("state.paths must be an array of {kind,value,store}")
    findings=[]; translated=[]
    for i,e in enumerate(entries):
        if not isinstance(e,dict) or not isinstance(e.get("value"),str): findings.append({"index":i,"type":"invalid-entry"}); continue
        value=e["value"]; s=style(value)
        if s in {"mixed","relative"}: findings.append({"index":i,"type":"invalid-namespace","value":value}); continue
        target=translate(value,mappings,dest)
        if target is None: findings.append({"index":i,"type":"unmapped","value":value}); continue
        if style(target) != dest: findings.append({"index":i,"type":"wrong-destination-namespace","value":target}); continue
        if not any(under(target,r,dest) for r in approved): findings.append({"index":i,"type":"outside-approved-root","value":target})
        if any(under(target,r,dest) or under(r,target,dest) for r in protected): findings.append({"index":i,"type":"protected-root-overlap","value":target})
        translated.append({**e,"translated":target})
    canonical={}
    for e in translated:
        key=e.get("logical_id") or e.get("kind")
        canonical.setdefault(str(key),set()).add(norm(e["translated"],dest))
    for key,vals in canonical.items():
        if len(vals)>1: findings.append({"type":"cross-store-mismatch","logical_id":key,"values":sorted(vals)})
    return {"status":"block" if findings else "allow-stage","destination_environment":dest,"translated":translated,"findings":findings}

def main()->int:
    p=argparse.ArgumentParser(); p.add_argument("state"); p.add_argument("--config",required=True); p.add_argument("--pretty",action="store_true"); a=p.parse_args()
    try: result=audit(load(a.state),load(a.config))
    except ValueError as exc: print(json.dumps({"status":"error","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2 if a.pretty else None,sort_keys=True))
    return 1 if result["status"]=="block" else 0
if __name__=="__main__": raise SystemExit(main())
