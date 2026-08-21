#!/usr/bin/env python3
import argparse, hashlib, json, sys

def canonical(v):
    return json.dumps(v, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def main():
    p=argparse.ArgumentParser(); p.add_argument("plan"); p.add_argument("--output")
    a=p.parse_args()
    try:
        data=json.load(open(a.plan,encoding="utf-8"))
        identity={k:data.get(k) for k in ["migration_id","revision","environment","source","predicate","ordering_key","transform_fingerprint","chunk_size","idempotency_strategy","verification"]}
        fp=hashlib.sha256(canonical(identity).encode()).hexdigest()
        data["plan_fingerprint"]=fp
        text=json.dumps(data,indent=2,ensure_ascii=False)+"\n"
        if a.output: open(a.output,"w",encoding="utf-8").write(text)
        else: sys.stdout.write(text)
    except Exception as e:
        print(f"error: {e}",file=sys.stderr); return 2
    return 0
if __name__=="__main__": raise SystemExit(main())
