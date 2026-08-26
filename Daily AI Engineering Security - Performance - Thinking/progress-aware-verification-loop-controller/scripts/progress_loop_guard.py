#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

TERMINAL = {"done", "failed", "cancelled"}


def load_jsonl(path):
    rows = []
    for n, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except Exception as exc:
            raise ValueError(f"line {n}: invalid JSON: {exc}") from exc
    return rows


def analyze(rows, max_identical=3, max_verifications=5):
    if max_identical < 1 or max_verifications < 1:
        raise ValueError("limits must be positive")
    last_state = None
    stagnant = 0
    verification_count = 0
    last_verified_state = None
    result = {"decision": "continue", "reasons": []}

    for index, row in enumerate(rows, 1):
        for key in ("event", "state_id"):
            if key not in row:
                raise ValueError(f"row {index}: missing {key}")
        state = str(row["state_id"])
        stagnant = stagnant + 1 if state == last_state else 0
        last_state = state

        if row["event"] == "verification":
            verification_count += 1
            if bool(row.get("fresh")) and bool(row.get("passed")):
                last_verified_state = state

        if str(row.get("task_status", "")).lower() in TERMINAL:
            result = {"decision": "stop_terminal", "reasons": ["terminal_task_state"]}
            break
        if stagnant >= max_identical:
            result = {"decision": "stop_stagnant", "reasons": ["state_not_advancing"]}
            break
        if verification_count > max_verifications and last_verified_state == state:
            result = {"decision": "stop_redundant_verification", "reasons": ["verification_budget_exhausted_for_verified_state"]}
            break

    result["metrics"] = {"events": len(rows), "verification_count": verification_count, "stagnant_repeat_count": stagnant, "last_state_id": last_state, "last_verified_state_id": last_verified_state}
    return result


def main():
    parser = argparse.ArgumentParser(description="Classify progress-aware agent loops")
    parser.add_argument("trace")
    parser.add_argument("--max-identical", type=int, default=3)
    parser.add_argument("--max-verifications", type=int, default=5)
    args = parser.parse_args()
    try:
        result = analyze(load_jsonl(args.trace), args.max_identical, args.max_verifications)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["decision"] == "continue" else 3


if __name__ == "__main__":
    raise SystemExit(main())
