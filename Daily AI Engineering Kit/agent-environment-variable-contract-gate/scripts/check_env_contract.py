#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

EXIT_OK = 0
EXIT_VIOLATION = 2
EXIT_INVALID = 3
EXIT_ERROR = 4
PLACEHOLDERS = {"", "changeme", "change-me", "example", "placeholder", "replace-me", "<secret>", "<value>"}


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"invalid JSON file {path}: {exc}") from exc


def validate_contract(data: Any) -> dict[str, Any]:
    if not isinstance(data, dict) or data.get("version") != 1:
        raise ValueError("contract must be an object with version=1")
    if not isinstance(data.get("allow_undocumented"), bool):
        raise ValueError("allow_undocumented must be boolean")
    variables = data.get("variables")
    if not isinstance(variables, list):
        raise ValueError("variables must be an array")
    names: set[str] = set()
    for i, item in enumerate(variables):
        if not isinstance(item, dict):
            raise ValueError(f"variables[{i}] must be an object")
        name = item.get("name")
        if not isinstance(name, str) or re.fullmatch(r"[A-Z][A-Z0-9_]*", name) is None:
            raise ValueError(f"variables[{i}].name must be uppercase snake case")
        if name in names:
            raise ValueError(f"duplicate variable: {name}")
        names.add(name)
        if not isinstance(item.get("required_in"), list) or not all(isinstance(x, str) for x in item["required_in"]):
            raise ValueError(f"{name}.required_in must be a string array")
        if not isinstance(item.get("secret"), bool):
            raise ValueError(f"{name}.secret must be boolean")
        if "allowed_values" in item:
            values = item["allowed_values"]
            if not isinstance(values, list) or not all(isinstance(x, str) for x in values):
                raise ValueError(f"{name}.allowed_values must be a string array")
        if "pattern" in item:
            if not isinstance(item["pattern"], str):
                raise ValueError(f"{name}.pattern must be a string")
            try:
                re.compile(item["pattern"])
            except re.error as exc:
                raise ValueError(f"{name}.pattern is invalid: {exc}") from exc
    return data


def parse_env_file(path: Path) -> dict[str, str]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read env file {path}: {exc}") from exc
    result: dict[str, str] = {}
    for line_number, raw in enumerate(lines, 1):
        stripped = raw.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("export "):
            stripped = stripped[7:].strip()
        if "=" not in stripped:
            raise ValueError(f"invalid env line {line_number}: missing '='")
        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", key):
            raise ValueError(f"invalid environment variable name on line {line_number}")
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]
        result[key] = value
    return result


def looks_like_placeholder(value: str) -> bool:
    lowered = value.strip().lower()
    return lowered in PLACEHOLDERS or lowered.startswith("${") or lowered.startswith("<") and lowered.endswith(">")


def looks_like_real_secret(value: str) -> bool:
    if looks_like_placeholder(value):
        return False
    if len(value) >= 20 and re.search(r"[A-Za-z]", value) and re.search(r"[0-9]", value):
        return True
    if re.match(r"(?i)^(sk-|ghp_|github_pat_|xox[baprs]-|AIza)", value):
        return True
    return False


def evaluate(contract: dict[str, Any], values: dict[str, str], environment: str, sample_mode: bool) -> dict[str, Any]:
    violations: list[dict[str, str]] = []
    checked: list[str] = []
    declared = {v["name"]: v for v in contract["variables"]}
    if not contract["allow_undocumented"]:
        for key in sorted(values):
            if key not in declared:
                violations.append({"variable": key, "code": "undocumented", "message": "variable is not declared in contract"})
    for name, spec in declared.items():
        checked.append(name)
        present = name in values and values[name] != ""
        if environment in spec["required_in"] and not present:
            violations.append({"variable": name, "code": "missing_required", "message": f"required in {environment}"})
            continue
        if not present:
            continue
        value = values[name]
        if sample_mode and spec["secret"] and looks_like_real_secret(value):
            violations.append({"variable": name, "code": "secret_in_sample", "message": "sample contains a real-looking secret"})
        if "allowed_values" in spec and value not in spec["allowed_values"] and not (sample_mode and looks_like_placeholder(value)):
            violations.append({"variable": name, "code": "not_allowed", "message": "value is outside allowed_values"})
        if "pattern" in spec and re.fullmatch(spec["pattern"], value) is None and not (sample_mode and spec["secret"] and looks_like_placeholder(value)):
            violations.append({"variable": name, "code": "pattern_mismatch", "message": "value does not match configured pattern"})
    return {
        "status": "pass" if not violations else "fail",
        "environment": environment,
        "sample_mode": sample_mode,
        "checked_variables": checked,
        "violations": violations,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate environment variables against a repository contract.")
    parser.add_argument("--contract", required=True, type=Path)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--env-file", type=Path)
    source.add_argument("--use-process-env", action="store_true")
    parser.add_argument("--environment", required=True)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--runtime-values", action="store_true", help="Treat env-file values as runtime values rather than committed sample values.")
    args = parser.parse_args()
    try:
        contract = validate_contract(load_json(args.contract))
        values = dict(os.environ) if args.use_process_env else parse_env_file(args.env_file)
        sample_mode = bool(args.env_file) and not args.runtime_values
        result = evaluate(contract, values, args.environment, sample_mode)
        rendered = json.dumps(result, indent=2, sort_keys=True)
        print(rendered)
        if args.output:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(rendered + "\n", encoding="utf-8")
        return EXIT_OK if result["status"] == "pass" else EXIT_VIOLATION
    except ValueError as exc:
        print(json.dumps({"status": "invalid", "error": str(exc)}, indent=2), file=sys.stdout)
        return EXIT_INVALID
    except Exception as exc:
        print(json.dumps({"status": "error", "error": str(exc)}, indent=2), file=sys.stdout)
        return EXIT_ERROR


if __name__ == "__main__":
    raise SystemExit(main())
