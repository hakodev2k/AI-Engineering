#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print(json.dumps({"status": "error", "error": "PyYAML is required: pip install pyyaml"}))
    sys.exit(3)


def load_yaml(path):
    try:
        data = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read YAML {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"YAML root must be an object: {path}")
    return data


def parse_date(value):
    if not isinstance(value, str):
        return None
    try:
        return dt.date.fromisoformat(value)
    except ValueError:
        return None


def finding(code, message, path=None, severity="block"):
    result = {"code": code, "message": message, "severity": severity}
    if path:
        result["path"] = path
    return result


def validate(plan, policy, today):
    findings = []
    approvals = []
    env = str(plan.get("environment", "")).strip().lower()
    production_names = {str(x).lower() for x in policy.get("production_environment_names", [])}
    is_production = env in production_names

    if not plan.get("flag_key"):
        findings.append(finding("MISSING_FLAG_KEY", "flag_key is required", "flag_key"))
    if not env:
        findings.append(finding("MISSING_ENVIRONMENT", "environment is required", "environment"))
    if policy.get("require_owner", True) and not plan.get("owner"):
        findings.append(finding("MISSING_OWNER", "owner is required", "owner"))
    if policy.get("require_kill_switch", True) and plan.get("kill_switch") is not True:
        findings.append(finding("KILL_SWITCH_REQUIRED", "kill_switch must be true", "kill_switch"))
    if policy.get("require_rollback_plan", True):
        rollback = plan.get("rollback")
        if not isinstance(rollback, dict) or not rollback.get("trigger") or not rollback.get("action"):
            findings.append(finding("ROLLBACK_PLAN_REQUIRED", "rollback.trigger and rollback.action are required", "rollback"))

    expiry = parse_date(plan.get("expires_on"))
    if policy.get("require_expiry", True):
        if expiry is None:
            findings.append(finding("INVALID_EXPIRY", "expires_on must be an ISO date", "expires_on"))
        else:
            delta = (expiry - today).days
            if delta < 0:
                findings.append(finding("FLAG_ALREADY_EXPIRED", "expires_on is in the past", "expires_on"))
            elif delta > int(policy.get("max_expiry_days", 90)):
                findings.append(finding("EXPIRY_TOO_FAR", "expires_on exceeds policy max_expiry_days", "expires_on"))

    observability = plan.get("observability")
    if policy.get("require_observability", True):
        if not isinstance(observability, dict):
            findings.append(finding("OBSERVABILITY_REQUIRED", "observability object is required", "observability"))
        else:
            metrics = observability.get("metrics", [])
            names = {m.get("name") for m in metrics if isinstance(m, dict)}
            for required in policy.get("required_metrics", []):
                if required not in names:
                    findings.append(finding("MISSING_REQUIRED_METRIC", f"required metric missing: {required}", "observability.metrics"))
            for index, metric in enumerate(metrics):
                if not isinstance(metric, dict) or not metric.get("name") or metric.get("abort_threshold") in (None, ""):
                    findings.append(finding("INVALID_METRIC", "each metric requires name and abort_threshold", f"observability.metrics[{index}]"))

    stages = plan.get("stages")
    if not isinstance(stages, list) or not stages:
        findings.append(finding("STAGES_REQUIRED", "at least one rollout stage is required", "stages"))
        stages = []
    if len(stages) > int(policy.get("max_stages", 8)):
        findings.append(finding("TOO_MANY_STAGES", "stage count exceeds policy max_stages", "stages"))

    allowed_targets = set(policy.get("allowed_target_types", []))
    percentages = []
    for index, stage in enumerate(stages):
        path = f"stages[{index}]"
        if not isinstance(stage, dict):
            findings.append(finding("INVALID_STAGE", "stage must be an object", path))
            continue
        target_type = stage.get("target_type")
        if target_type not in allowed_targets:
            findings.append(finding("INVALID_TARGET_TYPE", f"unsupported target_type: {target_type}", f"{path}.target_type"))
        duration = stage.get("duration_minutes")
        if not isinstance(duration, int) or duration < int(policy.get("min_stage_duration_minutes", 5)):
            findings.append(finding("STAGE_TOO_SHORT", "duration_minutes is below policy minimum", f"{path}.duration_minutes"))
        percentage = stage.get("percentage")
        if target_type == "percentage":
            if not isinstance(percentage, (int, float)) or percentage <= 0 or percentage > 100:
                findings.append(finding("INVALID_PERCENTAGE", "percentage stage requires value > 0 and <= 100", f"{path}.percentage"))
            else:
                percentages.append(float(percentage))
        if not stage.get("success_criteria"):
            findings.append(finding("SUCCESS_CRITERIA_REQUIRED", "success_criteria is required", f"{path}.success_criteria"))

    if percentages:
        if percentages[0] > float(policy.get("max_initial_percentage", 10)):
            findings.append(finding("INITIAL_PERCENTAGE_TOO_HIGH", "first percentage exceeds max_initial_percentage", "stages"))
        previous = 0.0
        for value in percentages:
            if value <= previous:
                findings.append(finding("NON_INCREASING_PERCENTAGE", "percentage stages must strictly increase", "stages"))
                break
            if previous > 0 and value - previous > float(policy.get("max_percentage_step", 50)):
                findings.append(finding("PERCENTAGE_STEP_TOO_LARGE", "percentage increase exceeds max_percentage_step", "stages"))
                break
            previous = value
        if policy.get("require_canary_before_full_rollout", True) and 100.0 in percentages and percentages.index(100.0) == 0:
            findings.append(finding("CANARY_REQUIRED", "100% rollout cannot be the first percentage stage", "stages"))

    if is_production and policy.get("require_approval_for_production", True):
        approvals.append({"code": "PRODUCTION_ROLLOUT_APPROVAL", "message": "explicit human approval is required for production rollout"})
    if any(v == 100.0 for v in percentages) and policy.get("require_approval_for_full_rollout", True):
        approvals.append({"code": "FULL_ROLLOUT_APPROVAL", "message": "explicit human approval is required before 100% rollout"})

    if findings:
        status = "blocked"
    elif approvals:
        status = "approval_required"
    else:
        status = "passed"
    return {
        "status": status,
        "environment": env,
        "flag_key": plan.get("flag_key"),
        "findings": findings,
        "approvals": approvals,
        "validated": True,
        "executed": False,
    }


def main():
    parser = argparse.ArgumentParser(description="Validate an agent-authored feature-flag rollout plan. Never changes feature flags.")
    parser.add_argument("--plan", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--output")
    parser.add_argument("--today", help="ISO date override for deterministic tests")
    args = parser.parse_args()
    try:
        plan = load_yaml(args.plan)
        policy = load_yaml(args.policy)
        today = dt.date.fromisoformat(args.today) if args.today else dt.date.today()
        result = validate(plan, policy, today)
    except Exception as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 3
    text = json.dumps(result, indent=2)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    print(text)
    return 2 if result["status"] == "blocked" else 4 if result["status"] == "approval_required" else 0


if __name__ == "__main__":
    sys.exit(main())
