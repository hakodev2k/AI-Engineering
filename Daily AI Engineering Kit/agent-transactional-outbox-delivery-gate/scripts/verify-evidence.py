#!/usr/bin/env python3
import argparse, json, pathlib, sys

def main():
    p=argparse.ArgumentParser(); p.add_argument("--evidence", required=True); p.add_argument("--schema", required=True); a=p.parse_args()
    try:
        ev=json.loads(pathlib.Path(a.evidence).read_text(encoding="utf-8")); schema=json.loads(pathlib.Path(a.schema).read_text(encoding="utf-8"))
    except Exception as e:
        print(f"invalid input: {e}", file=sys.stderr); return 2
    required=schema.get("required",[]); missing=[k for k in required if k not in ev]
    if missing: print("missing evidence keys: "+", ".join(missing), file=sys.stderr); return 2
    allowed={"investigating","implemented","blocked","failed","verified"}
    if ev.get("status") not in allowed: print("invalid status", file=sys.stderr); return 2
    if ev.get("verification_status") not in {"pending","verified","failed","blocked"}: print("invalid verification_status", file=sys.stderr); return 2
    if not isinstance(ev.get("findings"),list) or not isinstance(ev.get("checks"),list) or not isinstance(ev.get("changed_files"),list) or not isinstance(ev.get("remaining_risks"),list):
        print("array field has invalid type", file=sys.stderr); return 2
    for i,f in enumerate(ev["findings"]):
        for k in ("finding","evidence","confidence"):
            if k not in f: print(f"finding {i} missing {k}", file=sys.stderr); return 2
        if f["confidence"] not in {"low","medium","high"}: print(f"finding {i} invalid confidence", file=sys.stderr); return 2
    for i,c in enumerate(ev["checks"]):
        if c.get("result") not in {"passed","failed","blocked","not_applicable"} or not c.get("name"):
            print(f"check {i} invalid", file=sys.stderr); return 2
    if ev.get("verification_status")=="verified" and any(c.get("result") in {"failed","blocked"} for c in ev["checks"]):
        print("verified evidence contains failed/blocked checks", file=sys.stderr); return 1
    print("evidence valid")
    return 0
if __name__=="__main__": raise SystemExit(main())
