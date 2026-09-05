#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}") from exc


def validate_manifest(data: Any, source: Path) -> Dict[str, Any]:
    if not isinstance(data, dict):
        raise ValueError(f"manifest must be object: {source}")
    env = data.get("environment")
    values = data.get("values")
    if not isinstance(env, str) or not env:
        raise ValueError(f"manifest environment must be non-empty string: {source}")
    if not isinstance(values, dict):
        raise ValueError(f"manifest values must be object: {source}")
    for key, spec in values.items():
        if not isinstance(key, str) or not key:
            raise ValueError(f"config key must be non-empty string: {source}")
        if not isinstance(spec, dict):
            raise ValueError(f"config spec must be object for {key}: {source}")
        if not isinstance(spec.get("type"), str) or not spec["type"]:
            raise ValueError(f"config type missing for {key}: {source}")
        if not isinstance(spec.get("required", False), bool):
            raise ValueError(f"required must be boolean for {key}: {source}")
    return data


def validate_policy(data: Any) -> Dict[str, Any]:
    if not isinstance(data, dict):
        raise ValueError("policy must be object")
    for key in ("required_environments", "ignore_keys", "must_match_values", "secret_name_patterns", "allowed_secret_placeholders"):
        if not isinstance(data.get(key, []), list):
            raise ValueError(f"policy {key} must be array")
    return data


def finding(severity: str, kind: str, key: str, detail: str, environment: str | None = None) -> Dict[str, str]:
    item: Dict[str, str] = {"severity": severity, "kind": kind, "key": key, "detail": detail}
    if environment:
        item["environment"] = environment
    return item


def is_secret_key(key: str, patterns: List[str]) -> bool:
    upper = key.upper()
    return any(re.search(pattern, upper) for pattern in patterns)


def compare(manifests: List[Dict[str, Any]], policy: Dict[str, Any]) -> Dict[str, Any]:
    by_env: Dict[str, Dict[str, Any]] = {}
    for m in manifests:
        env = m["environment"]
        if env in by_env:
            raise ValueError(f"duplicate environment manifest: {env}")
        by_env[env] = m

    findings: List[Dict[str, str]] = []
    required_envs = policy.get("required_environments", [])
    for env in required_envs:
        if env not in by_env:
            findings.append(finding("error", "missing_environment", "*", f"required environment manifest is missing: {env}", env))

    ignored = set(policy.get("ignore_keys", []))
    key_union = set()
    for manifest in by_env.values():
        key_union.update(k for k in manifest["values"] if k not in ignored)

    secret_patterns = [str(p) for p in policy.get("secret_name_patterns", [])]
    placeholders = {str(v) for v in policy.get("allowed_secret_placeholders", [])}
    must_match = set(policy.get("must_match_values", []))

    for key in sorted(key_union):
        specs = {env: m["values"].get(key) for env, m in by_env.items()}
        present = {env: spec for env, spec in specs.items() if spec is not None}
        if not present:
            continue

        canonical_env = sorted(present)[0]
        canonical = present[canonical_env]
        required_anywhere = any(bool(spec.get("required", False)) for spec in present.values())

        for env in required_envs:
            if env in by_env and key not in by_env[env]["values"] and required_anywhere:
                findings.append(finding("error", "missing_required_key", key, f"required key absent from {env}", env))

        types = {env: spec.get("type") for env, spec in present.items()}
        if len(set(types.values())) > 1:
            findings.append(finding("error", "type_mismatch", key, f"declared types differ: {types}"))

        required_flags = {env: bool(spec.get("required", False)) for env, spec in present.items()}
        if len(set(required_flags.values())) > 1:
            findings.append(finding("error", "requiredness_mismatch", key, f"required flags differ: {required_flags}"))

        if key in must_match:
            values = {env: spec.get("value") for env, spec in present.items()}
            if len(set(json.dumps(v, sort_keys=True) for v in values.values())) > 1:
                findings.append(finding("error", "value_mismatch", key, f"policy requires equal values: {values}"))

        if is_secret_key(key, secret_patterns):
            for env, spec in present.items():
                if "value" in spec and str(spec.get("value", "")) not in placeholders:
                    findings.append(finding("error", "secret_value_committed", key, "secret-like key contains a non-placeholder value", env))

        for env, spec in present.items():
            if spec.get("required", False) and "value" in spec and spec.get("value") is None:
                findings.append(finding("warning", "required_value_null", key, "required key has explicit null in normalized manifest", env))

    errors = sum(1 for f in findings if f["severity"] == "error")
    warnings = sum(1 for f in findings if f["severity"] == "warning")
    return {
        "status": "fail" if errors else "pass",
        "environments": sorted(by_env),
        "summary": {"errors": errors, "warnings": warnings, "total": len(findings)},
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Check configuration parity across normalized environment manifests")
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--manifest", action="append", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    try:
        policy = validate_policy(load_json(args.policy))
        manifests = [validate_manifest(load_json(p), p) for p in args.manifest]
        report = compare(manifests, policy)
    except ValueError as exc:
        print(f"validation error: {exc}", file=sys.stderr)
        return 2
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    if report["status"] == "fail":
        print(f"config parity gate failed: {report['summary']['errors']} error(s)", file=sys.stderr)
        return 1
    print(f"config parity gate passed with {report['summary']['warnings']} warning(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
