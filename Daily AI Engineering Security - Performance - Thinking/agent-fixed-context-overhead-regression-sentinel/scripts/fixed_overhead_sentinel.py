#!/usr/bin/env python3
"""Compare fixed-context token measurements against a baseline and policy."""
import argparse
import json
import sys
from pathlib import Path

REQUIRED_COMPONENTS = ["system", "tools", "rules", "skills", "mcp", "subagents", "memory_attachments", "other"]


def load(path):
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def validate_measurement(name, item, require_breakdown):
    for field in ("profile", "model", "context_limit_tokens", "fixed_tokens", "components"):
        if field not in item:
            raise ValueError(f"{name} missing {field}")
    if not isinstance(item["context_limit_tokens"], int) or item["context_limit_tokens"] <= 0:
        raise ValueError(f"{name} context_limit_tokens must be positive integer")
    if not isinstance(item["fixed_tokens"], int) or item["fixed_tokens"] < 0:
        raise ValueError(f"{name} fixed_tokens must be non-negative integer")
    if not isinstance(item["components"], dict):
        raise ValueError(f"{name} components must be object")
    if require_breakdown:
        missing = [key for key in REQUIRED_COMPONENTS if key not in item["components"]]
        if missing:
            raise ValueError(f"{name} missing components: {', '.join(missing)}")
    for key, value in item["components"].items():
        if not isinstance(value, int) or value < 0:
            raise ValueError(f"{name} component {key} must be non-negative integer")
    component_sum = sum(item["components"].values())
    if component_sum != item["fixed_tokens"]:
        raise ValueError(f"{name} component sum {component_sum} != fixed_tokens {item['fixed_tokens']}")


def pct_change(old, new):
    if old == 0:
        return 0.0 if new == 0 else float("inf")
    return (new - old) * 100.0 / old


def compare(policy, baseline, candidate):
    require_breakdown = bool(policy.get("require_component_breakdown", True))
    validate_measurement("baseline", baseline, require_breakdown)
    validate_measurement("candidate", candidate, require_breakdown)
    if baseline["profile"] != candidate["profile"]:
        raise ValueError("profile mismatch")
    if baseline["model"] != candidate["model"] and not candidate.get("comparison_note"):
        raise ValueError("model mismatch requires candidate comparison_note")

    fixed = candidate["fixed_tokens"]
    limit = candidate["context_limit_tokens"]
    utilization = fixed * 100.0 / limit
    absolute_delta = fixed - baseline["fixed_tokens"]
    relative_delta = pct_change(baseline["fixed_tokens"], fixed)
    violations = []

    if fixed >= limit:
        violations.append({"code": "does_not_fit_context", "value": fixed, "limit": limit})
    if fixed > policy.get("max_fixed_tokens", 10**18):
        violations.append({"code": "max_fixed_tokens", "value": fixed, "limit": policy["max_fixed_tokens"]})
    if utilization > policy.get("max_context_utilization_pct", 100.0):
        violations.append({"code": "max_context_utilization_pct", "value": round(utilization, 3), "limit": policy["max_context_utilization_pct"]})
    if absolute_delta > policy.get("max_absolute_increase_tokens", 10**18):
        violations.append({"code": "max_absolute_increase_tokens", "value": absolute_delta, "limit": policy["max_absolute_increase_tokens"]})
    if relative_delta > policy.get("max_relative_increase_pct", float("inf")):
        violations.append({"code": "max_relative_increase_pct", "value": round(relative_delta, 3), "limit": policy["max_relative_increase_pct"]})

    component_deltas = []
    threshold = policy.get("max_component_relative_increase_pct", float("inf"))
    keys = sorted(set(baseline["components"]) | set(candidate["components"]))
    for key in keys:
        old = baseline["components"].get(key, 0)
        new = candidate["components"].get(key, 0)
        rel = pct_change(old, new)
        component_deltas.append({"component": key, "baseline": old, "candidate": new, "absolute_delta": new-old, "relative_delta_pct": None if rel == float("inf") else round(rel, 3)})
        if new > old and rel > threshold:
            violations.append({"code": "component_relative_increase", "component": key, "value": "infinite" if rel == float("inf") else round(rel, 3), "limit": threshold})

    component_deltas.sort(key=lambda x: abs(x["absolute_delta"]), reverse=True)
    return {
        "status": "ok" if not violations else "violation",
        "profile": candidate["profile"],
        "model": candidate["model"],
        "fixed_tokens": fixed,
        "context_limit_tokens": limit,
        "context_utilization_pct": round(utilization, 3),
        "absolute_delta_tokens": absolute_delta,
        "relative_delta_pct": None if relative_delta == float("inf") else round(relative_delta, 3),
        "component_deltas": component_deltas,
        "violations": violations,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--policy", required=True)
    parser.add_argument("--baseline", required=True)
    parser.add_argument("--candidate", required=True)
    parser.add_argument("--json-out")
    args = parser.parse_args()
    try:
        result = compare(load(args.policy), load(args.baseline), load(args.candidate))
    except ValueError as exc:
        result = {"status": "error", "error": str(exc)}
        print(json.dumps(result, sort_keys=True))
        return 3
    rendered = json.dumps(result, indent=2, sort_keys=True)
    print(rendered)
    if args.json_out:
        Path(args.json_out).write_text(rendered + "\n", encoding="utf-8")
    return 0 if result["status"] == "ok" else 2


if __name__ == "__main__":
    sys.exit(main())
