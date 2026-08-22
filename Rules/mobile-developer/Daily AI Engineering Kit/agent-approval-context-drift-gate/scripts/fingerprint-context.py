#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

FIELDS = ["task_id","risk","action_type","target_environment","repository_revision","plan_fingerprint","resource_fingerprint","command_fingerprint","permission_fingerprint","actor_id","dangerous_action"]

def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def canonical_context(data):
    missing=[f for f in FIELDS[:-1] if f not in data]
    if missing: raise ValueError("missing fields: "+", ".join(missing))
    obj={k:data.get(k) for k in FIELDS}
    return json.dumps(obj, sort_keys=True, separators=(",",":"), ensure_ascii=False)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("context")
    ap.add_argument("--output")
    args=ap.parse_args()
    try:
        data=load(args.context)
        fp=hashlib.sha256(canonical_context(data).encode()).hexdigest()
        out={"task_id":data["task_id"],"context_fingerprint":fp}
        text=json.dumps(out, indent=2)
        if args.output: Path(args.output).write_text(text+"\n", encoding="utf-8")
        else: print(text)
        return 0
    except Exception as e:
        print(json.dumps({"status":"error","error":str(e)}), file=sys.stderr)
        return 2
if __name__=="__main__": raise SystemExit(main())
