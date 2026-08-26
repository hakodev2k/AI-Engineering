#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

DEFAULT_HIGH_RISK = {"code_execution", "shell", "network_write", "credential_access", "host_write"}
DEFAULT_WEAK = {"auto", "never", "none", "bypass"}
DEFAULT_ENFORCING = {"ask", "human", "policy"}


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def evaluate(manifest, policy):
    if not isinstance(manifest, dict) or not isinstance(manifest.get("tools"), list):
        raise ValueError("manifest.tools must be a list")
    required = set(policy.get("require_approval_for", list(DEFAULT_HIGH_RISK)))
    sandbox_required = set(policy.get("require_sandbox_for", ["code_execution", "shell", "host_write"]))
    weak = {str(x).lower() for x in policy.get("weak_approval_labels", list(DEFAULT_WEAK))}
    enforcing = {str(x).lower() for x in policy.get("enforcing_approval_labels", list(DEFAULT_ENFORCING))}
    violations = []
    checked = 0

    for index, tool in enumerate(manifest["tools"]):
        if not isinstance(tool, dict):
            violations.append({"tool": f"index:{index}", "reason": "tool_not_object"})
            continue
        name = tool.get("name")
        category = tool.get("category")
        approval = str(tool.get("approval_requirement", "")).lower()
        sandboxed = bool(tool.get("sandboxed", False))
        if not name or not category:
            violations.append({"tool": name or f"index:{index}", "reason": "missing_identity_or_category"})
            continue
        checked += 1
        if category in required and approval in weak:
            violations.append({"tool": name, "reason": "high_risk_tool_weakens_approval_policy", "category": category})
        if category in required and approval not in enforcing:
            violations.append({"tool": name, "reason": "high_risk_tool_not_bound_to_enforcing_approval", "category": category})
        if category in sandbox_required and not sandboxed:
            violations.append({"tool": name, "reason": "high_risk_tool_missing_sandbox", "category": category})

    return {
        "ok": not violations,
        "decision": "allow" if not violations else "block",
        "checked_tools": checked,
        "violations": violations,
    }


def main():
    parser = argparse.ArgumentParser(description="Validate agent tool approval contracts")
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load(args.manifest), load(args.policy))
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
