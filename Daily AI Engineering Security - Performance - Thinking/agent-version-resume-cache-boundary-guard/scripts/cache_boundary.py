#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

CACHE_FIELDS = ("runtime_version","model","effort","system_prompt_hash","tool_schema_hash","hook_context_hash","policy_hash")

def load(path):
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e:
        raise ValueError(f"cannot read manifest {path}: {e}")
    if not isinstance(data,dict): raise ValueError("manifest must be a JSON object")
    missing=[k for k in CACHE_FIELDS if k not in data]
    if missing: raise ValueError("missing fields: "+", ".join(missing))
    return data

def canonical(data):
    return {k:data[k] for k in CACHE_FIELDS}

def fingerprint(data):
    raw=json.dumps(canonical(data),sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()

def compare(old,new):
    changed=[]
    for k in CACHE_FIELDS:
        if old[k]!=new[k]: changed.append(k)
    return changed

def main():
    p=argparse.ArgumentParser(description="Compare cache-relevant resume boundary manifests")
    p.add_argument("checkpoint"); p.add_argument("current"); p.add_argument("--json",action="store_true")
    a=p.parse_args()
    try: old,new=load(a.checkpoint),load(a.current)
    except ValueError as e:
        print(str(e),file=sys.stderr); return 2
    changed=compare(old,new)
    result={"checkpoint_fingerprint":fingerprint(old),"current_fingerprint":fingerprint(new),"compatible":not changed,"changed_fields":changed}
    if a.json: print(json.dumps(result,indent=2,sort_keys=True))
    else: print("compatible" if not changed else "cache-boundary drift: "+", ".join(changed))
    return 0 if not changed else 3
if __name__=="__main__": raise SystemExit(main())
