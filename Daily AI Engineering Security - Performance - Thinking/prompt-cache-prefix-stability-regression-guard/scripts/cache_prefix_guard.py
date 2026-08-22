#!/usr/bin/env python3
"""Profile ordered agent request components and gate prompt-cache prefix regressions.
Exit: 0 pass, 2 invalid input/policy, 3 regression.
Manifest: {"components":[{"name":"system_policy","stability":"stable","content":...}, ...]}
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

PASS, INVALID, REGRESSION = 0, 2, 3
STABILITIES = {"stable", "conditionally-stable", "volatile"}


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def canonical_bytes(value: Any) -> bytes:
    if isinstance(value, str):
        return value.encode("utf-8")
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def validate_policy(policy: dict[str, Any]) -> None:
    if not isinstance(policy.get("policy_version"), str) or not policy["policy_version"]:
        raise ValueError("policy_version required")
    for key in ("max_tool_schema_growth_percent", "max_stable_prefix_shrink_percent", "token_estimate_chars_per_token"):
        if not isinstance(policy.get(key), (int, float)) or policy[key] <= 0:
            raise ValueError(f"{key} must be positive")
    if not isinstance(policy.get("require_stable_prefix_match"), bool):
        raise ValueError("require_stable_prefix_match must be boolean")
    for key in ("volatile_name_patterns", "required_component_names"):
        if not isinstance(policy.get(key), list) or not all(isinstance(x, str) for x in policy[key]):
            raise ValueError(f"{key} must be a string list")


def profile(manifest: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    validate_policy(policy)
    components = manifest.get("components")
    if not isinstance(components, list) or not components:
        raise ValueError("components must be a non-empty list")
    seen: set[str] = set()
    rows: list[dict[str, Any]] = []
    prefix = bytearray()
    prefix_open = True
    volatile_seen = False
    stable_after_volatile: list[str] = []
    volatile_name_hits: list[str] = []
    token_divisor = float(policy["token_estimate_chars_per_token"])

    for index, component in enumerate(components):
        if not isinstance(component, dict):
            raise ValueError(f"component {index} must be an object")
        name = component.get("name")
        stability = component.get("stability")
        if not isinstance(name, str) or not name:
            raise ValueError(f"component {index} name required")
        if name in seen:
            raise ValueError(f"duplicate component name: {name}")
        seen.add(name)
        if stability not in STABILITIES:
            raise ValueError(f"component {name} stability must be one of {sorted(STABILITIES)}")
        if "content" not in component:
            raise ValueError(f"component {name} content required")
        data = canonical_bytes(component["content"])
        for pattern in policy["volatile_name_patterns"]:
            if re.search(pattern, name, re.IGNORECASE) and stability == "stable":
                volatile_name_hits.append(name)
                break
        if stability == "volatile":
            volatile_seen = True
            prefix_open = False
        elif volatile_seen and stability == "stable":
            stable_after_volatile.append(name)
        if prefix_open and stability == "stable":
            prefix.extend(name.encode("utf-8") + b"\0" + data + b"\0")
        elif prefix_open and stability == "conditionally-stable":
            # Conditional data is not included in the guaranteed stable prefix.
            prefix_open = False
        rows.append({
            "name": name,
            "stability": stability,
            "bytes": len(data),
            "estimated_tokens": round(len(data) / token_divisor, 2),
            "sha256": digest(data),
        })

    missing = sorted(set(policy["required_component_names"]) - seen)
    if missing:
        raise ValueError("missing required components: " + ",".join(missing))
    tool_bytes = next((r["bytes"] for r in rows if r["name"] == "tools"), 0)
    stable_bytes = len(prefix)
    return {
        "policy_version": policy["policy_version"],
        "component_count": len(rows),
        "components": rows,
        "stable_prefix_sha256": digest(bytes(prefix)),
        "stable_prefix_bytes": stable_bytes,
        "stable_prefix_estimated_tokens": round(stable_bytes / token_divisor, 2),
        "tool_schema_bytes": tool_bytes,
        "stable_after_volatile": stable_after_volatile,
        "stable_named_like_volatile": volatile_name_hits,
    }


def percent_change(current: float, baseline: float) -> float:
    if baseline == 0:
        return 0.0 if current == 0 else 100.0
    return ((current - baseline) / baseline) * 100.0


def compare(current: dict[str, Any], baseline: dict[str, Any], policy: dict[str, Any]) -> tuple[list[str], dict[str, Any]]:
    failures: list[str] = []
    deltas = {
        "tool_schema_growth_percent": round(percent_change(current["tool_schema_bytes"], baseline["tool_schema_bytes"]), 2),
        "stable_prefix_change_percent": round(percent_change(current["stable_prefix_bytes"], baseline["stable_prefix_bytes"]), 2),
        "stable_prefix_hash_changed": current["stable_prefix_sha256"] != baseline["stable_prefix_sha256"],
    }
    if current["stable_after_volatile"]:
        failures.append("stable_components_after_volatile:" + ",".join(current["stable_after_volatile"]))
    if current["stable_named_like_volatile"]:
        failures.append("components_marked_stable_but_named_volatile:" + ",".join(current["stable_named_like_volatile"]))
    if deltas["tool_schema_growth_percent"] > float(policy["max_tool_schema_growth_percent"]):
        failures.append("tool_schema_growth_exceeded")
    shrink = -float(deltas["stable_prefix_change_percent"])
    if shrink > float(policy["max_stable_prefix_shrink_percent"]):
        failures.append("stable_prefix_shrink_exceeded")
    if policy["require_stable_prefix_match"] and deltas["stable_prefix_hash_changed"]:
        failures.append("stable_prefix_hash_changed")
    return failures, deltas


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("current", type=Path)
    parser.add_argument("--baseline", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        policy = load(args.policy)
        current = profile(load(args.current), policy)
        failures: list[str] = []
        deltas: dict[str, Any] = {}
        if current["stable_after_volatile"]:
            failures.append("stable_components_after_volatile:" + ",".join(current["stable_after_volatile"]))
        if current["stable_named_like_volatile"]:
            failures.append("components_marked_stable_but_named_volatile:" + ",".join(current["stable_named_like_volatile"]))
        baseline_profile = None
        if args.baseline:
            baseline_profile = profile(load(args.baseline), policy)
            more, deltas = compare(current, baseline_profile, policy)
            failures.extend(x for x in more if x not in failures)
        report = {
            "status": "regression" if failures else "pass",
            "failures": failures,
            "current": current,
            "baseline": baseline_profile,
            "deltas": deltas,
        }
    except (ValueError, TypeError, re.error) as exc:
        print(json.dumps({"status": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return REGRESSION if failures else PASS


if __name__ == "__main__":
    raise SystemExit(main())
