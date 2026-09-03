#!/usr/bin/env python3
"""Check long-chat renderer measurements against absolute and regression budgets."""

import argparse
import json
import sys
from pathlib import Path

REQUIRED_FIELDS = ("messages", "renderer_rss_mb", "rendered_nodes", "p95_frame_ms")


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}") from exc


def validate_series(series, name):
    if not isinstance(series, list) or len(series) < 2:
        raise ValueError(f"{name} must contain at least two checkpoints")
    normalized = []
    seen = set()
    for row in series:
        if not isinstance(row, dict):
            raise ValueError(f"{name} rows must be objects")
        missing = [field for field in REQUIRED_FIELDS if field not in row]
        if missing:
            raise ValueError(f"{name} row missing fields: {missing}")
        values = {field: float(row[field]) for field in REQUIRED_FIELDS}
        if any(value < 0 for value in values.values()) or values["messages"] <= 0:
            raise ValueError(f"{name} values must be non-negative and messages > 0")
        messages = int(values["messages"])
        if messages in seen:
            raise ValueError(f"duplicate message checkpoint {messages} in {name}")
        seen.add(messages)
        values["messages"] = messages
        normalized.append(values)
    return sorted(normalized, key=lambda row: row["messages"])


def slope_per_100(series, metric):
    first, last = series[0], series[-1]
    delta_messages = last["messages"] - first["messages"]
    if delta_messages <= 0:
        raise ValueError("message checkpoints must span a positive range")
    return (last[metric] - first[metric]) * 100.0 / delta_messages


def evaluate(budgets, measurements):
    baseline = validate_series(measurements.get("baseline"), "baseline")
    candidate = validate_series(measurements.get("candidate"), "candidate")
    baseline_by_messages = {row["messages"]: row for row in baseline}
    candidate_by_messages = {row["messages"]: row for row in candidate}
    if set(baseline_by_messages) != set(candidate_by_messages):
        raise ValueError("baseline and candidate must use identical message checkpoints")

    required_budgets = ["max_renderer_rss_mb", "max_rendered_nodes", "max_p95_frame_ms", "max_rss_growth_mb_per_100_messages", "max_node_growth_per_100_messages", "max_regression_percent"]
    for key in required_budgets:
        if key not in budgets or float(budgets[key]) < 0:
            raise ValueError(f"missing or invalid budget: {key}")

    violations = []
    for row in candidate:
        checks = (
            ("renderer_rss_mb", "max_renderer_rss_mb"),
            ("rendered_nodes", "max_rendered_nodes"),
            ("p95_frame_ms", "max_p95_frame_ms"),
        )
        for metric, budget_key in checks:
            if row[metric] > float(budgets[budget_key]):
                violations.append({"checkpoint_messages": row["messages"], "metric": metric, "reason": "absolute_budget", "actual": row[metric], "limit": float(budgets[budget_key])})

    rss_growth = slope_per_100(candidate, "renderer_rss_mb")
    node_growth = slope_per_100(candidate, "rendered_nodes")
    if rss_growth > float(budgets["max_rss_growth_mb_per_100_messages"]):
        violations.append({"metric": "rss_growth_mb_per_100_messages", "reason": "growth_budget", "actual": rss_growth, "limit": float(budgets["max_rss_growth_mb_per_100_messages"])})
    if node_growth > float(budgets["max_node_growth_per_100_messages"]):
        violations.append({"metric": "node_growth_per_100_messages", "reason": "growth_budget", "actual": node_growth, "limit": float(budgets["max_node_growth_per_100_messages"])})

    max_regression = float(budgets["max_regression_percent"])
    for messages, candidate_row in candidate_by_messages.items():
        base = baseline_by_messages[messages]
        for metric in ("renderer_rss_mb", "rendered_nodes", "p95_frame_ms"):
            if base[metric] == 0:
                continue
            regression = (candidate_row[metric] - base[metric]) * 100.0 / base[metric]
            if regression > max_regression:
                violations.append({"checkpoint_messages": messages, "metric": metric, "reason": "relative_regression", "actual_percent": regression, "limit_percent": max_regression})

    return {"passed": not violations, "candidate_rss_growth_mb_per_100_messages": rss_growth, "candidate_node_growth_per_100_messages": node_growth, "violations": violations}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--budgets", required=True)
    parser.add_argument("--measurements", required=True)
    parser.add_argument("--output")
    args = parser.parse_args()
    try:
        report = evaluate(load_json(args.budgets), load_json(args.measurements))
    except (ValueError, TypeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    rendered = json.dumps(report, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(rendered + "\n", encoding="utf-8")
    print(rendered)
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
