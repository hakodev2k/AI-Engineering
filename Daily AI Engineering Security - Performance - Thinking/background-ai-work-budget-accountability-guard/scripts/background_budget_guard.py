#!/usr/bin/env python3
"""Validate normalized JSONL telemetry for background AI jobs.

Exit codes: 0 pass/report-only, 2 policy violation, 3 invalid input.
"""
import argparse, json, sys
from collections import defaultdict
from pathlib import Path

REQUIRED = {"timestamp", "job_id", "parent_id", "event"}

def nonneg_int(v, name, line):
    if v is None: return 0
    if isinstance(v, bool) or not isinstance(v, int) or v < 0:
        raise ValueError(f"line {line}: {name} must be a non-negative integer")
    return v

def main():
    p = argparse.ArgumentParser()
    p.add_argument("trace", type=Path)
    p.add_argument("--max-requests", type=int, default=50)
    p.add_argument("--max-input-tokens", type=int, default=2_000_000)
    p.add_argument("--max-output-tokens", type=int, default=200_000)
    p.add_argument("--max-no-progress", type=int, default=3)
    p.add_argument("--report-only", action="store_true")
    a = p.parse_args()
    for n in (a.max_requests,a.max_input_tokens,a.max_output_tokens,a.max_no_progress):
        if n < 0: print("thresholds must be non-negative", file=sys.stderr); return 3
    if not a.trace.is_file(): print(f"trace not found: {a.trace}", file=sys.stderr); return 3
    jobs = defaultdict(lambda: {"requests":0,"input_tokens":0,"output_tokens":0,"cached_input_tokens":0,"no_progress":0,"max_no_progress":0,"last_progress":None,"last_state":None})
    violations=[]
    try:
        with a.trace.open(encoding="utf-8") as f:
            for i, raw in enumerate(f,1):
                if not raw.strip(): continue
                e=json.loads(raw)
                missing=REQUIRED-set(e)
                if missing: raise ValueError(f"line {i}: missing {sorted(missing)}")
                if not str(e["job_id"]).strip() or not str(e["parent_id"]).strip():
                    raise ValueError(f"line {i}: empty job_id/parent_id")
                j=jobs[str(e["job_id"])]
                if e["event"]=="model_request":
                    j["requests"] += 1
                    j["input_tokens"] += nonneg_int(e.get("input_tokens"),"input_tokens",i)
                    j["output_tokens"] += nonneg_int(e.get("output_tokens"),"output_tokens",i)
                    j["cached_input_tokens"] += nonneg_int(e.get("cached_input_tokens"),"cached_input_tokens",i)
                    state=e.get("state_fingerprint")
                    progress=e.get("progress_fingerprint")
                    if j["last_state"] is not None and state == j["last_state"] and progress == j["last_progress"]:
                        j["no_progress"] += 1
                    else:
                        j["no_progress"] = 0
                    j["max_no_progress"] = max(j["max_no_progress"],j["no_progress"])
                    j["last_state"],j["last_progress"] = state,progress
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(str(exc), file=sys.stderr); return 3
    for jid,j in jobs.items():
        if j["requests"]>a.max_requests: violations.append(f"{jid}: requests {j['requests']} > {a.max_requests}")
        if j["input_tokens"]>a.max_input_tokens: violations.append(f"{jid}: input_tokens {j['input_tokens']} > {a.max_input_tokens}")
        if j["output_tokens"]>a.max_output_tokens: violations.append(f"{jid}: output_tokens {j['output_tokens']} > {a.max_output_tokens}")
        if j["max_no_progress"]>=a.max_no_progress and a.max_no_progress>0: violations.append(f"{jid}: no-progress sequence {j['max_no_progress']} >= {a.max_no_progress}")
    print(json.dumps({"jobs":jobs,"violations":violations}, indent=2, default=dict))
    return 0 if a.report_only or not violations else 2

if __name__ == "__main__": raise SystemExit(main())
