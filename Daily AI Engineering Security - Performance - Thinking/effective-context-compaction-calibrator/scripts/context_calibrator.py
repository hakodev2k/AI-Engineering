#!/usr/bin/env python3
"""Calculate a safe compaction trigger from effective context and response runway."""
from __future__ import annotations
import argparse, json, math, sys
from pathlib import Path

def positive_int(name, value):
    if isinstance(value, bool) or not isinstance(value, int) or value <= 0:
        raise ValueError(f"{name} must be a positive integer")
    return value

def ratio(name, value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not (0 < value <= 1):
        raise ValueError(f"{name} must be in (0, 1]")
    return float(value)

def evaluate(doc, policy):
    if not isinstance(doc, dict) or not isinstance(policy, dict):
        raise ValueError("input and policy must be JSON objects")
    raw = positive_int("raw_window_tokens", doc.get("raw_window_tokens"))
    eff_pct = ratio("effective_context_percentage", doc.get("effective_context_percentage", 1.0))
    provider = doc.get("provider_hard_limit_tokens")
    if provider is not None:
        provider = positive_int("provider_hard_limit_tokens", provider)
    reserve = positive_int("response_reserve_tokens", doc.get("response_reserve_tokens", 1))
    min_runway = positive_int("minimum_response_runway_tokens", policy.get("minimum_response_runway_tokens", 1))
    min_headroom = positive_int("minimum_compaction_headroom_tokens", policy.get("minimum_compaction_headroom_tokens", 1))
    target = ratio("target_utilization_ratio", doc.get("target_utilization_ratio", policy.get("target_utilization_ratio", 0.88)))

    effective = math.floor(raw * eff_pct)
    if provider is not None:
        effective = min(effective, provider)
    runway = max(reserve, min_runway)
    if runway >= effective:
        raise ValueError("required response runway must be smaller than effective window")

    safety_ceiling = effective - runway
    ratio_trigger = math.floor(effective * target)
    headroom_trigger = effective - min_headroom
    recommended = min(safety_ceiling, ratio_trigger, headroom_trigger)
    if recommended <= 0:
        raise ValueError("policy leaves no positive compaction trigger")

    configured = doc.get("configured_compaction_trigger_tokens")
    if configured is not None:
        configured = positive_int("configured_compaction_trigger_tokens", configured)
    current = doc.get("current_prompt_tokens", 0)
    if isinstance(current, bool) or not isinstance(current, int) or current < 0:
        raise ValueError("current_prompt_tokens must be a non-negative integer")

    reasons = []
    if configured is not None and configured > recommended:
        reasons.append("configured_trigger_too_late")
    if configured is not None and configured < math.floor(recommended * 0.70):
        reasons.append("configured_trigger_may_be_too_early")
    if current >= recommended:
        reasons.append("current_prompt_at_or_over_recommended_trigger")
    if provider is not None and provider < math.floor(raw * eff_pct):
        reasons.append("provider_limit_is_effective_cap")

    return {
        "status": "over_trigger" if current >= recommended else "within_budget",
        "reasons": reasons,
        "rawWindowTokens": raw,
        "effectiveWindowTokens": effective,
        "requiredRunwayTokens": runway,
        "safetyCeilingTokens": safety_ceiling,
        "recommendedCompactionTriggerTokens": recommended,
        "configuredCompactionTriggerTokens": configured,
        "currentPromptTokens": current,
        "headroomToTriggerTokens": recommended - current,
        "recommendedUtilizationOfEffectiveWindow": recommended / effective,
    }

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--policy", required=True)
    args = p.parse_args()
    try:
        doc = json.loads(Path(args.input).read_text(encoding="utf-8"))
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        print(json.dumps(evaluate(doc, policy), indent=2, sort_keys=True))
        return 0
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 1

if __name__ == "__main__":
    raise SystemExit(main())
