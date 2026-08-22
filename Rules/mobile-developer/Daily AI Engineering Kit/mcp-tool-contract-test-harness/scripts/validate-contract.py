#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def main():
    p = argparse.ArgumentParser(description="Validate a portable agent/MCP tool contract against policy.")
    p.add_argument("--policy", required=True)
    p.add_argument("--contract", required=True)
    args = p.parse_args()

    try:
        policy = load_json(args.policy)
        contract = load_json(args.contract)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    errors = []
    required = ["tool_name", "version", "side_effect_level", "approval_required", "input_schema", "success_required_fields", "error_required_fields", "fixtures"]
    for key in required:
        if key not in contract:
            errors.append(f"missing required field: {key}")

    level = contract.get("side_effect_level")
    if level not in policy.get("allowed_side_effect_levels", []):
        errors.append(f"invalid side_effect_level: {level}")

    if level in policy.get("human_approval_required_for", []) and contract.get("approval_required") is not True:
        errors.append(f"approval_required must be true for side_effect_level={level}")

    fixtures = contract.get("fixtures", [])
    if not isinstance(fixtures, list) or not fixtures:
        errors.append("fixtures must be a non-empty array")
        fixtures = []

    ids = set()
    classes = set()
    for i, fx in enumerate(fixtures):
        if not isinstance(fx, dict):
            errors.append(f"fixture[{i}] must be an object")
            continue
        for key in ["id", "class", "input", "expected_status"]:
            if key not in fx:
                errors.append(f"fixture[{i}] missing {key}")
        fid = fx.get("id")
        if fid in ids:
            errors.append(f"duplicate fixture id: {fid}")
        ids.add(fid)
        classes.add(fx.get("class"))
        if fx.get("expected_status") not in policy.get("required_result_status_values", ["success", "error"]):
            errors.append(f"fixture {fid}: invalid expected_status")
        if fx.get("live") and policy.get("live_execution_default") is False and level in policy.get("human_approval_required_for", []):
            # Allowed in the contract, but execution must still be externally approved.
            pass

    for required_class in policy.get("required_fixture_classes", []):
        if required_class not in classes:
            errors.append(f"missing required fixture class: {required_class}")

    if level in policy.get("require_replay_fixture_for", []) and "replay" not in classes:
        errors.append(f"side_effect_level={level} requires a replay fixture")

    if contract.get("open_questions"):
        errors.append("open_questions must be resolved before verification")

    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        return 1

    print(f"PASS: contract '{contract.get('tool_name')}' is structurally valid for policy")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
