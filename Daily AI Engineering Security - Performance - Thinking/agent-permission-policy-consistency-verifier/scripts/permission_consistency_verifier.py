#!/usr/bin/env python3
"""Verify observed agent permission decisions against an explicit scenario matrix.

Input observations are JSON Lines with fields:
  scenario_id: string
  observed_decision: allow|ask|deny
  observed_reason_class: optional string
  source: optional string
  timestamp: optional string

Exit codes:
  0 - all required scenarios observed and no blocking mismatch
  2 - policy mismatch or missing required scenario
  3 - invalid input/configuration
  4 - I/O error

This script never executes agent tools and never changes permission settings.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

VALID_DECISIONS = {"allow", "ask", "deny"}
SEVERITY = {
    ("deny", "allow"): "critical",
    ("ask", "allow"): "critical",
    ("deny", "ask"): "high",
    ("allow", "deny"): "reliability",
    ("allow", "ask"): "reliability",
    ("ask", "deny"): "reliability",
}


def fail(message: str, code: int = 3) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(code)


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except OSError as exc:
        fail(f"I/O error reading {path}: {exc}", 4)
    except json.JSONDecodeError as exc:
        fail(f"Invalid JSON in {path}: {exc}", 3)


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    try:
        with path.open("r", encoding="utf-8") as handle:
            for line_no, raw in enumerate(handle, 1):
                line = raw.strip()
                if not line:
                    continue
                try:
                    value = json.loads(line)
                except json.JSONDecodeError as exc:
                    fail(f"Invalid JSONL at {path}:{line_no}: {exc}", 3)
                if not isinstance(value, dict):
                    fail(f"Observation at {path}:{line_no} must be a JSON object", 3)
                rows.append(value)
    except OSError as exc:
        fail(f"I/O error reading {path}: {exc}", 4)
    return rows


def validate_matrix(matrix: Any) -> tuple[dict[str, dict[str, Any]], set[str]]:
    if not isinstance(matrix, dict):
        fail("Policy matrix root must be an object")
    scenarios = matrix.get("scenarios")
    if not isinstance(scenarios, list) or not scenarios:
        fail("Policy matrix must contain a non-empty scenarios array")

    by_id: dict[str, dict[str, Any]] = {}
    for index, scenario in enumerate(scenarios):
        if not isinstance(scenario, dict):
            fail(f"Scenario #{index + 1} must be an object")
        scenario_id = scenario.get("id")
        expected = scenario.get("expected_decision")
        if not isinstance(scenario_id, str) or not scenario_id.strip():
            fail(f"Scenario #{index + 1} has invalid id")
        if scenario_id in by_id:
            fail(f"Duplicate scenario id: {scenario_id}")
        if expected not in VALID_DECISIONS:
            fail(f"Scenario {scenario_id} has invalid expected_decision: {expected!r}")
        by_id[scenario_id] = scenario

    critical_raw = matrix.get("critical_scenarios", [])
    if not isinstance(critical_raw, list) or not all(isinstance(x, str) for x in critical_raw):
        fail("critical_scenarios must be an array of scenario ids")
    critical = set(critical_raw)
    unknown = critical.difference(by_id)
    if unknown:
        fail(f"Unknown critical scenario ids: {sorted(unknown)}")
    return by_id, critical


def validate_observation(row: dict[str, Any], index: int) -> None:
    scenario_id = row.get("scenario_id")
    observed = row.get("observed_decision")
    if not isinstance(scenario_id, str) or not scenario_id:
        fail(f"Observation #{index} missing scenario_id")
    if observed not in VALID_DECISIONS:
        fail(f"Observation #{index} has invalid observed_decision: {observed!r}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--matrix", required=True, type=Path, help="Policy matrix JSON")
    parser.add_argument("--observations", required=True, type=Path, help="Observed decisions JSONL")
    parser.add_argument("--report", type=Path, help="Optional JSON report path")
    parser.add_argument(
        "--require-all",
        action="store_true",
        help="Fail when any configured scenario is missing, not only critical scenarios",
    )
    args = parser.parse_args()

    matrix = load_json(args.matrix)
    scenarios, critical = validate_matrix(matrix)
    observations = load_jsonl(args.observations)

    latest: dict[str, dict[str, Any]] = {}
    duplicates: dict[str, int] = {}
    unknown_observations: list[str] = []
    for index, row in enumerate(observations, 1):
        validate_observation(row, index)
        scenario_id = row["scenario_id"]
        if scenario_id not in scenarios:
            unknown_observations.append(scenario_id)
            continue
        if scenario_id in latest:
            duplicates[scenario_id] = duplicates.get(scenario_id, 1) + 1
        latest[scenario_id] = row

    mismatches: list[dict[str, Any]] = []
    for scenario_id, row in latest.items():
        scenario = scenarios[scenario_id]
        expected = scenario["expected_decision"]
        observed = row["observed_decision"]
        expected_reason = scenario.get("expected_reason_class")
        observed_reason = row.get("observed_reason_class")
        decision_match = expected == observed
        reason_match = not expected_reason or expected_reason == observed_reason
        if not decision_match or not reason_match:
            mismatches.append(
                {
                    "scenario_id": scenario_id,
                    "risk": scenario.get("risk", "unknown"),
                    "expected_decision": expected,
                    "observed_decision": observed,
                    "expected_reason_class": expected_reason,
                    "observed_reason_class": observed_reason,
                    "decision_match": decision_match,
                    "reason_match": reason_match,
                    "severity": SEVERITY.get((expected, observed), "diagnostic")
                    if not decision_match
                    else "diagnostic",
                    "source": row.get("source"),
                    "timestamp": row.get("timestamp"),
                }
            )

    required = set(scenarios) if args.require_all else critical
    missing = sorted(required.difference(latest))
    security_mismatches = [m for m in mismatches if m["severity"] in {"critical", "high"}]
    reliability_mismatches = [m for m in mismatches if m["severity"] == "reliability"]

    report = {
        "environment": matrix.get("environment"),
        "configured_scenarios": len(scenarios),
        "observed_scenarios": len(latest),
        "missing_required_scenarios": missing,
        "unknown_observations": sorted(set(unknown_observations)),
        "duplicate_observation_counts": duplicates,
        "mismatch_count": len(mismatches),
        "security_mismatch_count": len(security_mismatches),
        "reliability_mismatch_count": len(reliability_mismatches),
        "mismatches": mismatches,
        "status": "PASS" if not mismatches and not missing else "FAIL",
    }

    rendered = json.dumps(report, indent=2, sort_keys=True)
    print(rendered)
    if args.report:
        try:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(rendered + "\n", encoding="utf-8")
        except OSError as exc:
            fail(f"I/O error writing report {args.report}: {exc}", 4)

    return 0 if report["status"] == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())
