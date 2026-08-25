#!/usr/bin/env python3
"""Profile browser-agent observation yield from JSONL traces. No third-party dependencies."""
import argparse
import json
import sys
from pathlib import Path


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def read_events(path):
    events = []
    with Path(path).open("r", encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, 1):
            if not line.strip():
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {line_no}: invalid JSON: {exc}") from exc
            if not isinstance(item, dict) or not isinstance(item.get("type"), str):
                raise ValueError(f"line {line_no}: event requires string type")
            if not isinstance(item.get("ts_ms"), (int, float)):
                raise ValueError(f"line {line_no}: event requires numeric ts_ms")
            events.append(item)
    if not events:
        raise ValueError("trace contains no events")
    return events


def summarize(events):
    observations = [e for e in events if e["type"] == "observation"]
    progress = [e for e in events if e["type"] == "progress"]
    compactions = [e for e in events if e["type"] == "compaction"]
    hashes = [e.get("state_hash") for e in observations if isinstance(e.get("state_hash"), str) and e.get("state_hash")]
    duplicates = 0
    previous = None
    for value in hashes:
        if previous is not None and value == previous:
            duplicates += 1
        previous = value
    tokens = sum(e.get("tokens", 0) for e in events if isinstance(e.get("tokens", 0), (int, float)))
    model_ms = sum(e.get("latency_ms", 0) for e in events if e["type"] == "model" and isinstance(e.get("latency_ms", 0), (int, float)))
    tool_ms = sum(e.get("latency_ms", 0) for e in events if e["type"] in {"tool", "observation"} and isinstance(e.get("latency_ms", 0), (int, float)))
    duration_ms = max(e["ts_ms"] for e in events) - min(e["ts_ms"] for e in events)
    progress_n = len(progress)
    obs_n = len(observations)
    return {
        "duration_ms": duration_ms,
        "observations": obs_n,
        "unique_states": len(set(hashes)),
        "duplicate_observations": duplicates,
        "duplicate_observation_rate": duplicates / max(len(hashes), 1),
        "progress_events": progress_n,
        "observations_per_progress": obs_n / max(progress_n, 1),
        "tokens": tokens,
        "tokens_per_progress": tokens / max(progress_n, 1),
        "model_latency_ms": model_ms,
        "tool_latency_ms": tool_ms,
        "unattributed_latency_ms": max(duration_ms - model_ms - tool_ms, 0),
        "compactions": len(compactions),
    }


def evaluate(summary, thresholds):
    failures = []
    checks = [
        ("duplicate_observation_rate", "max_duplicate_observation_rate"),
        ("observations_per_progress", "max_observations_per_progress"),
        ("tokens_per_progress", "max_tokens_per_progress"),
    ]
    for metric, key in checks:
        limit = thresholds.get(key)
        if limit is not None and (not isinstance(limit, (int, float)) or limit < 0):
            raise ValueError(f"invalid threshold: {key}")
        if limit is not None and summary[metric] > limit:
            failures.append({"metric": metric, "actual": summary[metric], "limit": limit})
    if thresholds.get("require_progress_events", True) and summary["progress_events"] == 0:
        failures.append({"metric": "progress_events", "actual": 0, "limit": ">0"})
    return failures


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("trace")
    parser.add_argument("--thresholds")
    args = parser.parse_args()
    try:
        events = read_events(args.trace)
        summary = summarize(events)
        thresholds = read_json(args.thresholds) if args.thresholds else {}
        failures = evaluate(summary, thresholds)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"status": "invalid", "error": str(exc)}))
        return 3
    print(json.dumps({"status": "pass" if not failures else "fail", "summary": summary, "failures": failures}, sort_keys=True))
    return 0 if not failures else 2


if __name__ == "__main__":
    sys.exit(main())
