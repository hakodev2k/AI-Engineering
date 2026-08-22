#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required: pip install pyyaml", file=sys.stderr)
    sys.exit(3)


def fail(message: str, code: int = 2) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    sys.exit(code)


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"contract not found: {path}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON contract: {exc}")


def load_yaml(path: Path):
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"policy not found: {path}")
    except yaml.YAMLError as exc:
        fail(f"invalid YAML policy: {exc}")


def require(value, name):
    if value is None or value == "" or value == []:
        fail(f"missing required field: {name}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a feature-flag rollout contract against package policy")
    parser.add_argument("--contract", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()

    contract = load_json(Path(args.contract))
    policy = load_yaml(Path(args.policy))

    for field in ["flag_key", "environment", "risk_level", "status", "requested_percent", "stages", "checks", "guardrails", "rollback"]:
        require(contract.get(field), field)

    if contract["status"] not in policy.get("allowed_statuses", []):
        fail(f"unsupported status: {contract['status']}")

    risk = contract["risk_level"]
    thresholds = policy.get("risk_levels", {})
    if risk not in thresholds:
        fail(f"unsupported risk_level: {risk}")

    requested = contract["requested_percent"]
    if not isinstance(requested, (int, float)) or requested <= 0 or requested > 100:
        fail("requested_percent must be > 0 and <= 100")

    stages = contract["stages"]
    percents = []
    for index, stage in enumerate(stages):
        percent = stage.get("percent")
        if not isinstance(percent, (int, float)) or percent <= 0 or percent > 100:
            fail(f"stages[{index}].percent must be > 0 and <= 100")
        percents.append(percent)
    if percents != sorted(set(percents)):
        fail("stage percentages must be strictly increasing and unique")
    if percents[-1] != requested:
        fail("final stage percent must equal requested_percent")

    initial_limit = thresholds[risk]["max_initial_percent"]
    if percents[0] > initial_limit:
        fail(f"initial stage {percents[0]}% exceeds {risk} risk limit of {initial_limit}%")

    required_checks = set(policy.get("required_checks", []))
    actual_checks = {k for k, v in contract["checks"].items() if v is True}
    missing = sorted(required_checks - actual_checks)
    if missing:
        fail("required checks not satisfied: " + ", ".join(missing))

    if not contract["guardrails"]:
        fail("at least one guardrail is required")
    for index, guardrail in enumerate(contract["guardrails"]):
        for field in ["name", "operator", "threshold", "evidence"]:
            require(guardrail.get(field), f"guardrails[{index}].{field}")

    rollback = contract["rollback"]
    for field in ["trigger", "action", "verification"]:
        require(rollback.get(field), f"rollback.{field}")

    approval_reasons = set(contract.get("approval_reasons", []))
    needs_approval = contract["environment"].lower() == "production" or requested > 25 or bool(approval_reasons)
    if needs_approval and not contract.get("approval", {}).get("approved", False):
        if contract["status"] not in {"needs-approval", "blocked", "planned"}:
            fail("approval is required before this status can progress")

    print("VALID: rollout contract satisfies package policy")
    return 0


if __name__ == "__main__":
    sys.exit(main())
