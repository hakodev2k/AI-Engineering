#!/usr/bin/env python3
import argparse
import json
import math
import statistics
import sys
from pathlib import Path


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def measured_bootstrap(history, fallback):
    values = []
    for row in history:
        try:
            bootstrap = int(row["bootstrap_tokens"])
            if bootstrap >= 0:
                values.append(bootstrap)
        except (KeyError, TypeError, ValueError):
            continue
    if not values:
        return int(fallback), "fallback"
    return int(math.ceil(statistics.median(values))), "median-history"


def evaluate(history, request, policy):
    children = request.get("children", [])
    if not isinstance(children, list) or not children:
        return {"ok": False, "decision": "block", "reasons": ["no_children"]}
    reasons = []
    max_children = int(policy.get("max_children", 6))
    if len(children) > max_children:
        reasons.append("max_children_exceeded")
    bootstrap, source = measured_bootstrap(history, policy.get("fallback_bootstrap_tokens", 25000))
    safety = float(policy.get("projection_safety_factor", 1.2))
    min_ratio = float(policy.get("min_useful_to_bootstrap_ratio", 1.5))
    retries = int(policy.get("max_retries_per_child", 2))
    spent = int(request.get("session_tokens_spent", 0))
    session_budget = int(policy.get("session_budget_tokens", 1000000))
    reserve = int(policy.get("reserve_tokens", 100000))
    remaining = max(0, session_budget - reserve - spent)

    projected = 0
    low_value = []
    per_child = []
    for child in children:
        name = str(child.get("name", "unnamed"))
        useful = int(child.get("estimated_useful_tokens", 0))
        inherited = int(child.get("inherited_context_tokens", 0))
        ratio = useful / max(1, bootstrap + inherited)
        call_cost = bootstrap + inherited + useful
        worst_case = int(math.ceil(call_cost * safety * (1 + retries)))
        projected += worst_case
        if ratio < min_ratio:
            low_value.append(name)
        per_child.append({"name": name, "useful_to_bootstrap_ratio": round(ratio, 3), "projected_worst_case_tokens": worst_case})

    if projected > remaining:
        reasons.append("session_budget_would_be_exceeded")
    if len(low_value) == len(children):
        decision = "serial"
    elif low_value:
        decision = "group"
    else:
        decision = "fanout"
    if reasons:
        decision = "block"
    return {
        "ok": not reasons,
        "decision": decision,
        "reasons": reasons,
        "bootstrap_tokens": bootstrap,
        "bootstrap_source": source,
        "remaining_budget_tokens": remaining,
        "projected_worst_case_tokens": projected,
        "low_value_children": low_value,
        "children": per_child,
    }


def main():
    parser = argparse.ArgumentParser(description="Measure fixed subagent overhead and gate fan-out against a cumulative token budget.")
    parser.add_argument("--history", required=True, help="JSON array with bootstrap_tokens records")
    parser.add_argument("--request", required=True, help="JSON object describing proposed children")
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(read_json(args.history), read_json(args.request), read_json(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "block", "reasons": [f"invalid_input:{exc}"]}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    sys.exit(main())
