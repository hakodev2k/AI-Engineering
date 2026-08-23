#!/usr/bin/env python3
"""Build a deterministic safe resume bundle from JSON context items.
Input JSON: {"items":[{"id","section","content","critical","source", optional "freshness"}]}
Token count is a conservative estimator (ceil UTF-8 characters / 4), not provider billing telemetry.
Exit 0 fits budget, 3 optimized with lazy items, 4 critical content exceeds budget, 2 invalid.
"""
from __future__ import annotations
import argparse, hashlib, json, math, re, sys
from pathlib import Path


def load(path: Path):
    try: x=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(x,dict): raise ValueError("JSON root must be object")
    return x

def norm(s:str, mode:str)->str:
    return re.sub(r"\s+"," ",s).strip() if mode=="whitespace" else s

def est_tokens(s:str)->int:
    return max(1, math.ceil(len(s)/4))

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument("context",type=Path); ap.add_argument("--policy",required=True,type=Path); ap.add_argument("--out",type=Path); a=ap.parse_args()
    try:
        data,pol=load(a.context),load(a.policy); items=data.get("items")
        if not isinstance(items,list): raise ValueError("items must be array")
        max_tokens=int(pol["max_resume_input_tokens"]); critical_sections=set(pol.get("critical_sections",[])); lazy_sections=set(pol.get("lazy_sections",[])); mode=pol.get("duplicate_normalization","whitespace")
        seen=set(); kept=[]; lazy=[]; duplicates=[]
        for i,it in enumerate(items):
            if not isinstance(it,dict): raise ValueError(f"item {i} must be object")
            for k in ("id","section","content","source"):
                if not isinstance(it.get(k),str): raise ValueError(f"item {i} {k} required string")
            critical=bool(it.get("critical")) or it["section"] in critical_sections
            sig=hashlib.sha256(norm(it["content"],mode).encode()).hexdigest()
            if sig in seen:
                duplicates.append(it["id"]); continue
            seen.add(sig); row={**it,"critical":critical,"estimated_tokens":est_tokens(it["content"])}
            (lazy if (it["section"] in lazy_sections and not critical) else kept).append(row)
        critical_tokens=sum(x["estimated_tokens"] for x in kept if x["critical"])
        if critical_tokens>max_tokens:
            out={"decision":"critical-over-budget","critical_tokens":critical_tokens,"budget":max_tokens,"duplicates":duplicates}; print(json.dumps(out,indent=2)); return 4
        # deterministic priority: critical first, then original kept order; overflow noncritical becomes lazy
        result=[]; used=0
        for row in sorted(kept,key=lambda x:(not x["critical"], items.index(next(y for y in items if y["id"]==x["id"])))):
            if row["critical"] or used+row["estimated_tokens"]<=max_tokens:
                result.append(row); used+=row["estimated_tokens"]
            else: lazy.append(row)
        out={"decision":"fit" if not lazy else "optimized","estimated_tokens":used,"budget":max_tokens,"bundle":result,"lazy":lazy,"duplicates":duplicates,"critical_ids":[x["id"] for x in result if x["critical"]]}
        text=json.dumps(out,indent=2,ensure_ascii=False)
        if a.out: a.out.write_text(text+"\n",encoding="utf-8")
        else: print(text)
        return 0 if not lazy else 3
    except (ValueError,KeyError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
