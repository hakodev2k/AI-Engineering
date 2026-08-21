#!/usr/bin/env python3
"""Sanitize every string leaf in a JSON tool result while preserving structure."""
from __future__ import annotations
import argparse, importlib.util, json, os, sys
from pathlib import Path


def load_guard(path: Path):
    spec=importlib.util.spec_from_file_location("secret_dlp_guard",path)
    if spec is None or spec.loader is None: raise RuntimeError("cannot load guard")
    mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod); return mod


def walk(value,guard,policy,findings):
    if isinstance(value,str):
        clean,fs,blocked=guard.sanitize_text(value,policy); findings.extend(fs)
        return None if blocked else clean, blocked
    if isinstance(value,list):
        out=[]; any_block=False
        for v in value:
            nv,b=walk(v,guard,policy,findings); out.append(nv); any_block|=b
        return out,any_block
    if isinstance(value,dict):
        out={}; any_block=False
        for k,v in value.items():
            nv,b=walk(v,guard,policy,findings); out[k]=nv; any_block|=b
        return out,any_block
    return value,False


def main():
    ap=argparse.ArgumentParser(); ap.add_argument("input"); ap.add_argument("output"); ap.add_argument("--policy",required=True); ap.add_argument("--guard",default=str(Path(__file__).with_name("secret_dlp_guard.py"))); a=ap.parse_args()
    try:
        policy=json.loads(Path(a.policy).read_text(encoding="utf-8")); data=json.loads(Path(a.input).read_text(encoding="utf-8")); guard=load_guard(Path(a.guard)); findings=[]; clean,blocked=walk(data,guard,policy,findings)
        envelope={"dlp_status":"blocked" if blocked else ("redacted" if findings else "clean"),"dlp_version":policy.get("version",1),"result":None if blocked else clean,"redaction_count":len(findings),"findings":findings}
        Path(a.output).write_text(json.dumps(envelope,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        return 3 if blocked else 0
    except Exception as e:
        Path(a.output).write_text(json.dumps({"dlp_status":"blocked","reason":"dlp_scanner_failed"},indent=2)+"\n",encoding="utf-8")
        print(str(e),file=sys.stderr); return 4

if __name__=="__main__": raise SystemExit(main())