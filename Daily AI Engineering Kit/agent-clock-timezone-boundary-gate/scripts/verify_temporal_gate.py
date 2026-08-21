#!/usr/bin/env python3
import argparse, json, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path

def run(cmd):
    r=subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return {"command":cmd,"exit_code":r.returncode,"stdout":r.stdout[-8000:],"stderr":r.stderr[-8000:]}

def main():
    p=argparse.ArgumentParser(); p.add_argument("--config",required=True); a=p.parse_args()
    cp=Path(a.config)
    try: cfg=json.loads(cp.read_text(encoding="utf-8"))
    except Exception as e: print(f"invalid config: {e}",file=sys.stderr); return 2
    commands=cfg.get("verification_commands")
    if not isinstance(commands,list) or not commands or not all(isinstance(x,str) and x.strip() for x in commands):
        print("verification_commands must be a non-empty string array",file=sys.stderr); return 2
    results=[]
    for cmd in commands:
        result=run(cmd); results.append(result)
        if result["exit_code"] != 0 and cfg.get("fail_fast",True): break
    status="verified" if len(results)==len(commands) and all(x["exit_code"]==0 for x in results) else "failed"
    report={"topic":"agent-clock-timezone-boundary-gate","status":status,"generated_at_utc":datetime.now(timezone.utc).isoformat(),"checks":results,"remaining_risks":[]}
    out=Path(cfg.get("report_path",".ai-temporal/verification.json")); out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(f"temporal gate: {status} -> {out}")
    return 0 if status=="verified" else 1
if __name__=="__main__": raise SystemExit(main())
