#!/usr/bin/env python3
"""Deterministic long-context recovery classifier. Standard-library only."""
import argparse, json, sys
from pathlib import Path

POLICY = {"compact_ratio":0.82,"evacuate_ratio":0.95,"cold_cache_hit_ratio":0.10,"cold_cache_age_seconds":900,"transport_error_threshold":2,"minimum_reserve_tokens":12000}
EXIT = {"allow":0,"compact":10,"export-and-fork":20,"block":30}

def load(path):
    try: return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(str(e))

def num(d,k,minv=0):
    v=d.get(k)
    if not isinstance(v,(int,float)) or isinstance(v,bool) or v<minv: raise ValueError(f"{k} invalid")
    return float(v)

def classify(t,p=POLICY):
    ctx=num(t,"context_tokens"); std=num(t,"standard_limit",1); mx=num(t,"max_context_tokens",1); reserve=num(t,"reserve_tokens"); errors=int(num(t,"recent_transport_errors"))
    if std>mx or ctx>mx: return "block",["context_limit_inconsistent_or_exceeded"]
    if reserve<p["minimum_reserve_tokens"]: return "block",["recovery_reserve_below_minimum"]
    hit=t.get("cache_hit_ratio"); age=t.get("cache_age_seconds")
    unknown=hit is None or age is None
    if not unknown:
        if not isinstance(hit,(int,float)) or not 0<=hit<=1: raise ValueError("cache_hit_ratio invalid")
        if not isinstance(age,(int,float)) or age<0: raise ValueError("cache_age_seconds invalid")
    cold=unknown or hit<=p["cold_cache_hit_ratio"] or age>=p["cold_cache_age_seconds"]
    if ctx>std and cold and errors>=p["transport_error_threshold"]: return "export-and-fork",["oversized_context","cold_or_unknown_cache","repeated_transport_error"]
    if ctx/mx>=p["evacuate_ratio"]: return "export-and-fork",["maximum_context_reserve_at_risk"]
    if ctx/mx>=p["compact_ratio"] or (ctx<=std and ctx/std>=p["compact_ratio"]): return "compact",["compaction_threshold_reached"]
    return "allow",["within_policy_envelope"]

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("telemetry"); args=ap.parse_args()
    try:
        action,reasons=classify(load(args.telemetry)); print(json.dumps({"action":action,"reasons":reasons},sort_keys=True)); return EXIT[action]
    except ValueError as e:
        print(json.dumps({"action":"invalid","error":str(e)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())
