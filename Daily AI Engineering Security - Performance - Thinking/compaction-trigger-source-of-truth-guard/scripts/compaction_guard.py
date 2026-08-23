#!/usr/bin/env python3
import argparse, json, math, sys

TRUSTED_SOURCES = {"last_call", "recomputed_context"}


def positive_int(v, name):
    if isinstance(v, bool) or not isinstance(v, int) or v < 0:
        raise ValueError(f"{name} must be a non-negative integer")
    return v


def evaluate(data, window, threshold):
    if not (0 < threshold <= 1):
        raise ValueError("threshold must be in (0,1]")
    current = positive_int(data.get("current_prompt_tokens"), "current_prompt_tokens")
    source = data.get("snapshot_source")
    fresh = data.get("snapshot_fresh")
    if source not in TRUSTED_SOURCES:
        return 2, {"decision":"BLOCK_RECOMPUTE","reason":"untrusted_snapshot_source","source":source}
    if fresh is not True:
        return 2, {"decision":"BLOCK_RECOMPUTE","reason":"stale_snapshot","source":source}
    if current > window * 4:
        return 2, {"decision":"BLOCK_RECOMPUTE","reason":"implausible_snapshot","current_prompt_tokens":current}
    utilization = current / window
    result = {"current_prompt_tokens":current,"context_window":window,"utilization":round(utilization,6),"source":source}
    if utilization >= threshold:
        result["decision"] = "REQUIRE_COMPACT"
        return 3, result
    result["decision"] = "ALLOW_NO_COMPACT"
    run_total = data.get("run_total_tokens")
    if isinstance(run_total, int):
        result["run_total_tokens_ignored_for_threshold"] = run_total
    return 0, result


def main():
    p=argparse.ArgumentParser()
    p.add_argument("snapshot")
    p.add_argument("--context-window", type=int, required=True)
    p.add_argument("--threshold", type=float, default=.9)
    a=p.parse_args()
    try:
        if a.context_window <= 0: raise ValueError("context-window must be positive")
        with open(a.snapshot, encoding="utf-8") as f: data=json.load(f)
        code,out=evaluate(data,a.context_window,a.threshold)
        print(json.dumps(out,sort_keys=True))
        return code
    except (OSError, json.JSONDecodeError, ValueError) as e:
        print(json.dumps({"decision":"ERROR","error":str(e)}), file=sys.stderr)
        return 4

if __name__ == "__main__": sys.exit(main())
