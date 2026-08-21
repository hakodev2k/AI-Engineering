#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import pathlib
import sys
from typing import Any

HTTP_METHODS = {"get", "put", "post", "delete", "options", "head", "patch", "trace"}


def load_document(path: pathlib.Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        try:
            import yaml  # type: ignore
        except ImportError as exc:
            raise RuntimeError(f"{path}: not JSON; install PyYAML for YAML input") from exc
        data = yaml.safe_load(text)
    if not isinstance(data, dict):
        raise RuntimeError(f"{path}: root must be an object")
    if not isinstance(data.get("paths"), dict):
        raise RuntimeError(f"{path}: missing object-valued 'paths'")
    return data


def finding(code: str, location: str, message: str, before: Any = None, after: Any = None) -> dict[str, Any]:
    evidence: dict[str, Any] = {}
    if before is not None:
        evidence["before"] = before
    if after is not None:
        evidence["after"] = after
    return {"code": code, "location": location, "message": message, "evidence": evidence}


def parameters(operation: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    result: dict[tuple[str, str], dict[str, Any]] = {}
    for item in operation.get("parameters", []) or []:
        if isinstance(item, dict) and "$ref" not in item:
            name = item.get("name")
            where = item.get("in")
            if isinstance(name, str) and isinstance(where, str):
                result[(where, name)] = item
    return result


def schema_type(schema: Any) -> Any:
    if not isinstance(schema, dict):
        return None
    if "type" in schema:
        return schema.get("type")
    return schema.get("$ref")


def compare_schema(
    baseline: Any,
    candidate: Any,
    location: str,
    breaking: list[dict[str, Any]],
    non_breaking: list[dict[str, Any]],
) -> None:
    if not isinstance(baseline, dict) or not isinstance(candidate, dict):
        return

    old_type = schema_type(baseline)
    new_type = schema_type(candidate)
    if old_type is not None and new_type is not None and old_type != new_type:
        breaking.append(finding("schema-type-changed", location, "Schema type/reference changed", old_type, new_type))

    old_enum = baseline.get("enum")
    new_enum = candidate.get("enum")
    if isinstance(old_enum, list) and isinstance(new_enum, list):
        removed = [value for value in old_enum if value not in new_enum]
        added = [value for value in new_enum if value not in old_enum]
        if removed:
            breaking.append(finding("enum-narrowed", location, "Previously accepted enum values were removed", removed, new_enum))
        if added:
            non_breaking.append(finding("enum-expanded", location, "Enum values were added", old_enum, new_enum))

    old_required = set(baseline.get("required") or [])
    new_required = set(candidate.get("required") or [])
    for name in sorted(new_required - old_required):
        breaking.append(finding("required-property-added", f"{location}.properties.{name}", "A property became newly required"))

    old_props = baseline.get("properties") or {}
    new_props = candidate.get("properties") or {}
    if isinstance(old_props, dict) and isinstance(new_props, dict):
        for name in sorted(old_props.keys() & new_props.keys()):
            compare_schema(old_props[name], new_props[name], f"{location}.properties.{name}", breaking, non_breaking)
        for name in sorted(new_props.keys() - old_props.keys()):
            non_breaking.append(finding("property-added", f"{location}.properties.{name}", "Optional schema property was added"))


def compare_documents(baseline: dict[str, Any], candidate: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    breaking: list[dict[str, Any]] = []
    non_breaking: list[dict[str, Any]] = []

    old_paths = baseline["paths"]
    new_paths = candidate["paths"]

    for path in sorted(old_paths.keys() - new_paths.keys()):
        breaking.append(finding("path-removed", f"paths.{path}", "API path was removed"))
    for path in sorted(new_paths.keys() - old_paths.keys()):
        non_breaking.append(finding("path-added", f"paths.{path}", "API path was added"))

    for path in sorted(old_paths.keys() & new_paths.keys()):
        old_path = old_paths[path] if isinstance(old_paths[path], dict) else {}
        new_path = new_paths[path] if isinstance(new_paths[path], dict) else {}
        old_methods = {m for m in old_path if m.lower() in HTTP_METHODS}
        new_methods = {m for m in new_path if m.lower() in HTTP_METHODS}

        for method in sorted(old_methods - new_methods):
            breaking.append(finding("method-removed", f"paths.{path}.{method}", "HTTP operation was removed"))
        for method in sorted(new_methods - old_methods):
            non_breaking.append(finding("method-added", f"paths.{path}.{method}", "HTTP operation was added"))

        for method in sorted(old_methods & new_methods):
            old_op = old_path.get(method) if isinstance(old_path.get(method), dict) else {}
            new_op = new_path.get(method) if isinstance(new_path.get(method), dict) else {}
            location = f"paths.{path}.{method}"

            old_params = parameters(old_op)
            new_params = parameters(new_op)
            for key in sorted(new_params.keys() - old_params.keys()):
                if new_params[key].get("required") is True:
                    breaking.append(finding("required-parameter-added", f"{location}.parameters.{key[0]}.{key[1]}", "A new required parameter was added"))
                else:
                    non_breaking.append(finding("optional-parameter-added", f"{location}.parameters.{key[0]}.{key[1]}", "An optional parameter was added"))
            for key in sorted(old_params.keys() & new_params.keys()):
                if not old_params[key].get("required") and new_params[key].get("required") is True:
                    breaking.append(finding("parameter-became-required", f"{location}.parameters.{key[0]}.{key[1]}", "An existing parameter became required"))
                compare_schema(old_params[key].get("schema"), new_params[key].get("schema"), f"{location}.parameters.{key[0]}.{key[1]}.schema", breaking, non_breaking)

            old_responses = old_op.get("responses") or {}
            new_responses = new_op.get("responses") or {}
            if isinstance(old_responses, dict) and isinstance(new_responses, dict):
                for code in sorted(old_responses.keys() - new_responses.keys()):
                    breaking.append(finding("response-removed", f"{location}.responses.{code}", "Documented response was removed"))

            old_body = ((old_op.get("requestBody") or {}).get("content") or {}) if isinstance(old_op.get("requestBody"), dict) else {}
            new_body = ((new_op.get("requestBody") or {}).get("content") or {}) if isinstance(new_op.get("requestBody"), dict) else {}
            if isinstance(old_body, dict) and isinstance(new_body, dict):
                for media in sorted(old_body.keys() & new_body.keys()):
                    old_schema = (old_body[media] or {}).get("schema") if isinstance(old_body[media], dict) else None
                    new_schema = (new_body[media] or {}).get("schema") if isinstance(new_body[media], dict) else None
                    compare_schema(old_schema, new_schema, f"{location}.requestBody.{media}", breaking, non_breaking)

    old_schemas = (((baseline.get("components") or {}).get("schemas") or {}) if isinstance(baseline.get("components"), dict) else {})
    new_schemas = (((candidate.get("components") or {}).get("schemas") or {}) if isinstance(candidate.get("components"), dict) else {})
    if isinstance(old_schemas, dict) and isinstance(new_schemas, dict):
        for name in sorted(old_schemas.keys() & new_schemas.keys()):
            compare_schema(old_schemas[name], new_schemas[name], f"components.schemas.{name}", breaking, non_breaking)

    return breaking, non_breaking


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect common breaking changes between two OpenAPI documents")
    parser.add_argument("--baseline", required=True)
    parser.add_argument("--candidate", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    baseline_path = pathlib.Path(args.baseline)
    candidate_path = pathlib.Path(args.candidate)
    output_path = pathlib.Path(args.output)

    try:
        baseline = load_document(baseline_path)
        candidate = load_document(candidate_path)
        breaking, non_breaking = compare_documents(baseline, candidate)
        report = {
            "status": "needs-approval" if breaking else "pass",
            "baseline": str(baseline_path),
            "candidate": str(candidate_path),
            "breaking_changes": breaking,
            "non_breaking_changes": non_breaking,
            "verification": {"parsed": True, "comparison_completed": True, "tests_passed": None},
        }
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(json.dumps({"status": report["status"], "breaking_count": len(breaking), "non_breaking_count": len(non_breaking)}))
        return 2 if breaking else 0
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
