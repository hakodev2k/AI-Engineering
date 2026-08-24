#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

EXIT_OK = 0
EXIT_BREAKING = 2
EXIT_INVALID = 4
EXIT_ERROR = 5


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def validate_contract(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict) or value.get("version") != 1:
        raise ValueError(f"{label} must be an object with version=1")
    commands = value.get("commands")
    if not isinstance(commands, list):
        raise ValueError(f"{label}.commands must be an array")
    seen_commands: set[str] = set()
    for ci, command in enumerate(commands):
        if not isinstance(command, dict):
            raise ValueError(f"{label}.commands[{ci}] must be an object")
        name = command.get("name")
        if not isinstance(name, str) or not name or name in seen_commands:
            raise ValueError(f"{label}.commands[{ci}].name must be unique and non-empty")
        seen_commands.add(name)
        for collection in ("options", "positionals"):
            items = command.get(collection)
            if not isinstance(items, list):
                raise ValueError(f"{label} command {name} {collection} must be an array")
            seen: set[str] = set()
            for ii, item in enumerate(items):
                if not isinstance(item, dict):
                    raise ValueError(f"{label} command {name} {collection}[{ii}] must be an object")
                item_name = item.get("name")
                if not isinstance(item_name, str) or not item_name or item_name in seen:
                    raise ValueError(f"{label} command {name} has duplicate/invalid {collection} name")
                seen.add(item_name)
                if not isinstance(item.get("required"), bool):
                    raise ValueError(f"{label} command {name} {item_name}.required must be boolean")
                if collection == "options":
                    choices = item.get("choices", [])
                    if not isinstance(choices, list):
                        raise ValueError(f"{label} command {name} option {item_name}.choices must be an array")
        codes = command.get("exit_codes")
        if not isinstance(codes, list) or any(not isinstance(code, int) for code in codes):
            raise ValueError(f"{label} command {name}.exit_codes must be an integer array")
    return value


def validate_policy(value: Any) -> dict[str, Any]:
    if not isinstance(value, dict) or value.get("version") != 1:
        raise ValueError("policy must be an object with version=1")
    for key in (
        "check_removed_commands", "check_removed_options", "check_requiredness",
        "check_choice_narrowing", "check_default_changes", "check_removed_positionals",
        "check_removed_exit_codes",
    ):
        if not isinstance(value.get(key), bool):
            raise ValueError(f"policy.{key} must be boolean")
    allowed = value.get("allowed_default_changes", [])
    if not isinstance(allowed, list) or any(not isinstance(x, str) for x in allowed):
        raise ValueError("policy.allowed_default_changes must be an array of strings")
    return value


def by_name(items: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {item["name"]: item for item in items}


def finding(kind: str, path: str, before: Any, after: Any, message: str) -> dict[str, Any]:
    return {"severity": "breaking", "kind": kind, "path": path, "before": before, "after": after, "message": message}


def compare(baseline: dict[str, Any], candidate: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    findings: list[dict[str, Any]] = []
    base_commands = by_name(baseline["commands"])
    cand_commands = by_name(candidate["commands"])

    for command_name, base_command in base_commands.items():
        cand_command = cand_commands.get(command_name)
        if cand_command is None:
            if policy["check_removed_commands"]:
                findings.append(finding("removed-command", command_name, "present", "missing", "existing command was removed"))
            continue

        base_options = by_name(base_command["options"])
        cand_options = by_name(cand_command["options"])
        for option_name, base_option in base_options.items():
            path = f"{command_name}.options.{option_name}"
            cand_option = cand_options.get(option_name)
            if cand_option is None:
                if policy["check_removed_options"]:
                    findings.append(finding("removed-option", path, "present", "missing", "existing option was removed"))
                continue
            if policy["check_requiredness"] and not base_option["required"] and cand_option["required"]:
                findings.append(finding("requiredness", path, False, True, "optional option became required"))
            if policy["check_choice_narrowing"]:
                before = set(base_option.get("choices", []))
                after = set(cand_option.get("choices", []))
                removed = sorted(before - after)
                if removed:
                    findings.append(finding("choice-narrowing", path, sorted(before), sorted(after), f"accepted choices removed: {removed}"))
            if policy["check_default_changes"]:
                before_default = base_option.get("default")
                after_default = cand_option.get("default")
                allow_key = f"{command_name}:{option_name}"
                if before_default != after_default and allow_key not in policy["allowed_default_changes"]:
                    findings.append(finding("default-change", path, before_default, after_default, "existing option default changed"))

        base_positionals = by_name(base_command["positionals"])
        cand_positionals = by_name(cand_command["positionals"])
        for positional_name, base_positional in base_positionals.items():
            path = f"{command_name}.positionals.{positional_name}"
            cand_positional = cand_positionals.get(positional_name)
            if cand_positional is None:
                if policy["check_removed_positionals"]:
                    findings.append(finding("removed-positional", path, "present", "missing", "existing positional argument was removed"))
                continue
            if policy["check_requiredness"] and not base_positional["required"] and cand_positional["required"]:
                findings.append(finding("requiredness", path, False, True, "optional positional became required"))

        if policy["check_removed_exit_codes"]:
            removed_codes = sorted(set(base_command["exit_codes"]) - set(cand_command["exit_codes"]))
            if removed_codes:
                findings.append(finding("removed-exit-code", f"{command_name}.exit_codes", sorted(base_command["exit_codes"]), sorted(cand_command["exit_codes"]), f"documented exit codes removed: {removed_codes}"))

    return {
        "status": "breaking" if findings else "compatible",
        "breaking_count": len(findings),
        "findings": findings,
    }


def emit(report: dict[str, Any], output: Path | None) -> None:
    rendered = json.dumps(report, indent=2, sort_keys=True)
    print(rendered)
    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Compare normalized CLI contracts for breaking changes.")
    parser.add_argument("--baseline", required=True, type=Path)
    parser.add_argument("--candidate", required=True, type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        baseline = validate_contract(load_json(args.baseline), "baseline")
        candidate = validate_contract(load_json(args.candidate), "candidate")
        policy = validate_policy(load_json(args.policy))
        report = compare(baseline, candidate, policy)
        emit(report, args.output)
        return EXIT_BREAKING if report["breaking_count"] else EXIT_OK
    except ValueError as exc:
        report = {"status": "invalid", "breaking_count": 0, "findings": [], "error": str(exc)}
        emit(report, args.output)
        return EXIT_INVALID
    except Exception as exc:
        report = {"status": "error", "breaking_count": 0, "findings": [], "error": f"internal error: {exc}"}
        emit(report, args.output)
        return EXIT_ERROR


if __name__ == "__main__":
    sys.exit(main())
