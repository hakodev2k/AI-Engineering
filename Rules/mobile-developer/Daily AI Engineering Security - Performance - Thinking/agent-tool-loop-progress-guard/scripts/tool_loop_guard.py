#!/usr/bin/env python3
"""Deterministic progress-aware tool-loop guard.

Standard library only.

Exit codes:
0 decision/record succeeded
2 invalid input or policy
3 blocked/strategy-change decision (when --fail-on-block is used)
4 state I/O failure
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from pathlib import Path
from typing import Any


def read_json(path: str) -> dict[str, Any]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            value = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"JSON root must be object: {path}")
    return value


def atomic_write(path: str, value: dict[str, Any]) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    temp = p.with_suffix(p.suffix + ".tmp")
    with open(temp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(value, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")
    os.replace(temp, p)


def compact_ws(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def normalize(value: Any, policy: dict[str, Any], key: str | None = None) -> Any:
    volatile = set(policy.get("volatileArgumentKeys", []))
    command_like = set(policy.get("commandLikeArgumentKeys", []))
    if isinstance(value, dict):
        return {
            k: normalize(v, policy, k)
            for k, v in sorted(value.items())
            if k not in volatile
        }
    if isinstance(value, list):
        return [normalize(v, policy, key) for v in value]
    if isinstance(value, str) and key in command_like:
        return compact_ws(value)
    return value


def digest(value: Any) -> str:
    raw = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def fingerprints(call: dict[str, Any], policy: dict[str, Any]) -> tuple[str, str, dict[str, Any]]:
    tool = str(call.get("tool", "")).strip()
    if not tool:
        raise ValueError("call.tool is required")
    args = call.get("arguments", {})
    if not isinstance(args, dict):
        raise ValueError("call.arguments must be an object")
    normalized = normalize(args, policy)
    exact = digest({"tool": tool, "arguments": normalized})
    family_keys = policy.get("familyKeysByTool", {}).get(tool)
    if family_keys is None:
        family_value = {"tool": tool}
    else:
        family_value = {"tool": tool, "family": {k: normalized.get(k) for k in family_keys}}
    family = digest(family_value)
    return exact, family, normalized


def empty_state() -> dict[str, Any]:
    return {"version": 1, "calls": [], "phase_counts": {}, "global_count": 0, "recovery_cycles": 0}


def load_state(path: str) -> dict[str, Any]:
    if not os.path.exists(path):
        return empty_state()
    state = read_json(path)
    if not isinstance(state.get("calls", []), list):
        raise ValueError("state.calls must be an array")
    return state


def tool_class(tool: str, policy: dict[str, Any]) -> str:
    return str(policy.get("toolClasses", {}).get(tool, policy.get("unknownToolClass", "unknown")))


def counts(state: dict[str, Any], exact: str, family: str, window: int) -> tuple[int, int, int, int]:
    recent = state.get("calls", [])[-window:]
    exact_count = 0
    family_count = 0
    exact_same_output = 0
    family_same_output = 0
    last_exact_output = None
    last_family_output = None
    for item in recent:
        if not isinstance(item, dict):
            continue
        if item.get("exact_fingerprint") == exact:
            exact_count += 1
            out = item.get("output_digest")
            if out and last_exact_output == out:
                exact_same_output += 1
            if out:
                last_exact_output = out
        if item.get("family_fingerprint") == family:
            family_count += 1
            out = item.get("output_digest")
            if out and last_family_output == out:
                family_same_output += 1
            if out:
                last_family_output = out
    return exact_count, family_count, exact_same_output, family_same_output


def decide(call: dict[str, Any], state: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    defaults = policy.get("defaults", {})
    exact, family, normalized = fingerprints(call, policy)
    tool = str(call["tool"])
    cls = tool_class(tool, policy)
    phase = str(call.get("phase", "default"))
    window = int(defaults.get("recentHistoryWindow", 50))
    exact_count, family_count, exact_same, family_same = counts(state, exact, family, window)
    phase_count = int(state.get("phase_counts", {}).get(phase, 0))
    global_count = int(state.get("global_count", 0))

    result = {
        "decision": "allow",
        "reason": "new-or-productive-call",
        "tool": tool,
        "tool_class": cls,
        "phase": phase,
        "exact_fingerprint": exact,
        "family_fingerprint": family,
        "normalized_arguments": normalized,
        "counters": {
            "prior_exact": exact_count,
            "prior_family": family_count,
            "prior_exact_same_output_pairs": exact_same,
            "prior_family_same_output_pairs": family_same,
            "phase_calls": phase_count,
            "global_calls": global_count
        },
        "policy_version": policy.get("version", 1)
    }

    if phase_count >= int(defaults.get("phaseCallBudget", 40)):
        result.update(decision="block", reason="phase-call-budget-exhausted")
        return result
    if global_count >= int(defaults.get("globalCallBudget", 120)):
        result.update(decision="block", reason="global-call-budget-exhausted")
        return result

    status = str(call.get("prior_status", ""))
    if cls in {"side-effecting", "unknown"} and status in set(policy.get("ambiguousFailureStatuses", [])):
        result.update(decision="verify-before-retry", reason="ambiguous-side-effect-outcome")
        return result

    b_exact = int(defaults.get("blockExactRepeats", 4))
    s_exact = int(defaults.get("strategyChangeExactRepeats", 3))
    w_exact = int(defaults.get("warningExactRepeats", 2))
    b_family = int(defaults.get("blockFamilyRepeats", 8))
    s_family = int(defaults.get("strategyChangeFamilyRepeats", 6))
    w_family = int(defaults.get("warningFamilyRepeats", 4))

    if exact_count >= b_exact or family_count >= b_family:
        result.update(decision="block", reason="repeat-hard-threshold")
    elif exact_count >= s_exact or family_count >= s_family:
        result.update(decision="require-strategy-change", reason="repeat-strategy-threshold")
    elif exact_count >= w_exact or family_count >= w_family:
        result.update(decision="warn", reason="repeat-warning-threshold")

    if result["decision"] == "allow" and (exact_same >= 2 or family_same >= 3):
        result.update(decision="warn", reason="low-output-novelty")

    return result


def command_decide(args: argparse.Namespace) -> int:
    policy = read_json(args.policy)
    state = load_state(args.state)
    call = read_json(args.call)
    result = decide(call, state, policy)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if args.fail_on_block and result["decision"] in {"block", "require-strategy-change", "verify-before-retry"}:
        return 3
    return 0


def command_record(args: argparse.Namespace) -> int:
    policy = read_json(args.policy)
    state = load_state(args.state)
    call = read_json(args.call)
    result = read_json(args.result)
    exact, family, normalized = fingerprints(call, policy)
    tool = str(call["tool"])
    phase = str(call.get("phase", "default"))
    output_value = result.get("output")
    output_digest = digest(output_value) if output_value is not None else None
    event = {
        "tool": tool,
        "tool_class": tool_class(tool, policy),
        "phase": phase,
        "exact_fingerprint": exact,
        "family_fingerprint": family,
        "normalized_arguments": normalized,
        "status": result.get("status", "unknown"),
        "output_digest": output_digest,
        "elapsed_ms": result.get("elapsed_ms"),
        "error_signature": result.get("error_signature")
    }
    calls = state.setdefault("calls", [])
    calls.append(event)
    max_history = max(100, int(policy.get("defaults", {}).get("recentHistoryWindow", 50)) * 4)
    if len(calls) > max_history:
        state["calls"] = calls[-max_history:]
    state["global_count"] = int(state.get("global_count", 0)) + 1
    phase_counts = state.setdefault("phase_counts", {})
    phase_counts[phase] = int(phase_counts.get(phase, 0)) + 1
    atomic_write(args.state, state)
    print(json.dumps({"recorded": True, "event": event}, ensure_ascii=False, indent=2))
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description="Progress-aware tool loop guard")
    sub = p.add_subparsers(dest="command", required=True)
    d = sub.add_parser("decide")
    d.add_argument("--policy", required=True)
    d.add_argument("--state", required=True)
    d.add_argument("--call", required=True)
    d.add_argument("--fail-on-block", action="store_true")
    d.set_defaults(func=command_decide)
    r = sub.add_parser("record")
    r.add_argument("--policy", required=True)
    r.add_argument("--state", required=True)
    r.add_argument("--call", required=True)
    r.add_argument("--result", required=True)
    r.set_defaults(func=command_record)
    args = p.parse_args()
    try:
        return int(args.func(args))
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2
    except OSError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
