#!/usr/bin/env python3
"""Compare environment configuration snapshots without exposing raw values."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def fail(message: str, code: int = 2) -> None:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(code)


def load_json(path: Path) -> Any:
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        fail(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {path}: {exc}")


def flatten_json(value: Any, prefix: str = "") -> dict[str, str]:
    result: dict[str, str] = {}
    if isinstance(value, dict):
        for key, child in value.items():
            next_prefix = f"{prefix}.{key}" if prefix else str(key)
            result.update(flatten_json(child, next_prefix))
    elif isinstance(value, list):
        result[prefix] = json.dumps(value, sort_keys=True, separators=(",", ":"))
    else:
        result[prefix] = json.dumps(value, sort_keys=True, separators=(",", ":"))
    return result


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        fail(f"file not found: {path}")
    for index, raw in enumerate(lines, 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].strip()
        if "=" not in line:
            fail(f"invalid env line {index} in {path}")
        key, value = line.split("=", 1)
        key = key.strip()
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_\.\-]*", key):
            fail(f"invalid env key {key!r} in {path}:{index}")
        values[key] = value.strip()
    return values


def load_snapshot(entry: dict[str, Any], inventory_dir: Path) -> dict[str, str]:
    raw_path = entry.get("path")
    fmt = entry.get("format")
    if not isinstance(raw_path, str) or not raw_path:
        fail("each environment must provide a non-empty path")
    path = (inventory_dir / raw_path).resolve()
    if fmt == "json":
        return flatten_json(load_json(path))
    if fmt == "env":
        return load_env_file(path)
    fail(f"unsupported format {fmt!r} for {raw_path}; expected json or env")
    return {}


def fingerprint(value: str | None) -> str | None:
    if value is None:
        return None
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:16]


def matches_any(key: str, patterns: list[str]) -> bool:
    upper = key.upper()
    return any(pattern.upper() in upper for pattern in patterns)


def classify(key: str, policy: dict[str, Any]) -> tuple[str, bool, bool]:
    secret_like = matches_any(key, policy.get("secret_key_patterns", []))
    approval = matches_any(key, policy.get("approval_required_patterns", []))
    if matches_any(key, policy.get("high_risk_patterns", [])):
        return "high", approval, secret_like
    if matches_any(key, policy.get("medium_risk_patterns", [])):
        return "medium", approval, secret_like
    return "low", approval, secret_like


def validate_inventory(inventory: Any) -> dict[str, dict[str, Any]]:
    if not isinstance(inventory, dict) or not isinstance(inventory.get("environments"), dict):
        fail("inventory must be an object containing an environments object")
    environments = inventory["environments"]
    if len(environments) < 2:
        fail("inventory must contain at least two environments")
    for name, entry in environments.items():
        if not isinstance(name, str) or not name or not isinstance(entry, dict):
            fail("environment names must be non-empty strings with object definitions")
    return environments


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect configuration drift using secret-safe fingerprints.")
    parser.add_argument("--inventory", required=True, help="Inventory JSON containing environment snapshot paths.")
    parser.add_argument("--policy", required=True, help="Drift policy JSON.")
    parser.add_argument("--output", required=True, help="Output report path.")
    args = parser.parse_args()

    inventory_path = Path(args.inventory).resolve()
    policy_path = Path(args.policy).resolve()
    output_path = Path(args.output).resolve()

    inventory = load_json(inventory_path)
    policy = load_json(policy_path)
    environments = validate_inventory(inventory)
    baseline_name = policy.get("baseline_environment")
    if baseline_name not in environments:
        fail(f"baseline environment {baseline_name!r} is not present in inventory")

    snapshots = {
        name: load_snapshot(entry, inventory_path.parent)
        for name, entry in environments.items()
    }
    baseline = snapshots[baseline_name]
    ignored = {str(key) for key in policy.get("ignored_keys", [])}
    findings: list[dict[str, Any]] = []

    for environment, target in snapshots.items():
        if environment == baseline_name:
            continue
        keys = sorted((set(baseline) | set(target)) - ignored)
        for key in keys:
            base_value = baseline.get(key)
            target_value = target.get(key)
            if base_value == target_value:
                continue
            if key not in target:
                kind = "missing"
            elif key not in baseline:
                kind = "extra"
            else:
                kind = "different"
            severity, approval_required, secret_like = classify(key, policy)
            findings.append({
                "environment": environment,
                "key": key,
                "kind": kind,
                "severity": severity,
                "approval_required": approval_required,
                "baseline_fingerprint": fingerprint(base_value),
                "target_fingerprint": fingerprint(target_value),
                "secret_like": secret_like,
            })

    summary = {
        "total": len(findings),
        "high": sum(item["severity"] == "high" for item in findings),
        "medium": sum(item["severity"] == "medium" for item in findings),
        "low": sum(item["severity"] == "low" for item in findings),
        "approval_required": sum(bool(item["approval_required"]) for item in findings),
    }
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "baseline_environment": baseline_name,
        "status": "clean" if not findings else "drift-detected",
        "environments": sorted(environments.keys()),
        "findings": findings,
        "summary": summary,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2, sort_keys=True) + os.linesep, encoding="utf-8")
    print(f"{report['status']}: {summary['total']} finding(s); report={output_path}")
    return 0 if not findings else 1


if __name__ == "__main__":
    raise SystemExit(main())
