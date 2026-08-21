#!/usr/bin/env python3
"""Read-only calculator for proposed subagent fan-out.
Returns 0 when within policy, 2 when blocked, 3 for invalid input.
"""
import argparse
import json
import sys
from pathlib import Path


def load_config(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    required = [
        "max_concurrent_agents",
        "max_aggregate_predicted_tokens",
        "max_predicted_tokens_per_agent",
        "assumed_parent_context_inheritance_ratio",
        "retry_cost_multiplier",
        "max_retries_per_agent",
        "warn_amplification_ratio",
        "block_amplification_ratio"
    ]
    for key in required:
        if key not in data:
            raise ValueError("missing config key: " + key)
    return data


def evaluate(cfg, parent_tokens, agents, work_tokens, retries, serial_tokens):
    if min(parent_tokens, work_tokens, retries) < 0 or agents < 1:
        raise ValueError("numeric inputs are out of range")
    if retries > int(cfg["max_retries_per_agent"]):
        raise ValueError("requested retries exceed configured maximum")
    ratio = float(cfg["assumed_parent_context_inheritance_ratio"])
    if ratio < 0 or ratio > 1:
        raise ValueError("inheritance ratio must be between 0 and 1")

    inherited = round(parent_tokens * ratio)
    base_child = inherited + work_tokens
    retry_factor = 1 + retries * float(cfg["retry_cost_multiplier"])
    per_child = round(base_child * retry_factor)
    aggregate = per_child * agents
    baseline = serial_tokens if serial_tokens and serial_tokens > 0 else base_child
    amplification = aggregate / baseline if baseline else 0.0

    violations = []
    warnings = []
    if agents > int(cfg["max_concurrent_agents"]): violations.append("concurrency_limit")
    if per_child > int(cfg["max_predicted_tokens_per_agent"]): violations.append("per_agent_token_limit")
    if aggregate > int(cfg["max_aggregate_predicted_tokens"]): violations.append("aggregate_token_limit")
    if amplification >= float(cfg["block_amplification_ratio"]): violations.append("amplification_limit")
    elif amplification >= float(cfg["warn_amplification_ratio"]): warnings.append("high_amplification")

    return {
        "decision": "block" if violations else ("warn" if warnings else "allow"),
        "agents": agents,
        "inherited_tokens_per_child": inherited,
        "expected_work_tokens_per_child": work_tokens,
        "predicted_tokens_per_child": per_child,
        "predicted_aggregate_tokens": aggregate,
        "serial_baseline_tokens": baseline,
        "predicted_amplification_ratio": round(amplification, 3),
        "max_retries": retries,
        "warnings": warnings,
        "violations": violations
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("command", choices=["check"])
    p.add_argument("--config", required=True)
    p.add_argument("--parent-context-tokens", type=int, required=True)
    p.add_argument("--agents", type=int, required=True)
    p.add_argument("--expected-work-tokens", type=int, required=True)
    p.add_argument("--max-retries", type=int, default=0)
    p.add_argument("--serial-baseline-tokens", type=int)
    args = p.parse_args()
    try:
        result = evaluate(load_config(args.config), args.parent_context_tokens, args.agents, args.expected_work_tokens, args.max_retries, args.serial_baseline_tokens)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 2 if result["decision"] == "block" else 0
    except (OSError, ValueError, TypeError, json.JSONDecodeError) as exc:
        print("fanout-budget error: " + str(exc), file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
