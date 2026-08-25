#!/usr/bin/env python3
"""Classify subagent liveness from JSONL telemetry without executing workload code."""
import argparse
import json
import sys
from pathlib import Path

VALID = {"model_event", "tool_event", "protocol_event", "durable_progress", "human_cancel", "policy_denied", "provider_timeout"}


def load_events(path):
    events = []
    with open(path, "r", encoding="utf-8") as f:
        for n, line in enumerate(f, 1):
            if not line.strip():
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {n}: invalid JSON: {exc}") from exc
            if not isinstance(obj, dict) or "ts" not in obj or "type" not in obj:
                raise ValueError(f"line {n}: expected object with ts and type")
            try:
                ts = float(obj["ts"])
            except (TypeError, ValueError) as exc:
                raise ValueError(f"line {n}: ts must be numeric") from exc
            typ = str(obj["type"])
            if typ not in VALID:
                raise ValueError(f"line {n}: unknown type {typ}")
            events.append((ts, typ))
    return sorted(events)


def classify(events, now, policy):
    latest = {}
    for ts, typ in events:
        latest[typ] = max(ts, latest.get(typ, float("-inf")))
    if "human_cancel" in latest:
        return {"classification": "human_cancel", "stale_signals": 0}
    if "policy_denied" in latest:
        return {"classification": "policy_denied", "stale_signals": 0}
    if "provider_timeout" in latest and now - latest["provider_timeout"] <= float(policy["progress_window_seconds"]):
        return {"classification": "provider_timeout", "stale_signals": 0}
    signals = list(policy["signals"])
    if not events:
        return {"classification": "confirmed_stall", "stale_signals": len(signals), "reason": "no events"}
    soft = float(policy["soft_stall_seconds"])
    hard = float(policy["hard_stall_seconds"])
    stale, recent = [], []
    for sig in signals:
        age = now - latest.get(sig, float("-inf"))
        (stale if age >= soft else recent).append(sig)
    if recent:
        return {"classification": "productive_or_waiting", "stale_signals": len(stale), "recent_signals": recent}
    newest = max((latest.get(sig, float("-inf")) for sig in signals), default=float("-inf"))
    age = now - newest
    if len(stale) >= int(policy["minimum_stale_signals"]) and age >= hard:
        return {"classification": "confirmed_stall", "stale_signals": len(stale), "age_seconds": age}
    return {"classification": "suspected_stall", "stale_signals": len(stale), "age_seconds": age}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("events")
    parser.add_argument("--policy", default=str(Path(__file__).resolve().parents[1] / "config" / "policy.json"))
    parser.add_argument("--now", required=True, type=float)
    args = parser.parse_args()
    try:
        with open(args.policy, "r", encoding="utf-8") as f:
            policy = json.load(f)
        result = classify(load_events(args.events), args.now, policy)
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(result, sort_keys=True))
    return 1 if result["classification"] == "confirmed_stall" else 0


if __name__ == "__main__":
    raise SystemExit(main())
