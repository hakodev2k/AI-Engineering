#!/usr/bin/env python3
"""Validate the Architecture Drift Detection Gate policy.

Exit codes:
  0 - policy is valid
  2 - policy is invalid or cannot be read

No third-party packages are required.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date
from pathlib import Path
from typing import Any


def fail(message: str, errors: list[str]) -> None:
    errors.append(message)


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate(policy: Any) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    if not isinstance(policy, dict):
        return ["policy must be a JSON object"], warnings

    required = ["version", "modules", "allowed_dependencies", "forbidden_patterns", "ignored_paths", "exceptions"]
    for key in required:
        if key not in policy:
            fail(f"missing required top-level key: {key}", errors)

    if errors:
        return errors, warnings

    if not isinstance(policy["version"], int) or policy["version"] < 1:
        fail("version must be a positive integer", errors)

    modules = policy["modules"]
    if not isinstance(modules, list) or not modules:
        fail("modules must be a non-empty array", errors)
        modules = []

    module_names: set[str] = set()
    for index, module in enumerate(modules):
        prefix = f"modules[{index}]"
        if not isinstance(module, dict):
            fail(f"{prefix} must be an object", errors)
            continue
        name = module.get("name")
        paths = module.get("paths")
        markers = module.get("dependency_markers", [])
        if not isinstance(name, str) or not name.strip():
            fail(f"{prefix}.name must be a non-empty string", errors)
        elif name in module_names:
            fail(f"duplicate module name: {name}", errors)
        else:
            module_names.add(name)
        if not isinstance(paths, list) or not paths or any(not isinstance(p, str) or not p.strip() for p in paths):
            fail(f"{prefix}.paths must be a non-empty array of strings", errors)
        if not isinstance(markers, list) or any(not isinstance(p, str) or not p for p in markers):
            fail(f"{prefix}.dependency_markers must be an array of regex strings", errors)

    allowed = policy["allowed_dependencies"]
    if not isinstance(allowed, dict):
        fail("allowed_dependencies must be an object", errors)
    else:
        for source, targets in allowed.items():
            if source not in module_names:
                fail(f"allowed_dependencies contains unknown source module: {source}", errors)
            if not isinstance(targets, list) or any(not isinstance(t, str) for t in targets):
                fail(f"allowed_dependencies.{source} must be an array of module names", errors)
                continue
            for target in targets:
                if target not in module_names:
                    fail(f"allowed_dependencies.{source} contains unknown target module: {target}", errors)
        for name in module_names:
            if name not in allowed:
                warnings.append(f"module '{name}' has no allowed_dependencies entry; only self references will be tolerated by the checker")

    forbidden = policy["forbidden_patterns"]
    if not isinstance(forbidden, list):
        fail("forbidden_patterns must be an array", errors)
        forbidden = []
    rule_ids: set[str] = set()
    for index, rule in enumerate(forbidden):
        prefix = f"forbidden_patterns[{index}]"
        if not isinstance(rule, dict):
            fail(f"{prefix} must be an object", errors)
            continue
        rule_id = rule.get("id")
        if not isinstance(rule_id, str) or not rule_id:
            fail(f"{prefix}.id must be a non-empty string", errors)
        elif rule_id in rule_ids:
            fail(f"duplicate forbidden pattern id: {rule_id}", errors)
        else:
            rule_ids.add(rule_id)
        if not isinstance(rule.get("pattern"), str) or not rule.get("pattern"):
            fail(f"{prefix}.pattern must be a non-empty regex string", errors)
        scoped_modules = rule.get("modules", [])
        if not isinstance(scoped_modules, list) or any(m not in module_names for m in scoped_modules):
            fail(f"{prefix}.modules must contain only known module names", errors)

    ignored = policy["ignored_paths"]
    if not isinstance(ignored, list) or any(not isinstance(p, str) for p in ignored):
        fail("ignored_paths must be an array of glob strings", errors)

    exceptions = policy["exceptions"]
    if not isinstance(exceptions, list):
        fail("exceptions must be an array", errors)
        exceptions = []
    exception_ids: set[str] = set()
    today = date.today()
    for index, item in enumerate(exceptions):
        prefix = f"exceptions[{index}]"
        if not isinstance(item, dict):
            fail(f"{prefix} must be an object", errors)
            continue
        exception_id = item.get("id")
        if not isinstance(exception_id, str) or not exception_id:
            fail(f"{prefix}.id must be a non-empty string", errors)
        elif exception_id in exception_ids:
            fail(f"duplicate exception id: {exception_id}", errors)
        else:
            exception_ids.add(exception_id)
        for field in ["rule_id", "owner", "reason", "expires_on"]:
            if not isinstance(item.get(field), str) or not item.get(field):
                fail(f"{prefix}.{field} must be a non-empty string", errors)
        paths = item.get("paths", [])
        if not isinstance(paths, list) or not paths or any(not isinstance(p, str) for p in paths):
            fail(f"{prefix}.paths must be a non-empty array of glob strings", errors)
        expires_on = item.get("expires_on")
        if isinstance(expires_on, str) and expires_on:
            try:
                expiry = date.fromisoformat(expires_on)
                if expiry < today:
                    warnings.append(f"exception '{exception_id}' expired on {expires_on}")
            except ValueError:
                fail(f"{prefix}.expires_on must use YYYY-MM-DD", errors)

    decisions = policy.get("decision_records", [])
    if not isinstance(decisions, list) or any(not isinstance(p, str) for p in decisions):
        fail("decision_records must be an array of strings when provided", errors)

    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate architecture policy JSON")
    parser.add_argument("--policy", default=None, help="Path to policy JSON; defaults to ARCHITECTURE_POLICY or .architecture-policy.json")
    args = parser.parse_args()

    import os
    policy_path = Path(args.policy or os.getenv("ARCHITECTURE_POLICY", ".architecture-policy.json"))

    try:
        policy = load_json(policy_path)
    except (OSError, json.JSONDecodeError) as exc:
        print(json.dumps({"valid": False, "errors": [f"cannot read policy '{policy_path}': {exc}"], "warnings": []}, indent=2))
        return 2

    errors, warnings = validate(policy)
    result = {"valid": not errors, "policy": str(policy_path), "errors": errors, "warnings": warnings}
    print(json.dumps(result, indent=2))
    return 0 if not errors else 2


if __name__ == "__main__":
    sys.exit(main())
