#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

REQUIRED = {"task","status","boundaries","findings","commands","verification_status","remaining_risks"}
ALLOWED_STATUS={"investigating","implemented","blocked","verified"}
ALLOWED_VERIFY={"unverified","verified","blocked"}


def main() -> int:
    p=argparse.ArgumentParser(); p.add_argument("--evidence", required=True); p.add_argument("--schema", required=True); a=p.parse_args()
    ep=Path(a.evidence); sp=Path(a.schema)
    if not ep.is_file() or not sp.is_file(): print("evidence/schema missing", file=sys.stderr); return 2
    try: data=json.loads(ep.read_text(encoding="utf-8")); json.loads(sp.read_text(encoding="utf-8"))
    except Exception as exc: print(f"invalid JSON: {exc}", file=sys.stderr); return 2
    missing=REQUIRED-data.keys()
    if missing: print("missing evidence keys: "+", ".join(sorted(missing)), file=sys.stderr); return 2
    if data["status"] not in ALLOWED_STATUS or data["verification_status"] not in ALLOWED_VERIFY:
        print("invalid status", file=sys.stderr); return 2
    if not isinstance(data["boundaries"], list) or not data["boundaries"]: print("at least one boundary required", file=sys.stderr); return 2
    for i,b in enumerate(data["boundaries"]):
        if not all(k in b for k in ("name","kind","entry","exit","evidence")) or not b.get("evidence"):
            print(f"boundary {i} incomplete", file=sys.stderr); return 2
    for i,f in enumerate(data["findings"]):
        req={"finding","evidence","confidence","affected_component","risk","recommended_action","verification_status"}
        if req-f.keys(): print(f"finding {i} incomplete", file=sys.stderr); return 2
    if data["verification_status"] == "verified" and data["status"] != "verified":
        print("verified evidence requires status=verified", file=sys.stderr); return 2
    print("evidence contract valid")
    return 0

if __name__ == "__main__": raise SystemExit(main())
