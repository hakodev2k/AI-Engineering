#!/usr/bin/env python3
"""Analyze prompt-prefix stability and cache/token regressions from sanitized traces.

Trace format:
{
  "quality_score": 1.0,
  "steps": [
    {"segments": [{"type":"system","content":"..."}],
     "input_tokens": 1000, "cached_tokens": 500, "cache_write_tokens": 0,
     "latency_ms": 800}
  ]
}
Exit: 0 allow, 2 invalid, 4 review required, 5 regression/block.
"""
from __future__ import annotations
import argparse, hashlib, json, statistics, sys
from pathlib import Path

ALLOW, INVALID, REVIEW, BLOCK = 0, 2, 4, 5


def load(path: Path) -> dict:
    try: value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict): raise ValueError(f"{path} must contain an object")
    return value


def number(obj, key, default=0.0):
    value = obj.get(key, default)
    if value is None: return None
    if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0: raise ValueError(f"{key} must be a non-negative number or null")
    return float(value)


def fingerprint(segment: dict) -> str:
    if not isinstance(segment, dict) or not isinstance(segment.get("type"), str) or not isinstance(segment.get("content"), str):
        raise ValueError("every segment needs string type and content")
    raw = (segment["type"] + "\0" + segment["content"]).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def summarize(trace: dict) -> dict:
    steps = trace.get("steps")
    if not isinstance(steps, list) or not steps: raise ValueError("steps must be a non-empty array")
    input_tokens=[]; cached=[]; writes=[]; latencies=[]; stable_ratios=[]; mutations=[]
    previous=None; cache_fields_complete=True
    for step in steps:
        if not isinstance(step, dict): raise ValueError("each step must be an object")
        segments=step.get("segments")
        if not isinstance(segments, list) or not segments: raise ValueError("segments must be a non-empty array")
        fps=[fingerprint(s) for s in segments]
        sizes=[len((s["type"]+"\0"+s["content"]).encode("utf-8")) for s in segments]
        if previous is not None:
            shared=0
            for a,b,size in zip(previous[0], fps, previous[1]):
                if a != b: break
                shared += size
            total=max(sum(sizes),1)
            stable_ratios.append(min(shared,total)/total)
            mutations.append(0 if previous[0] == fps else 1)
        previous=(fps,sizes)
        inp=number(step,"input_tokens"); input_tokens.append(inp)
        c=number(step,"cached_tokens",None); w=number(step,"cache_write_tokens",None)
        if c is None or w is None: cache_fields_complete=False
        else: cached.append(c); writes.append(w)
        l=number(step,"latency_ms",None)
        if l is not None: latencies.append(l)
    total_input=sum(input_tokens)
    quality=number(trace,"quality_score",1.0)
    return {
        "steps": len(steps),
        "input_tokens_total": total_input,
        "input_tokens_per_step": total_input/len(steps),
        "cache_read_ratio": (sum(cached)/total_input) if cache_fields_complete and total_input else None,
        "cache_write_ratio": (sum(writes)/total_input) if cache_fields_complete and total_input else None,
        "stable_prefix_ratio": statistics.mean(stable_ratios) if stable_ratios else 1.0,
        "prefix_mutations_per_step": (sum(mutations)/len(mutations)) if mutations else 0.0,
        "latency_ms_mean": statistics.mean(latencies) if latencies else None,
        "quality_score": quality,
        "cache_telemetry_complete": cache_fields_complete
    }


def pct_change(new, old):
    if old == 0: return 0.0 if new == 0 else float("inf")
    return (new-old)/old*100.0


def main():
    p=argparse.ArgumentParser(); p.add_argument("trace",type=Path); p.add_argument("--policy",type=Path,required=True); p.add_argument("--baseline",type=Path)
    a=p.parse_args()
    try:
        policy=load(a.policy); candidate=summarize(load(a.trace)); result={"candidate":candidate,"decision":"allow","findings":[]}; code=ALLOW
        if candidate["stable_prefix_ratio"] < float(policy.get("min_stable_prefix_ratio",0.6)):
            result["findings"].append("stable prefix ratio below policy"); code=BLOCK
        if candidate["cache_telemetry_complete"]:
            if candidate["cache_read_ratio"] < float(policy.get("min_cache_read_ratio",0.5)): result["findings"].append("cache read ratio below policy")
            if candidate["cache_write_ratio"] > float(policy.get("max_cache_write_ratio",0.35)): result["findings"].append("cache write ratio above policy"); code=BLOCK
        else:
            result["findings"].append("cache telemetry unavailable"); code=max(code,REVIEW)
        if a.baseline:
            baseline=summarize(load(a.baseline)); result["baseline"]=baseline
            token_reg=pct_change(candidate["input_tokens_per_step"],baseline["input_tokens_per_step"])
            quality_reg=pct_change(baseline["quality_score"]-candidate["quality_score"], baseline["quality_score"] if baseline["quality_score"] else 1.0)
            result["token_regression_percent"]=token_reg; result["quality_drop_percent"]=(baseline["quality_score"]-candidate["quality_score"])*100.0
            if token_reg > float(policy.get("max_token_regression_percent",10.0)):
                result["findings"].append("input token regression exceeds policy"); code=BLOCK
            if (baseline["quality_score"]-candidate["quality_score"])*100.0 > float(policy.get("max_quality_regression_percent",0.0)):
                result["findings"].append("quality regression exceeds policy"); code=BLOCK
        if code==BLOCK: result["decision"]="block"
        elif code==REVIEW: result["decision"]="review_required"
    except (ValueError,TypeError,ZeroDivisionError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return INVALID
    print(json.dumps(result,indent=2)); return code

if __name__=="__main__": raise SystemExit(main())
