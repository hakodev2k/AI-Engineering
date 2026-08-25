#!/usr/bin/env python3
"""Compare before/after stream-parser traces against explicit budgets."""
import argparse, json, sys
from pathlib import Path
import importlib.util

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location("profiler", HERE/"stream_parse_profiler.py")
profiler=importlib.util.module_from_spec(spec)
spec.loader.exec_module(profiler)

REQUIRED={"max_scan_amplification","max_scaling_exponent","max_p95_parse_us","max_parse_us_per_final_kb"}

def load_budgets(path):
    with open(path,"r",encoding="utf-8") as f:
        b=json.load(f)
    if not isinstance(b,dict) or not REQUIRED.issubset(b):
        raise ValueError("budget file missing required numeric fields")
    for k in REQUIRED:
        if not isinstance(b[k],(int,float)) or b[k] <= 0:
            raise ValueError(f"budget {k} must be > 0")
    return b

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--before", nargs="+", required=True)
    ap.add_argument("--after", nargs="+", required=True)
    ap.add_argument("--budgets", required=True)
    args=ap.parse_args()
    try:
        b=load_budgets(args.budgets)
        before=[profiler.profile(profiler.load_trace(x)) for x in args.before]
        after=[profiler.profile(profiler.load_trace(x)) for x in args.after]
        bexp=profiler.scaling_exponent([(x["final_bytes"],x["total_parse_us"]) for x in before])
        aexp=profiler.scaling_exponent([(x["final_bytes"],x["total_parse_us"]) for x in after])
        worst_scan=max(x["scan_amplification"] for x in after)
        worst_p95=max(x["p95_parse_us"] for x in after)
        worst_per_kb=max(x["parse_us_per_final_kb"] for x in after)
        checks={
            "scan_amplification": worst_scan <= b["max_scan_amplification"],
            "p95_parse_us": worst_p95 <= b["max_p95_parse_us"],
            "parse_us_per_final_kb": worst_per_kb <= b["max_parse_us_per_final_kb"],
            "scaling_exponent": aexp is None or aexp <= b["max_scaling_exponent"],
            "total_parse_cpu_not_worse": sum(x["total_parse_us"] for x in after) <= sum(x["total_parse_us"] for x in before),
        }
        result={"pass":all(checks.values()),"checks":checks,"before_scaling_exponent":bexp,"after_scaling_exponent":aexp,"after_worst":{"scan_amplification":worst_scan,"p95_parse_us":worst_p95,"parse_us_per_final_kb":worst_per_kb}}
        print(json.dumps(result, sort_keys=True))
        return 0 if result["pass"] else 20
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"pass":False,"error":str(exc)}))
        return 30

if __name__=="__main__":
    sys.exit(main())
