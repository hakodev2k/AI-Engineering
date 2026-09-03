#!/usr/bin/env python3
import argparse, json, sys
from collections import defaultdict

ORDER = {
    "turn_started": 10,
    "model_started": 20,
    "model_first_token": 30,
    "model_completed": 40,
    "approval_started": 50,
    "approval_completed": 60,
    "tool_started": 70,
    "tool_completed": 80,
    "turn_completed": 90,
}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_events(path):
    events = []
    with open(path, "r", encoding="utf-8") as f:
        for n, line in enumerate(f, 1):
            if not line.strip():
                continue
            try:
                e = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {n}: invalid JSON: {exc}")
            for key in ("timestamp_ms", "run_id", "turn_id", "event"):
                if key not in e:
                    raise ValueError(f"line {n}: missing {key}")
            if not isinstance(e["timestamp_ms"], (int, float)):
                raise ValueError(f"line {n}: timestamp_ms must be numeric")
            events.append(e)
    return events


def duration(index, a, b):
    if a in index and b in index:
        return index[b] - index[a]
    return None


def analyze(events, policy):
    turns = defaultdict(list)
    for e in events:
        turns[(str(e["run_id"]), str(e["turn_id"]))].append(e)
    reports = []
    blocking = []
    for key, evs in sorted(turns.items()):
        evs.sort(key=lambda x: x["timestamp_ms"])
        turn_index = {}
        tools = defaultdict(dict)
        invalid = []
        last_rank = -1
        for e in evs:
            name = e["event"]
            rank = ORDER.get(name)
            if rank is not None and name not in ("approval_started", "approval_completed", "tool_started", "tool_completed"):
                if rank < last_rank:
                    invalid.append(name)
                last_rank = max(last_rank, rank)
            if name in ("tool_started", "tool_completed"):
                tid = e.get("tool_call_id")
                if not tid:
                    invalid.append(f"{name}:missing_tool_call_id")
                else:
                    tools[str(tid)][name] = e["timestamp_ms"]
            else:
                turn_index.setdefault(name, e["timestamp_ms"])
        missing = [x for x in policy["required_turn_events"] if x not in turn_index]
        tool_reports = []
        for tid, idx in sorted(tools.items()):
            tm = [x for x in policy["required_tool_events"] if x not in idx]
            if tm:
                missing.extend([f"tool:{tid}:{x}" for x in tm])
            td = duration(idx, "tool_started", "tool_completed")
            if td is not None and td < 0:
                invalid.append(f"tool:{tid}:negative_duration")
            tool_reports.append({"tool_call_id": tid, "tool_execution_ms": td})
        required_count = len(policy["required_turn_events"]) + len(tools) * len(policy["required_tool_events"])
        completeness = 1.0 if required_count == 0 else max(0.0, (required_count - len(missing)) / required_count)
        report = {
            "run_id": key[0], "turn_id": key[1],
            "completeness_ratio": completeness,
            "missing": missing, "invalid": invalid,
            "turn_latency_ms": duration(turn_index, "turn_started", "turn_completed"),
            "model_total_ms": duration(turn_index, "model_started", "model_completed"),
            "model_ttft_ms": duration(turn_index, "model_started", "model_first_token"),
            "approval_wait_ms": duration(turn_index, "approval_started", "approval_completed"),
            "tools": tool_reports,
        }
        if len(missing) > policy["max_missing_required_events"] or len(invalid) > policy["max_invalid_order_events"] or completeness < policy["minimum_completeness_ratio"]:
            blocking.append(f"{key[0]}/{key[1]}")
        reports.append(report)
    return {"status": "pass" if not blocking else "fail", "blocking_turns": blocking, "turns": reports}


def main():
    p = argparse.ArgumentParser(description="Validate and profile agent lifecycle JSONL events")
    p.add_argument("events")
    p.add_argument("--policy", default="config/policy.json")
    p.add_argument("--output")
    args = p.parse_args()
    try:
        result = analyze(load_events(args.events), load_json(args.policy))
    except (OSError, ValueError, KeyError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text + "\n")
    else:
        print(text)
    return 0 if result["status"] == "pass" else 1

if __name__ == "__main__":
    raise SystemExit(main())
