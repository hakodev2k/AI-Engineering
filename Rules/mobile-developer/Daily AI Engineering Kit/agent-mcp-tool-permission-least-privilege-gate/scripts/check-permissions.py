#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_json(path: str):
    p = Path(path)
    if not p.is_file():
        raise FileNotFoundError(path)
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate normalized agent/MCP permission requests against a least-privilege policy.")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--requests", required=True)
    args = parser.parse_args()

    try:
        policy = load_json(args.policy)
        payload = load_json(args.requests)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"INPUT_ERROR: {exc}", file=sys.stderr)
        return 2

    requests = payload if isinstance(payload, list) else payload.get("requests")
    if not isinstance(requests, list) or not requests:
        print("VALIDATION_ERROR: requests must be a non-empty list", file=sys.stderr)
        return 2

    high_risk = set(policy.get("approval_required_risk", []))
    allowed_reads = set(policy.get("allowed_read_scopes", []))
    forbidden = set(policy.get("forbidden_without_approval", []))
    deny_unknown = bool(policy.get("deny_unknown_tools", True))

    errors = []
    for index, item in enumerate(requests):
        prefix = f"request[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{prefix}: must be an object")
            continue
        for field in ("task_id", "agent", "tool", "scope", "action", "risk", "justification"):
            if not item.get(field):
                errors.append(f"{prefix}: missing {field}")
        if item.get("expires_after_task") is not True:
            errors.append(f"{prefix}: expires_after_task must be true")
        scope = item.get("scope", "")
        action = item.get("action", "")
        risk = item.get("risk", "")
        approval = item.get("approval_id")
        if any(token in scope for token in ("*", ":all", ".all")):
            errors.append(f"{prefix}: wildcard/broad scope is not allowed: {scope}")
        if action == "read" and scope not in allowed_reads and risk == "read" and deny_unknown:
            errors.append(f"{prefix}: unknown read scope denied: {scope}")
        if scope in forbidden and not approval:
            errors.append(f"{prefix}: scope {scope} requires approval")
        if risk in high_risk and not approval:
            errors.append(f"{prefix}: risk {risk} requires approval")
        if action in {"write", "delete", "execute", "grant"} and not approval:
            errors.append(f"{prefix}: action {action} requires approval")
        if len(str(item.get("justification", "")).strip()) < 8:
            errors.append(f"{prefix}: justification is too short")

    if errors:
        for error in errors:
            print(f"DENY: {error}", file=sys.stderr)
        return 1

    print(f"ALLOW: validated {len(requests)} permission request(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
