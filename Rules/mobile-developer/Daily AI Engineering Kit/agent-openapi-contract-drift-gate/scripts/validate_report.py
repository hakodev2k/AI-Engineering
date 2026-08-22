#!/usr/bin/env python3
import json, sys
from pathlib import Path

def main():
    if len(sys.argv)!=2:
        print("usage: validate_report.py <report.json>",file=sys.stderr); return 64
    p=Path(sys.argv[1])
    try: d=json.loads(p.read_text(encoding="utf-8"))
    except Exception as e: print(f"invalid json: {e}",file=sys.stderr); return 65
    required=["status","baseline","candidate","findings","verification"]
    missing=[k for k in required if k not in d]
    if missing: print("missing: "+", ".join(missing),file=sys.stderr); return 66
    if d["status"] not in {"pass","warning","blocked"}: print("invalid status",file=sys.stderr); return 67
    if not isinstance(d["findings"],list): print("findings must be list",file=sys.stderr); return 68
    bc=sum(1 for f in d["findings"] if isinstance(f,dict) and f.get("breaking") is True)
    if d.get("verification",{}).get("breaking_count")!=bc: print("breaking_count mismatch",file=sys.stderr); return 69
    if (bc>0)!=(d.get("verification",{}).get("approval_required") is True): print("approval flag mismatch",file=sys.stderr); return 70
    if bc>0 and d["status"]!="blocked": print("breaking changes must block",file=sys.stderr); return 71
    print("report valid"); return 0
if __name__=="__main__": raise SystemExit(main())
