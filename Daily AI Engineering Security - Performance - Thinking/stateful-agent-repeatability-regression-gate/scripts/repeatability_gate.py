#!/usr/bin/env python3
"""Deterministic repeated-run reliability gate for stateful agent tasks."""
from __future__ import annotations
import json
import sys
from collections import defaultdict
from pathlib import Path

REQUIRED_RUN_FIELDS = {"task_id", "trial", "passed", "collateral_effect", "harness_error", "evidence"}


def load_json(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON config: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("config must be an object")
    return data


def load_runs(path: Path) -> list[dict]:
    runs = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError as exc:
        raise ValueError(f"file not found: {path}") from exc
    for line_no, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSONL line {line_no}: {exc}") from exc
        if not isinstance(row, dict) or not REQUIRED_RUN_FIELDS.issubset(row):
            raise ValueError(f"line {line_no} missing required fields")
        if not isinstance(row["task_id"], str) or not row["task_id"].strip():
            raise ValueError(f"line {line_no}: task_id must be non-empty string")
        if not isinstance(row["trial"], int) or row["trial"] < 1:
            raise ValueError(f"line {line_no}: trial must be positive integer")
        for field in ("passed", "collateral_effect", "harness_error"):
            if not isinstance(row[field], bool):
                raise ValueError(f"line {line_no}: {field} must be boolean")
        if not isinstance(row["evidence"], str) or not row["evidence"].strip():
            raise ValueError(f"line {line_no}: evidence must be non-empty string")
        runs.append(row)
    if not runs:
        raise ValueError("run corpus is empty")
    return runs


def validate_config(cfg: dict) -> None:
    integer_keys = ["min_trials_per_task"]
    rate_keys = ["min_run_pass_rate", "min_all_runs_success_task_rate", "max_flaky_task_rate", "max_never_pass_task_rate", "max_harness_error_rate"]
    for key in integer_keys:
        if not isinstance(cfg.get(key), int) or cfg[key] < 1:
            raise ValueError(f"{key} must be integer >= 1")
    for key in rate_keys:
        value = cfg.get(key)
        if not isinstance(value, (int, float)) or isinstance(value, bool) or not 0 <= value <= 1:
            raise ValueError(f"{key} must be in [0,1]")
    if not isinstance(cfg.get("block_on_any_collateral_effect"), bool):
        raise ValueError("block_on_any_collateral_effect must be boolean")


def calculate(runs: list[dict], min_trials: int) -> tuple[dict, list[str]]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    errors: list[str] = []
    seen = set()
    for row in runs:
        key = (row["task_id"], row["trial"])
        if key in seen:
            errors.append(f"duplicate task/trial: {key[0]}#{key[1]}")
        seen.add(key)
        grouped[row["task_id"]].append(row)
    for task, rows in grouped.items():
        if len(rows) < min_trials:
            errors.append(f"task {task} has {len(rows)} trials; requires {min_trials}")
    total = len(runs)
    passed = sum(1 for r in runs if r["passed"] and not r["harness_error"])
    harness = sum(1 for r in runs if r["harness_error"])
    collateral = sum(1 for r in runs if r["collateral_effect"])
    all_success = 0
    flaky = 0
    never_pass = 0
    for rows in grouped.values():
        valid = [r for r in rows if not r["harness_error"]]
        successes = sum(1 for r in valid if r["passed"])
        if valid and successes == len(valid):
            all_success += 1
        elif successes == 0:
            never_pass += 1
        else:
            flaky += 1
    tasks = len(grouped)
    metrics = {
        "runs": total,
        "tasks": tasks,
        "run_pass_rate": passed / total,
        "all_runs_success_task_rate": all_success / tasks,
        "flaky_task_rate": flaky / tasks,
        "never_pass_task_rate": never_pass / tasks,
        "collateral_effect_rate": collateral / total,
        "harness_error_rate": harness / total,
    }
    return metrics, errors


def gate(cfg: dict, metrics: dict) -> list[str]:
    failures = []
    minimums = {
        "run_pass_rate": cfg["min_run_pass_rate"],
        "all_runs_success_task_rate": cfg["min_all_runs_success_task_rate"],
    }
    maximums = {
        "flaky_task_rate": cfg["max_flaky_task_rate"],
        "never_pass_task_rate": cfg["max_never_pass_task_rate"],
        "harness_error_rate": cfg["max_harness_error_rate"],
    }
    for key, threshold in minimums.items():
        if metrics[key] < threshold:
            failures.append(f"{key}={metrics[key]:.4f} below minimum {threshold:.4f}")
    for key, threshold in maximums.items():
        if metrics[key] > threshold:
            failures.append(f"{key}={metrics[key]:.4f} above maximum {threshold:.4f}")
    if cfg["block_on_any_collateral_effect"] and metrics["collateral_effect_rate"] > 0:
        failures.append("collateral effects observed")
    return failures


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(f"usage: {argv[0]} <gate-config.json> <runs.jsonl>", file=sys.stderr)
        return 1
    try:
        cfg = load_json(Path(argv[1])); validate_config(cfg)
        runs = load_runs(Path(argv[2]))
        metrics, evidence_errors = calculate(runs, cfg["min_trials_per_task"])
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(metrics, indent=2, sort_keys=True))
    if evidence_errors:
        print("INVALID EVIDENCE")
        for err in evidence_errors:
            print(f"- {err}")
        return 1
    failures = gate(cfg, metrics)
    if failures:
        print("BLOCK")
        for failure in failures:
            print(f"- {failure}")
        return 2
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
