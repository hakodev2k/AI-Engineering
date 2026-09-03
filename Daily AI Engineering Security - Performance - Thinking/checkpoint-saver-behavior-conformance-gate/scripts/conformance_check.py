#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def load(p):
    try: return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception as e: raise ValueError(f"cannot read {p}: {e}")

def main():
    ap=argparse.ArgumentParser(description="Evaluate checkpoint saver observations against an invariant profile")
    ap.add_argument("--profile", required=True); ap.add_argument("--observations", required=True)
    a=ap.parse_args()
    try:
        profile, obs = load(a.profile), load(a.observations)
        required=profile.get("required",[]); results=obs.get("invariants",{})
        missing=[x for x in required if x not in results]
        failed=[x for x in required if results.get(x) is not True]
        raw=Path(a.observations).read_bytes(); fixture_hash=hashlib.sha256(raw).hexdigest()
        report={"backend":obs.get("backend"),"version":obs.get("version"),"profile_version":profile.get("profile_version"),"observation_hash":fixture_hash,"missing":missing,"failed":failed,"eligible":not missing and not failed}
        print(json.dumps(report, indent=2, sort_keys=True))
        return 0 if report["eligible"] else 3
    except Exception as e:
        print(json.dumps({"eligible":False,"error":str(e)}), file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
