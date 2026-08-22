#!/usr/bin/env python3
"""Validate a coding-agent repository working-set manifest.

Manifest:
{
  "context_bytes": 50000,
  "segments": [{"id":"s1","sha256":"...","bytes":1000}],
  "facts": [{"id":"api","required":true,"fresh":true,"source":"src/api.cs","sha256":"...","present":true}]
}
Exit: 0 allow, 2 invalid input, 3 policy block.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

HEX64 = re.compile(r"^[0-9a-fA-F]{64}$")

def load(path: Path):
    try: value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict): raise ValueError(f"{path} must contain an object")
    return value

def nonneg(value, name):
    if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0: raise ValueError(f"{name} must be non-negative")
    return float(value)

def analyze(m, p):
    facts=m.get("facts",[]); segs=m.get("segments",[])
    if not isinstance(facts,list) or not isinstance(segs,list): raise ValueError("facts and segments must be lists")
    total=nonneg(m.get("context_bytes",0),"context_bytes")
    required=covered=0; missing=[]; stale=[]
    for i,f in enumerate(facts):
        if not isinstance(f,dict): raise ValueError(f"facts[{i}] must be object")
        fid=f.get("id"); src=f.get("source")
        if not isinstance(fid,str) or not fid: raise ValueError(f"facts[{i}].id required")
        if not isinstance(src,str) or not src: raise ValueError(f"{fid}.source required")
        req=f.get("required") is True
        if req:
            required += 1
            present=f.get("present") is True
            fresh=f.get("fresh") is True
            sha=f.get("sha256")
            valid_hash=isinstance(sha,str) and bool(HEX64.match(sha))
            if present and fresh and (valid_hash or not p.get("require_fresh_hash_for_required_files",True)): covered += 1
            if not present: missing.append(fid)
            elif not fresh or (p.get("require_fresh_hash_for_required_files",True) and not valid_hash): stale.append(fid)
    coverage=1.0 if required==0 else covered/required
    hashes={}; duplicate_bytes=0
    for i,s in enumerate(segs):
        if not isinstance(s,dict): raise ValueError(f"segments[{i}] must be object")
        b=nonneg(s.get("bytes",0),f"segments[{i}].bytes"); sha=s.get("sha256")
        if isinstance(sha,str) and HEX64.match(sha):
            if sha in hashes: duplicate_bytes += b
            else: hashes[sha]=b
    duplicate_ratio=0.0 if total==0 else min(1.0, duplicate_bytes/total)
    findings=[]
    if total > nonneg(p.get("max_context_bytes",120000),"max_context_bytes"): findings.append("context budget exceeded")
    if duplicate_ratio > float(p.get("max_duplicate_ratio",0.15)): findings.append("duplicate context ratio exceeded")
    if coverage < float(p.get("min_required_fact_coverage",1.0)): findings.append("required fact coverage below threshold")
    if missing: findings.append("missing required facts: " + ",".join(missing))
    if stale: findings.append("stale/unverifiable required facts: " + ",".join(stale))
    return {"decision":"allow" if not findings else "block","context_bytes":int(total),"required_facts":required,"covered_required_facts":covered,"required_fact_coverage":coverage,"duplicate_ratio":duplicate_ratio,"missing":missing,"stale":stale,"findings":findings}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("manifest",type=Path); ap.add_argument("--policy",type=Path,required=True); a=ap.parse_args()
    try: result=analyze(load(a.manifest),load(a.policy))
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2)); return 0 if result["decision"]=="allow" else 3
if __name__=="__main__": raise SystemExit(main())
