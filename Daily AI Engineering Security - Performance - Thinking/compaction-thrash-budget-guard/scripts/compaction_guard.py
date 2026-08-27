#!/usr/bin/env python3
import argparse, json, statistics, sys
from pathlib import Path

REQUIRED = {"turn", "event", "input_tokens", "cache_read_tokens", "cache_creation_tokens", "live_context_tokens", "reported_context_tokens", "static_tokens"}

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read policy {path}: {exc}") from exc

def load_trace(path):
    rows=[]
    for lineno,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip():
            continue
        try:
            row=json.loads(line)
        except Exception as exc:
            raise ValueError(f"invalid JSON line {lineno}: {exc}") from exc
        missing=REQUIRED-row.keys()
        if missing:
            raise ValueError(f"line {lineno} missing fields: {','.join(sorted(missing))}")
        for key in ("turn","input_tokens","cache_read_tokens","cache_creation_tokens","live_context_tokens","reported_context_tokens","static_tokens"):
            if not isinstance(row[key], (int,float)) or row[key] < 0:
                raise ValueError(f"line {lineno} field {key} must be non-negative number")
        rows.append(row)
    if not rows:
        raise ValueError("trace is empty")
    return rows

def percentile(values, p):
    if not values: return 0.0
    vals=sorted(values); pos=(len(vals)-1)*p; lo=int(pos); hi=min(lo+1,len(vals)-1); frac=pos-lo
    return vals[lo]*(1-frac)+vals[hi]*frac

def analyze(rows, policy):
    violations=[]
    comp=[r for r in rows if r["event"]=="compaction"]
    turns=max(1, max(r["turn"] for r in rows)-min(r["turn"] for r in rows)+1)
    comp_per_100=len(comp)*100.0/turns
    if comp_per_100 > policy["max_compactions_per_100_turns"]:
        violations.append("compaction_rate")
    gaps=[b["turn"]-a["turn"] for a,b in zip(comp,comp[1:])]
    if gaps and min(gaps) < policy["min_turns_between_compactions"]:
        violations.append("compaction_spacing")
    repeated=[r["static_tokens"] for r in rows if r["static_tokens"] > policy["max_repeated_static_tokens_per_turn"]]
    if repeated:
        violations.append("repeated_static_payload")
    cache_read_ratio=sum(r["cache_read_tokens"] for r in rows)/max(1,sum(r["input_tokens"] for r in rows))
    cache_create_ratio=sum(r["cache_creation_tokens"] for r in rows)/max(1,sum(r["input_tokens"] for r in rows))
    if cache_read_ratio < policy["min_cache_read_ratio"]:
        violations.append("low_cache_read_ratio")
    if cache_create_ratio > policy["max_cache_creation_ratio"]:
        violations.append("high_cache_creation_ratio")
    ratios=[r["reported_context_tokens"]/max(1,r["live_context_tokens"]) for r in rows]
    if max(ratios) > policy["max_reported_to_live_ratio"]:
        violations.append("usage_accounting_divergence")
    progress=set(policy.get("progress_events",[]))
    no_progress_attempts=0; max_no_progress=0; progressed=False
    for r in rows:
        if r["event"] in progress:
            progressed=True; no_progress_attempts=0
        elif r["event"]=="compaction":
            if not progressed:
                no_progress_attempts+=1; max_no_progress=max(max_no_progress,no_progress_attempts)
            else:
                progressed=False; no_progress_attempts=1; max_no_progress=max(max_no_progress,1)
    if max_no_progress > policy["max_compaction_attempts_without_progress"]:
        violations.append("unproductive_compaction_retries")
    decision="allow"
    if violations:
        decision="defer-and-trim"
    if "unproductive_compaction_retries" in violations or len(violations) >= 4:
        decision="stop-and-recover"
    return {
        "ok": not violations,
        "decision": decision,
        "violations": sorted(set(violations)),
        "metrics": {
            "turns": turns,
            "compactions": len(comp),
            "compactions_per_100_turns": round(comp_per_100,3),
            "min_turn_gap": min(gaps) if gaps else None,
            "cache_read_ratio": round(cache_read_ratio,4),
            "cache_creation_ratio": round(cache_create_ratio,4),
            "max_reported_to_live_ratio": round(max(ratios),4),
            "repeated_static_violation_events": len(repeated),
            "p95_input_tokens": round(percentile([r["input_tokens"] for r in rows],0.95),2),
            "max_compactions_without_progress": max_no_progress
        }
    }

def main():
    ap=argparse.ArgumentParser(description="Detect context-compaction thrash from JSONL telemetry")
    ap.add_argument("--trace",required=True); ap.add_argument("--policy",required=True)
    args=ap.parse_args()
    try:
        result=analyze(load_trace(args.trace),load_json(args.policy))
    except Exception as exc:
        print(json.dumps({"ok":False,"error":str(exc)}), file=sys.stderr); return 2
    print(json.dumps(result,indent=2,sort_keys=True))
    return 0 if result["ok"] else 3

if __name__=="__main__":
    raise SystemExit(main())
