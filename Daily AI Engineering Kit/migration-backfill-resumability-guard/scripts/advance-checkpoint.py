#!/usr/bin/env python3
import argparse, json, os, tempfile
from datetime import datetime, timezone

def main():
    p=argparse.ArgumentParser(); p.add_argument("--checkpoint",required=True); p.add_argument("--expected-version",type=int,required=True); p.add_argument("--cursor",required=True); p.add_argument("--processed",type=int,required=True); p.add_argument("--status",choices=["ready","running","paused","failed","completed","blocked"],required=True); p.add_argument("--lease-owner",required=True); p.add_argument("--lease-expires-at",required=True)
    a=p.parse_args()
    try:
        cp=json.load(open(a.checkpoint,encoding="utf-8"))
        if cp.get("checkpoint_version")!=a.expected_version:
            print("checkpoint version conflict"); return 5
        if a.processed<0: print("processed must be >=0"); return 2
        cp.update({"checkpoint_version":a.expected_version+1,"cursor":a.cursor,"processed_total":int(cp.get("processed_total",0))+a.processed,"status":a.status,"lease_owner":a.lease_owner,"lease_expires_at":a.lease_expires_at,"updated_at":datetime.now(timezone.utc).isoformat().replace("+00:00","Z")})
        d=os.path.dirname(os.path.abspath(a.checkpoint)); fd,tmp=tempfile.mkstemp(dir=d,prefix=".checkpoint-",text=True)
        with os.fdopen(fd,"w",encoding="utf-8") as f: json.dump(cp,f,indent=2); f.write("\n"); f.flush(); os.fsync(f.fileno())
        os.replace(tmp,a.checkpoint); return 0
    except Exception as e:
        print(f"error: {e}"); return 2
if __name__=="__main__": raise SystemExit(main())
