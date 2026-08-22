#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

DECISIONS = {"allow", "approval_required", "deny"}


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"Missing file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc


def contains_any(text: str, fragments):
    lowered = text.lower()
    return next((item for item in fragments if str(item).lower() in lowered), None)


def main():
    parser = argparse.ArgumentParser(description="Evaluate an AI tool action against a local policy.")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--request", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    policy = load_json(Path(args.policy))
    request = load_json(Path(args.request))

    for key in ("tool", "action", "target", "reason", "environment", "writes_data"):
        if key not in request:
            raise SystemExit(f"Request missing required field: {key}")

    action = str(request["action"])
    target = str(request["target"])
    reasons = []
    decision = None

    matched = contains_any(action, policy.get("deny_action_fragments", []))
    if matched:
        decision = "deny"
        reasons.append(f"Action matched denied fragment: {matched}")

    if decision is None:
        matched = contains_any(action, policy.get("approval_action_fragments", []))
        if matched:
            decision = "approval_required"
            reasons.append(f"Action matched approval fragment: {matched}")

    if decision is None:
        matched = contains_any(target, policy.get("protected_target_fragments", []))
        if matched:
            decision = "approval_required"
            reasons.append(f"Target matched protected fragment: {matched}")

    if decision is None:
        for flag in policy.get("risk_flags_requiring_approval", []):
            if request.get(flag) is True:
                decision = "approval_required"
                reasons.append(f"Risk flag requires approval: {flag}")
                break

    if decision is None and request.get("writes_data") is False:
        safe_prefix = next((p for p in policy.get("safe_read_prefixes", []) if action.lower().startswith(str(p).lower())), None)
        if safe_prefix:
            decision = "allow"
            reasons.append(f"Safe read-only prefix: {safe_prefix}")

    if decision is None:
        key = "default_write_decision" if request.get("writes_data") else "default_read_decision"
        decision = policy.get(key, "approval_required")
        reasons.append(f"Applied {key}")

    if decision not in DECISIONS:
        raise SystemExit(f"Invalid policy decision: {decision}")

    result = {
        "decision": decision,
        "reasons": reasons,
        "tool": request["tool"],
        "action": action,
        "target": target,
        "environment": request["environment"]
    }

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(decision)


if __name__ == "__main__":
    main()
