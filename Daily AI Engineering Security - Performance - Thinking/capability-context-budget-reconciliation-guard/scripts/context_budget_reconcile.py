#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

EXIT_OK = 0
EXIT_REGRESSION = 2
EXIT_INPUT = 3


def load(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain an object")
    return data


def analyze(baseline, candidate, policy):
    for name, obj in (("baseline", baseline), ("candidate", candidate)):
        if not isinstance(obj.get("total_tokens"), int) or obj["total_tokens"] < 0:
            raise ValueError(f"{name}.total_tokens must be a non-negative integer")
        if not isinstance(obj.get("categories"), dict):
            raise ValueError(f"{name}.categories must be an object")

    expected = int(policy.get("expected_removed_tokens", 0))
    ratio = float(policy.get("min_effective_reduction_ratio", 0.8))
    max_total = int(policy.get("max_total_tokens", candidate["total_tokens"]))
    max_growth = int(policy.get("max_unrelated_category_growth", 0))

    removed = baseline["total_tokens"] - candidate["total_tokens"]
    required = int(expected * ratio)
    growth = {}
    categories = set(baseline["categories"]) | set(candidate["categories"])
    for category in sorted(categories):
        delta = int(candidate["categories"].get(category, 0)) - int(baseline["categories"].get(category, 0))
        if delta > 0:
            growth[category] = delta

    violations = []
    if candidate["total_tokens"] > max_total:
        violations.append({"kind": "budget", "observed": candidate["total_tokens"], "limit": max_total})
    if expected > 0 and removed < required:
        violations.append({"kind": "ineffective-removal", "observed_reduction": removed, "required_reduction": required})
    if max_growth >= 0:
        for category, delta in growth.items():
            if delta > max_growth:
                violations.append({"kind": "category-displacement", "category": category, "growth": delta, "limit": max_growth})

    return {
        "status": "pass" if not violations else "regression",
        "baseline_total": baseline["total_tokens"],
        "candidate_total": candidate["total_tokens"],
        "effective_reduction": removed,
        "category_growth": growth,
        "violations": violations,
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description="Reconcile capability-context token changes and detect hidden token displacement.")
    parser.add_argument("--baseline", required=True)
    parser.add_argument("--candidate", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--output")
    args = parser.parse_args(argv)

    try:
        result = analyze(load(args.baseline), load(args.candidate), load(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return EXIT_INPUT

    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    print(text)
    return EXIT_OK if result["status"] == "pass" else EXIT_REGRESSION


if __name__ == "__main__":
    raise SystemExit(main())
