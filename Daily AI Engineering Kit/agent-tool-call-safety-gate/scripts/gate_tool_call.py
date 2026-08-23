#!/usr/bin/env python3
"""Deterministic safety gate for AI-agent tool calls. Standard library only."""
from __future__ import annotations

import argparse
import fnmatch
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

EXIT_ALLOW = 0
EXIT_DENY = 2
EXIT_APPROVAL = 3
EXIT_INVALID = 4
EXIT_ERROR = 5
ALLOWED_EFFECTS = {"allow", "deny", "approval"}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def load_json(path: Path) -> Any:
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def validate_request(value: Any) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError("request must be a JSON object")
    required = ("request_id", "tool", "operation", "arguments", "requested_by")
    for key in required:
        if key not in value:
            raise ValueError(f"request missing required field: {key}")
    for key in ("request_id", "tool", "operation", "requested_by"):
        if not isinstance(value[key], str) or not value[key].strip():
            raise ValueError(f"request.{key} must be a non-empty string")
    if not isinstance(value["arguments"], dict):
        raise ValueError("request.arguments must be an object")
    if "context" in value and not isinstance(value["context"], dict):
        raise ValueError("request.context must be an object")
    return value


def validate_policy(value: Any) -> dict[str, Any]:
    if not isinstance(value, dict) or value.get("version") != 1:
        raise ValueError("policy must be an object with version=1")
    if value.get("default_action") not in ALLOWED_EFFECTS:
        raise ValueError("policy.default_action must be allow, deny, or approval")
    rules = value.get("rules")
    if not isinstance(rules, list):
        raise ValueError("policy.rules must be an array")
    seen: set[str] = set()
    for index, rule in enumerate(rules):
        if not isinstance(rule, dict):
            raise ValueError(f"policy.rules[{index}] must be an object")
        rid = rule.get("id")
        if not isinstance(rid, str) or not rid or rid in seen:
            raise ValueError(f"policy.rules[{index}].id must be unique and non-empty")
        seen.add(rid)
        if rule.get("effect") not in ALLOWED_EFFECTS:
            raise ValueError(f"policy rule {rid} has unsupported effect")
        if not isinstance(rule.get("priority", 0), int):
            raise ValueError(f"policy rule {rid} priority must be an integer")
        if not isinstance(rule.get("match", {}), dict):
            raise ValueError(f"policy rule {rid} match must be an object")
        patterns = rule.get("match", {}).get("argument_regex", {})
        if not isinstance(patterns, dict):
            raise ValueError(f"policy rule {rid} argument_regex must be an object")
        for dotted, pattern in patterns.items():
            if not isinstance(dotted, str) or not isinstance(pattern, str):
                raise ValueError(f"policy rule {rid} argument_regex entries must be strings")
            try:
                re.compile(pattern)
            except re.error as exc:
                raise ValueError(f"policy rule {rid} invalid regex for {dotted}: {exc}") from exc
    return value


def glob_union_match(value: str, expression: str) -> bool:
    return any(fnmatch.fnmatchcase(value.lower(), part.strip().lower()) for part in expression.split("|") if part.strip())


def dotted_get(obj: Any, dotted: str) -> Any:
    current = obj
    for part in dotted.split("."):
        if not isinstance(current, dict) or part not in current:
            return None
        current = current[part]
    return current


def rule_matches(rule: dict[str, Any], request: dict[str, Any]) -> tuple[bool, list[str]]:
    match = rule.get("match", {})
    evidence: list[str] = []
    tool_expr = match.get("tool", "*")
    op_expr = match.get("operation", "*")
    if not isinstance(tool_expr, str) or not isinstance(op_expr, str):
        return False, []
    if not glob_union_match(request["tool"], tool_expr):
        return False, []
    if not glob_union_match(request["operation"], op_expr):
        return False, []
    evidence.extend([f"tool={request['tool']} matched {tool_expr}", f"operation={request['operation']} matched {op_expr}"])
    for dotted, pattern in match.get("argument_regex", {}).items():
        actual = dotted_get(request["arguments"], dotted)
        if actual is None:
            return False, []
        rendered = actual if isinstance(actual, str) else json.dumps(actual, sort_keys=True)
        if re.search(pattern, rendered) is None:
            return False, []
        evidence.append(f"arguments.{dotted} matched configured regex")
    return True, evidence


