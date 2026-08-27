#!/usr/bin/env python3
import argparse, json
from pathlib import Path

def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def load_jsonl(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except Exception as exc:
            raise ValueError(f"line {n}: {exc}")
    return rows

def evaluate(rows,budget):
    comp=[i for i,r in enumerate(rows) if r.get("event")=="compaction"]
    if not comp:
        return {"ok":False,"status":"insufficient_evidence","reasons":["no_compaction_event"]}
    i=comp[-1]
    after=rows[i+1:i+1+int(budget.get("max_turns_observed",3))]
    if not after:
        return {"ok":False,"status":"insufficient_evidence","reasons":["no_post_compaction_turns"]}
    window=int(rows[i].get("context_window",0))
    if window<=0:
        return {"ok":False,"status":"invalid","reasons":["missing_context_window"]}
    required=set(budget.get("required_sources",[])); seen=set(); total=0; static=0; cache_read=0; input_tokens=0; by_source={}
    for r in after:
        for s in r.get("sources",[]):
            name=s.get("name"); tok=int(s.get("tokens",0))
            if not name or tok<0:
                return {"ok":False,"status":"invalid","reasons":["bad_source_record"]}
            seen.add(name); total+=tok; by_source[name]=by_source.get(name,0)+tok
            if s.get("static",False): static+=tok
        cache_read+=int(r.get("cache_read_tokens",0)); input_tokens+=int(r.get("input_tokens",0))
    reasons=[]
    if required-seen: reasons.append("missing_required_sources:"+",".join(sorted(required-seen)))
    post_fraction=total/window; static_fraction=static/window; cache_ratio=cache_read/max(1,input_tokens)
    if post_fraction>float(budget["max_post_compaction_fraction"]): reasons.append("post_compaction_budget_exceeded")
    if static_fraction>float(budget["max_static_fraction"]): reasons.append("static_context_budget_exceeded")
    if cache_ratio<float(budget["min_cache_read_ratio"]): reasons.append("cache_read_ratio_below_floor")
    return {"ok":not reasons,"status":"pass" if not reasons else "block","reasons":reasons,"post_compaction_fraction":round(post_fraction,4),"static_fraction":round(static_fraction,4),"cache_read_ratio":round(cache_ratio,4),"tokens_by_source":by_source}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--trace",required=True); ap.add_argument("--budget",required=True); a=ap.parse_args()
    try:
        out=evaluate(load_jsonl(a.trace),load_json(a.budget))
    except Exception as exc:
        print(json.dumps({"ok":False,"status":"invalid","error":str(exc)})); return 2
    print(json.dumps(out,indent=2,sort_keys=True)); return 0 if out["ok"] else 3

if __name__=="__main__":
    raise SystemExit(main())
