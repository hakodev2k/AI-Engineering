#!/usr/bin/env python3
"""Validate exact call/result integrity for one agent tool-call turn."""
import json
import sys
from collections import Counter
from pathlib import Path


def read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def validate(policy, turn):
    errors = []
    if not isinstance(policy, dict) or not isinstance(turn, dict):
        return ["policy and turn must be JSON objects"]
    max_calls = policy.get("max_parallel_calls", 4)
    statuses = policy.get("terminal_statuses", ["success", "error", "denied", "cancelled"])
    require_terminal = policy.get("require_terminal_result", True)
    if not isinstance(max_calls, int) or max_calls < 1:
        return ["max_parallel_calls must be a positive integer"]
    if not isinstance(statuses, list) or not statuses or not all(isinstance(x, str) for x in statuses):
        return ["terminal_statuses must be a non-empty string list"]
    calls = turn.get("calls")
    results = turn.get("results")
    if not isinstance(calls, list) or not isinstance(results, list):
        return ["turn must contain calls[] and results[]"]
    if len(calls) > max_calls:
        errors.append(f"parallel batch size {len(calls)} exceeds hard limit {max_calls}")
    call_ids = []
    for i, c in enumerate(calls):
        cid = c.get("call_id") if isinstance(c, dict) else None
        if not isinstance(cid, str) or not cid.strip():
            errors.append(f"calls[{i}] missing stable call_id")
        else:
            call_ids.append(cid)
    dup_calls = [k for k,v in Counter(call_ids).items() if v > 1]
    if dup_calls:
        errors.append("duplicate call_id(s): " + ", ".join(sorted(dup_calls)))
    result_ids = []
    for i, r in enumerate(results):
        if not isinstance(r, dict):
            errors.append(f"results[{i}] must be an object")
            continue
        rid = r.get("call_id")
        status = r.get("status")
        if not isinstance(rid, str) or not rid.strip():
            errors.append(f"results[{i}] missing call_id")
            continue
        result_ids.append(rid)
        if require_terminal and status not in statuses:
            errors.append(f"{rid}: non-terminal or invalid status {status!r}")
    call_set = set(call_ids)
    result_set = set(result_ids)
    missing = sorted(call_set - result_set)
    unknown = sorted(result_set - call_set)
    duplicate_results = sorted(k for k,v in Counter(result_ids).items() if v > 1)
    if missing:
        errors.append("missing result(s): " + ", ".join(missing))
    if unknown:
        errors.append("result(s) for unknown call_id: " + ", ".join(unknown))
    if duplicate_results:
        errors.append("duplicate terminal result(s): " + ", ".join(duplicate_results))
    return errors


def main(argv):
    if len(argv) != 3:
        print(f"usage: {argv[0]} <policy.json> <turn.json>", file=sys.stderr)
        return 1
    try:
        policy = read_json(Path(argv[1])); turn = read_json(Path(argv[2]))
        errors = validate(policy, turn)
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr); return 1
    if errors:
        print("BLOCK")
        for error in errors: print(f"- {error}")
        return 4
    print(f"PASS: {len(turn['calls'])} call(s) exactly accounted for")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv))
