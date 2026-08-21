#!/usr/bin/env python3
"""Deterministic admission gate for a subagent context envelope.

Input JSON example:
{
  "model": "worker-model",
  "context_limit": 200000,
  "components": {
    "system": 30000,
    "tool_schemas": 40000,
    "required_context": 50000,
    "user_input": 5000,
    "duplicate_history": 12000,
    "optional_tool_schemas": 18000
  },
  "required_components": ["system", "required_context", "user_input"],
  "output_reserve": 16000,
  "reroute_candidates": {"large-model": 400000}
}

Exit codes: 0 allow, 2 invalid, 3 reduce_optional, 4 reroute, 5 block.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOW, INVALID, REDUCE, REROUTE, BLOCK = 0, 2, 3, 4, 5


def load_object(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def nonnegative_int(value: Any, name: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        raise ValueError(f"{name} must be a non-negative integer")
    return value


def evaluate(data: dict[str, Any], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    model = data.get("model")
    if not isinstance(model, str) or not model.strip():
        raise ValueError("model must be a non-empty string")

    raw_limit = data.get("context_limit")
    if raw_limit is None:
        if policy.get("fail_closed_on_unknown_limit", True):
            return {"decision": "block", "model": model, "reason": "unknown context limit"}, BLOCK
        raw_limit = policy.get("default_context_limit")
    limit = nonnegative_int(raw_limit, "context_limit")
    if limit == 0:
        raise ValueError("context_limit must be greater than zero")

    components = data.get("components")
    if not isinstance(components, dict) or not components:
        raise ValueError("components must be a non-empty object")
    measured: dict[str, int] = {}
    for key, value in components.items():
        if not isinstance(key, str) or not key:
            raise ValueError("component names must be non-empty strings")
        measured[key] = nonnegative_int(value, f"components.{key}")

    required = data.get("required_components", policy.get("required_components", []))
    if not isinstance(required, list) or not all(isinstance(x, str) for x in required):
        raise ValueError("required_components must be an array of strings")
    missing = sorted(set(required) - set(measured))
    if missing:
        raise ValueError(f"required components missing from measurements: {missing}")

    reserve = nonnegative_int(
        data.get("output_reserve", policy.get("minimum_output_reserve", 0)),
        "output_reserve",
    )
    min_reserve = nonnegative_int(policy.get("minimum_output_reserve", 0), "minimum_output_reserve")
    if reserve < min_reserve:
        raise ValueError(f"output_reserve {reserve} is below policy minimum {min_reserve}")
    headroom = nonnegative_int(policy.get("minimum_headroom_tokens", 0), "minimum_headroom_tokens")
    effective_budget = limit - reserve - headroom
    if effective_budget <= 0:
        return {
            "decision": "block", "model": model, "context_limit": limit,
            "reason": "reserve and mandatory headroom consume the context window"
        }, BLOCK

    total_input = sum(measured.values())
    required_input = sum(measured[name] for name in set(required))
    optional_input = total_input - required_input
    utilization = total_input / limit
    max_ratio = policy.get("max_utilization_ratio", 1.0)
    if isinstance(max_ratio, bool) or not isinstance(max_ratio, (int, float)) or not 0 < float(max_ratio) <= 1:
        raise ValueError("max_utilization_ratio must be in (0, 1]")
    ratio_budget = int(limit * float(max_ratio)) - reserve
    admissible_budget = min(effective_budget, ratio_budget)
    deficit = max(0, total_input - admissible_budget)

    base = {
        "model": model,
        "context_limit": limit,
        "output_reserve": reserve,
        "mandatory_headroom": headroom,
        "effective_budget": admissible_budget,
        "total_input": total_input,
        "required_input": required_input,
        "optional_input": optional_input,
        "utilization_ratio": round(utilization, 6),
        "headroom": max(0, admissible_budget - total_input),
        "deficit": deficit,
        "components": measured,
    }

    if required_input > admissible_budget:
        candidates = data.get("reroute_candidates", {})
        approved = policy.get("approved_reroute_models", {})
        if not isinstance(candidates, dict) or not isinstance(approved, dict):
            raise ValueError("reroute candidate/model maps must be objects")
        viable = []
        if policy.get("allow_model_reroute", True):
            for name, candidate_limit_raw in candidates.items():
                if name not in approved:
                    continue
                candidate_limit = nonnegative_int(candidate_limit_raw, f"reroute_candidates.{name}")
                candidate_budget = min(
                    candidate_limit - reserve - headroom,
                    int(candidate_limit * float(max_ratio)) - reserve,
                )
                if total_input <= candidate_budget:
                    viable.append({"model": name, "context_limit": candidate_limit, "budget": candidate_budget})
        if viable:
            viable.sort(key=lambda x: (x["context_limit"], x["model"]))
            return {**base, "decision": "reroute", "reason": "required envelope exceeds current model budget", "viable_reroutes": viable}, REROUTE
        return {**base, "decision": "block", "reason": "required envelope cannot fit and no approved reroute fits"}, BLOCK

    if total_input <= admissible_budget:
        return {**base, "decision": "allow", "reason": "complete envelope fits with policy reserve"}, ALLOW

    if optional_input > 0 and policy.get("allow_optional_context_reduction", True):
        order = policy.get("optional_reduction_order", [])
        if not isinstance(order, list) or not all(isinstance(x, str) for x in order):
            raise ValueError("optional_reduction_order must be an array of strings")
        remaining_deficit = deficit
        plan = []
        required_set = set(required)
        for name in order:
            if name in required_set:
                continue
            tokens = measured.get(name, 0)
            if tokens <= 0:
                continue
            remove = min(tokens, remaining_deficit)
            plan.append({"component": name, "max_removable_tokens": tokens, "needed_tokens": remove})
            remaining_deficit -= remove
            if remaining_deficit <= 0:
                break
        if remaining_deficit <= 0:
            return {**base, "decision": "reduce_optional", "reason": "optional context causes overflow", "reduction_plan": plan}, REDUCE

    candidates = data.get("reroute_candidates", {})
    approved = policy.get("approved_reroute_models", {})
    viable = []
    if policy.get("allow_model_reroute", True) and isinstance(candidates, dict) and isinstance(approved, dict):
        for name, candidate_limit_raw in candidates.items():
            if name not in approved:
                continue
            candidate_limit = nonnegative_int(candidate_limit_raw, f"reroute_candidates.{name}")
            candidate_budget = min(candidate_limit - reserve - headroom, int(candidate_limit * float(max_ratio)) - reserve)
            if total_input <= candidate_budget:
                viable.append({"model": name, "context_limit": candidate_limit, "budget": candidate_budget})
    if viable:
        viable.sort(key=lambda x: (x["context_limit"], x["model"]))
        return {**base, "decision": "reroute", "reason": "current envelope does not fit", "viable_reroutes": viable}, REROUTE

    return {**base, "decision": "block", "reason": "envelope does not fit safely"}, BLOCK


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        result, code = evaluate(load_object(args.input), load_object(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, sort_keys=True))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
