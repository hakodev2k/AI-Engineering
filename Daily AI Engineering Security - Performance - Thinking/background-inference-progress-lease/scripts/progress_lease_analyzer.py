#!/usr/bin/env python3
"""Analyze background model-call telemetry for no-progress and budget violations.

Input: JSONL records with fields:
  timestamp, worker_id, owner_id, purpose, request_fingerprint,
  progress_version, input_tokens, owner_state

owner_state should be one of: active, idle, completed, cancelled.
Exit codes: 0=no blocking violations, 2=policy violations, 64=input error.
"""
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from pathlib import Path

VALID_STATES = {"active", "idle", "completed", "cancelled"}

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("jsonl", type=Path)
    p.add_argument("--max-requests", type=int, default=50)
    p.add_argument("--max-input-tokens", type=int, default=2_000_000)
    p.add_argument("--max-no-progress", type=int, default=3)
    p.add_argument("--max-duplicate-fingerprint", type=int, default=3)
    return p.parse_args()

def fail(msg):
    print(json.dumps({"error": msg}), file=sys.stderr)
    raise SystemExit(64)

def main():
    a = parse_args()
    for name, value in vars(a).items():
        if name != "jsonl" and isinstance(value, int) and value < 1:
            fail(f"{name} must be >= 1")
    if not a.jsonl.is_file():
        fail(f"input not found: {a.jsonl}")

    stats = defaultdict(lambda: {"requests":0,"tokens":0,"no_progress":0,"last_progress":None,"dup":0,"last_fp":None,"violations":[]})
    required = {"worker_id","owner_id","purpose","request_fingerprint","progress_version","input_tokens","owner_state"}
    try:
        with a.jsonl.open(encoding="utf-8") as f:
            for lineno, line in enumerate(f, 1):
                if not line.strip():
                    continue
                rec = json.loads(line)
                missing = required - rec.keys()
                if missing:
                    fail(f"line {lineno}: missing {sorted(missing)}")
                if rec["owner_state"] not in VALID_STATES:
                    fail(f"line {lineno}: invalid owner_state")
                if not isinstance(rec["input_tokens"], int) or rec["input_tokens"] < 0:
                    fail(f"line {lineno}: input_tokens must be non-negative integer")
                key = str(rec["worker_id"])
                s = stats[key]
                s["owner_id"] = rec["owner_id"]
                s["purpose"] = rec["purpose"]
                s["requests"] += 1
                s["tokens"] += rec["input_tokens"]

                pv = str(rec["progress_version"])
                if s["last_progress"] is None or pv != s["last_progress"]:
                    s["no_progress"] = 0
                    s["last_progress"] = pv
                else:
                    s["no_progress"] += 1

                fp = str(rec["request_fingerprint"])
                if fp == s["last_fp"]:
                    s["dup"] += 1
                else:
                    s["dup"] = 1
                    s["last_fp"] = fp

                reasons = []
                if rec["owner_state"] in {"completed", "cancelled"}:
                    reasons.append("owner_terminal")
                if s["requests"] > a.max_requests:
                    reasons.append("request_budget")
                if s["tokens"] > a.max_input_tokens:
                    reasons.append("token_budget")
                if s["no_progress"] >= a.max_no_progress:
                    reasons.append("no_progress")
                if s["dup"] > a.max_duplicate_fingerprint:
                    reasons.append("duplicate_fingerprint")
                for reason in reasons:
                    event = {"line":lineno,"reason":reason}
                    if event not in s["violations"]:
                        s["violations"].append(event)
    except json.JSONDecodeError as e:
        fail(f"invalid JSON at line {e.lineno}: {e.msg}")

    out = {"workers": stats, "blocking_violations": sum(len(v["violations"]) for v in stats.values())}
    print(json.dumps(out, indent=2, sort_keys=True))
    return 2 if out["blocking_violations"] else 0

if __name__ == "__main__":
    raise SystemExit(main())
