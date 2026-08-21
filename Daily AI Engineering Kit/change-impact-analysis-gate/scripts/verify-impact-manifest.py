#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

REQUIRED_TOP_LEVEL = {
    "request",
    "risk_level",
    "entry_points",
    "affected_components",
    "contracts",
    "expected_files",
    "verification",
    "approvals",
    "unresolved_questions",
}


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def validate_manifest(data):
    errors = []
    missing = sorted(REQUIRED_TOP_LEVEL - set(data.keys()))
    if missing:
        errors.append("Missing required keys: " + ", ".join(missing))

    if data.get("risk_level") not in {"low", "medium", "high", "critical"}:
        errors.append("risk_level must be one of: low, medium, high, critical")

    for key in ("entry_points", "affected_components", "contracts", "expected_files", "verification", "approvals", "unresolved_questions"):
        if key in data and not isinstance(data[key], list):
            errors.append(f"{key} must be a JSON array")

    if not isinstance(data.get("request"), str) or not data.get("request", "").strip():
        errors.append("request must be a non-empty string")

    for idx, component in enumerate(data.get("affected_components", [])):
        if not isinstance(component, dict):
            errors.append(f"affected_components[{idx}] must be an object")
            continue
        for field in ("name", "impact", "evidence"):
            if field not in component:
                errors.append(f"affected_components[{idx}] missing {field}")
        if component.get("impact") not in {"direct", "indirect", "uncertain"}:
            errors.append(f"affected_components[{idx}].impact is invalid")
        if not isinstance(component.get("evidence"), list) or not component.get("evidence"):
            errors.append(f"affected_components[{idx}].evidence must be a non-empty array")

    return errors


def expected_paths(data):
    result = set()
    for item in data.get("expected_files", []):
        if isinstance(item, str):
            result.add(item)
        elif isinstance(item, dict) and isinstance(item.get("path"), str):
            result.add(item["path"])
    return result


def main():
    parser = argparse.ArgumentParser(description="Validate an impact manifest and optionally reconcile changed files.")
    parser.add_argument("--manifest", default="impact-manifest.json")
    parser.add_argument("--changed-files")
    parser.add_argument("--schema-only", action="store_true")
    args = parser.parse_args()

    try:
        manifest = load_json(args.manifest)
    except Exception as exc:
        print(f"ERROR: cannot read manifest: {exc}", file=sys.stderr)
        return 2

    errors = validate_manifest(manifest)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 3

    if args.schema_only:
        print("Impact manifest structural validation passed.")
        return 0

    if args.changed_files:
        try:
            changed_data = load_json(args.changed_files)
            actual = set(changed_data.get("files", []))
        except Exception as exc:
            print(f"ERROR: cannot read changed-files input: {exc}", file=sys.stderr)
            return 2

        declared = expected_paths(manifest)
        always_allowed = {args.manifest, args.changed_files}
        unexpected = sorted(actual - declared - always_allowed)

        if unexpected:
            print("ERROR: changed files not declared in impact manifest:", file=sys.stderr)
            for path in unexpected:
                print(f"  - {path}", file=sys.stderr)
            return 4

        print(f"Manifest reconciliation passed for {len(actual)} changed file(s).")
        return 0

    print("Impact manifest validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
