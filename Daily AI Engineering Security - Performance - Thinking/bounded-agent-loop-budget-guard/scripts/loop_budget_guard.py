#!/usr/bin/env python3
import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

REQUIRED = {"iteration", "action", "signature", "input_tokens", "output_tokens", "progress_delta"}


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def load_trace(path):
    rows = []
    for line_no, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except Exception as exc:
            raise ValueError(f"line {line_no}: invalid JSON: {exc}")
        missing = REQUIRED - row.keys()
        if missing:
            raise ValueError(f"line {line_no}: missing {','.join(sorted(missing))}")
        rows.append(row)
    return rows


def evaluate(rows, policy):
    limits = [policy.get("max_iterations"), policy.get("max_tool_calls"), policy.get("max_total_tokens")]
    if policy.get("require_finite_limits", True) and any(v is None or int(v) <= 0 for v in limits):
        return {"ok": False, "decision": "invalid_policy", "reasons": ["finite_positive_limits_required"]}

    total_tokens = 0
    tool_calls = 0
    no_progress = defaultdict(int)
    reasons = []
    stop_at = None
    min_progress = float(policy.get("min_progress_delta", 1))
    repeat_limit = int(policy.get("max_same_signature_without_progress", 3))

    for row in rows:
        iteration = int(row["iteration"])
        total_tokens += int(row["input_tokens"]) + int(row["output_tokens"])
        if row["action"] not in ("model", "final"):
            tool_calls += 1

        sig = str(row["signature"])
        if float(row["progress_delta"]) >= min_progress:
            no_progress[sig] = 0
        else:
            no_progress[sig] += 1

        local = []
        if iteration > int(policy["max_iterations"]):
            local.append("max_iterations_exceeded")
        if tool_calls > int(policy["max_tool_calls"]):
            local.append("max_tool_calls_exceeded")
        if total_tokens > int(policy["max_total_tokens"]):
            local.append("max_total_tokens_exceeded")
        if no_progress[sig] >= repeat_limit:
            local.append("repeated_signature_without_progress")

        if local:
            reasons.extend(local)
            stop_at = iteration
            break

    decision = "continue" if not reasons else "stop"
    return {
        "ok": not reasons,
        "decision": decision,
        "stop_at_iteration": stop_at,
        "iterations_observed": len(rows),
        "tool_calls_observed": tool_calls,
        "total_tokens_observed": total_tokens,
        "reasons": sorted(set(reasons)),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--trace", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load_trace(args.trace), load_json(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "invalid_input", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
