#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load_records(path):
    text=Path(path).read_text(encoding="utf-8").strip()
    if not text: raise ValueError("empty input")
    try:
        obj=json.loads(text)
        return obj if isinstance(obj,list) else [obj]
    except json.JSONDecodeError:
        out=[]
        for n,line in enumerate(text.splitlines(),1):
            if not line.strip(): continue
            try: out.append(json.loads(line))
            except json.JSONDecodeError as e: raise ValueError(f"invalid JSONL line {n}: {e}")
        return out


def usage_of(rec):
    if isinstance(rec.get("usage"),dict): return rec["usage"]
    payload=rec.get("payload")
    if isinstance(payload,dict) and isinstance(payload.get("usage"),dict): return payload["usage"]
    return rec if any(k in rec for k in ("input_tokens","cache_read_input_tokens","iterations")) else None


def footprint(u):
    return int(u.get("input_tokens") or 0)+int(u.get("cache_creation_input_tokens") or 0)+int(u.get("cache_read_input_tokens") or 0)


def analyze_usage(u):
    apparent=footprint(u)
    iterations=u.get("iterations") if isinstance(u.get("iterations"),list) else []
    msgs=[x for x in iterations if isinstance(x,dict) and x.get("type") in ("message","model_message")]
    final=footprint(msgs[-1]) if msgs else apparent
    billing=sum(footprint(x) for x in iterations if isinstance(x,dict)) if iterations else apparent
    return {"apparent_input":apparent,"final_context_input":final,"billing_iteration_input":billing,"iteration_count":len(iterations),"message_iteration_count":len(msgs),"inflation_ratio":round(apparent/final,4) if final else None}


def cmd(a):
    rows=[]
    for rec in load_records(a.path):
        u=usage_of(rec)
        if not u: continue
        d=analyze_usage(u)
        d["apparent_compact"]=d["apparent_input"]>=a.threshold
        d["effective_compact"]=d["final_context_input"]>=a.threshold
        d["window"]=a.window; d["threshold"]=a.threshold
        rows.append(d)
    if not rows:
        print("no usage records found",file=sys.stderr); return 1
    false=[r for r in rows if r["apparent_compact"] and not r["effective_compact"]]
    result={"records":len(rows),"false_positive_compactions":len(false),"max_inflation_ratio":max((r["inflation_ratio"] or 0) for r in rows),"details":rows}
    print(json.dumps(result,indent=2))
    return 2 if false else 0


def main():
    p=argparse.ArgumentParser(description="Separate cumulative usage from final context occupancy")
    s=p.add_subparsers(dest="cmd",required=True)
    a=s.add_parser("analyze"); a.add_argument("path"); a.add_argument("--window",type=int,required=True); a.add_argument("--threshold",type=int,required=True)
    x=p.parse_args()
    if x.threshold<=0 or x.window<=0 or x.threshold>x.window:
        print("invalid window/threshold",file=sys.stderr); return 1
    return cmd(x)

if __name__=="__main__":
    try: sys.exit(main())
    except Exception as e: print(f"error: {e}",file=sys.stderr); sys.exit(1)
