#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise SystemExit(f"failed to read {path}: {exc}")

def main():
    p=argparse.ArgumentParser()
    p.add_argument("assumptions")
    p.add_argument("--policy")
    p.add_argument("--output")
    a=p.parse_args()
    data=load(a.assumptions)
    if not isinstance(data,list): raise SystemExit("assumptions must be a JSON array")
    result={"assumption_fingerprint": hashlib.sha256(canonical(data)).hexdigest()}
    if a.policy:
        result["policy_fingerprint"]=hashlib.sha256(canonical(load(a.policy))).hexdigest()
    text=json.dumps(result,indent=2)
    if a.output: Path(a.output).write_text(text+"\n",encoding="utf-8")
    else: print(text)
    return 0
if __name__=="__main__": sys.exit(main())