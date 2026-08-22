#!/usr/bin/env python3
"""Progress-aware watchdog decision gate.

Input fields:
phase, idle_seconds, total_elapsed_seconds, attempt_number, tokens_used,
signals (object of signal->age seconds or null), checkpoint_hash,
previous_checkpoint_hash, identical_signature_count.

Exit codes: 0 continue/wait, 3 checkpoint_retry, 4 stop, 2 invalid.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Any


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def number(data: dict[str, Any], key: str) -> float:
    value = data.get(key)
    if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{key} must be a non-negative number")
    return float(value)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True, type=Path)
    p.add_argument("--policy", required=True, type=Path)
    a = p.parse_args()
    try:
        data, policy = load(a.input), load(a.policy)
        phase = data.get("phase", "unknown")
        if not isinstance(phase, str):
            raise ValueError("phase must be a string")
        patience_map = policy.get("phase_patience_seconds", {})
        if not isinstance(patience_map, dict):
            raise ValueError("phase_patience_seconds must be an object")
        patience = float(patience_map.get(phase, patience_map.get("unknown", 300)))
        idle = number(data, "idle_seconds")
        elapsed = number(data, "total_elapsed_seconds")
        attempt = int(number(data, "attempt_number"))
        tokens = number(data, "tokens_used")
        identical = int(number(data, "identical_signature_count"))
        signals = data.get("signals", {})
        if not isinstance(signals, dict):
            raise ValueError("signals must be an object")
        weights = policy.get("weights", {})
        if not isinstance(weights, dict):
            raise ValueError("weights must be an object")

        findings: list[str] = []
        score = 0.0
        fresh_signals: list[str] = []
        for name in policy.get("progress_signals", []):
            age = signals.get(name)
            if age is None:
                continue
            if not isinstance(age, (int, float)) or isinstance(age, bool) or age < 0:
                raise ValueError(f"signal age for {name} must be non-negative or null")
            if float(age) <= patience:
                score += float(weights.get(name, 1))
                fresh_signals.append(name)

        hard_timeout = float(policy.get("hard_task_timeout_seconds", 3600))
        max_attempts = int(policy.get("max_total_attempts", 3))
        max_identical = int(policy.get("max_identical_no_progress_signatures", 2))
        max_tokens = float(policy.get("max_wasted_tokens", 120000))
        checkpoint = data.get("checkpoint_hash")
        previous = data.get("previous_checkpoint_hash")
        checkpoint_advanced = isinstance(checkpoint, str) and checkpoint and checkpoint != previous
        if checkpoint_advanced:
            score += float(weights.get("checkpoint_advanced", 4))
            if "checkpoint_advanced" not in fresh_signals:
                fresh_signals.append("checkpoint_advanced")

        if elapsed >= hard_timeout:
            findings.append("hard task timeout exhausted")
        if attempt >= max_attempts:
            findings.append("attempt budget exhausted")
        if tokens >= max_tokens:
            findings.append("wasted token budget exhausted")
        if identical >= max_identical:
            findings.append("identical no-progress signature circuit breaker tripped")

        if findings:
            decision, code = "stop", 4
        elif idle < patience:
            min_score = float(policy.get("minimum_signal_weight_to_continue", 1))
            decision = "continue" if score >= min_score else "wait"
            code = 0
        else:
            require_cp = bool(policy.get("require_checkpoint_before_retry", True))
            has_cp = isinstance(checkpoint, str) and bool(checkpoint)
            if require_cp and not has_cp:
                decision, code = "stop", 4
                findings.append("patience expired and no verified checkpoint is available")
            else:
                decision, code = "checkpoint_retry", 3
                findings.append("phase patience expired; bounded retry from checkpoint")

        result = {
            "decision": decision,
            "phase": phase,
            "phase_patience_seconds": patience,
            "progress_score": score,
            "fresh_signals": sorted(set(fresh_signals)),
            "checkpoint_advanced": bool(checkpoint_advanced),
            "findings": findings,
            "budgets": {
                "attempt": attempt,
                "max_total_attempts": max_attempts,
                "tokens_used": tokens,
                "max_wasted_tokens": max_tokens,
                "elapsed_seconds": elapsed,
                "hard_task_timeout_seconds": hard_timeout,
                "identical_signature_count": identical,
                "max_identical_no_progress_signatures": max_identical
            }
        }
        print(json.dumps(result, indent=2))
        return code
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
