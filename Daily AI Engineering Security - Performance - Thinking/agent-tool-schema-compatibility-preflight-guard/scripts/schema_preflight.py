#!/usr/bin/env python3
"""Deterministic provider-profile preflight for AI tool JSON Schemas.

Input may be either:
  * a single JSON Schema object, or
  * an object with {"tools": [{"name": "...", "inputSchema": {...}}]}.

The script never calls a model/provider and never mutates input files.
Exit codes: 0=compatible, 2=incompatible, 3=input/config error.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

LOOKAROUND_RE = re.compile(r"\(\?[=!<]")


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON from {path}: {exc}") from exc


def fingerprint(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def iter_nodes(value: Any, path: str = "$") -> Iterable[Tuple[str, Any]]:
    yield path, value
    if isinstance(value, dict):
        for key, child in value.items():
            yield from iter_nodes(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from iter_nodes(child, f"{path}[{index}]")


def lint_schema(schema: Dict[str, Any], profile: Dict[str, Any]) -> List[Dict[str, str]]:
    findings: List[Dict[str, str]] = []

    def add(code: str, path: str, message: str) -> None:
        findings.append({"code": code, "path": path, "message": message})

    if profile.get("root_type_object") and schema.get("type") != "object":
        add("ROOT_TYPE", "$.type", "root schema must have type=object")

    for path, node in iter_nodes(schema):
        if not isinstance(node, dict):
            continue

        for keyword in profile.get("forbidden_keywords", []):
            if keyword in node:
                add("FORBIDDEN_KEYWORD", f"{path}.{keyword}", f"keyword '{keyword}' is forbidden by profile")

        if profile.get("forbid_ref") and "$ref" in node:
            add("REF_FORBIDDEN", f"{path}.$ref", "$ref is forbidden by profile")
        if profile.get("forbid_defs") and "$defs" in node:
            add("DEFS_FORBIDDEN", f"{path}.$defs", "$defs is forbidden by profile")

        if node.get("type") == "object":
            props = node.get("properties")
            if props is not None and not isinstance(props, dict):
                add("PROPERTIES_TYPE", f"{path}.properties", "properties must be an object")
                props = None

            if profile.get("require_additional_properties_false"):
                if node.get("additionalProperties") is not False:
                    add("ADDITIONAL_PROPERTIES", f"{path}.additionalProperties", "must be explicitly false")

            required = node.get("required", [])
            if required is not None and not isinstance(required, list):
                add("REQUIRED_TYPE", f"{path}.required", "required must be an array")
                required = []

            if profile.get("require_all_properties_in_required") and isinstance(props, dict):
                missing = sorted(set(props.keys()) - set(required or []))
                if missing:
                    add("STRICT_REQUIRED", f"{path}.required", "strict profile requires every property in required: " + ", ".join(missing))

        pattern = node.get("pattern")
        if profile.get("forbid_pattern_lookaround") and isinstance(pattern, str) and LOOKAROUND_RE.search(pattern):
            add("PATTERN_LOOKAROUND", f"{path}.pattern", "regex lookaround is not supported by this profile")

    return findings


def runtime_validate(schema: Dict[str, Any], args: Dict[str, Any]) -> List[Dict[str, str]]:
    findings: List[Dict[str, str]] = []
    required = schema.get("required", []) if isinstance(schema.get("required", []), list) else []
    props = schema.get("properties", {}) if isinstance(schema.get("properties", {}), dict) else {}

    for key in required:
        if key not in args:
            findings.append({"code": "ARG_REQUIRED", "path": f"$.{key}", "message": "required argument missing"})

    if schema.get("additionalProperties") is False:
        for key in args:
            if key not in props:
                findings.append({"code": "ARG_UNKNOWN", "path": f"$.{key}", "message": "unknown argument not allowed"})

    simple_types = {
        "string": str,
        "integer": int,
        "number": (int, float),
        "boolean": bool,
        "object": dict,
        "array": list,
    }
    for key, value in args.items():
        prop = props.get(key)
        if not isinstance(prop, dict):
            continue
        expected = prop.get("type")
        py_type = simple_types.get(expected)
        if py_type and not isinstance(value, py_type):
            findings.append({"code": "ARG_TYPE", "path": f"$.{key}", "message": f"expected {expected}"})
        enum = prop.get("enum")
        if isinstance(enum, list) and value not in enum:
            findings.append({"code": "ARG_ENUM", "path": f"$.{key}", "message": f"value not in enum {enum}"})
    return findings


def extract_tools(payload: Any) -> List[Tuple[str, Dict[str, Any]]]:
    if isinstance(payload, dict) and isinstance(payload.get("tools"), list):
        result = []
        for i, tool in enumerate(payload["tools"]):
            if not isinstance(tool, dict):
                raise ValueError(f"tools[{i}] must be an object")
            name = str(tool.get("name", f"tool-{i}"))
            schema = tool.get("inputSchema") or tool.get("parameters")
            if not isinstance(schema, dict):
                raise ValueError(f"tool '{name}' missing object inputSchema/parameters")
            result.append((name, schema))
        return result
    if isinstance(payload, dict):
        return [("schema", payload)]
    raise ValueError("input must be a schema object or an object containing tools[]")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--profiles", required=True, type=Path)
    parser.add_argument("--profile", required=True)
    parser.add_argument("--args", type=Path, help="optional runtime argument JSON; allowed only for a single schema/tool")
    parser.add_argument("--report", type=Path)
    ns = parser.parse_args()

    try:
        payload = load_json(ns.input)
        config = load_json(ns.profiles)
        profiles = config.get("profiles", {}) if isinstance(config, dict) else {}
        profile = profiles.get(ns.profile)
        if not isinstance(profile, dict):
            raise ValueError(f"unknown profile: {ns.profile}")
        tools = extract_tools(payload)
        runtime_args = load_json(ns.args) if ns.args else None
        if runtime_args is not None and (len(tools) != 1 or not isinstance(runtime_args, dict)):
            raise ValueError("--args requires exactly one schema/tool and an object JSON value")
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 3

    report = {"profile": ns.profile, "tools": [], "compatible": True}
    for name, schema in tools:
        findings = lint_schema(schema, profile)
        if runtime_args is not None:
            findings.extend(runtime_validate(schema, runtime_args))
        item = {
            "name": name,
            "fingerprint": fingerprint(schema),
            "compatible": not findings,
            "findings": findings,
        }
        report["tools"].append(item)
        if findings:
            report["compatible"] = False

    rendered = json.dumps(report, indent=2, ensure_ascii=False)
    if ns.report:
        try:
            ns.report.write_text(rendered + "\n", encoding="utf-8")
        except OSError as exc:
            print(f"cannot write report: {exc}", file=sys.stderr)
            return 3
    print(rendered)
    return 0 if report["compatible"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
