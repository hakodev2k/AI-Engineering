#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path

FIELDS=["task_id","risk","action_type","target_environment","repository_revision","plan_fingerprint","resource_fingerprint","command_fingerprint","permission_fingerprint","actor_id","dangerous_action"]

def load(p): return json.loads(Path(p).read_text(encoding="utf-8"))
def canon(d): return json.dumps({k:d.get(k) for k in FIELDS},sort_keys=True,separators=(",",":"),ensure_ascii=False)
def fp(d): return hashlib.sha256(canon(d).encode()).hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("baseline"); ap.add_argument("current"); ap.add_argument("--output"); a=ap.parse_args()
    try:
        b,c=load(a.baseline),load(a.current)
        for d,name in ((b,"baseline"),(c,"current")):
            miss=[k for k in FIELDS[:-1] if k not in d]
            if miss: raise ValueError(f"{name} missing fields: {', '.join(miss)}")
        changed=[k for k in FIELDS if b.get(k)!=c.get(k)]
        status="unchanged" if not changed else "drifted"
        out={"version":"1.0","task_id":c["task_id"],"baseline_fingerprint":fp(b),"current_fingerprint":fp(c),"status":status,"changed_fields":changed,"checked_at_utc":datetime.now(timezone.utc).isoformat()}
        text=json.dumps(out,indent=2)
        if a.output: Path(a.output).write_text(text+"\n",encoding="utf-8")
        else: print(text)
        return 0 if status=="unchanged" else 3
    except Exception as e:
        print(json.dumps({"status":"invalid","error":str(e)}),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
