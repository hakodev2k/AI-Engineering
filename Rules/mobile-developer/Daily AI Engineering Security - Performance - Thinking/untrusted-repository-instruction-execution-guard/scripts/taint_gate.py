#!/usr/bin/env python3
"""Deterministic pre-tool authorization gate for untrusted-context influence.

Input JSON shape:
{
  "sources": [{"type": "repository-file", "trust": "untrusted"}],
  "tool": {
    "name": "test",
    "capabilities": {
      "executes_repository_code": true,
      "network_access": false,
      "secret_access": false,
      "destructive_write": false,
      "writes_outside_workspace": false,
      "github_write": false,
      "package_install": false,
      "sandbox_bypass": false
    }
  },
  "environment": {"has_secrets": false},
  "approval": {"granted": false, "action_id": null}
}

Exit codes: 0 allow, 2 invalid input/config, 4 approval required, 5 deny.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOW = 0
INVALID = 2
REQUIRE_APPROVAL = 4
DENY = 5

CAPABILITY_KEYS = {
    "executes_repository_code",
    "network_access",
    "secret_access",
    "destructive_write",
    "writes_outside_workspace",
    "github_write",
    "package_install",
    "sandbox_bypass",
}


def load_object(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def bool_value(mapping: dict[str, Any], key: str, default: bool = False) -> bool:
    value = mapping.get(key, default)
    if not isinstance(value, bool):
        raise ValueError(f"{key} must be boolean")
    return value


def validate_policy(policy: dict[str, Any]) -> None:
    for key in ("trusted_sources", "untrusted_sources", "high_impact_tools"):
        value = policy.get(key, [])
        if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
            raise ValueError(f"policy.{key} must be a list of strings")
    for key in ("deny_when_untrusted", "require_approval_when_untrusted"):
        value = policy.get(key, {})
        if not isinstance(value, dict) or not all(isinstance(v, bool) for v in value.values()):
            raise ValueError(f"policy.{key} must be an object of booleans")


def normalize_input(data: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any], dict[str, bool], dict[str, Any]]:
    sources = data.get("sources")
    tool = data.get("tool")
    environment = data.get("environment", {})
    approval = data.get("approval", {})

    if not isinstance(sources, list) or not sources:
        raise ValueError("sources must be a non-empty list")
    normalized_sources: list[dict[str, Any]] = []
    for index, source in enumerate(sources):
        if not isinstance(source, dict) or not isinstance(source.get("type"), str):
            raise ValueError(f"sources[{index}] must contain string type")
        trust = source.get("trust")
        if trust is not None and trust not in {"trusted", "untrusted", "unknown"}:
            raise ValueError(f"sources[{index}].trust must be trusted, untrusted, or unknown")
        normalized_sources.append(source)

    if not isinstance(tool, dict) or not isinstance(tool.get("name"), str):
        raise ValueError("tool must contain string name")
    capabilities = tool.get("capabilities", {})
    if not isinstance(capabilities, dict):
        raise ValueError("tool.capabilities must be an object")
    unknown_caps = set(capabilities) - CAPABILITY_KEYS
    if unknown_caps:
        raise ValueError(f"unknown capability keys: {', '.join(sorted(unknown_caps))}")
    normalized_caps = {key: bool_value(capabilities, key, False) for key in CAPABILITY_KEYS}

    if not isinstance(environment, dict):
        raise ValueError("environment must be an object")
    normalized_env = {"has_secrets": bool_value(environment, "has_secrets", False)}

    if not isinstance(approval, dict):
        raise ValueError("approval must be an object")
    if "granted" in approval and not isinstance(approval["granted"], bool):
        raise ValueError("approval.granted must be boolean")
    return normalized_sources, {"name": tool["name"], "capabilities": normalized_caps}, normalized_env, approval


def source_trust(source: dict[str, Any], policy: dict[str, Any]) -> str:
    explicit = source.get("trust")
    if explicit in {"trusted", "untrusted", "unknown"}:
        return explicit
    source_type = source["type"]
    if source_type in policy.get("trusted_sources", []):
        return "trusted"
    if source_type in policy.get("untrusted_sources", []):
        return "untrusted"
    return "unknown"


def decide(data: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    validate_policy(policy)
    sources, tool, environment, approval = normalize_input(data)
    trusts = [source_trust(source, policy) for source in sources]
    has_untrusted = any(t == "untrusted" for t in trusts)
    has_unknown = any(t == "unknown" for t in trusts)
    influenced_by_low_trust = has_untrusted or has_unknown
    caps = tool["capabilities"]
    tool_name = tool["name"]
    high_impact = tool_name in policy.get("high_impact_tools", []) or any(caps.values())
    reasons: list[str] = []

    if caps["sandbox_bypass"] and policy.get("deny_when_untrusted", {}).get("sandbox_bypass", True) and influenced_by_low_trust:
        reasons.append("untrusted_or_unknown influence requests sandbox bypass")
        return _result("deny", reasons, trusts, tool_name)

    if (
        influenced_by_low_trust
        and policy.get("deny_when_untrusted", {}).get("secret_access_and_network", True)
        and environment["has_secrets"]
        and caps["network_access"]
        and (caps["secret_access"] or environment["has_secrets"])
    ):
        reasons.append("untrusted_or_unknown influence combines secret-bearing environment with network access")
        return _result("deny", reasons, trusts, tool_name)

    if (
        influenced_by_low_trust
        and policy.get("deny_when_untrusted", {}).get("destructive_write_without_approval", True)
        and caps["destructive_write"]
        and not approval.get("granted", False)
    ):
        reasons.append("destructive write under untrusted_or_unknown influence lacks approval")
        return _result("deny", reasons, trusts, tool_name)

    approval_map = policy.get("require_approval_when_untrusted", {})
    approval_reasons: list[str] = []
    if influenced_by_low_trust:
        for capability in (
            "executes_repository_code",
            "network_access",
            "writes_outside_workspace",
            "github_write",
            "package_install",
        ):
            if caps[capability] and approval_map.get(capability, False):
                approval_reasons.append(f"{capability} under untrusted_or_unknown influence")

    if has_unknown and high_impact:
        approval_reasons.append("high-impact tool has unknown source provenance")

    if approval_reasons and not approval.get("granted", False):
        return _result("require_approval", sorted(set(approval_reasons)), trusts, tool_name)

    if approval_reasons and approval.get("granted", False):
        action_id = approval.get("action_id")
        if not isinstance(action_id, str) or not action_id.strip():
            return _result("require_approval", ["approval is granted but action_id is missing"], trusts, tool_name)
        reasons.append("required approval present and action-bound")

    if influenced_by_low_trust and high_impact:
        reasons.append("low-trust influence accepted only because no deny rule matched and required approval conditions are satisfied")
    else:
        reasons.append("no blocking trust/capability combination matched")
    return _result("allow", reasons, trusts, tool_name)


def _result(decision: str, reasons: list[str], trusts: list[str], tool_name: str) -> dict[str, Any]:
    return {
        "decision": decision,
        "tool": tool_name,
        "source_trust": trusts,
        "reasons": reasons,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="decision input JSON")
    parser.add_argument("--policy", type=Path, required=True, help="trust policy JSON")
    parser.add_argument("--output", type=Path, help="optional report output path")
    args = parser.parse_args()

    try:
        data = load_object(args.input)
        policy = load_object(args.policy)
        result = decide(data, policy)
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID

    rendered = json.dumps(result, indent=2, ensure_ascii=False)
    if args.output:
        try:
            args.output.write_text(rendered + "\n", encoding="utf-8")
        except OSError as exc:
            print(json.dumps({"decision": "invalid", "error": f"cannot write output: {exc}"}), file=sys.stderr)
            return INVALID
    print(rendered)
    if result["decision"] == "allow":
        return ALLOW
    if result["decision"] == "require_approval":
        return REQUIRE_APPROVAL
    return DENY


if __name__ == "__main__":
    raise SystemExit(main())
