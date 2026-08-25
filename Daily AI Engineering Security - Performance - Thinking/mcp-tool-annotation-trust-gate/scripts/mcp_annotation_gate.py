#!/usr/bin/env python3
"""Trust-aware MCP ToolAnnotations policy evaluator.

Input JSON:
{
  "server": "server-id",
  "tool": "tool-name",
  "annotations": {
    "readOnlyHint": true,
    "destructiveHint": false,
    "idempotentHint": true,
    "openWorldHint": false
  }
}

Exit codes: 0 allow, 10 ask, 20 deny, 30 input/policy error.
"""
import argparse
import json
import sys

DEFAULTS = {
    "readOnlyHint": False,
    "destructiveHint": True,
    "idempotentHint": False,
    "openWorldHint": True,
}

def load_json(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            value = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value

def as_string_set(policy, key):
    value = policy.get(key, [])
    if not isinstance(value, list) or not all(isinstance(x, str) for x in value):
        raise ValueError(f"policy.{key} must be an array of strings")
    return set(value)

def normalize_annotations(raw, trusted):
    if raw is None:
        raw = {}
    if not isinstance(raw, dict):
        raise ValueError("annotations must be an object when present")
    normalized = dict(DEFAULTS)
    reasons = []
    if raw.get("destructiveHint") is True:
        normalized["destructiveHint"] = True
        reasons.append("server_claims_destructive")
    if raw.get("openWorldHint") is True:
        normalized["openWorldHint"] = True
        reasons.append("server_claims_open_world")
    if trusted:
        for key in DEFAULTS:
            if key in raw:
                if not isinstance(raw[key], bool):
                    raise ValueError(f"annotations.{key} must be boolean")
                normalized[key] = raw[key]
        reasons.append("trusted_annotations_applied")
    else:
        for key in ("readOnlyHint", "idempotentHint"):
            if raw.get(key) is True:
                reasons.append(f"ignored_untrusted_{key}")
        if raw.get("destructiveHint") is False:
            reasons.append("ignored_untrusted_destructiveHint_false")
        if raw.get("openWorldHint") is False:
            reasons.append("ignored_untrusted_openWorldHint_false")
        reasons.append("pessimistic_defaults_for_untrusted_server")
    return normalized, reasons

def evaluate(inp, policy):
    server = inp.get("server")
    tool = inp.get("tool")
    if not isinstance(server, str) or not server:
        raise ValueError("input.server must be a non-empty string")
    if not isinstance(tool, str) or not tool:
        raise ValueError("input.tool must be a non-empty string")
    trusted_servers = as_string_set(policy, "trusted_servers")
    deny_tools = as_string_set(policy, "deny_tools")
    deny_destructive_tools = as_string_set(policy, "deny_destructive_tools")
    allow_tools = as_string_set(policy, "allow_tools")
    allow_trusted_read_only = policy.get("allow_trusted_read_only", False)
    ask_on_open_world = policy.get("ask_on_open_world", True)
    if not isinstance(allow_trusted_read_only, bool) or not isinstance(ask_on_open_world, bool):
        raise ValueError("boolean policy fields must be boolean")
    trusted = server in trusted_servers
    risk, reasons = normalize_annotations(inp.get("annotations"), trusted)
    if tool in deny_tools:
        return "deny", risk, reasons + ["tool_explicitly_denied"]
    if risk["destructiveHint"] and tool in deny_destructive_tools:
        return "deny", risk, reasons + ["destructive_tool_explicitly_denied"]
    if tool in allow_tools and trusted and risk["readOnlyHint"] and not risk["destructiveHint"] and not risk["openWorldHint"]:
        return "allow", risk, reasons + ["trusted_explicit_allow_read_only_closed_world"]
    if trusted and allow_trusted_read_only and risk["readOnlyHint"] and not risk["destructiveHint"]:
        if ask_on_open_world and risk["openWorldHint"]:
            return "ask", risk, reasons + ["open_world_requires_approval"]
        return "allow", risk, reasons + ["trusted_read_only_fast_path"]
    if risk["destructiveHint"]:
        return "ask", risk, reasons + ["destructive_or_unknown_requires_approval"]
    if risk["openWorldHint"] and ask_on_open_world:
        return "ask", risk, reasons + ["open_world_requires_approval"]
    return "ask", risk, reasons + ["no_safe_auto_approval_rule"]

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True, help="Tool decision JSON")
    p.add_argument("--policy", required=True, help="Local policy JSON")
    args = p.parse_args()
    try:
        inp = load_json(args.input)
        policy = load_json(args.policy)
        decision, risk, reasons = evaluate(inp, policy)
        print(json.dumps({
            "decision": decision,
            "server": inp.get("server"),
            "tool": inp.get("tool"),
            "trusted_server": inp.get("server") in set(policy.get("trusted_servers", [])),
            "normalized_risk": risk,
            "reasons": reasons,
        }, sort_keys=True))
    except ValueError as exc:
        print(json.dumps({"decision": "deny", "error": str(exc)}))
        return 30
    return {"allow": 0, "ask": 10, "deny": 20}[decision]

if __name__ == "__main__":
    sys.exit(main())
