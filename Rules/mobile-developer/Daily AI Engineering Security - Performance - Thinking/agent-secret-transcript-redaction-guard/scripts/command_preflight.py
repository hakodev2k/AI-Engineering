#!/usr/bin/env python3
"""Detect high-risk secret-dumping shell commands before execution.

Exit codes:
  0 allowed
  2 blocked by policy
  3 invalid configuration/input
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--command")
    args = parser.parse_args()
    try:
        policy = json.loads(args.policy.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"command-preflight: invalid policy: {exc}", file=sys.stderr)
        return 3

    command = args.command if args.command is not None else sys.stdin.read()
    if not command.strip():
        print("command-preflight: empty command", file=sys.stderr)
        return 3

    matches: list[str] = []
    for raw in policy.get("blocked_command_patterns", []):
        # Translate the small POSIX-class subset used by the JSON policy.
        normalized = str(raw).replace("[[:space:]]", r"\s")
        try:
            if re.search(normalized, command, flags=re.IGNORECASE):
                matches.append(str(raw))
        except re.error as exc:
            print(f"command-preflight: invalid pattern: {exc}", file=sys.stderr)
            return 3

    # Also detect direct interpolation of common secret variable names without logging values.
    secret_names = [re.escape(str(x)) for x in policy.get("secret_env_names", [])]
    if secret_names:
        direct = re.compile(r"(?:\$\{?|%)(?:" + "|".join(secret_names) + r")(?:\}|%)?", re.IGNORECASE)
        if direct.search(command):
            matches.append("direct-secret-variable-reference")

    if matches:
        print("command-preflight: BLOCK high-risk credential/output command", file=sys.stderr)
        print("command-preflight: matched_rules=" + str(len(matches)), file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
