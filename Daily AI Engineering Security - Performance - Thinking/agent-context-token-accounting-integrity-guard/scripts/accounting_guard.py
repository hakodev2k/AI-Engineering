#!/usr/bin/env python3
"""Validate token-accounting snapshots before lossy context management.

Snapshot example:
{
  "current_context_tokens": 81174,
  "current_context_source": "provider_input_tokens",
  "context_window_tokens": 370000,
  "cumulative_usage_tokens": 1515840,
  "cache_read_tokens": 0,
  "cache_write_tokens": 0,
  "transcript_revision": "sha256:abc",
  "measurement_revision": "sha256:abc",
  "post_compaction": false,
  "remeasured_after_compaction": true,
  "estimated_context_tokens": 82000,
  "reference_context_tokens": 81174
}
Exit: 0 safe, 2 invalid, 3 integrity failure.
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

SAFE, INVALID, FAIL = 0, 2, 3


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def number(data: dict, key: str, *, required: bool = True) -> float | None:
    value = data.get(key)
    if value is None and not required:
        return None
    if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value) or value < 0:
        raise ValueError(f"{key} must be a finite non-negative number")
    return float(value)


def validate(snapshot: dict, policy: dict) -> dict:
    current = number(snapshot, "current_context_tokens")
    window = number(snapshot, "context_window_tokens")
    cumulative = number(snapshot, "cumulative_usage_tokens")
    source = snapshot.get("current_context_source")
    if not isinstance(source, str) or not source:
        raise ValueError("current_context_source must be a non-empty string")
    if window == 0:
        raise ValueError("context_window_tokens must be greater than zero")

    findings: list[str] = []
    recognized = set(policy.get("recognized_sources", []))
    if source not in recognized:
        findings.append("unrecognized current-context measurement source")
    if not policy.get("allow_cumulative_usage_as_occupancy", False) and source == "cumulative_usage":
        findings.append("cumulative usage cannot be used as context occupancy")
    if cumulative < current and source != "calibrated_estimator":
        findings.append("cumulative usage is unexpectedly below current context")

    transcript_revision = snapshot.get("transcript_revision")
    measurement_revision = snapshot.get("measurement_revision")
    if policy.get("require_transcript_revision_binding", True):
        if not isinstance(transcript_revision, str) or not transcript_revision:
            findings.append("missing transcript revision")
        if measurement_revision != transcript_revision:
            findings.append("measurement is not bound to current transcript revision")

    if snapshot.get("post_compaction") is True and policy.get("require_post_compaction_remeasurement", True):
        if snapshot.get("remeasured_after_compaction") is not True:
            findings.append("post-compaction occupancy was not remeasured")

    ratio = current / window
    max_ratio = float(policy.get("max_occupancy_ratio_without_serialized_recheck", 1.0))
    if ratio > max_ratio and source != "serialized_prompt_tokenizer":
        findings.append("occupancy exceeds configured ratio without serialized-prompt recheck")

    estimated = number(snapshot, "estimated_context_tokens", required=False)
    reference = number(snapshot, "reference_context_tokens", required=False)
    estimator_error_ratio = None
    if estimated is not None and reference is not None and reference > 0:
        estimator_error_ratio = abs(estimated - reference) / reference
        if estimator_error_ratio > float(policy.get("max_estimator_error_ratio", 0.20)):
            findings.append("estimator error exceeds configured tolerance")

    # Detect the common multi-call bug shape: occupancy is effectively the cumulative run sum.
    if cumulative > 0 and current > window and abs(current - cumulative) / cumulative < 0.01:
        findings.append("current context closely matches cumulative usage while exceeding model window")

    decision = "safe" if not findings else "integrity_failure"
    return {
        "decision": decision,
        "current_context_tokens": current,
        "context_window_tokens": window,
        "occupancy_ratio": ratio,
        "current_context_source": source,
        "cumulative_usage_tokens": cumulative,
        "estimator_error_ratio": estimator_error_ratio,
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("snapshot", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        result = validate(load(args.snapshot), load(args.policy))
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2))
    return SAFE if result["decision"] == "safe" else FAIL


if __name__ == "__main__":
    raise SystemExit(main())
