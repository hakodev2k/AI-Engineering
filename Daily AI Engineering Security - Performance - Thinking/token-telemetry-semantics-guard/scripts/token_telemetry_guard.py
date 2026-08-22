#!/usr/bin/env python3
"""Validate canonical token telemetry semantics and estimator accuracy.

Each JSONL event must contain:
  event_id: string
  current_context_tokens: non-negative number
  model_context_window: positive number
  measurement_source: provider_measured|tokenizer_measured|estimated|reconstructed
Optional:
  session_id: string
  session_cumulative_tokens: non-negative number
  cached_input_tokens: non-negative number
  estimated_current_context_tokens: non-negative number
  measured_current_context_tokens: non-negative number
  automation_consumer: boolean

Exit codes: 0 success, 2 invalid input/config, 3 strict policy violation.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Any


def load_policy(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("policy must contain a JSON object")
    return value


def number(row: dict[str, Any], key: str, required: bool = False) -> float | None:
    if key not in row:
        if required:
            raise ValueError(f"missing {key}")
        return None
    value = row[key]
    if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{key} must be a non-negative number")
    return float(value)


def load_events(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read events: {exc}") from exc
    events: list[dict[str, Any]] = []
    for line_no, raw in enumerate(lines, 1):
        if not raw.strip():
            continue
        try:
            row = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {line_no}: invalid JSON: {exc}") from exc
        if not isinstance(row, dict):
            raise ValueError(f"line {line_no}: event must be an object")
        if not isinstance(row.get("event_id"), str) or not row["event_id"].strip():
            raise ValueError(f"line {line_no}: event_id must be non-empty string")
        if not isinstance(row.get("measurement_source"), str):
            raise ValueError(f"line {line_no}: measurement_source must be string")
        current = number(row, "current_context_tokens", required=True)
        window = number(row, "model_context_window", required=True)
        if window is None or window <= 0:
            raise ValueError(f"line {line_no}: model_context_window must be positive")
        for key in ("session_cumulative_tokens", "cached_input_tokens", "estimated_current_context_tokens", "measured_current_context_tokens"):
            number(row, key)
        if "automation_consumer" in row and not isinstance(row["automation_consumer"], bool):
            raise ValueError(f"line {line_no}: automation_consumer must be boolean")
        events.append(row)
    if not events:
        raise ValueError("events file contains no events")
    return events


def analyze(events: list[dict[str, Any]], policy: dict[str, Any]) -> dict[str, Any]:
    allowed_sources = set(policy.get("allowed_measurement_sources", []))
    if not allowed_sources:
        raise ValueError("policy.allowed_measurement_sources must be non-empty")
    max_error = float(policy.get("max_estimator_relative_error", 0.15))
    if max_error < 0:
        raise ValueError("max_estimator_relative_error must be non-negative")

    violations: list[dict[str, Any]] = []
    estimator_errors: list[float] = []
    last_cumulative: dict[str, float] = {}

    for row in events:
        event_id = row["event_id"]
        source = row["measurement_source"]
        current = float(row["current_context_tokens"])
        window = float(row["model_context_window"])
        automation = row.get("automation_consumer", False)

        if policy.get("require_measurement_source", True) and source not in allowed_sources:
            violations.append({"event_id": event_id, "code": "invalid_measurement_source"})
        if policy.get("block_when_current_context_exceeds_window", True) and current > window:
            violations.append({"event_id": event_id, "code": "current_context_exceeds_window", "current": current, "window": window})

        cumulative = row.get("session_cumulative_tokens")
        session_id = row.get("session_id", "default")
        if cumulative is not None:
            cumulative = float(cumulative)
            previous = last_cumulative.get(str(session_id))
            if policy.get("require_monotonic_session_cumulative", True) and previous is not None and cumulative < previous:
                violations.append({"event_id": event_id, "code": "cumulative_counter_decreased", "previous": previous, "current": cumulative})
            last_cumulative[str(session_id)] = cumulative
            if automation and cumulative == current and cumulative > window:
                violations.append({"event_id": event_id, "code": "ambiguous_cumulative_used_as_context"})

        measured = row.get("measured_current_context_tokens")
        estimated = row.get("estimated_current_context_tokens")
        if measured is not None and estimated is not None:
            measured_f = float(measured)
            estimated_f = float(estimated)
            error = abs(estimated_f - measured_f) / max(measured_f, 1.0)
            estimator_errors.append(error)
            if error > max_error:
                violations.append({"event_id": event_id, "code": "estimator_error_exceeds_policy", "relative_error": round(error, 6)})
            if source == "estimated" and current == estimated_f and automation:
                violations.append({"event_id": event_id, "code": "estimate_drives_automation_despite_measured_value"})

        if automation and source in {"estimated", "reconstructed"} and policy.get("block_automation_on_ambiguous_semantics", True) and measured is None:
            violations.append({"event_id": event_id, "code": "automation_uses_unverified_estimate"})

    return {
        "event_count": len(events),
        "violation_count": len(violations),
        "violations": violations,
        "estimator_samples": len(estimator_errors),
        "max_estimator_relative_error": round(max(estimator_errors), 6) if estimator_errors else None,
        "mean_estimator_relative_error": round(sum(estimator_errors) / len(estimator_errors), 6) if estimator_errors else None,
        "safe_for_automation": len(violations) == 0,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("events", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        report = analyze(load_events(args.events), load_policy(args.policy))
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 3 if args.strict and not report["safe_for_automation"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
