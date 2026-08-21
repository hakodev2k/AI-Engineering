#!/usr/bin/env python3
"""Redact registered secrets and credential patterns from text output."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

ASSIGNMENT = re.compile(
    r"(?i)\b(api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd|authorization)"
    r"(\s*[:=]\s*)([^\s,;]+)"
)
BEARER = re.compile(r"(?i)\b(Bearer\s+)[A-Za-z0-9._~+/=-]{8,}")
TOKEN_SHAPES = (
    re.compile(r"\bgh[pousr]_[A-Za-z0-9]{20,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
)


def load_policy(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or data.get("version") != 1:
        raise ValueError("policy version 1 is required")
    replacement = data.get("replacement")
    names = data.get("secret_environment_variables")
    patterns = data.get("blocked_command_patterns")
    minimum = data.get("minimum_secret_length")
    if not isinstance(replacement, str) or not replacement:
        raise ValueError("replacement must be a non-empty string")
    if not isinstance(minimum, int) or isinstance(minimum, bool) or minimum < 4:
        raise ValueError("minimum_secret_length must be an integer >= 4")
    if not isinstance(names, list) or not all(isinstance(name, str) for name in names):
        raise ValueError("secret_environment_variables must be a list of names")
    if not isinstance(patterns, list) or not all(isinstance(pattern, str) for pattern in patterns):
        raise ValueError("blocked_command_patterns must be a list")
    for pattern in patterns:
        re.compile(pattern)
    return data


def registered_values(policy: dict) -> list[str]:
    minimum = policy["minimum_secret_length"]
    values = {
        value
        for name in policy["secret_environment_variables"]
        if (value := os.environ.get(name)) is not None and len(value) >= minimum
    }
    return sorted(values, key=len, reverse=True)


def redact(text: str, policy: dict) -> tuple[str, int]:
    replacement = policy["replacement"]
    count = 0
    for value in registered_values(policy):
        occurrences = text.count(value)
        if occurrences:
            text = text.replace(value, replacement)
            count += occurrences

    text, matched = ASSIGNMENT.subn(lambda match: match.group(1) + match.group(2) + replacement, text)
    count += matched
    text, matched = BEARER.subn(lambda match: match.group(1) + replacement, text)
    count += matched
    for pattern in TOKEN_SHAPES:
        text, matched = pattern.subn(replacement, text)
        count += matched
    return text, count


def command_is_blocked(command: str, policy: dict) -> bool:
    return any(re.search(pattern, command, flags=re.IGNORECASE) for pattern in policy["blocked_command_patterns"])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--input", type=Path, help="read text from a file instead of stdin")
    parser.add_argument("--fail-on-detection", action="store_true")
    parser.add_argument("--check-command")
    args = parser.parse_args()
    try:
        policy = load_policy(args.config)
        if args.check_command is not None:
            blocked = command_is_blocked(args.check_command, policy)
            print(json.dumps({"status": "blocked" if blocked else "allowed"}))
            return 4 if blocked else 0
        text = args.input.read_text(encoding="utf-8", errors="replace") if args.input else sys.stdin.read()
        sanitized, count = redact(text, policy)
        sys.stdout.write(sanitized)
        if count:
            print(f"redaction_guard: masked {count} value(s)", file=sys.stderr)
        return 3 if count and args.fail_on_detection else 0
    except (OSError, ValueError, json.JSONDecodeError, re.error) as exc:
        print(json.dumps({"status": "error", "error": type(exc).__name__}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
