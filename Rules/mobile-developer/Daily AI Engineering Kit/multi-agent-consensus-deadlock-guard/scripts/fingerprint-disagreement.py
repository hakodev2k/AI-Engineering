#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def canonical(obj):
    clone = dict(obj)
    clone.pop("evidence_fingerprint", None)
    clone.pop("resolution", None)
    return json.dumps(clone, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()

def main():
    p=argparse.ArgumentParser(); p.add_argument("input"); p.add_argument("--output"); a=p.parse_args()
    try:
        data=json.load(open(a.input,encoding="utf-8")); digest=hashlib.sha256(canonical(data)).hexdigest()
        out={"disagreement_id":data.get("disagreement_id"),"fingerprint":digest}
        text=json.dumps(out,indent=2)
        if a.output:
            output = Path(a.output)
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(text + "\n", encoding="utf-8")
        else: print(text)
    except Exception as e:
        print(f"fingerprint failed: {e}",file=sys.stderr); return 2
    return 0
if __name__=="__main__": raise SystemExit(main())
