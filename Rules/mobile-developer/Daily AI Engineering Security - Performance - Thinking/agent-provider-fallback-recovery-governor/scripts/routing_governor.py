#!/usr/bin/env python3
"""Evaluate provider fallback recovery state from a single routing snapshot.

Input JSON fields:
 state, now_monotonic, primary_eligible_at, probe_failures, switches,
 error_class, persistent_provider, active_provider, primary_provider
Exit codes: 0 keep/restore, 3 probe, 4 exhausted/block, 2 invalid.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

OK, INVALID, PROBE, BLOCK = 0, 2, 3, 4


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("JSON root must be an object")
    return value


def number(d: dict, key: str, default=0.0) -> float:
    v = d.get(key, default)
    if isinstance(v, bool) or not isinstance(v, (int, float)) or v < 0:
        raise ValueError(f"{key} must be a non-negative number")
    return float(v)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("input", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ns = ap.parse_args()
    try:
        d, p = load(ns.input), load(ns.policy)
        state = d.get("state")
        error_class = d.get("error_class", "none")
        persistent = d.get("persistent_provider")
        active = d.get("active_provider")
        primary = d.get("primary_provider")
        if state not in {"primary", "cooldown", "fallback", "probe", "degraded", "exhausted"}:
            raise ValueError("invalid state")
        if not all(isinstance(x, str) and x for x in (persistent, active, primary)):
            raise ValueError("provider fields must be non-empty strings")
        now = number(d, "now_monotonic")
        eligible = number(d, "primary_eligible_at")
        probe_failures = int(number(d, "probe_failures"))
        switches = int(number(d, "switches"))
        max_probe = int(p.get("max_primary_probe_failures", 2))
        max_switch = int(p.get("max_provider_switches_per_turn", 4))
        findings = []

        if active != persistent and p.get("persist_temporary_fallback_as_user_selection") is False:
            findings.append("temporary_route_must_not_replace_persistent_selection")
        if switches >= max_switch or probe_failures >= max_probe:
            decision, code = "hold_fallback", BLOCK
            findings.append("routing_budget_exhausted")
        elif error_class in {"auth", "billing"}:
            decision, code = "operator_action", BLOCK
            findings.append("non_probeable_error")
        elif error_class == "hard_quota" and now < eligible:
            decision, code = "hold_fallback", OK
            findings.append("hard_quota_cooldown")
        elif state in {"fallback", "cooldown", "degraded"} and now >= eligible and active != primary:
            decision, code = "probe_primary", PROBE
            findings.append("primary_recheck_due")
        elif state == "probe" and active == primary:
            decision, code = "restore_primary", OK
            findings.append("primary_probe_active")
        else:
            decision, code = "keep_route", OK

        print(json.dumps({
            "decision": decision,
            "state": state,
            "primary_provider": primary,
            "active_provider": active,
            "persistent_provider": persistent,
            "probe_failures": probe_failures,
            "switches": switches,
            "findings": findings
        }, indent=2, sort_keys=True))
        return code
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
