#!/usr/bin/env python3
"""Bounded deterministic detector for pytest test-order dependence."""
from __future__ import annotations

import argparse
import json
import os
import random
import subprocess
import sys
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class RunResult:
    label: str
    order: list[str]
    returncode: int
    duration_seconds: float
    stdout: str
    stderr: str
    timed_out: bool = False


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load JSON from {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def validate_config(config: dict[str, Any]) -> dict[str, Any]:
    if config.get("version") != 1:
        raise ValueError("config.version must equal 1")
    for key in ("permutations", "seed", "timeout_seconds", "max_reproduced_failures", "max_tests"):
        if not isinstance(config.get(key), int):
            raise ValueError(f"config.{key} must be an integer")
    if not 1 <= config["permutations"] <= 100:
        raise ValueError("config.permutations must be between 1 and 100")
    if not 1 <= config["timeout_seconds"] <= 86400:
        raise ValueError("config.timeout_seconds must be between 1 and 86400")
    if not 1 <= config["max_reproduced_failures"] <= config["permutations"]:
        raise ValueError("config.max_reproduced_failures must be within permutation count")
    if not 1 <= config["max_tests"] <= 5000:
        raise ValueError("config.max_tests must be between 1 and 5000")
    for key in ("pytest_command", "collection_args", "run_args"):
        if not isinstance(config.get(key), list) or not all(isinstance(x, str) for x in config[key]):
            raise ValueError(f"config.{key} must be an array of strings")
    env = config.get("environment", {})
    if not isinstance(env, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in env.items()):
        raise ValueError("config.environment must be a string map")
    return config


def parse_collected_nodeids(stdout: str) -> list[str]:
    nodeids: list[str] = []
    for raw in stdout.splitlines():
        line = raw.strip()
        if "::" in line and not line.startswith(("=", "<")):
            nodeids.append(line)
    seen: set[str] = set()
    unique: list[str] = []
    for nodeid in nodeids:
        if nodeid not in seen:
            seen.add(nodeid)
            unique.append(nodeid)
    return unique


def build_env(config: dict[str, Any]) -> dict[str, str]:
    env = os.environ.copy()
    env.update(config.get("environment", {}))
    return env


def run_command(command: list[str], cwd: Path, timeout: int, env: dict[str, str]) -> tuple[int, float, str, str, bool]:
    started = time.monotonic()
    try:
        proc = subprocess.run(command, cwd=cwd, env=env, text=True, capture_output=True, timeout=timeout, check=False)
        return proc.returncode, round(time.monotonic() - started, 3), proc.stdout, proc.stderr, False
    except subprocess.TimeoutExpired as exc:
        stdout = exc.stdout if isinstance(exc.stdout, str) else ""
        stderr = exc.stderr if isinstance(exc.stderr, str) else ""
        return 124, round(time.monotonic() - started, 3), stdout, stderr, True


def collect_tests(config: dict[str, Any], root: Path, extra_args: list[str]) -> tuple[list[str], RunResult]:
    command = config["pytest_command"] + config["collection_args"] + extra_args
    rc, duration, stdout, stderr, timed_out = run_command(command, root, config["timeout_seconds"], build_env(config))
    result = RunResult("collection", [], rc, duration, stdout, stderr, timed_out)
    if rc != 0:
        return [], result
    return parse_collected_nodeids(stdout), result


def execute_order(config: dict[str, Any], root: Path, order: list[str], label: str, extra_args: list[str] | None = None) -> RunResult:
    command = config["pytest_command"] + config["run_args"]
    if extra_args:
        command += extra_args
    command += order
    rc, duration, stdout, stderr, timed_out = run_command(command, root, config["timeout_seconds"], build_env(config))
    return RunResult(label, order, rc, duration, stdout, stderr, timed_out)


def generate_permutations(nodeids: list[str], seed: int, count: int) -> list[list[str]]:
    rng = random.Random(seed)
    result: list[list[str]] = []
    signatures: set[tuple[str, ...]] = set()
    attempts = 0
    max_attempts = max(20, count * 20)
    while len(result) < count and attempts < max_attempts:
        attempts += 1
        candidate = list(nodeids)
        rng.shuffle(candidate)
        signature = tuple(candidate)
        if signature in signatures:
            continue
        signatures.add(signature)
        result.append(candidate)
    return result


def candidate_sequences(victim: str, candidates: list[str]) -> list[list[str]]:
    sequences: list[list[str]] = []
    for candidate in candidates:
        if candidate != victim:
            sequences.append([candidate, victim])
    if candidates:
        all_before = [x for x in candidates if x != victim] + [victim]
        if len(all_before) > 1:
            sequences.append(all_before)
    return sequences


def compact_result(result: RunResult) -> dict[str, Any]:
    value = asdict(result)
    value["stdout"] = result.stdout[-12000:]
    value["stderr"] = result.stderr[-12000:]
    return value


def write_report(path: Path, report: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--pytest-arg", action="append", default=[])
    parser.add_argument("--victim")
    parser.add_argument("--candidate", action="append", default=[])
    args = parser.parse_args()

    try:
        config = validate_config(load_json(args.config))
        root = args.root.resolve()
        if not root.is_dir():
            raise ValueError(f"repository root is not a directory: {root}")

        nodeids, collection = collect_tests(config, root, args.pytest_arg)
        report: dict[str, Any] = {
            "status": "runner_error",
            "generated_at": utc_now(),
            "seed": config["seed"],
            "baseline": None,
            "permutations": [],
            "victim_checks": [],
            "summary": {"collection": compact_result(collection), "collected_tests": len(nodeids)},
        }
        if collection.returncode != 0:
            write_report(args.output, report)
            print(json.dumps(report["summary"], indent=2))
            return 4
        if not nodeids:
            report["summary"]["error"] = "no pytest node IDs collected"
            write_report(args.output, report)
            return 4
        if len(nodeids) > config["max_tests"]:
            report["summary"]["error"] = f"collected {len(nodeids)} tests, above max_tests={config['max_tests']}"
            write_report(args.output, report)
            return 4

        baseline = execute_order(config, root, nodeids, "baseline")
        report["baseline"] = compact_result(baseline)
        if baseline.returncode != 0:
            report["status"] = "baseline_fail"
            report["summary"]["message"] = "normal collected order already fails; classify baseline defect before order dependence"
            write_report(args.output, report)
            return 2

        reproduced = 0
        for index, order in enumerate(generate_permutations(nodeids, config["seed"], config["permutations"]), start=1):
            result = execute_order(config, root, order, f"permutation-{index}")
            report["permutations"].append(compact_result(result))
            if result.returncode != 0:
                reproduced += 1
                if reproduced >= config["max_reproduced_failures"]:
                    break

        victim_reproduced = False
        if args.victim:
            if args.victim not in nodeids:
                report["summary"]["victim_error"] = "victim was not found in collected node IDs"
            else:
                candidates = args.candidate or [n for n in nodeids if n != args.victim]
                candidates = [n for n in candidates if n in nodeids and n != args.victim]
                for index, sequence in enumerate(candidate_sequences(args.victim, candidates), start=1):
                    result = execute_order(config, root, sequence, f"victim-check-{index}")
                    report["victim_checks"].append(compact_result(result))
                    if result.returncode != 0:
                        victim_reproduced = True
                        break

        if victim_reproduced:
            report["status"] = "victim_reproduced"
        elif reproduced:
            report["status"] = "order_dependent_failure"
        else:
            report["status"] = "not_reproduced"
        report["summary"].update({
            "permutations_executed": len(report["permutations"]),
            "permutation_failures": reproduced,
            "victim_checks_executed": len(report["victim_checks"]),
            "victim_reproduced": victim_reproduced,
        })
        write_report(args.output, report)
        print(json.dumps({"status": report["status"], **report["summary"]}, indent=2))
        return 1 if report["status"] in {"order_dependent_failure", "victim_reproduced"} else 0
    except ValueError as exc:
        print(f"configuration/input error: {exc}", file=sys.stderr)
        return 4
    except Exception as exc:
        print(f"unexpected runner error: {exc}", file=sys.stderr)
        return 5


if __name__ == "__main__":
    raise SystemExit(main())
