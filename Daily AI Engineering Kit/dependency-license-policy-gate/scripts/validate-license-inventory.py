#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

REQUIRED_DEP_FIELDS = {
    "package_key", "ecosystem", "name", "version", "change_type",
    "source_fingerprint", "license_expression", "raw_license",
    "evidence_confidence", "evidence_references", "direct"
}
VALID_CHANGE_TYPES = {"added", "upgraded", "replaced", "source-changed", "vendored"}
VALID_CONFIDENCE = {"verified", "partial", "unknown"}


def load_json(path: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def nonempty_string(value):
    return isinstance(value, str) and bool(value.strip())


def validate(inventory, policy):
    errors = []
    if not isinstance(inventory, dict):
        return ["inventory must be a JSON object"]
    for field in ("inventory_version", "generated_at", "distribution_context", "dependencies"):
        if field not in inventory:
            errors.append(f"missing inventory field: {field}")
    if not nonempty_string(inventory.get("inventory_version")):
        errors.append("inventory_version must be a non-empty string")
    if not nonempty_string(inventory.get("generated_at")):
        errors.append("generated_at must be a non-empty ISO-8601 string")
    if not nonempty_string(inventory.get("distribution_context")):
        errors.append("distribution_context must be a non-empty string")

    deps = inventory.get("dependencies")
    if not isinstance(deps, list) or not deps:
        errors.append("dependencies must be a non-empty array")
        return errors

    seen = set()
    for idx, dep in enumerate(deps):
        prefix = f"dependencies[{idx}]"
        if not isinstance(dep, dict):
            errors.append(f"{prefix} must be an object")
            continue
        missing = REQUIRED_DEP_FIELDS - set(dep)
        for field in sorted(missing):
            errors.append(f"{prefix} missing field: {field}")
        for field in ("package_key", "ecosystem", "name", "version", "source_fingerprint", "license_expression", "raw_license"):
            if field in dep and not nonempty_string(dep[field]):
                errors.append(f"{prefix}.{field} must be a non-empty string")
        key = dep.get("package_key")
        if nonempty_string(key):
            identity = (key, dep.get("version"), dep.get("source_fingerprint"))
            if identity in seen:
                errors.append(f"duplicate dependency identity: {identity}")
            seen.add(identity)
        if dep.get("change_type") not in VALID_CHANGE_TYPES:
            errors.append(f"{prefix}.change_type is invalid")
        confidence = dep.get("evidence_confidence")
        if confidence not in VALID_CONFIDENCE:
            errors.append(f"{prefix}.evidence_confidence is invalid")
        refs = dep.get("evidence_references")
        if not isinstance(refs, list) or not refs or not all(nonempty_string(x) for x in refs):
            errors.append(f"{prefix}.evidence_references must contain non-empty strings")
        if not isinstance(dep.get("direct"), bool):
            errors.append(f"{prefix}.direct must be boolean")
        if confidence == "verified" and (not refs or not nonempty_string(dep.get("source_fingerprint"))):
            errors.append(f"{prefix} verified evidence requires references and source_fingerprint")

    if not isinstance(policy, dict) or not nonempty_string(policy.get("policy_version")):
        errors.append("policy must contain policy_version")
    licenses = policy.get("licenses", {})
    for category in ("allowed", "restricted", "prohibited"):
        if not isinstance(licenses.get(category, []), list):
            errors.append(f"policy licenses.{category} must be an array")
    return errors


def main():
    parser = argparse.ArgumentParser(description="Validate dependency license inventory")
    parser.add_argument("--inventory", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        inventory = load_json(args.inventory)
        policy = load_json(args.policy)
        errors = validate(inventory, policy)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("VALID")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
