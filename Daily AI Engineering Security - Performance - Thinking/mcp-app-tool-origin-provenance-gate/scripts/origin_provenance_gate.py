#!/usr/bin/env python3
"""Deterministic policy gate for Host-attested MCP tool invocation provenance."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Any

VALID_ORIGINS = {"app", "model", "user", "host", "unknown"}
EXIT_OK, EXIT_POLICY, EXIT_INPUT = 0, 2, 3


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def evaluate(record: Any) -> dict[str, Any]:
    if not isinstance(record, dict):
        raise ValueError("input must be an object")
    tool = record.get("tool")
    if not isinstance(tool, dict) or not isinstance(tool.get("name"), str) or not tool["name"].strip():
        raise ValueError("tool.name must be a non-empty string")
    visibility = tool.get("visibility")
    if not isinstance(visibility, list) or any(v not in {"app", "model"} for v in visibility):
        raise ValueError("tool.visibility must be an array containing only app/model")
    origin = record.get("host_attested_origin")
    if origin not in VALID_ORIGINS:
        raise ValueError("host_attested_origin is invalid")

    violations: list[str] = []
    warnings: list[str] = []
    claimed = record.get("caller_claimed_origin")
    if claimed is not None:
        warnings.append("caller_claimed_origin is untrusted and ignored for authorization")
        if claimed != origin:
            warnings.append("caller_claimed_origin differs from host_attested_origin")

    if origin == "app" and "app" not in visibility:
        violations.append("app origin is not permitted by tool visibility")
    if origin == "model" and "model" not in visibility:
        violations.append("model origin is not permitted by tool visibility")

    allowed = tool.get("allowed_origins")
    if allowed is not None:
        if not isinstance(allowed, list) or any(v not in {"app", "model", "user", "host"} for v in allowed):
            raise ValueError("tool.allowed_origins contains invalid origin")
        if origin not in allowed:
            violations.append("origin is not in tool.allowed_origins")

    if origin == "unknown" and bool(tool.get("sensitive", False)):
        violations.append("sensitive tool requires known trusted origin")

    return {
        "allow": not violations,
        "tool": tool["name"],
        "trusted_origin": origin,
        "violations": violations,
        "warnings": warnings,
        "provenance_is_not_authorization": True,
        "required_follow_on_controls": ["authentication", "resource authorization", "argument validation", "approval where required"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--json-out")
    args = parser.parse_args()
    try:
        report = evaluate(load_json(args.input))
    except ValueError as exc:
        print(f"input error: {exc}", file=sys.stderr)
        return EXIT_INPUT
    rendered = json.dumps(report, indent=2, ensure_ascii=False)
    print(rendered)
    if args.json_out:
        Path(args.json_out).write_text(rendered + "\n", encoding="utf-8")
    return EXIT_OK if report["allow"] else EXIT_POLICY


if __name__ == "__main__":
    raise SystemExit(main())
