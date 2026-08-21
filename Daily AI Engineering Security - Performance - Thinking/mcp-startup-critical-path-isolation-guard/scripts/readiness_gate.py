#!/usr/bin/env python3
"""Validate MCP startup policy and compare benchmark artifacts.

Exit codes:
0 pass
2 invalid input/policy
3 performance or invariant gate failed
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

VALID_CLASSES = {"required", "background", "on_demand", "disabled"}


def load_json(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"top-level JSON must be an object: {path}")
    return data


def validate_policy(policy: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    positive_ints = [
        "core_ready_slo_ms",
        "max_parallel_initializers",
        "default_required_timeout_ms",
        "default_background_timeout_ms",
        "default_on_demand_timeout_ms",
        "retry_backoff_ms",
        "failure_cooldown_ms",
    ]
    for key in positive_ints:
        val = policy.get(key)
        if not isinstance(val, int) or val <= 0:
            errors.append(f"{key} must be a positive integer")
    retries = policy.get("max_retries_per_server")
    if not isinstance(retries, int) or retries < 0 or retries > 10:
        errors.append("max_retries_per_server must be an integer between 0 and 10")
    regression = policy.get("core_ready_regression_percent")
    if not isinstance(regression, (int, float)) or regression < 0 or regression > 100:
        errors.append("core_ready_regression_percent must be between 0 and 100")
    if policy.get("optional_servers_may_block_core_ready") is not False:
        errors.append("optional_servers_may_block_core_ready must be false")

    servers = policy.get("servers", {})
    if not isinstance(servers, dict):
        errors.append("servers must be an object")
        return errors
    for name, cfg in servers.items():
        if not isinstance(cfg, dict):
            errors.append(f"server {name}: config must be an object")
            continue
        cls = cfg.get("class")
        if cls not in VALID_CLASSES:
            errors.append(f"server {name}: invalid class {cls!r}")
        timeout = cfg.get("timeout_ms")
        if cls != "disabled" and (not isinstance(timeout, int) or timeout <= 0):
            errors.append(f"server {name}: enabled server needs positive timeout_ms")
        caps = cfg.get("capabilities", [])
        if not isinstance(caps, list) or any(not isinstance(c, str) or not c for c in caps):
            errors.append(f"server {name}: capabilities must be non-empty strings")
    return errors


def summary(doc: dict[str, Any], label: str) -> dict[str, Any]:
    s = doc.get("summary")
    if not isinstance(s, dict):
        raise ValueError(f"{label}: missing summary object")
    return s


def number(value: Any, name: str) -> float:
    if not isinstance(value, (int, float)):
        raise ValueError(f"{name} must be numeric")
    return float(value)


def compare(policy: dict[str, Any], baseline: dict[str, Any], candidate: dict[str, Any]) -> tuple[list[str], dict[str, Any]]:
    failures: list[str] = []
    bs = summary(baseline, "baseline")
    cs = summary(candidate, "candidate")

    base_p95 = number(bs.get("core_ready_p95_ms"), "baseline core_ready_p95_ms")
    cand_p95 = number(cs.get("core_ready_p95_ms"), "candidate core_ready_p95_ms")
    slo = number(policy.get("core_ready_slo_ms"), "core_ready_slo_ms")
    allowed_pct = number(policy.get("core_ready_regression_percent"), "core_ready_regression_percent")
    allowed_vs_base = base_p95 * (1.0 + allowed_pct / 100.0)

    if cand_p95 > slo:
        failures.append(f"candidate p95 {cand_p95:.2f}ms exceeds SLO {slo:.2f}ms")
    if cand_p95 > allowed_vs_base:
        failures.append(
            f"candidate p95 {cand_p95:.2f}ms exceeds baseline regression limit {allowed_vs_base:.2f}ms"
        )

    optional_blocks = int(cs.get("optional_block_count", 0))
    if optional_blocks != 0:
        failures.append(f"optional_block_count must be 0, got {optional_blocks}")

    peak = int(cs.get("peak_initializers", 0))
    max_parallel = int(policy["max_parallel_initializers"])
    if peak > max_parallel:
        failures.append(f"peak_initializers {peak} exceeds max {max_parallel}")

    if int(cs.get("timeouts", 0)) > 0 and candidate.get("scenario") == "normal":
        failures.append("normal candidate scenario contains startup benchmark timeouts")

    valid = int(cs.get("valid_core_ready_count", 0))
    run_count = int(cs.get("run_count", 0))
    if run_count < 3 or valid != run_count:
        failures.append("candidate does not contain at least 3 fully valid core-ready runs")

    delta_pct = ((cand_p95 - base_p95) / base_p95 * 100.0) if base_p95 > 0 else None
    result = {
        "pass": not failures,
        "baseline_core_ready_p95_ms": base_p95,
        "candidate_core_ready_p95_ms": cand_p95,
        "delta_percent": delta_pct,
        "slo_ms": slo,
        "allowed_regression_percent": allowed_pct,
        "failures": failures,
    }
    return failures, result


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd", required=True)

    vp = sub.add_parser("validate-policy")
    vp.add_argument("--policy", required=True)

    cp = sub.add_parser("compare")
    cp.add_argument("--policy", required=True)
    cp.add_argument("--baseline", required=True)
    cp.add_argument("--candidate", required=True)

    args = parser.parse_args()
    try:
        policy = load_json(args.policy)
        errors = validate_policy(policy)
        if errors:
            print(json.dumps({"policy_valid": False, "errors": errors}, indent=2))
            return 2
        if args.cmd == "validate-policy":
            print(json.dumps({"policy_valid": True, "errors": []}))
            return 0

        baseline = load_json(args.baseline)
        candidate = load_json(args.candidate)
        failures, result = compare(policy, baseline, candidate)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 3 if failures else 0
    except (ValueError, KeyError, TypeError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
