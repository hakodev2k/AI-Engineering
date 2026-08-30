#!/usr/bin/env python3
"""Validate that tool execution never exceeds a request-scoped authorization set.

Input: JSONL records. Required fields per record:
  request_id: str
  advertised_tools: list[str]
  requested_tool: str
Optional:
  resolved_tool: str | null
  callback_executed: bool
  approved: bool
  subject: str
  tenant: str
  authorized_subject: str
  authorized_tenant: str

Exit codes: 0 pass, 2 policy violation/input failure.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def load_rows(path: Path):
    rows = []
    try:
        with path.open("r", encoding="utf-8") as fh:
            for lineno, line in enumerate(fh, 1):
                line = line.strip()
                if not line:
                    continue
                obj = json.loads(line)
                if not isinstance(obj, dict):
                    raise ValueError(f"line {lineno}: record must be an object")
                rows.append(obj)
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSONL: {exc}") from exc
    return rows


def canonical(name: str, aliases: dict[str, str], case_sensitive: bool) -> str:
    if not isinstance(name, str) or not name.strip():
        raise ValueError("tool names must be non-empty strings")
    value = name.strip()
    if not case_sensitive:
        value = value.lower()
        aliases = {str(k).lower(): str(v).lower() for k, v in aliases.items()}
    seen = set()
    while value in aliases:
        if value in seen:
            raise ValueError(f"alias cycle at {value}")
        seen.add(value)
        value = aliases[value]
    return value


def evaluate(rows, policy):
    aliases = policy.get("aliases", {})
    if not isinstance(aliases, dict):
        raise ValueError("policy.aliases must be an object")
    case_sensitive = bool(policy.get("case_sensitive_tool_names", True))
    sensitive = {canonical(x, aliases, case_sensitive) for x in policy.get("sensitive_tools", [])}
    approval_required = {canonical(x, aliases, case_sensitive) for x in policy.get("require_human_approval_for", [])}
    violations = []
    decisions = []

    for idx, row in enumerate(rows, 1):
        rid = str(row.get("request_id", f"row-{idx}"))
        advertised = row.get("advertised_tools")
        if not isinstance(advertised, list):
            raise ValueError(f"{rid}: advertised_tools must be a list")
        allowed = {canonical(x, aliases, case_sensitive) for x in advertised}
        requested = canonical(row.get("requested_tool"), aliases, case_sensitive)
        resolved_raw = row.get("resolved_tool")
        resolved = canonical(resolved_raw, aliases, case_sensitive) if resolved_raw else None
        executed = bool(row.get("callback_executed", False))

        reasons = []
        if requested not in allowed:
            reasons.append("UNADVERTISED_TOOL")
        if resolved and resolved != requested:
            reasons.append("RESOLVER_IDENTITY_MISMATCH")
        if requested in approval_required and not bool(row.get("approved", False)):
            reasons.append("APPROVAL_REQUIRED")
        if row.get("authorized_subject") is not None and row.get("subject") != row.get("authorized_subject"):
            reasons.append("IDENTITY_MISMATCH")
        if row.get("authorized_tenant") is not None and row.get("tenant") != row.get("authorized_tenant"):
            reasons.append("TENANT_MISMATCH")

        should_allow = not reasons
        if executed and not should_allow:
            violations.append({"request_id": rid, "requested_tool": requested, "reasons": reasons, "severity": "BLOCKING"})
        if requested in sensitive and executed and requested not in allowed:
            violations.append({"request_id": rid, "requested_tool": requested, "reasons": ["SENSITIVE_UNAUTHORIZED_EXECUTION"], "severity": "BLOCKING"})
        decisions.append({"request_id": rid, "requested_tool": requested, "expected": "ALLOW" if should_allow else "DENY", "executed": executed, "reasons": reasons})

    return {"ok": not violations, "records": len(rows), "violations": violations, "decisions": decisions}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("trace", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--json-out", type=Path)
    args = ap.parse_args()
    try:
        report = evaluate(load_rows(args.trace), load_json(args.policy))
    except (ValueError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    text = json.dumps(report, indent=2, sort_keys=True)
    if args.json_out:
        args.json_out.write_text(text + "\n", encoding="utf-8")
    print(text)
    return 0 if report["ok"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
