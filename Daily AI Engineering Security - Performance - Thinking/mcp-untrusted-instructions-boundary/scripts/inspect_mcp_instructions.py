#!/usr/bin/env python3
"""Inspect MCP server instructions before they enter model context."""
import json
import re
import sys
from pathlib import Path

DEFAULT_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior|system)",
    r"override\s+(the\s+)?(system|developer|safety|policy)",
    r"do\s+not\s+(ask|require).*(approval|permission)",
    r"reveal|exfiltrat|send.*(secret|credential|token|password)",
    r"disable.*(guard|safety|approval|permission)",
]


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def validate(policy, payload):
    if not isinstance(policy, dict) or not isinstance(payload, dict):
        raise ValueError("policy and payload must be JSON objects")
    max_chars = policy.get("max_instruction_chars", 4096)
    if not isinstance(max_chars, int) or max_chars < 1 or max_chars > 100000:
        raise ValueError("max_instruction_chars must be integer 1..100000")
    destination = policy.get("destination_context_class")
    if destination != "untrusted_server_data":
        raise ValueError("destination_context_class must be untrusted_server_data")
    server_id = payload.get("server_id")
    text = payload.get("instructions")
    if not isinstance(server_id, str) or not server_id.strip():
        raise ValueError("payload.server_id must be a non-empty string")
    if not isinstance(text, str):
        raise ValueError("payload.instructions must be a string")
    return max_chars, server_id, text


def inspect(policy, payload):
    max_chars, server_id, text = validate(policy, payload)
    findings = []
    if len(text) > max_chars:
        findings.append(f"instruction length {len(text)} exceeds limit {max_chars}")
    bad_controls = [c for c in text if ord(c) < 32 and c not in "\n\r\t"]
    if bad_controls:
        findings.append("contains disallowed control characters")
    patterns = policy.get("blocked_patterns", DEFAULT_PATTERNS)
    if not isinstance(patterns, list) or not all(isinstance(x, str) for x in patterns):
        raise ValueError("blocked_patterns must be a list of regex strings")
    for pattern in patterns:
        try:
            if re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL):
                findings.append(f"matched blocked pattern: {pattern}")
        except re.error as exc:
            raise ValueError(f"invalid regex {pattern!r}: {exc}")
    return {
        "server_id": server_id,
        "trust": "untrusted",
        "destination": "untrusted_server_data",
        "decision": "block" if findings else "allow_untrusted",
        "findings": findings,
    }


def main(argv):
    if len(argv) != 3:
        print(f"usage: {argv[0]} <policy.json> <payload.json>", file=sys.stderr)
        return 1
    try:
        result = inspect(read_json(argv[1]), read_json(argv[2]))
    except (OSError, ValueError) as exc:
        print(json.dumps({"decision":"error","error":str(exc)}))
        return 1
    print(json.dumps(result, indent=2))
    return 2 if result["decision"] == "block" else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
