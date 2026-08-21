#!/usr/bin/env python3
"""Deterministically redact secrets from agent tool output.

Reads UTF-8 text from stdin or --input, writes sanitized text to stdout or --output.
Known secret values are loaded only from explicitly configured environment variable names.
The script never prints original secret values in reports.

Exit codes:
  0 sanitized successfully; no high-confidence residual found
  2 high-confidence residual detected after sanitization
  3 invalid input/configuration
  4 I/O failure
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

TOKEN_PATTERNS = [
    ("github_token", re.compile(r"\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b")),
    ("aws_access_key", re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b")),
    ("slack_token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b")),
    ("jwt", re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b")),
    ("private_key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("openai_like", re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b")),
]


def load_policy(path: Path) -> dict:
    try:
        policy = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load policy: {exc}") from exc
    if policy.get("mode") not in {"redact", "warn"}:
        raise ValueError("policy.mode must be redact or warn")
    return policy


def replacement(policy: dict, kind: str) -> str:
    return str(policy.get("replacement", "[REDACTED:{type}]")).replace("{type}", kind)


def known_secrets(policy: dict) -> list[tuple[str, str]]:
    minimum = int(policy.get("minimum_exact_secret_length", 6))
    values: list[tuple[str, str]] = []
    for name in policy.get("secret_env_names", []):
        value = os.environ.get(str(name))
        if value and len(value) >= minimum:
            values.append((str(name), value))
    values.sort(key=lambda item: len(item[1]), reverse=True)
    return values


def redact_assignments(text: str, policy: dict) -> tuple[str, int]:
    keys = [re.escape(str(k)) for k in policy.get("sensitive_assignment_keys", [])]
    if not keys:
        return text, 0
    key_union = "|".join(keys)
    pattern = re.compile(
        rf"(?im)(?P<prefix>\b(?:{key_union})\b\s*[:=]\s*[\"']?)(?P<value>[^\s,;\"']{{6,}})"
    )
    count = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal count
        count += 1
        return match.group("prefix") + replacement(policy, "sensitive_assignment")

    return pattern.sub(repl, text), count


def sanitize(text: str, policy: dict) -> tuple[str, dict]:
    metrics = {"exact_masks": 0, "pattern_masks": 0, "assignment_masks": 0, "residuals": 0}
    sanitized = text
    if policy.get("mode") == "redact":
        for name, value in known_secrets(policy):
            occurrences = sanitized.count(value)
            if occurrences:
                sanitized = sanitized.replace(value, replacement(policy, f"env:{name}"))
                metrics["exact_masks"] += occurrences

        for kind, pattern in TOKEN_PATTERNS:
            sanitized, n = pattern.subn(replacement(policy, kind), sanitized)
            metrics["pattern_masks"] += n

        sanitized, n = redact_assignments(sanitized, policy)
        metrics["assignment_masks"] += n

    for _, value in known_secrets(policy):
        if value in sanitized:
            metrics["residuals"] += sanitized.count(value)
    for _, pattern in TOKEN_PATTERNS:
        metrics["residuals"] += len(pattern.findall(sanitized))
    return sanitized, metrics


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--input", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--metrics", type=Path)
    args = parser.parse_args()

    try:
        policy = load_policy(args.policy)
        if args.input:
            raw = args.input.read_bytes()
        else:
            raw = sys.stdin.buffer.read()
        maximum = int(policy.get("max_output_bytes", 10485760))
        if len(raw) > maximum:
            print("secret-output-guard: input exceeds configured maximum", file=sys.stderr)
            return 3
        text = raw.decode("utf-8", errors="replace")
        sanitized, metrics = sanitize(text, policy)
        encoded = sanitized.encode("utf-8")
        if args.output:
            args.output.write_bytes(encoded)
        else:
            sys.stdout.buffer.write(encoded)
        if args.metrics:
            safe_metrics = {**metrics, "input_bytes": len(raw), "output_bytes": len(encoded)}
            args.metrics.write_text(json.dumps(safe_metrics, indent=2) + "\n", encoding="utf-8")
        if metrics["residuals"] and policy.get("fail_on_high_confidence_residual", True):
            print(f"secret-output-guard: residual_count={metrics['residuals']}", file=sys.stderr)
            return 2
        return 0
    except ValueError as exc:
        print(f"secret-output-guard: {exc}", file=sys.stderr)
        return 3
    except OSError as exc:
        print(f"secret-output-guard: I/O error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
