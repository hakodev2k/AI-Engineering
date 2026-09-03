#!/usr/bin/env python3
"""Verify destination-policy parity for credential-consuming adapters."""

import argparse
import json
import sys
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}") from exc


def evaluate(policy, inventory):
    required = set(policy.get("required_controls", []))
    if not required:
        raise ValueError("policy.required_controls must be a non-empty list")
    adapters = inventory.get("adapters")
    if not isinstance(adapters, list):
        raise ValueError("inventory.adapters must be a list")

    violations = []
    checked = 0
    for adapter in adapters:
        if not isinstance(adapter, dict):
            raise ValueError("every adapter must be an object")
        name = str(adapter.get("name", "")).strip()
        if not name:
            raise ValueError("every adapter requires a non-empty name")
        uses_credential = bool(adapter.get("uses_credential"))
        endpoint_user_controlled = bool(adapter.get("user_configurable_endpoint"))
        shared_use_only = bool(adapter.get("supports_shared_use_only_credentials"))
        if not (uses_credential and endpoint_user_controlled):
            continue

        checked += 1
        controls = adapter.get("controls", {})
        if not isinstance(controls, dict):
            violations.append({"adapter": name, "reason": "controls must be an object", "severity": "high"})
            continue
        missing = sorted(control for control in required if controls.get(control) is not True)
        if missing:
            violations.append({"adapter": name, "reason": "missing_required_controls", "missing": missing, "severity": "critical" if shared_use_only else "high"})
        if shared_use_only and controls.get("enforce_before_secret_materialization") is not True:
            violations.append({"adapter": name, "reason": "shared credential can reach endpoint path before policy enforcement", "severity": "critical"})

        tests = adapter.get("negative_tests", [])
        has_negative = isinstance(tests, list) and any(
            isinstance(test, dict)
            and test.get("case") == "disallowed_destination"
            and test.get("passed") is True
            for test in tests
        )
        if not has_negative:
            violations.append({"adapter": name, "reason": "missing passing disallowed-destination negative test", "severity": "high"})

    return {"checked_adapters": checked, "violations": violations, "passed": not violations}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--inventory", required=True, type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        report = evaluate(load_json(args.policy), load_json(args.inventory))
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    rendered = json.dumps(report, indent=2, sort_keys=True)
    if args.output:
        args.output.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
