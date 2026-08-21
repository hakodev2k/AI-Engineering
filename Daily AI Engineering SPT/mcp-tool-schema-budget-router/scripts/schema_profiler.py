#!/usr/bin/env python3
"""Profile model-visible tool schema size without external dependencies.

Catalog format:
{
  "tools": [
    {
      "name": "tool_name",
      "description": "...",
      "inputSchema": {"type": "object", ...},
      "routing": {"tags": ["repo"], "keywords": ["code"]}
    }
  ]
}

`routing` is host-only metadata and is excluded from model-visible size estimates.
Exit codes: 0 success, 2 invalid input/policy, 3 budget violation.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def read_json(path: str) -> Any:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def read_policy(path: str | None) -> dict[str, Any]:
    if not path:
        return {}
    data = read_json(path)
    if not isinstance(data, dict):
        raise ValueError("policy root must be an object")
    return data


def extract_tools(catalog: Any) -> list[dict[str, Any]]:
    tools = catalog.get("tools") if isinstance(catalog, dict) else catalog
    if not isinstance(tools, list):
        raise ValueError("catalog must be an array or an object containing a tools array")
    result: list[dict[str, Any]] = []
    for index, tool in enumerate(tools):
        if not isinstance(tool, dict):
            raise ValueError(f"tool[{index}] must be an object")
        result.append(tool)
    return result


def model_visible(tool: dict[str, Any]) -> dict[str, Any]:
    """Strip only host-only metadata; preserve callable definition fields exactly."""
    return {k: v for k, v in tool.items() if k not in {"routing", "_routing"}}


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def definition_hash(tool: dict[str, Any]) -> str:
    return hashlib.sha256(canonical_bytes(model_visible(tool))).hexdigest()


def estimate_tokens(value: Any, chars_per_token: float) -> int:
    if chars_per_token <= 0:
        raise ValueError("estimatedCharsPerToken must be > 0")
    chars = len(canonical_bytes(value).decode("utf-8"))
    return max(1, int((chars + chars_per_token - 1) // chars_per_token))


def validate_tool(tool: dict[str, Any], index: int, require_object_schema: bool) -> list[str]:
    errors: list[str] = []
    name = tool.get("name")
    if not isinstance(name, str) or not name.strip():
        errors.append(f"tool[{index}].name must be non-empty text")
    schema = tool.get("inputSchema")
    if not isinstance(schema, dict):
        errors.append(f"tool[{index}].inputSchema must be an object")
    elif require_object_schema and schema.get("type") != "object":
        errors.append(f"tool[{index}].inputSchema.type must be 'object'")
    routing = tool.get("routing", {})
    if routing is not None and not isinstance(routing, dict):
        errors.append(f"tool[{index}].routing must be an object when present")
    return errors


def profile(catalog: Any, policy: dict[str, Any]) -> dict[str, Any]:
    tools = extract_tools(catalog)
    validation = policy.get("validation", {}) if isinstance(policy.get("validation", {}), dict) else {}
    require_object = bool(validation.get("requireObjectInputSchema", True))
    require_unique = bool(validation.get("requireUniqueNames", True))
    chars_per_token = float(policy.get("estimatedCharsPerToken", 4.0))

    errors: list[str] = []
    names: list[str] = []
    rows: list[dict[str, Any]] = []
    total_chars = 0
    total_tokens = 0

    for i, tool in enumerate(tools):
        errors.extend(validate_tool(tool, i, require_object))
        name = str(tool.get("name", ""))
        names.append(name)
        visible = model_visible(tool)
        raw = canonical_bytes(visible).decode("utf-8")
        chars = len(raw)
        tokens = estimate_tokens(visible, chars_per_token)
        total_chars += chars
        total_tokens += tokens
        routing = tool.get("routing") if isinstance(tool.get("routing"), dict) else {}
        rows.append({
            "name": name,
            "chars": chars,
            "estimated_tokens": tokens,
            "definition_sha256": definition_hash(tool),
            "essential": "essential" in set(routing.get("tags", [])) if isinstance(routing.get("tags", []), list) else False,
        })

    if require_unique:
        seen: set[str] = set()
        for name in names:
            if name in seen and name:
                errors.append(f"duplicate tool name: {name}")
            seen.add(name)

    rows.sort(key=lambda x: (-x["estimated_tokens"], x["name"]))
    budgets = policy.get("budgets", {}) if isinstance(policy.get("budgets", {}), dict) else {}
    max_total = int(budgets.get("maxToolSchemaTokens", 2**31 - 1))
    max_single = int(budgets.get("maxSingleToolTokens", 2**31 - 1))
    oversized = [r["name"] for r in rows if r["estimated_tokens"] > max_single]

    return {
        "valid": not errors,
        "errors": errors,
        "tool_count": len(tools),
        "model_visible_chars": total_chars,
        "estimated_tokens": total_tokens,
        "budget_tokens": max_total,
        "budget_utilization": round(total_tokens / max_total, 6) if max_total > 0 else None,
        "within_budget": total_tokens <= max_total and not oversized,
        "oversized_tools": oversized,
        "tools": rows,
    }


def main() -> int:
    p = argparse.ArgumentParser(description="Profile tool schema token footprint")
    p.add_argument("catalog")
    p.add_argument("--policy")
    p.add_argument("--output")
    p.add_argument("--fail-on-budget", action="store_true")
    args = p.parse_args()

    try:
        catalog = read_json(args.catalog)
        policy = read_policy(args.policy)
        report = profile(catalog, policy)
    except ValueError as exc:
        print(json.dumps({"valid": False, "errors": [str(exc)]}, indent=2), file=sys.stderr)
        return 2

    text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        try:
            Path(args.output).parent.mkdir(parents=True, exist_ok=True)
            Path(args.output).write_text(text, encoding="utf-8")
        except OSError as exc:
            print(json.dumps({"valid": False, "errors": [str(exc)]}, indent=2), file=sys.stderr)
            return 2
    else:
        print(text, end="")

    if not report["valid"]:
        return 2
    if args.fail_on_budget and not report["within_budget"]:
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
