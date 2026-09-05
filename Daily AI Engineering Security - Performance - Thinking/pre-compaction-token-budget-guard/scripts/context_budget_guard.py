#!/usr/bin/env python3
"""Canonical context-budget and compaction decision calculator."""
import json, sys
from pathlib import Path

def load_config(path):
    try: cfg=json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(str(exc))
    for key in ("context_window","reserved_tokens","compact_at_utilization"):
        if key not in cfg: raise ValueError(f"missing {key}")
    cw=cfg["context_window"]; reserve=cfg["reserved_tokens"]; threshold=cfg["compact_at_utilization"]
    if not isinstance(cw,int) or cw<=0: raise ValueError("context_window must be positive integer")
    if not isinstance(reserve,int) or reserve<0 or reserve>=cw: raise ValueError("reserved_tokens must be integer in [0, context_window)")
    if not isinstance(threshold,(int,float)) or not 0<threshold<1: raise ValueError("compact_at_utilization must be between 0 and 1")
    return cw,reserve,float(threshold)

def calculate(cw,reserve,threshold,used):
    if not isinstance(used,int) or used<0: raise ValueError("used_tokens must be non-negative integer")
    usable=cw-reserve; trigger=int(usable*threshold); utilization=used/usable
    return {"context_window":cw,"reserved_tokens":reserve,"usable_tokens":usable,"used_tokens":used,"remaining_usable_tokens":max(0,usable-used),"threshold_tokens":trigger,"utilization":round(utilization,6),"compact":used>=trigger}

def main(argv):
    if len(argv)!=3: print(f"usage: {argv[0]} <budget.json> <used_tokens>",file=sys.stderr); return 1
    try:
        cw,reserve,threshold=load_config(argv[1]); used=int(argv[2]); result=calculate(cw,reserve,threshold,used)
    except (ValueError,TypeError) as exc: print(f"ERROR: {exc}",file=sys.stderr); return 1
    print(json.dumps(result,sort_keys=True)); return 3 if result["compact"] else 0
if __name__=="__main__": sys.exit(main(sys.argv))
