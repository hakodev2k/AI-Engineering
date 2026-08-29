#!/usr/bin/env python3
"""Deterministically minimize outbound AI-agent tool arguments.

Input: {"tool": "name", "args": {...}}
Policy: see ../config/policy.example.json
Exit codes: 0 allow, 2 review/block, 1 invalid input/runtime error.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)
PHONE_RE = re.compile(r"(?<!\d)(?:\+?\d[\d .()\-]{7,}\d)(?!\d)")
TOKEN_RE = re.compile(r"\b(?:sk-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_]{20,}|Bearer\s+[A-Za-z0-9._~+/=-]{12,})\b", re.I)


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def mask_pii(text: str) -> tuple[str, list[str]]:
    matches: list[str] = []
    if EMAIL_RE.search(text):
        matches.append("email")
        text = EMAIL_RE.sub("[EMAIL]", text)
    if PHONE_RE.search(text):
        matches.append("phone")
        text = PHONE_RE.sub("[PHONE]", text)
    if TOKEN_RE.search(text):
        matches.append("secret_token")
        text = TOKEN_RE.sub("[SECRET]", text)
    return text, matches


def minimize(request: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    tool = request.get("tool")
    args = request.get("args")
    if not isinstance(tool, str) or not tool:
        raise ValueError("request.tool must be a non-empty string")
    if not isinstance(args, dict):
        raise ValueError("request.args must be an object")

    tool_policy = policy.get("tools", {}).get(tool)
    if not isinstance(tool_policy, dict):
        return {"decision": policy.get("default_action", "review"), "tool": tool,
                "args": {}, "report": {"reason": "unknown_tool", "removed_fields": list(args)}}

    allowed = set(tool_policy.get("allowed_fields", []))
    strategies = tool_policy.get("field_strategies", {})
    max_len = int(tool_policy.get("max_string_length", 1024))
    sensitive_names = {str(x).lower() for x in policy.get("sensitive_field_names", [])}

    out: dict[str, Any] = {}
    removed: list[str] = []
    transformed: list[dict[str, Any]] = []
    sensitive: list[dict[str, str]] = []
    review_required = False

    for key, value in args.items():
        key_l = key.lower()
        if key not in allowed:
            removed.append(key)
            if key_l in sensitive_names:
                sensitive.append({"field": key, "type": "sensitive_field_name"})
            continue

        strategy = strategies.get(key, "keep")
        if key_l in sensitive_names and strategy == "keep":
            sensitive.append({"field": key, "type": "required_sensitive_field"})
            review_required = True

        if strategy == "drop":
            removed.append(key)
            continue
        if isinstance(value, str):
            original_len = len(value)
            if strategy == "mask_pii":
                value, found = mask_pii(value)
                for item in found:
                    sensitive.append({"field": key, "type": item})
                if found:
                    transformed.append({"field": key, "action": "mask_pii"})
            elif strategy == "truncate" and len(value) > max_len:
                value = value[:max_len]
                transformed.append({"field": key, "action": "truncate", "from": original_len, "to": max_len})
            elif strategy not in {"keep", "mask_pii", "truncate"}:
                raise ValueError(f"unsupported strategy {strategy!r} for field {key!r}")

            if TOKEN_RE.search(value):
                sensitive.append({"field": key, "type": "secret_token_remaining"})
                review_required = True
        out[key] = value

    decision = "review" if review_required else "allow"
    return {
        "decision": decision,
        "tool": tool,
        "args": out,
        "report": {
            "removed_fields": removed,
            "transformed_fields": transformed,
            "sensitive_matches": sensitive,
            "input_field_count": len(args),
            "output_field_count": len(out),
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("request", type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--out", type=Path)
    ns = parser.parse_args()
    try:
        result = minimize(load_json(ns.request), load_json(ns.policy))
    except ValueError as exc:
        print(json.dumps({"decision": "block", "error": str(exc)}), file=sys.stderr)
        return 1
    rendered = json.dumps(result, indent=2, ensure_ascii=False) + "\n"
    if ns.out:
        ns.out.write_text(rendered, encoding="utf-8")
    else:
        sys.stdout.write(rendered)
    return 0 if result["decision"] == "allow" else 2


if __name__ == "__main__":
    raise SystemExit(main())