def parse_time(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("approval.expires_at must include timezone")
    return parsed.astimezone(timezone.utc)


def approval_valid(approval: Any, request: dict[str, Any], rule_id: str) -> tuple[bool, str]:
    if approval is None:
        return False, "approval record not supplied"
    if not isinstance(approval, dict):
        return False, "approval must be an object"
    required = ("request_id", "rule_id", "decision", "approver", "expires_at")
    if any(key not in approval for key in required):
        return False, "approval is missing required fields"
    if approval["request_id"] != request["request_id"] or approval["rule_id"] != rule_id:
        return False, "approval is not bound to this request and rule"
    if approval["decision"] != "approved" or not isinstance(approval["approver"], str) or not approval["approver"].strip():
        return False, "approval decision/approver is invalid"
    try:
        if parse_time(str(approval["expires_at"])) <= datetime.now(timezone.utc):
            return False, "approval has expired"
    except (TypeError, ValueError) as exc:
        return False, f"approval expiry is invalid: {exc}"
    return True, f"approved by {approval['approver']} until {approval['expires_at']}"


def decision(request_id: str, status: str, policy_version: int | None, rule_id: str | None, reason: str, approval_ok: bool, evidence: list[str] | None = None) -> dict[str, Any]:
    return {
        "request_id": request_id,
        "status": status,
        "policy_version": policy_version,
        "matched_rule_id": rule_id,
        "reason": reason,
        "evaluated_at": utc_now(),
        "approval_valid": approval_ok,
        "evidence": evidence or [],
    }


def evaluate(request: dict[str, Any], policy: dict[str, Any], approval: Any = None) -> tuple[dict[str, Any], int]:
    indexed = list(enumerate(policy["rules"]))
    indexed.sort(key=lambda item: (-item[1].get("priority", 0), item[0]))
    selected = None
    selected_evidence: list[str] = []
    for _, rule in indexed:
        matches, evidence = rule_matches(rule, request)
        if matches:
            selected = rule
            selected_evidence = evidence
            break
    if selected is None:
        effect = policy["default_action"]
        rid = None
        reason = f"no rule matched; default_action={effect}"
    else:
        effect = selected["effect"]
        rid = selected["id"]
        reason = selected.get("reason") or f"matched policy rule {rid}"
    if effect == "allow":
        return decision(request["request_id"], "allow", policy["version"], rid, reason, False, selected_evidence), EXIT_ALLOW
    if effect == "deny":
        return decision(request["request_id"], "deny", policy["version"], rid, reason, False, selected_evidence), EXIT_DENY
    ok, approval_reason = approval_valid(approval, request, rid or "__default__")
    evidence = selected_evidence + [approval_reason]
    if ok:
        return decision(request["request_id"], "allow", policy["version"], rid, reason, True, evidence), EXIT_ALLOW
    return decision(request["request_id"], "approval_required", policy["version"], rid, reason, False, evidence), EXIT_APPROVAL


def emit(result: dict[str, Any], output: Path | None) -> None:
    rendered = json.dumps(result, indent=2, sort_keys=True)
    print(rendered)
    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--request", required=True, type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--approval", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    request_id = "unknown"
    try:
        request = validate_request(load_json(args.request))
        request_id = request["request_id"]
        policy = validate_policy(load_json(args.policy))
        approval = load_json(args.approval) if args.approval else None
        result, code = evaluate(request, policy, approval)
        emit(result, args.output)
        return code
    except ValueError as exc:
        emit(decision(request_id, "invalid", None, None, str(exc), False), args.output)
        return EXIT_INVALID
    except Exception as exc:
        emit(decision(request_id, "error", None, None, f"internal evaluation error: {exc}", False), args.output)
        return EXIT_ERROR


if __name__ == "__main__":
    sys.exit(main())
