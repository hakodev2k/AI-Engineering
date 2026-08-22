#!/usr/bin/env python3
"""Validate webhook idempotency and replay policy without reading its secret."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import yaml

HEADER = re.compile(r"^[!#$%&'*+.^_`|~0-9A-Za-z-]+$")
ENVIRONMENT_NAME = re.compile(r"^[A-Z][A-Z0-9_]*$")


def validate(policy: object) -> list[str]:
    if not isinstance(policy, dict):
        return ["policy must be a mapping"]

    errors: list[str] = []
    required = {
        "version",
        "max_clock_skew_seconds",
        "replay_window_seconds",
        "idempotency_ttl_seconds",
        "require_signature",
        "require_timestamp",
        "require_event_id",
        "allow_unsigned_in_development",
        "hash_algorithm",
        "signature_header",
        "timestamp_header",
        "event_id_header",
        "idempotency_key_header",
        "secret_env_var",
    }
    unknown = sorted(set(policy) - required)
    missing = sorted(required - set(policy))
    if unknown:
        errors.append("unknown fields: " + ", ".join(unknown))
    if missing:
        errors.append("missing fields: " + ", ".join(missing))
        return errors

    if policy["version"] != 1:
        errors.append("version must be 1")

    for name, minimum in (
        ("max_clock_skew_seconds", 0),
        ("replay_window_seconds", 1),
        ("idempotency_ttl_seconds", 1),
    ):
        value = policy[name]
        if isinstance(value, bool) or not isinstance(value, int) or value < minimum:
            errors.append(f"{name} must be an integer >= {minimum}")

    if isinstance(policy["max_clock_skew_seconds"], int) and policy["max_clock_skew_seconds"] > 3600:
        errors.append("max_clock_skew_seconds must not exceed 3600")
    if all(isinstance(policy[name], int) and not isinstance(policy[name], bool) for name in ("replay_window_seconds", "idempotency_ttl_seconds")):
        if policy["idempotency_ttl_seconds"] < policy["replay_window_seconds"]:
            errors.append("idempotency_ttl_seconds must be >= replay_window_seconds")

    for name in ("require_signature", "require_timestamp", "require_event_id", "allow_unsigned_in_development"):
        if not isinstance(policy[name], bool):
            errors.append(f"{name} must be boolean")

    if policy["hash_algorithm"] != "sha256":
        errors.append("hash_algorithm must be sha256")
    for name in ("signature_header", "timestamp_header", "event_id_header", "idempotency_key_header"):
        value = policy[name]
        if not isinstance(value, str) or not HEADER.fullmatch(value):
            errors.append(f"{name} must be a valid HTTP header token")
    secret_name = policy["secret_env_var"]
    if not isinstance(secret_name, str) or not ENVIRONMENT_NAME.fullmatch(secret_name):
        errors.append("secret_env_var must be an uppercase environment variable name")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("policy", type=Path)
    args = parser.parse_args()
    try:
        policy = yaml.safe_load(args.policy.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 2

    errors = validate(policy)
    result = {"status": "valid" if not errors else "invalid", "errors": errors}
    print(json.dumps(result, indent=2))
    return 0 if not errors else 3


if __name__ == "__main__":
    raise SystemExit(main())
