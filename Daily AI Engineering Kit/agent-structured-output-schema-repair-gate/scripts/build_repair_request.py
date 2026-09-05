#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

def main():
    p=argparse.ArgumentParser(); p.add_argument("--input",required=True,type=Path); p.add_argument("--report",required=True,type=Path); p.add_argument("--output",required=True,type=Path); a=p.parse_args()
    try:
        raw=a.input.read_bytes(); report=json.loads(a.report.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e:
        print(f"input error: {e}",file=sys.stderr); return 2
    if report.get("status")!="invalid" or not isinstance(report.get("errors"),list):
        print("repair request requires an invalid validation report",file=sys.stderr); return 2
    req={"raw_sha256":hashlib.sha256(raw).hexdigest(),"errors":report["errors"],"instructions":["Return only a corrected JSON value matching the existing contract.","Preserve supported facts from the raw output.","Do not invent missing facts; use an allowed partial/failed status when evidence is insufficient.","Do not weaken or change the schema."]}
    a.output.parent.mkdir(parents=True,exist_ok=True); a.output.write_text(json.dumps(req,indent=2)+"\n",encoding="utf-8"); print("repair request created"); return 0
if __name__=="__main__": raise SystemExit(main())
