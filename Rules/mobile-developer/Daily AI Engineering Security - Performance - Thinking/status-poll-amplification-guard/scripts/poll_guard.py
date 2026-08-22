#!/usr/bin/env python3
"""Decide whether a polled status should become model-visible.

Exit codes: 0 normal decision, 2 circuit-break/budget stop, 3 input/config error.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def canonical_status(status: dict, fields: list[str]) -> dict:
    return {k: status.get(k) for k in fields}


def fingerprint(value: dict) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--status", required=True, help="JSON object")
    ap.add_argument("--previous-fingerprint", default="")
    ap.add_argument("--poll-count", type=int, required=True)
    ap.add_argument("--elapsed-seconds", type=float, required=True)
    ap.add_argument("--current-interval", type=float, required=True)
    ap.add_argument("--identical-failure-count", type=int, default=0)
    args = ap.parse_args()
    try:
        cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
        status = json.loads(args.status)
        if not isinstance(status, dict):
            raise ValueError("status must be a JSON object")
        fields = cfg["material_fields"]
        terminal = set(cfg["terminal_states"])
        if args.poll_count < 0 or args.elapsed_seconds < 0 or args.current_interval <= 0:
            raise ValueError("invalid numeric input")
        norm = canonical_status(status, fields)
        fp = fingerprint(norm)
        state = str(status.get("state", ""))
        changed = fp != args.previous_fingerprint
        if state in terminal:
            decision = "terminal"
            next_interval = cfg["initial_interval_seconds"]
            code = 0
        elif args.poll_count >= cfg["max_polls"] or args.elapsed_seconds >= cfg["max_wall_clock_seconds"]:
            decision = "circuit-break"
            next_interval = args.current_interval
            code = 2
        elif status.get("failure_signature") and args.identical_failure_count >= cfg["identical_failure_limit"]:
            decision = "circuit-break"
            next_interval = args.current_interval
            code = 2
        elif changed:
            decision = "emit"
            next_interval = cfg["initial_interval_seconds"]
            code = 0
        else:
            decision = "suppress"
            next_interval = min(cfg["max_interval_seconds"], max(cfg["initial_interval_seconds"], args.current_interval * cfg["backoff_multiplier"]))
            code = 0
        print(json.dumps({"decision":decision,"fingerprint":fp,"changed":changed,"next_interval_seconds":next_interval}, sort_keys=True))
        return code
    except (OSError, KeyError, TypeError, ValueError, json.JSONDecodeError) as e:
        print(json.dumps({"decision":"error","error":str(e)}), file=sys.stderr)
        return 3

if __name__ == "__main__":
    raise SystemExit(main())
