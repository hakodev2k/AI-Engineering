#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path


def canonical_hash(value):
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def load_jsonl(path):
    events = []
    for line_no, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSON on line {line_no}: {exc}") from exc
        if not isinstance(item, dict):
            raise ValueError(f"line {line_no} must be a JSON object")
        events.append(item)
    return events


def evaluate(events, policy):
    terminal = set(policy.get("terminal_task_states", []))
    accepted = set(policy.get("accepted_progress_kinds", []))
    max_no_progress = int(policy.get("max_consecutive_no_progress_windows", 2))
    max_identical = int(policy.get("max_identical_tool_calls", 2))
    if max_no_progress < 0 or max_identical < 1:
        raise ValueError("policy thresholds are invalid")
    if not events:
        return {"decision": "stop", "reason": "no_events", "progress_events": 0}

    latest_state = None
    no_progress = 0
    progress_events = 0
    last_call_hash = None
    identical_count = 0

    for index, event in enumerate(events):
        kind = event.get("kind")
        if not isinstance(kind, str):
            if policy.get("fail_closed_on_invalid_event", True):
                return {"decision": "stop", "reason": f"invalid_event:{index}", "progress_events": progress_events}
            continue

        state = event.get("task_state")
        if state is not None:
            if not isinstance(state, str):
                return {"decision": "stop", "reason": f"invalid_task_state:{index}", "progress_events": progress_events}
            latest_state = state

        if kind == "tool_call":
            call_hash = canonical_hash({"tool": event.get("tool"), "arguments": event.get("arguments")})
            if call_hash == last_call_hash:
                identical_count += 1
            else:
                identical_count = 1
                last_call_hash = call_hash
            if identical_count > max_identical:
                return {
                    "decision": "stop",
                    "reason": "identical_tool_call_limit",
                    "identical_tool_calls": identical_count,
                    "progress_events": progress_events,
                }

        observable_progress = kind in accepted and bool(event.get("changed", True))
        if kind == "commentary" and not policy.get("commentary_counts_as_progress", False):
            observable_progress = False

        if observable_progress:
            progress_events += 1
            no_progress = 0
        elif kind in {"continuation", "tool_result", "commentary"}:
            no_progress += 1
            if no_progress > max_no_progress:
                return {
                    "decision": "stop",
                    "reason": "no_progress_limit",
                    "consecutive_no_progress_windows": no_progress,
                    "progress_events": progress_events,
                }

    if latest_state in terminal:
        return {"decision": "stop", "reason": f"terminal_task_state:{latest_state}", "progress_events": progress_events}

    return {
        "decision": "continue",
        "reason": "observable_progress_or_budget_available",
        "progress_events": progress_events,
        "consecutive_no_progress_windows": no_progress,
        "identical_tool_calls": identical_count,
    }


def main():
    parser = argparse.ArgumentParser(description="Deterministic progress circuit breaker for agent loops")
    parser.add_argument("--events", required=True, help="JSONL event ledger")
    parser.add_argument("--policy", required=True, help="JSON policy")
    args = parser.parse_args()
    try:
        result = evaluate(load_jsonl(args.events), load_json(args.policy))
    except Exception as exc:
        print(json.dumps({"decision": "stop", "reason": f"guard_error:{exc}"}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["decision"] == "continue" else 3


if __name__ == "__main__":
    raise SystemExit(main())
