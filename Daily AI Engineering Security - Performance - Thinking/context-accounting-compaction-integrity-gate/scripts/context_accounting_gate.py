#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    try: return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e: raise ValueError(f"cannot read JSON {path}: {e}")

def evaluate(s,b):
    if not isinstance(s,dict) or not isinstance(b,dict): raise ValueError("snapshot and budget must be objects")
    window=int(s.get("context_window",0)); reserve=int(b.get("reserve_tokens",0));
    if window<=0 or reserve<0 or reserve>=window: return {"decision":"block","reasons":["invalid_window_or_reserve"]}
    trusted=b.get("trusted_occupancy_fields",["last_call_prompt_tokens","stored_context_tokens"])
    fresh=set(s.get("fresh_fields",[])); chosen=None
    for f in trusted:
        v=s.get(f)
        if f in fresh and isinstance(v,(int,float)) and v>=0:
            chosen=(f,int(v)); break
    if chosen is None: return {"decision":"defer","reasons":["no_fresh_trusted_occupancy"],"context_window":window}
    field,occ=chosen
    if occ>window*float(b.get("max_plausible_occupancy_ratio",1.25)):
        return {"decision":"block","reasons":["implausible_occupancy"],"occupancy_source":field,"occupancy_tokens":occ}
    threshold=window-reserve; utilization=occ/window
    cumulative=s.get("cumulative_usage_tokens")
    warnings=[]
    if isinstance(cumulative,(int,float)) and occ>0 and cumulative/occ>float(b.get("max_cumulative_to_current_ratio",10)):
        warnings.append("cumulative_usage_far_above_current_occupancy")
    low=int(s.get("consecutive_low_reclaim_compactions",0))
    if low>=int(b.get("max_low_reclaim_before_break",2)):
        return {"decision":"block","reasons":["compaction_circuit_breaker_open"],"occupancy_source":field,"occupancy_tokens":occ,"warnings":warnings}
    decision="allow_compaction" if occ>=threshold else "no_compaction"
    return {"decision":decision,"occupancy_source":field,"occupancy_tokens":occ,"context_window":window,"reserve_tokens":reserve,"threshold_tokens":threshold,"utilization":round(utilization,6),"warnings":warnings}

def main():
    p=argparse.ArgumentParser(); p.add_argument("snapshot"); p.add_argument("--budget",required=True); p.add_argument("--out")
    a=p.parse_args()
    try:
        r=evaluate(load(a.snapshot),load(a.budget)); text=json.dumps(r,indent=2)
        if a.out: Path(a.out).write_text(text+"\n",encoding="utf-8")
        else: print(text)
        return 0 if r["decision"] in {"allow_compaction","no_compaction"} else 3
    except Exception as e:
        print(f"error: {e}",file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
