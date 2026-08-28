#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}")


def load_jsonl(path):
    rows=[]
    try:
        lines=Path(path).read_text(encoding="utf-8").splitlines()
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}")
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try: row=json.loads(line)
        except Exception as exc: raise ValueError(f"invalid JSON at line {n}: {exc}")
        required={"session_id","prefix_hash","input_tokens","cached_tokens","provider"}
        missing=required-row.keys()
        if missing: raise ValueError(f"line {n} missing: {','.join(sorted(missing))}")
        if row["input_tokens"] < 0 or row["cached_tokens"] < 0: raise ValueError(f"line {n}: token counts must be non-negative")
        rows.append(row)
    return rows


def longest_cold_streak(rows):
    best=cur=0
    for r in rows:
        if r["cached_tokens"] <= 0:
            cur+=1; best=max(best,cur)
        else: cur=0
    return best


def analyze(rows, thresholds):
    n=len(rows)
    total_input=sum(r["input_tokens"] for r in rows)
    total_cached=sum(min(r["cached_tokens"],r["input_tokens"]) for r in rows)
    hits=sum(1 for r in rows if r["cached_tokens"] > 0)
    session_ids={r["session_id"] for r in rows}
    prefix_hashes={r["prefix_hash"] for r in rows}
    providers=[r["provider"] for r in rows]
    provider_changes=sum(1 for a,b in zip(providers,providers[1:]) if a!=b)
    hit_ratio=hits/n if n else 0.0
    cached_share=total_cached/total_input if total_input else 0.0
    cold=longest_cold_streak(rows)
    min_calls=int(thresholds.get("min_calls_for_enforcement",4))
    violations=[]
    warnings=[]
    if thresholds.get("require_stable_session_id",True) and len(session_ids)>1:
        violations.append("session_id_unstable")
    if thresholds.get("require_stable_prefix_hash",True) and len(prefix_hashes)>1:
        violations.append("prefix_hash_unstable")
    if n >= min_calls:
        if hit_ratio < float(thresholds.get("min_cache_hit_ratio",0.6)):
            violations.append("cache_hit_ratio_below_threshold")
        if cached_share < float(thresholds.get("min_cached_token_share",0.5)):
            violations.append("cached_token_share_below_threshold")
        allowed_failover=int(thresholds.get("allow_provider_failover_cold_turns",1))
        effective_cold=max(0,cold-min(provider_changes,allowed_failover))
        if effective_cold > int(thresholds.get("max_cold_streak",2)):
            violations.append("cold_streak_exceeded")
    else:
        warnings.append("insufficient_calls_for_ratio_enforcement")
    fresh=max(0,total_input-total_cached)
    return {
        "ok": not violations,
        "calls": n,
        "session_id_count": len(session_ids),
        "prefix_hash_count": len(prefix_hashes),
        "provider_changes": provider_changes,
        "cache_hit_ratio": round(hit_ratio,6),
        "cached_token_share": round(cached_share,6),
        "total_input_tokens": total_input,
        "cached_tokens": total_cached,
        "fresh_input_tokens": fresh,
        "longest_cold_streak": cold,
        "violations": sorted(set(violations)),
        "warnings": warnings
    }


def compare(base, candidate):
    def safe_reduction(a,b):
        return 0.0 if a<=0 else (a-b)/a
    return {
        "fresh_input_token_reduction": round(safe_reduction(base["fresh_input_tokens"],candidate["fresh_input_tokens"]),6),
        "cache_hit_ratio_delta": round(candidate["cache_hit_ratio"]-base["cache_hit_ratio"],6),
        "cached_token_share_delta": round(candidate["cached_token_share"]-base["cached_token_share"],6)
    }


def main():
    ap=argparse.ArgumentParser(description="Measure OpenRouter agent cache-affinity regressions from JSONL usage traces")
    ap.add_argument("--trace",required=True)
    ap.add_argument("--thresholds",required=True)
    ap.add_argument("--baseline")
    args=ap.parse_args()
    try:
        th=load_json(args.thresholds)
        result=analyze(load_jsonl(args.trace),th)
        if args.baseline:
            result["comparison"]=compare(analyze(load_jsonl(args.baseline),th),result)
        print(json.dumps(result,indent=2,sort_keys=True))
        return 0 if result["ok"] else 3
    except Exception as exc:
        print(str(exc),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())
